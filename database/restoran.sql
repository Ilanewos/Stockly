-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 03 Nov 2025 pada 13.49
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restoran`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `bahan`
--

CREATE TABLE `bahan` (
  `id_bahan` int(11) NOT NULL,
  `nama_bahan` varchar(100) NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `satuan` varchar(50) NOT NULL,
  `harga` int(11) NOT NULL DEFAULT 0,
  `status` enum('normal','menipis','habis') DEFAULT 'normal',
  `minim_stok` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bahan`
--

INSERT INTO `bahan` (`id_bahan`, `nama_bahan`, `stok`, `satuan`, `harga`, `status`, `minim_stok`) VALUES
(1, 'Nasi Premium', 5460, 'gram', 12000, 'menipis', 2000),
(2, 'Telur ayam', 45, 'butir', 2500, 'normal', 30),
(3, 'Daging ayam', 2000, 'gram', 40000, 'normal', 200),
(4, 'Bawang putih', 50, 'siung', 1000, 'normal', 10),
(5, 'Kecap manis', 25, 'sdm', 500, 'normal', 5),
(6, 'Saus tiram', 20, 'sdm', 600, 'normal', 5),
(7, 'Garam', 50, 'sdt', 200, 'normal', 10),
(8, 'Merica bubuk', 30, 'sdt', 300, 'normal', 10),
(9, 'Minyak goreng', 25, 'sdm', 400, 'normal', 10),
(10, 'Daun bawang', 20, 'batang', 1000, 'normal', 5),
(11, 'Bawang goreng', 20, 'sdm', 1500, 'normal', 5),
(12, 'Air', 300, 'ml', 1, 'normal', 100),
(13, 'Serai', 100, 'batang', 500, 'normal', 5),
(14, 'Daun salam', 100, 'lembar', 300, 'normal', 5),
(15, 'Bawang merah', 80, 'siung', 800, 'normal', 10),
(16, 'Kunyit', 50, 'cm', 400, 'normal', 5),
(17, 'Jahe', 50, 'cm', 400, 'normal', 5),
(18, 'Soun', 200, 'gram', 1500, 'normal', 20),
(19, 'Tauge', 200, 'gram', 800, 'normal', 20),
(20, 'Jeruk nipis', 50, 'buah', 1000, 'normal', 5),
(21, 'Daun seledri', 50, 'batang', 700, 'normal', 5),
(22, 'Mie telur', 3000, 'gram', 2500, 'normal', 200),
(23, 'Kol', 1000, 'gram', 1500, 'normal', 100),
(24, 'Sawi hijau', 800, 'gram', 1200, 'normal', 100),
(25, 'Dada ayam', 1500, 'gram', 45000, 'normal', 200),
(26, 'Madu', 30, 'sdm', 1000, 'normal', 5),
(27, 'Margarin', 30, 'sdm', 800, 'normal', 5),
(28, 'Wortel', 1000, 'gram', 1000, 'normal', 50),
(29, 'Brokoli', 1000, 'gram', 2000, 'normal', 50),
(30, 'Bakso sapi', 100, 'butir', 1500, 'normal', 10),
(31, 'Teh celup', 49, 'kantong', 300, 'normal', 10),
(32, 'Gula pasir', 498, 'sdm', 100, 'normal', 20),
(33, 'Es batu', 292, 'kotak', 50, 'normal', 20),
(34, 'Daging alpukat', 300, 'gram', 5000, 'normal', 10),
(35, 'Susu kental manis', 50, 'sdm', 800, 'normal', 10),
(36, 'Bubuk kopi', 200, 'sdm', 400, 'normal', 10),
(37, 'Susu cair', 500, 'ml', 200, 'normal', 50),
(38, 'Gula', 26, 'sd', 400, 'normal', 20),
(43, 'cabai', 100, 'kg', 50000, 'normal', 50),
(44, 'daging sapi', 10, 'kg', 10000, 'normal', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `menu`
--

CREATE TABLE `menu` (
  `id_menu` int(11) NOT NULL,
  `nama_menu` varchar(100) NOT NULL,
  `harga` int(11) NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `menu`
--

INSERT INTO `menu` (`id_menu`, `nama_menu`, `harga`, `deleted_at`) VALUES
(1, 'Ayam Geprek Keju', 20000, '2025-10-29 02:42:34'),
(2, 'Soto Ayam', 20000, NULL),
(3, 'Mie Goreng Jawa', 22000, '2025-11-02 17:42:25'),
(4, 'Ayam Bakar Madu', 30000, '2025-11-02 11:04:00'),
(5, 'Capcay Kuah', 18000, '2025-11-02 11:03:52'),
(6, 'Es Teh Manis', 5000, NULL),
(7, 'Jus Alpukat', 20000, '2025-11-02 11:03:49'),
(8, 'Kopi Susu Gula Aren', 15000, '2025-11-02 11:03:45'),
(9, 'Ayam Geprek', 18000, '2025-11-02 17:42:09'),
(10, 'popmie', 5000, '2025-11-02 10:44:59'),
(11, 'indomie', 10000, '2025-11-02 11:02:37'),
(12, 'Ayam aja', 32232, NULL),
(13, 'de', 3323, NULL),
(14, 'telur orak arik', 5000, '2025-11-02 20:33:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `resep`
--

CREATE TABLE `resep` (
  `id_resep` int(11) NOT NULL,
  `id_menu` int(11) DEFAULT NULL,
  `id_bahan` int(11) DEFAULT NULL,
  `jumlah_bahan` int(11) NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `resep`
--

INSERT INTO `resep` (`id_resep`, `id_menu`, `id_bahan`, `jumlah_bahan`, `deleted_at`) VALUES
(1, 1, 1, 200, NULL),
(2, 1, 2, 1, NULL),
(3, 1, 3, 2, '2025-10-29 22:19:40'),
(4, 1, 4, 2, NULL),
(5, 1, 5, 1, NULL),
(6, 1, 6, 1, NULL),
(7, 1, 7, 0, NULL),
(8, 1, 8, 0, NULL),
(9, 1, 9, 1, NULL),
(10, 1, 10, 1, NULL),
(11, 1, 11, 1, NULL),
(12, 2, 3, 100, '2025-11-02 11:04:46'),
(13, 2, 12, 400, '2025-11-02 11:04:46'),
(14, 2, 13, 1, '2025-11-02 11:04:46'),
(15, 2, 14, 1, '2025-11-02 11:04:46'),
(16, 2, 4, 2, '2025-11-02 11:04:46'),
(17, 2, 15, 3, '2025-11-02 11:04:46'),
(18, 2, 16, 1, '2025-11-02 11:04:46'),
(19, 2, 17, 1, '2025-11-02 11:04:46'),
(20, 2, 7, 1, '2025-11-02 11:04:46'),
(21, 2, 8, 0, '2025-11-02 11:04:46'),
(22, 2, 9, 1, '2025-11-02 11:04:46'),
(23, 2, 18, 20, '2025-11-02 11:04:46'),
(24, 2, 19, 20, '2025-11-02 11:04:46'),
(25, 2, 20, 1, '2025-11-02 11:04:46'),
(26, 2, 21, 1, '2025-11-02 11:04:46'),
(27, 3, 22, 100, '2025-11-02 11:05:44'),
(28, 3, 2, 1, '2025-11-02 11:05:44'),
(29, 3, 23, 30, '2025-11-02 11:05:44'),
(30, 3, 24, 20, '2025-11-02 11:05:44'),
(31, 3, 4, 2, '2025-11-02 11:05:44'),
(32, 3, 5, 1, '2025-11-02 11:05:44'),
(33, 3, 6, 1, '2025-11-02 11:05:44'),
(34, 3, 7, 0, '2025-11-02 11:05:44'),
(35, 3, 8, 0, '2025-11-02 11:05:44'),
(36, 3, 9, 1, '2025-11-02 11:05:44'),
(37, 3, 10, 1, '2025-11-02 11:05:44'),
(38, 4, 25, 120, '2025-11-02 11:04:00'),
(39, 4, 26, 1, '2025-11-02 11:04:00'),
(40, 4, 5, 1, '2025-11-02 11:04:00'),
(41, 4, 4, 2, '2025-11-02 11:04:00'),
(42, 4, 20, 1, '2025-11-02 11:04:00'),
(43, 4, 7, 0, '2025-11-02 11:04:00'),
(44, 4, 8, 0, '2025-11-02 11:04:00'),
(45, 4, 27, 1, '2025-11-02 11:04:00'),
(46, 5, 28, 30, '2025-11-02 11:03:52'),
(47, 5, 29, 30, '2025-11-02 11:03:52'),
(48, 5, 23, 20, '2025-11-02 11:03:52'),
(49, 5, 24, 20, '2025-11-02 11:03:52'),
(50, 5, 30, 3, '2025-11-02 11:03:52'),
(51, 5, 4, 2, '2025-11-02 11:03:52'),
(52, 5, 6, 1, '2025-11-02 11:03:52'),
(53, 5, 7, 0, '2025-11-02 11:03:52'),
(54, 5, 8, 0, '2025-11-02 11:03:52'),
(55, 5, 12, 150, '2025-11-02 11:03:52'),
(56, 5, 9, 1, '2025-11-02 11:03:52'),
(57, 6, 31, 1, '2025-11-02 11:05:53'),
(58, 6, 12, 200, '2025-11-02 11:05:53'),
(59, 6, 32, 2, '2025-11-02 11:05:53'),
(60, 6, 33, 8, '2025-11-02 11:05:53'),
(61, 7, 34, 100, '2025-11-02 11:03:49'),
(62, 7, 35, 1, '2025-11-02 11:03:49'),
(63, 7, 32, 1, '2025-11-02 11:03:49'),
(64, 7, 12, 100, '2025-11-02 11:03:49'),
(65, 7, 33, 5, '2025-11-02 11:03:49'),
(66, 8, 36, 1, '2025-11-02 11:03:45'),
(67, 8, 12, 150, '2025-11-02 11:03:45'),
(68, 8, 37, 100, '2025-11-02 11:03:45'),
(69, 8, 38, 2, '2025-11-02 11:03:45'),
(70, 8, 33, 8, '2025-11-02 11:03:45'),
(71, 1, 2, 1, NULL),
(72, 9, 1, 5, '2025-11-02 11:00:42'),
(73, 9, 3, 20, '2025-11-02 11:00:42'),
(74, 9, 1, 5, '2025-11-02 11:02:53'),
(75, 9, 1, 5, '2025-11-02 11:03:39'),
(76, 9, 1, 5, '2025-11-02 17:42:09'),
(77, 9, 3, 10, '2025-11-02 17:42:09'),
(78, 9, 43, 1, '2025-11-02 17:42:10'),
(79, 2, 3, 100, NULL),
(80, 2, 12, 399, NULL),
(81, 2, 13, 1, NULL),
(82, 2, 14, 1, NULL),
(83, 2, 4, 2, NULL),
(84, 2, 15, 3, NULL),
(85, 2, 16, 1, NULL),
(86, 2, 17, 1, NULL),
(87, 2, 7, 1, NULL),
(88, 2, 9, 1, NULL),
(89, 2, 18, 20, NULL),
(90, 2, 19, 20, NULL),
(91, 2, 20, 1, NULL),
(92, 2, 21, 1, NULL),
(93, 3, 22, 100, '2025-11-02 17:42:25'),
(94, 3, 2, 1, '2025-11-02 17:42:25'),
(95, 3, 24, 20, '2025-11-02 17:42:25'),
(96, 3, 10, 1, '2025-11-02 17:42:25'),
(97, 3, 12, 500, '2025-11-02 17:42:25'),
(98, 6, 31, 1, NULL),
(99, 6, 12, 200, NULL),
(100, 6, 32, 2, NULL),
(101, 6, 33, 8, NULL),
(102, 13, 1, 10, NULL),
(103, 14, 2, 1, '2025-11-02 20:33:35'),
(104, 14, 9, 5, '2025-11-02 20:33:35');

-- --------------------------------------------------------

--
-- Struktur dari tabel `restok`
--

CREATE TABLE `restok` (
  `id_restok` int(11) NOT NULL,
  `jumlah_tambah` int(11) NOT NULL,
  `tanggal_restok` datetime DEFAULT current_timestamp(),
  `id_bahan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `restok`
--

INSERT INTO `restok` (`id_restok`, `jumlah_tambah`, `tanggal_restok`, `id_bahan`) VALUES
(1, 5000, '2025-11-02 10:59:22', 1),
(2, 20, '2025-11-02 11:07:13', 2),
(3, 2000, '2025-10-28 00:40:01', 3),
(4, 50, '2025-10-28 00:40:01', 4),
(5, 4, '2025-11-02 04:44:10', 5),
(6, 20, '2025-10-28 00:40:01', 6),
(7, 50, '2025-10-28 00:40:01', 7),
(8, 30, '2025-10-28 00:40:01', 8),
(9, 50, '2025-10-28 00:40:01', 9),
(10, 20, '2025-10-28 00:40:01', 10),
(11, 20, '2025-10-28 00:40:01', 11),
(12, 100, '2025-10-28 00:40:01', 13),
(13, 100, '2025-10-28 00:40:01', 14),
(14, 80, '2025-10-28 00:40:01', 15),
(15, 50, '2025-10-28 00:40:01', 16),
(16, 50, '2025-10-28 00:40:01', 17),
(17, 200, '2025-10-28 00:40:01', 18),
(18, 200, '2025-10-28 00:40:01', 19),
(19, 50, '2025-10-28 00:40:01', 20),
(20, 50, '2025-10-28 00:40:01', 21),
(21, 3000, '2025-10-28 00:40:01', 22),
(22, 1000, '2025-10-28 00:40:01', 23),
(23, 800, '2025-10-28 00:40:01', 24),
(24, 1500, '2025-10-28 00:40:01', 25),
(25, 30, '2025-10-28 00:40:01', 26),
(26, 30, '2025-10-28 00:40:01', 27),
(27, 1000, '2025-10-28 00:40:01', 28),
(28, 1000, '2025-10-28 00:40:01', 29),
(29, 100, '2025-10-28 00:40:01', 30),
(30, 50, '2025-10-28 00:40:01', 31),
(31, 500, '2025-10-28 00:40:01', 32),
(32, 300, '2025-10-28 00:40:01', 33),
(33, 300, '2025-10-28 00:40:01', 34),
(34, 50, '2025-10-28 00:40:01', 35),
(35, 200, '2025-10-28 00:40:01', 36),
(36, 500, '2025-10-28 00:40:01', 37),
(37, 50, '2025-10-28 00:40:01', 38),
(38, 500, '2025-11-02 11:06:59', 12);

-- --------------------------------------------------------

--
-- Struktur dari tabel `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(11) NOT NULL,
  `id_menu` int(11) NOT NULL,
  `total_jumlah` int(11) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `nomor_meja` int(11) NOT NULL,
  `waktu` datetime DEFAULT current_timestamp(),
  `catatan` varchar(255) DEFAULT NULL,
  `status_pesanan` enum('pending','done','cancel') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_menu`, `total_jumlah`, `total_harga`, `nomor_meja`, `waktu`, `catatan`, `status_pesanan`) VALUES
(1, 1, 1, 20000, 1, '2025-10-28 10:15:00', NULL, ''),
(2, 3, 1, 25000, 2, '2025-10-28 10:20:00', NULL, ''),
(3, 2, 1, 5000, 3, '2025-10-28 10:35:00', NULL, ''),
(11, 6, 1, 5000, 0, '2025-11-02 18:55:11', NULL, ''),
(12, 2, 1, 20000, 0, '2025-11-02 18:56:12', NULL, ''),
(13, 6, 1, 5000, 0, '2025-11-02 19:01:10', NULL, ''),
(14, 6, 1, 5000, 0, '2025-11-02 19:02:19', NULL, ''),
(15, 2, 3, 60000, 0, '2025-11-02 19:03:57', 'tanpa sambal, ekstra telur', ''),
(19, 6, 1, 5000, 0, '2025-11-02 19:42:56', 'adada', 'done'),
(22, 13, 1, 3323, 0, '2025-11-02 19:51:13', 'adada', 'done'),
(23, 13, 1, 3323, 0, '2025-11-02 19:52:18', 'dadad', 'done'),
(24, 14, 1, 10000, 0, '2025-11-02 19:55:09', 'whfujb', 'done'),
(25, 14, 1, 10000, 0, '2025-11-02 20:04:02', NULL, 'done'),
(26, 14, 1, 10000, 0, '2025-11-02 20:05:06', NULL, 'done'),
(27, 14, 2, 20000, 0, '2025-11-02 20:24:03', 'ms vm', 'done'),
(28, 13, 1, 3323, 0, '2025-11-02 20:25:10', NULL, 'done'),
(29, 13, 1, 3323, 0, '2025-11-02 20:28:09', 'cnab', 'done');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `bahan`
--
ALTER TABLE `bahan`
  ADD PRIMARY KEY (`id_bahan`);

--
-- Indeks untuk tabel `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indeks untuk tabel `resep`
--
ALTER TABLE `resep`
  ADD PRIMARY KEY (`id_resep`),
  ADD KEY `id_menu` (`id_menu`),
  ADD KEY `id_bahan` (`id_bahan`);

--
-- Indeks untuk tabel `restok`
--
ALTER TABLE `restok`
  ADD PRIMARY KEY (`id_restok`),
  ADD KEY `id_bahan` (`id_bahan`);

--
-- Indeks untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_menu` (`id_menu`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `bahan`
--
ALTER TABLE `bahan`
  MODIFY `id_bahan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT untuk tabel `menu`
--
ALTER TABLE `menu`
  MODIFY `id_menu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT untuk tabel `resep`
--
ALTER TABLE `resep`
  MODIFY `id_resep` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT untuk tabel `restok`
--
ALTER TABLE `restok`
  MODIFY `id_restok` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `resep`
--
ALTER TABLE `resep`
  ADD CONSTRAINT `resep_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`),
  ADD CONSTRAINT `resep_ibfk_2` FOREIGN KEY (`id_bahan`) REFERENCES `bahan` (`id_bahan`);

--
-- Ketidakleluasaan untuk tabel `restok`
--
ALTER TABLE `restok`
  ADD CONSTRAINT `restok_ibfk_1` FOREIGN KEY (`id_bahan`) REFERENCES `bahan` (`id_bahan`);

--
-- Ketidakleluasaan untuk tabel `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
