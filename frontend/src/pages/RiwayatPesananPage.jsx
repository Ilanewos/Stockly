import React, { useEffect, useState } from "react";
import { getOrderHistory } from "../services/orderService";

export default function RiwayatPesananPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const res = await getOrderHistory();
        setRiwayat(res.data || []);
      } catch (err) {
        console.error("Gagal ambil riwayat:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) return <div className="p-6">Memuat riwayat...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Riwayat Pesanan</h2>
      <p className="text-gray-500 mb-6">Daftar pesanan yang sudah selesai</p>

      {riwayat.length === 0 ? (
        <div className="text-gray-500">Belum ada pesanan selesai.</div>
      ) : (
        <div className="space-y-4">
          {riwayat.map((p) => (
            <div key={p.id_pesanan} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">Pesanan #{p.id_pesanan}</div>
                  <div className="text-sm text-gray-500">Meja {p.meja}</div>
                </div>
                <div className="text-lg font-semibold text-green-700">
                  Rp {Number(p.total_bayar).toLocaleString()}
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Status: <span className="font-medium text-green-600">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
