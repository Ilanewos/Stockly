import React, { useState, useEffect } from "react";
import { api } from "../api";

export default function LaporanPage() {
  const [laporanHariIni, setLaporanHariIni] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data laporan dari backend
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const reportRes = await api.getReport();
        const stokRes = await api.getStokBahan();

        const summary = reportRes?.summary || {};
        const list = reportRes?.list || [];
        const stok = stokRes?.data || [];

        const laporan = {
          tanggal: new Date().toLocaleDateString("id-ID"),
          total_transaksi: summary.total_transaksi || 0,
          total_penjualan: summary.total_pendapatan || 0,
          rata_rata_transaksi:
            summary.total_transaksi > 0
              ? summary.total_pendapatan / summary.total_transaksi
              : 0,
          stok_bahan: stok,
          transaksi: list,
        };

        setLaporanHariIni(laporan);
        localStorage.setItem("laporan_hari_ini", JSON.stringify(laporan));
      } catch (err) {
        console.error("⚠️ Gagal ambil laporan dari backend:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  if (loading) return <p className="p-6">Loading laporan...</p>;
  if (!laporanHariIni) return <p className="p-6">Data laporan tidak tersedia.</p>;

  const { tanggal, total_transaksi, total_penjualan, rata_rata_transaksi, stok_bahan, transaksi } =
    laporanHariIni;

  const lowStock = stok_bahan.filter((b) => b.status === "menipis");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Operasional</h2>
          {/* <p className="text-gray-500">Laporan tanggal {tanggal}</p> */}
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded shadow">
          <p className="text-sm font-medium">Total Pendapatan</p>
          <p className="text-2xl font-bold">
            Rp {total_penjualan.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500">
            Dari {total_transaksi} transaksi selesai
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <p className="text-sm font-medium">Rata-rata Transaksi</p>
          <p className="text-2xl font-bold">
            Rp {Math.round(rata_rata_transaksi).toLocaleString("id-ID")}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded shadow">
          <p className="text-sm font-medium">Stok Rendah</p>
          <p className="text-2xl font-bold">{lowStock.length}</p>
        </div>
      </div>

      {/* 🔹 Tabel Transaksi */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h4 className="font-semibold mb-2">Transaksi Selesai (Done)</h4>
        {transaksi.length === 0 ? (
          <p>Belum ada transaksi selesai.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border px-4 py-2">No</th>
                <th className="border px-4 py-2">Menu</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((t, i) => (
                <tr key={t.id_transaksi || i} className="text-center">
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2">{t.nama_menu}</td>
                  <td className="border px-4 py-2">{t.total_jumlah}</td>
                  <td className="border px-4 py-2">
                    Rp {t.total_harga?.toLocaleString("id-ID")}
                  </td>
                  <td className="border px-4 py-2">{t.waktu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Kondisi Stok Bahan */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h4 className="font-semibold mb-2">Kondisi Stok Bahan</h4>
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-4 py-2">Nama Bahan</th>
              <th className="border px-4 py-2">Stok</th>
              <th className="border px-4 py-2">Satuan</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {stok_bahan.map((b, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">{b.namaBahan}</td>
                <td className="border px-4 py-2">{b.stok}</td>
                <td className="border px-4 py-2">{b.satuan}</td>
                <td
                  className={`border px-4 py-2 font-semibold ${
                    b.status === "menipis" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {b.status === "menipis" ? "Menipis" : "Normal"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
