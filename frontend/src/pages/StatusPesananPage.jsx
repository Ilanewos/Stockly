import React, { useEffect, useState } from "react";
import {
  getOrders,
  getOrderSummary,
  updateOrderStatus,
} from "../services/orderService";

export default function StatusPesananPage() {
  const [pesanan, setPesanan] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    processing: 0,
    done: 0,
    cancel: 0,
  });
  const [loading, setLoading] = useState(true);

  // ambil data awal
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [orders, sum] = await Promise.all([
          getOrders(),
          getOrderSummary(),
        ]);
        setPesanan(orders);
        setSummary(sum);
      } catch (err) {
        console.error("Gagal load data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Hitung ulang summary setelah ubah status
  const refreshSummary = async () => {
    try {
      const sum = await getOrderSummary();
      setSummary(sum);
    } catch (err) {
      console.error("Gagal refresh summary:", err);
    }
  };

  // Ubah status pesanan
  const ubahStatus = async (id, statusBaru) => {
    try {
      await updateOrderStatus(id, statusBaru.toLowerCase());
      setPesanan((prev) =>
        prev.map((p) =>
          p.id_pesanan === id ? { ...p, status: statusBaru } : p
        )
      );
      refreshSummary();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading data pesanan...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Status Pesanan</h2>
      <p className="text-gray-500 mb-6">
        Daftar pesanan yang sedang diproses dan statusnya
      </p>

      {/* Ringkasan status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center font-medium">
          Pending: {summary.pending}
        </div>
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center font-medium">
          Process: {summary.processing}
        </div>
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium">
          Done: {summary.done}
        </div>
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center font-medium">
          Cancel: {summary.cancel}
        </div>
      </div>

      {/* Daftar pesanan */}
      <div className="space-y-4">
        {pesanan.map((p) => (
          <div key={p.id_pesanan} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-lg">
                  ORD-{p.id_pesanan}
                </div>
                <div className="text-sm text-gray-500">
                  Meja: {p.meja || "-"}
                </div>
              </div>

              {/* Dropdown ubah status */}
              <select
                value={p.status}
                onChange={(e) => ubahStatus(p.id_pesanan, e.target.value)}
                className={`px-2 py-1 rounded text-sm font-medium border ${
                  p.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : p.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : p.status === "done"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processing">Process</option>
                <option value="done">Done</option>
                <option value="cancel">Cancel</option>
              </select>
            </div>

            {/* Detail item */}
            <ul className="mt-3 border-t pt-2 text-sm">
              <li className="flex justify-between py-1 text-gray-700">
                <span>{p.nama_menu || "-"}</span>
                <span>Rp {Number(p.total_bayar).toLocaleString()}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
