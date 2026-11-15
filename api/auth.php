<?php
session_start();
header('Content-Type: application/json');
require_once '../config/database.php';

$action = $_GET['action'] ?? '';
function out($arr) { echo json_encode($arr); exit; }

// Batasi percobaan: 5 kali gagal, tunggu 60 detik
function cek_kunci() {
    if (($_SESSION['lock_until'] ?? 0) > time()) {
        out(['status' => 'error', 'message' => 'Terlalu banyak percobaan, coba lagi sebentar.']);
    }
}
function catat_gagal() {
    $_SESSION['tries'] = ($_SESSION['tries'] ?? 0) + 1;
    if ($_SESSION['tries'] >= 5) { $_SESSION['lock_until'] = time() + 60; $_SESSION['tries'] = 0; }
}
function mulai_sesi($id, $role, $nama) {
    session_regenerate_id(true);
    $_SESSION['id_pengguna'] = (int)$id;
    $_SESSION['role'] = $role;
    $_SESSION['nama'] = $nama;
    $_SESSION['tries'] = 0;
}

try {
    // ===== Siapa yang sedang masuk =====
    if ($action === 'me') {
        out(['status' => 'success',
             'admin' => (($_SESSION['role'] ?? '') === 'admin'),
             'nama'  => $_SESSION['nama'] ?? null]);
    }

    // ===== Daftar akun warga =====
    if ($action === 'daftar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        cek_kunci();
        $nama  = trim($_POST['nama'] ?? '');
        $email = strtolower(trim($_POST['email'] ?? ''));
        $pass  = $_POST['password'] ?? '';

        if (!preg_match('/^[\p{L}\p{N}_.\- ]{3,30}$/u', $nama)) {
            out(['status' => 'error', 'message' => 'Nama pengguna 3-30 karakter (huruf, angka, spasi, titik, garis bawah).']);
        }
        if (in_array(strtolower($nama), ['admin', 'administrator'], true)) {
            out(['status' => 'error', 'message' => 'Nama pengguna tidak tersedia']);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) {
            out(['status' => 'error', 'message' => 'Format email tidak valid.']);
        }
        if (strlen($pass) < 6 || strlen($pass) > 72) {
            out(['status' => 'error', 'message' => 'Kata sandi minimal 6 karakter.']);
        }
        $q = $pdo->prepare("SELECT COUNT(*) FROM pengguna WHERE nama = ? OR email = ?");
        $q->execute([$nama, $email]);
        if ($q->fetchColumn() > 0) {
            out(['status' => 'error', 'message' => 'Nama pengguna atau email sudah dipakai.']);
        }
        $pdo->prepare("INSERT INTO pengguna (nama, email, password, role) VALUES (?, ?, ?, 'warga')")
            ->execute([$nama, $email, password_hash($pass, PASSWORD_DEFAULT)]);
        mulai_sesi($pdo->lastInsertId(), 'warga', $nama);
        out(['status' => 'success', 'nama' => $nama]);
    }

    // ===== Masuk warga (nama pengguna + kata sandi) =====
    if ($action === 'masuk' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        cek_kunci();
        $nama = trim($_POST['nama'] ?? '');
        $pass = $_POST['password'] ?? '';
        $q = $pdo->prepare("SELECT id_pengguna, nama, password FROM pengguna WHERE nama = ? AND role = 'warga'");
        $q->execute([$nama]);
        $u = $q->fetch();
        if ($u && password_verify($pass, $u['password'])) {
            mulai_sesi($u['id_pengguna'], 'warga', $u['nama']);
            out(['status' => 'success', 'nama' => $u['nama']]);
        }
        catat_gagal();
        out(['status' => 'error', 'message' => 'Nama pengguna atau kata sandi salah.']);
    }

    // ===== Masuk admin (PIN 4 digit) =====
    if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        cek_kunci();
        $pin = trim($_POST['pin'] ?? '');
        if (preg_match('/^\d{4}$/', $pin)) {
            $rows = $pdo->query("SELECT id_pengguna, password FROM pengguna WHERE role = 'admin'")->fetchAll();
            foreach ($rows as $r) {
                if (password_verify($pin, $r['password'])) {
                    mulai_sesi($r['id_pengguna'], 'admin', 'admin');
                    out(['status' => 'success']);
                }
            }
        }
        catat_gagal();
        out(['status' => 'error', 'message' => 'PIN admin salah']);
    }

    // ===== Keluar =====
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        out(['status' => 'success']);
    }

    out(['status' => 'error', 'message' => 'Aksi tidak dikenal.']);
} catch (PDOException $e) {
    error_log('jalanku auth: ' . $e->getMessage());
    if ($e->getCode() === '23000') {
        out(['status' => 'error', 'message' => 'Nama pengguna atau email sudah dipakai.']);
    }
    out(['status' => 'error', 'message' => 'Terjadi kesalahan sistem.']);
}
