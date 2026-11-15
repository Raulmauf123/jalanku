<?php
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';

$action = $_GET['action'] ?? '';

function out($arr) { echo json_encode($arr); exit; }

try {
    // ===== Daftar semua laporan (untuk peta, laporan saya, admin) =====
    if ($action === 'fetch') {
        $sql = "SELECT l.id_laporan, l.no_tiket, l.lokasi, l.latitude, l.longitude,
                       l.keterangan, l.foto, l.dibuat_pada, l.nama_pelapor AS user,
                       j.nama_jenis AS jenis, t.nama_tingkat AS tingkat,
                       s.urutan - 1 AS stage, s.nama_status AS status
                FROM laporan l
                JOIN jenis_kerusakan j   ON l.id_jenis   = j.id_jenis
                JOIN tingkat_kerusakan t ON l.id_tingkat = t.id_tingkat
                JOIN status_laporan s    ON l.id_status  = s.id_status
                ORDER BY l.id_laporan DESC";
        $rows  = $pdo->query($sql)->fetchAll();
        $admin = (($_SESSION['role'] ?? '') === 'admin');
        $me    = $_SESSION['nama'] ?? null;
        foreach ($rows as &$r) {                       // nama pelapor hanya terlihat oleh admin dan pemiliknya
            if (!$admin && $r['user'] !== $me) $r['user'] = null;
        }
        unset($r);
        out(['status' => 'success', 'data' => $rows]);
    }

    // ===== Cek status berdasarkan nomor tiket =====
    if ($action === 'cek') {
        $tiket = strtoupper(trim($_GET['tiket'] ?? ''));
        $stmt = $pdo->prepare("SELECT l.no_tiket, l.lokasi, s.nama_status AS status, s.urutan - 1 AS stage
                               FROM laporan l JOIN status_laporan s ON l.id_status = s.id_status
                               WHERE l.no_tiket = ?");
        $stmt->execute([$tiket]);
        $row = $stmt->fetch();
        if ($row) out(['status' => 'success', 'data' => $row]);
        out(['status' => 'error', 'message' => 'Nomor tiket tidak ditemukan.']);
    }

    // ===== Simpan laporan baru =====
    if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        if (empty($_SESSION['id_pengguna'])) {
            out(['status' => 'error', 'need_login' => true, 'message' => 'Silakan masuk dulu untuk mengirim laporan.']);
        }
        $jenis   = trim($_POST['jenis'] ?? '');
        $tingkat = trim($_POST['tingkat'] ?? 'Sedang');
        $lokasi  = trim($_POST['lokasi'] ?? '');
        $lat     = ($_POST['lat'] ?? '') !== '' ? (float)$_POST['lat'] : null;
        $lng     = ($_POST['lng'] ?? '') !== '' ? (float)$_POST['lng'] : null;
        $ket     = trim($_POST['keterangan'] ?? '');
        $nama    = $_SESSION['nama'] ?? null;

        if ($jenis === '' || $lokasi === '') {
            out(['status' => 'error', 'message' => 'Jenis kerusakan dan lokasi wajib diisi.']);
        }

        $q = $pdo->prepare("SELECT id_jenis FROM jenis_kerusakan WHERE nama_jenis = ?");
        $q->execute([$jenis]); $idJenis = $q->fetchColumn();
        $q = $pdo->prepare("SELECT id_tingkat FROM tingkat_kerusakan WHERE nama_tingkat = ?");
        $q->execute([$tingkat]); $idTingkat = $q->fetchColumn();
        if (!$idJenis || !$idTingkat) {
            out(['status' => 'error', 'message' => 'Jenis atau tingkat kerusakan tidak dikenal.']);
        }

        // Foto (opsional): jpg/png/webp, maksimal 3 MB
        $foto = null;
        if (!empty($_FILES['foto']['tmp_name'])) {
            $mime = mime_content_type($_FILES['foto']['tmp_name']);
            $ext  = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime] ?? null;
            if (!$ext || $_FILES['foto']['size'] > 3 * 1024 * 1024) {
                out(['status' => 'error', 'message' => 'Foto harus JPG/PNG/WEBP dan maksimal 3 MB.']);
            }
            $foto = bin2hex(random_bytes(8)) . '.' . $ext;
            move_uploaded_file($_FILES['foto']['tmp_name'], __DIR__ . '/../uploads/' . $foto);
        }

        $idPengguna = $_SESSION['id_pengguna'] ?? null;

        $pdo->beginTransaction();
        $ins = $pdo->prepare("INSERT INTO laporan
            (no_tiket, id_pengguna, nama_pelapor, id_jenis, id_tingkat, id_status, lokasi, latitude, longitude, keterangan, foto)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)");
        $ins->execute(['T' . bin2hex(random_bytes(4)), $idPengguna, $nama, $idJenis, $idTingkat, $lokasi, $lat, $lng, $ket, $foto]);
        $id    = (int)$pdo->lastInsertId();
        $tiket = 'JR-' . sprintf('%04d', $id);
        $pdo->prepare("UPDATE laporan SET no_tiket = ? WHERE id_laporan = ?")->execute([$tiket, $id]);
        $pdo->prepare("INSERT INTO riwayat_status (id_laporan, id_status, id_petugas, catatan) VALUES (?, 1, NULL, 'Laporan dikirim')")
            ->execute([$id]);
        $pdo->commit();

        out(['status' => 'success', 'message' => 'Laporan terkirim.', 'no_tiket' => $tiket]);
    }

    // ===== Ubah status (khusus admin) =====
    if ($action === 'update_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        if (($_SESSION['role'] ?? '') !== 'admin') {
            out(['status' => 'error', 'message' => 'Sesi admin berakhir, silakan masuk lagi.']);
        }
        $tiket = strtoupper(trim($_POST['tiket'] ?? ''));
        $stage = (int)($_POST['stage'] ?? -1);          // 0..4
        $q = $pdo->prepare("SELECT id_laporan FROM laporan WHERE no_tiket = ?");
        $q->execute([$tiket]); $id = (int)$q->fetchColumn();
        $q = $pdo->prepare("SELECT id_status FROM status_laporan WHERE urutan = ?");
        $q->execute([$stage + 1]); $idStatus = $q->fetchColumn();
        if (!$id || !$idStatus) out(['status' => 'error', 'message' => 'Data tidak valid.']);

        $pdo->beginTransaction();
        $pdo->prepare("UPDATE laporan SET id_status = ? WHERE id_laporan = ?")->execute([$idStatus, $id]);
        $pdo->prepare("INSERT INTO riwayat_status (id_laporan, id_status, id_petugas) VALUES (?, ?, ?)")
            ->execute([$id, $idStatus, $_SESSION['id_pengguna'] ?? null]);
        $pdo->commit();
        out(['status' => 'success', 'message' => 'Status diperbarui.']);
    }

    // ===== Hapus laporan (khusus admin) =====
    if ($action === 'delete' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        if (($_SESSION['role'] ?? '') !== 'admin') {
            out(['status' => 'error', 'message' => 'Sesi admin berakhir, silakan masuk lagi.']);
        }
        $tiket = strtoupper(trim($_POST['tiket'] ?? ''));
        $q = $pdo->prepare("SELECT id_laporan, foto FROM laporan WHERE no_tiket = ?");
        $q->execute([$tiket]); $row = $q->fetch();
        if (!$row) out(['status' => 'error', 'message' => 'Laporan tidak ditemukan.']);
        $pdo->prepare("DELETE FROM laporan WHERE id_laporan = ?")->execute([$row['id_laporan']]);
        if ($row['foto']) @unlink(__DIR__ . '/../uploads/' . basename($row['foto']));
        out(['status' => 'success', 'message' => 'Laporan dihapus.']);
    }

    out(['status' => 'error', 'message' => 'Aksi tidak dikenal.']);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log('jalanku: ' . $e->getMessage());
    out(['status' => 'error', 'message' => 'Terjadi kesalahan sistem.']);
}
