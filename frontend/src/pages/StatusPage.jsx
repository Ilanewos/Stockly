import React, { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import { api } from "../api"; // pastikan api.js sudah benar seperti sebelumnya

// 🔹 Komponen dropdown status
function DropdownStatus({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Process", color: "hover:bg-yellow-100 text-yellow-700" },
    { label: "Done", color: "hover:bg-blue-100 text-blue-700" },
    { label: "Cancel", color: "hover:bg-red-100 text-red-700" },
  ];

  return (
    <div className="relative inline-block text-sm font-medium">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1 rounded border bg-white transition-colors ${
          value === "Process"
            ? "text-yellow-700 border-yellow-300"
            : value === "Done"
            ? "text-blue-700 border-blue-300"
            : "text-red-700 border-red-300"
        }`}
      >
        {value}
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-28 bg-white border rounded-lg shadow-lg z-10">
          {options.map((opt) => (
            <div
              key={opt.label}
              onClick={() => {
                onChange(opt.label);
                setOpen(false);
              }}
              className={`px-3 py-1 cursor-pointer transition ${opt.color}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil data dari backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getOrders(); // GET /operasional/orders
      if (res?.success) {
        const mapped = res.data.map((t) => ({
          id: t.id_transaksi,
          date: t.waktu,
         status:
  t.status_pesanan === "proses" || t.status_pesanan === "pending"
    ? "Process"
    : t.status_pesanan === "done"
    ? "Done"
    : "Cancel",

          note: t.catatan || "",
          nama_menu: t.nama_menu,
          total_jumlah: t.total_jumlah,
          harga: t.harga,
          total_harga: t.total_harga,
        }));
        setTransaksi(mapped);
      }
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔹 Ubah status pesanan di backend
  const ubahStatus = async (id, statusBaru) => {
    try {
      if (statusBaru === "Process") {
        await api.processOrder(id); // POST /operasional/orders/:id/process
      } else if (statusBaru === "Done") {
        await api.finishOrder(id); // POST /operasional/orders/:id/done
      } else if (statusBaru === "Cancel") {
        await api.updateOrderStatus(id, "cancel"); // POST /operasional/orders/:id/cancel
      }

      // Update tampilan
      setTransaksi((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: statusBaru } : t
        )
      );
    } catch (err) {
      console.error("Gagal ubah status:", err);
    }
  };

  // 🔹 Hitung jumlah per status
  const count = (status) => transaksi.filter((t) => t.status === status).length;

  // 🔹 Filter pesanan aktif (Process)
  const transaksiAktif = transaksi.filter((t) => t.status === "Process");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">Status Pesanan</h1>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {/* 🔹 Ringkasan status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center font-medium">
          Process: {count("Process")}
        </div>
        <div className="bg-blue-100 text-blue-800 p-2 rounded text-center font-medium">
          Done: {count("Done")}
        </div>
        <div className="bg-red-100 text-red-800 p-2 rounded text-center font-medium">
          Cancel: {count("Cancel")}
        </div>
      </div>

      {/* 🔹 Daftar transaksi */}
      {transaksiAktif.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {transaksiAktif.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm text-gray-500">
                    {t.date
                      ? new Date(t.date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </div>
                </div>

                <DropdownStatus
                  value={t.status}
                  onChange={(statusBaru) => ubahStatus(t.id, statusBaru)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>{t.nama_menu}</span>
                  <span>
                    {t.total_jumlah} × Rp {t.harga.toLocaleString("id-ID")} = Rp{" "}
                    {t.total_harga.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {t.note && (
                <p className="text-sm italic text-gray-600 mt-2">
                  Catatan: {t.note}
                </p>
              )}

              <div className="text-right font-semibold pt-2 border-t">
                Total: Rp {t.total_harga.toLocaleString("id-ID")}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">
          Belum ada pesanan aktif (status Process).
        </p>
      )}
    </div>
  );
}
