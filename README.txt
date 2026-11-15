jalanku. (versi pecahan file)

Buka index.html di browser. Semua file saling terhubung lewat folder assets.

index.html            -> kerangka halaman
assets/css/           -> style.css (utama), fx.css, peta.css, style-2..6.css (urut sesuai pemuatan di index.html)
assets/js/            -> script-01..07.js (urut sesuai index.html), hero-video.js (video latar)
assets/img/           -> gambar yang dulu tertanam (logo, foto)
assets/video/         -> video hero landscape dan portrait

Catatan: Leaflet (peta) dan font Plus Jakarta Sans tetap dimuat dari internet (CDN).
Urutan <link> dan <script> di index.html jangan diubah kalau mau menggabung ulang.
