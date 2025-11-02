import React, { useState, useEffect } from "react";

export default function LaporanPage() {
  const [laporanHariIni, setLaporanHariIni] = useState({
    tanggal: new Date().toLocaleDateString("id-ID"),
    total_transaksi: 0,
    total_penjualan: 0,
    rata_rata_transaksi: 0,
    stok_bahan: [],
    transaksi: [],
  });

  const [loading, setLoading] = useState(true);

  // Ambil data dari halaman Transaksi & Bahan
  const fetchTransaksi = () => {
    return JSON.parse(localStorage.getItem("transaksi")) || [];
  };

  const fetchBahan = () => {
    return JSON.parse(localStorage.getItem("bahan")) || [];
  };

  // Update laporan hari ini
  const updateLaporanHariIni = () => {
    const today = new Date().toLocaleDateString("id-ID");

    // Ambil semua transaksi, lalu filter hanya yang statusnya "done"
    const transaksiHariIni = fetchTransaksi().filter(
      (t) => t.status?.toLowerCase() === "done"
    );

    const bahanHariIni = fetchBahan();

    const total_penjualan = transaksiHariIni.reduce((sum, t) => sum + t.total, 0);
    const total_transaksi = transaksiHariIni.length;
    const rata_rata_transaksi = total_transaksi
      ? total_penjualan / total_transaksi
      : 0;

    const laporanBaru = {
      tanggal: today,
      total_transaksi,
      total_penjualan,
      rata_rata_transaksi,
      stok_bahan: bahanHariIni,
      transaksi: transaksiHariIni,
    };

    localStorage.setItem("laporan_hari_ini", JSON.stringify(laporanBaru));
    setLaporanHariIni(laporanBaru);
  };

  useEffect(() => {
    setLoading(true);
    updateLaporanHariIni();
    setLoading(false);
  }, []);

  const laporanTampil = {
    ...laporanHariIni,
    stok_bahan: fetchBahan(),
  };

  const lowStock = laporanTampil.stok_bahan.filter((b) => b.stok <= b.min_stok);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Laporan Operasional</h2>
          <p className="text-gray-500">
            Laporan tanggal {laporanTampil.tanggal}
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading laporan...</p>
      ) : (
        <>
          {/* Statistik utama */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded shadow">
              <p className="text-sm font-medium">Total Pendapatan</p>
              <p className="text-2xl font-bold">
                Rp {laporanTampil.total_penjualan?.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-gray-500">
                Dari {laporanTampil.total_transaksi} transaksi selesai
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow">
              <p className="text-sm font-medium">Rata-rata Transaksi</p>
              <p className="text-2xl font-bold">
                Rp{" "}
                {Math.round(laporanTampil.rata_rata_transaksi)?.toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow">
              <p className="text-sm font-medium">Stok Rendah</p>
              <p className="text-2xl font-bold">{lowStock.length}</p>
            </div>
          </div>

          {/* Tabel Transaksi */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h4 className="font-semibold mb-2">Transaksi Selesai (Done)</h4>
            {laporanTampil.transaksi.length === 0 ? (
              <p>Belum ada transaksi selesai hari ini.</p>
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
                  {laporanTampil.transaksi.map((t, idxTrans) =>
                    t.items.map((item, idxItem) => (
                      <tr key={`${t.id}-${item.menuId}`} className="text-center">
                        {idxItem === 0 && (
                          <td className="border px-4 py-2" rowSpan={t.items.length}>
                            {idxTrans + 1}
                          </td>
                        )}
                        <td className="border px-4 py-2">{item.name}</td>
                        <td className="border px-4 py-2">{item.quantity}</td>
                        <td className="border px-4 py-2">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>
                        {idxItem === 0 && (
                          <td className="border px-4 py-2" rowSpan={t.items.length}>
                            {t.waktu}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Kondisi Stok Bahan */}
          <div className="bg-white p-4 rounded shadow overflow-x-auto">
            <h4 className="font-semibold mb-2">Kondisi Stok Bahan</h4>
            <div className="min-w-[600px]">
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-200 text-center">
                    <th className="border px-4 py-2">Nama Bahan</th>
                    <th className="border px-4 py-2">Stok</th>
                    <th className="border px-4 py-2">Min. Stok</th>
                    <th className="border px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanTampil.stok_bahan.map((b) => (
                    <tr key={b.id_bahan || b.id} className="text-center">
                      <td className="border px-4 py-2">{b.nama_bahan || b.nama}</td>
                      <td className="border px-4 py-2">{b.stok_awal ?? b.stok}</td>
                      <td className="border px-4 py-2">{b.stok}</td>
                      <td className="border px-4 py-2">{b.min_stok}</td>
                      <td
                        className={`border px-4 py-2 font-semibold ${
                          b.stok <= b.min_stok
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {b.stok <= b.min_stok ? "Rendah" : "Aman"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
