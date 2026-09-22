# 🎮 Top Up Game API

REST API untuk aplikasi e-commerce top-up game (diamond, UC, dan item digital lainnya). Project ini dibangun sebagai portofolio pembelajaran backend development, mencakup autentikasi, otorisasi berbasis role, dan alur transaksi lengkap.

## 📖 Tentang Project

Aplikasi ini mensimulasikan sistem top-up game skala kecil dengan dua peran utama:
- **User** — bisa melihat katalog game & paket, melakukan checkout, dan melihat riwayat transaksi
- **Admin** — bisa mengelola data game/produk dan memperbarui status transaksi

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL (dikelola via XAMPP/phpMyAdmin) |
| Autentikasi | JSON Web Token (JWT) |
| Password Hashing | bcrypt |
| Testing API | Thunder Client |
| Version Control | Git & GitHub |

## ✨ Fitur

### Autentikasi
- Register akun baru dengan password ter-hash (bcrypt)
- Login dengan JWT token (berlaku 1 hari)
- Middleware proteksi endpoint (harus login)
- Middleware role-based access control (khusus admin)

### Games & Products
- Melihat daftar game & detail game (publik)
- Melihat paket top-up per game (publik)
- Admin: tambah, edit, hapus game
- Admin: tambah, edit, hapus paket produk

### Orders (Transaksi)
- User: checkout paket top-up (total harga dihitung otomatis dari database)
- User: melihat detail order & riwayat transaksi pribadi
- Admin: melihat seluruh order dari semua user
- Admin: update status order (pending → processing → success/failed)
- Histori perubahan status tercatat di tabel `order_logs`

## 🗄️ Struktur Database (ERD)

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    users     │         │    orders    │         │  order_logs  │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ id (PK)      │────┐    │ id (PK)      │────┐    │ id (PK)      │
│ name         │    │    │ user_id (FK) │────┘    │ order_id(FK) │
│ email        │    └───▶│ product_id(FK)│───┐     │ status       │
│ password     │         │ target_acc_id│   │     │ note         │
│ role         │         │ quantity     │   │     │ created_at   │
│ created_at   │         │ total_price  │   │     └──────────────┘
└──────────────┘         │ status       │   │
                          │ payment_meth │   │
                          │ created_at   │   │
                          └──────────────┘   │
                                              │
┌──────────────┐         ┌──────────────┐    │
│    games     │         │   products   │    │
├──────────────┤         ├──────────────┤    │
│ id (PK)      │────┐    │ id (PK)      │◀───┘
│ name         │    └───▶│ game_id (FK) │
│ thumbnail_url│         │ name         │
│ description  │         │ price        │
│ is_active    │         │ is_active    │
│ created_at   │         │ created_at   │
└──────────────┘         └──────────────┘
```

**Relasi:**
- `products.game_id` → `games.id` (satu game punya banyak produk)
- `orders.user_id` → `users.id` (satu user punya banyak order)
- `orders.product_id` → `products.id` (satu produk bisa dipesan berkali-kali)
- `order_logs.order_id` → `orders.id` (satu order punya banyak log histori status)

## 📡 API Endpoints

### Auth
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | Publik | Registrasi akun baru |
| POST | `/api/auth/login` | Publik | Login, mengembalikan JWT token |

### Games
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/games` | Publik | Daftar semua game aktif |
| GET | `/api/games/:id` | Publik | Detail satu game |
| GET | `/api/games/:gameId/products` | Publik | Daftar paket top-up per game |
| POST | `/api/games` | Admin | Tambah game baru |
| PUT | `/api/games/:id` | Admin | Update data game |
| DELETE | `/api/games/:id` | Admin | Hapus game |

### Products
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/games/products` | Admin | Tambah paket produk baru |
| PUT | `/api/games/products/:id` | Admin | Update paket produk |
| DELETE | `/api/games/products/:id` | Admin | Hapus paket produk |

### Orders
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/orders` | User (login) | Buat order/checkout baru |
| GET | `/api/orders/:id` | User (login) | Detail satu order |
| GET | `/api/orders/user/:userId` | User (login) | Riwayat order milik user |
| GET | `/api/orders` | Admin | Lihat semua order (dashboard) |
| PUT | `/api/orders/:id/status` | Admin | Update status order |

**Autentikasi endpoint terproteksi:** kirim header `Authorization: Bearer <token>` yang didapat dari hasil login.

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js terinstall
- XAMPP (untuk MySQL) terinstall dan berjalan

### Langkah Instalasi

1. Clone repository ini
```bash
git clone https://github.com/shinji33114/topup-game-api.git
cd topup-game-api
```

2. Install dependencies
```bash
npm install
```

3. Buat database MySQL bernama `topup_game_db` via phpMyAdmin, lalu jalankan schema SQL yang tersedia di folder `/database` *(sesuaikan jika kamu simpan file schema di lokasi lain)*

4. Buat file `.env` di root project, isi dengan:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=topup_game_db
DB_PORT=3306
PORT=5000
JWT_SECRET=your_secret_key_here
```

5. Jalankan server
```bash
npm run dev
```

6. Server akan berjalan di `http://localhost:5000`

## 🧪 Testing

Semua endpoint sudah diuji secara manual menggunakan Thunder Client, meliputi:
- Alur autentikasi (register, login, akses tanpa token, token invalid)
- Alur CRUD games & products (termasuk validasi role admin)
- Alur checkout & update status order
- Skenario negatif: user biasa mencoba akses endpoint admin (harus ditolak)

## 📚 Apa yang Saya Pelajari dari Project Ini

Project ini adalah langkah pertama saya membangun REST API full backend dari nol. Beberapa hal yang saya pelajari dan alami langsung selama proses membangunnya:

- **Desain database relasional** — merancang skema dengan foreign key yang saling terhubung (users, games, products, orders, order_logs), dan memahami kenapa relasi ini penting untuk menjaga integritas data.
- **Arsitektur MVC** — memisahkan kode menjadi config, controllers, routes, dan middlewares supaya project tetap rapi dan mudah dikembangkan, dibanding menumpuk semua logic di satu file.
- **Autentikasi & otorisasi** — memahami perbedaan antara *authentication* (siapa kamu, lewat login & JWT) dan *authorization* (apa yang boleh kamu lakukan, lewat role-based middleware).
- **Debugging error nyata** — mulai dari `ReferenceError: Cannot access 'app' before initialization` karena urutan kode yang salah, sampai bug routing Express dimana `/products/:id` tertimpa oleh pola `/:id` yang lebih umum karena urutan deklarasi route yang keliru. Ini mengajarkan saya pentingnya urutan route dari yang paling spesifik ke paling umum.
- **Environment variables & keamanan dasar** — memahami kenapa `.env` tidak boleh di-commit ke Git, dan bagaimana `.gitignore` bekerja untuk melindungi data sensitif.
- **Version control dengan Git** — mulai dari inisialisasi repo, resolve masalah unrelated histories saat menghubungkan repo lokal dengan repo GitHub yang sudah ada isinya, sampai kebiasaan commit bertahap per fitur.
- **Manual API testing** — menggunakan Thunder Client untuk menguji endpoint secara sistematis, termasuk skenario gagal (token tidak valid, akses ditolak) untuk memastikan keamanan aplikasi bekerja sesuai harapan, bukan cuma "jalan pas kondisi normal".

Tahap selanjutnya yang ingin saya kembangkan: integrasi payment gateway sungguhan (Midtrans/Xendit) dan membangun frontend untuk melengkapi aplikasi ini secara end-to-end.

## 👤 Author

Dibuat oleh Irfan Maulana Firmansyah Putra sebagai bagian dari portofolio belajar backend development.

---

*Project ini masih dalam pengembangan aktif — fitur frontend dan integrasi payment gateway direncanakan sebagai langkah berikutnya.*
