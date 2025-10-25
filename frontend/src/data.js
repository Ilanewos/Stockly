// Dummy data based on your SQL dump (simplified)
export const bahan = [
  { id_bahan: 1, nama_bahan: 'Nasi', stok: 48 },
  { id_bahan: 2, nama_bahan: 'Ayam', stok: 30 },
  { id_bahan: 3, nama_bahan: 'Mie', stok: 40 },
  { id_bahan: 4, nama_bahan: 'Cabai', stok: 90 },
  { id_bahan: 5, nama_bahan: 'Bawang', stok: 80 },
  { id_bahan: 6, nama_bahan: 'Minyak', stok: 0 },
  { id_bahan: 7, nama_bahan: 'Kecap', stok: 5 },
  { id_bahan: 8, nama_bahan: 'Sayur', stok: 60 },
]

export const menu = [
  { id_menu: 1, nama_menu: 'Nasi Goreng', harga: 20000 },
  { id_menu: 2, nama_menu: 'Lalapan Ayam', harga: 25000 },
  { id_menu: 3, nama_menu: 'Mie Ayam', harga: 18000 },
]

export const resep = [
  { id_resep: 1, id_menu: 1, id_bahan: 1, jumlah_bahan: 1 },
  { id_resep: 2, id_menu: 1, id_bahan: 5, jumlah_bahan: 10 },
  { id_resep: 3, id_menu: 1, id_bahan: 4, jumlah_bahan: 5 },
  { id_resep: 4, id_menu: 1, id_bahan: 6, jumlah_bahan: 10 },
  { id_resep: 5, id_menu: 1, id_bahan: 7, jumlah_bahan: 5 },
  { id_resep: 6, id_menu: 2, id_bahan: 2, jumlah_bahan: 1 },
  { id_resep: 7, id_menu: 2, id_bahan: 8, jumlah_bahan: 30 },
  { id_resep: 8, id_menu: 2, id_bahan: 4, jumlah_bahan: 10 },
  { id_resep: 9, id_menu: 3, id_bahan: 3, jumlah_bahan: 1 },
  { id_resep:10, id_menu: 3, id_bahan: 8, jumlah_bahan: 20 },
  { id_resep:11, id_menu: 3, id_bahan: 2, jumlah_bahan: 30 },
]

export const pesanan = [
  { id_pesanan: 1001, total_bayar: 33000, items: [ { id_menu:1, jumlah:1, subtotal:15000 }, { id_menu:2, jumlah:1, subtotal:18000 } ], tanggal: '2025-10-24' }
]

export const restock = [
  { id_restok:1, id_bahan:1, jumlah_tambah:50, tanggal:'2025-10-23' },
  { id_restok:2, id_bahan:2, jumlah_tambah:20, tanggal:'2025-10-23' },
  { id_restok:3, id_bahan:6, jumlah_tambah:50, tanggal:'2025-10-22' },
]