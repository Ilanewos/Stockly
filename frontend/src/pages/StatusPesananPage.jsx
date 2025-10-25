import React, { useState } from "react";
import { pesanan as pesananAwal, menu as menuData } from "../data";

export default function StatusPesananPage() {
  const [pesanan, setPesanan] = useState(
    pesananAwal.map((p) => ({ ...p, status: p.status || "Pending" }))
  );

  // Ganti status pesanan
  const ubahStatus = (id, statusBaru) => {
    setPesanan((prev) =>
      prev.map((p) =>
        p.id_pesanan === id ? { ...p, status: statusBaru } : p
      )
    );
  };

  // Hitung jumlah per status
  const count = (status) => pesanan.filter((p) => p.status === status).length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Status Pesanan</h2>
      <p className="text-gray-500 mb-6">
        Daftar pesanan yang sedang diproses dan statusnya
      </p>

      {/* Kartu ringkasan status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-center font-medium">
          Pending: {count("Pending")}
        </div>
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-center font-medium">
          Process: {count("Process")}
        </div>
        <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium">
          Done: {count("Done")}
        </div>
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center font-medium">
          Cancel: {count("Cancel")}
        </div>
      </div>

      {/* Daftar pesanan */}
      <div className="space-y-4">
        {pesanan.map((p) => {
          const total = p.total_bayar;
          return (
            <div key={p.id_pesanan} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-lg">
                    ORD-{p.id_pesanan}
                  </div>
                  <div className="text-sm text-gray-500">
                    Meja {p.nomor_meja} • {p.waktu}
                  </div>
                </div>

                {/* Dropdown ubah status */}
                <select
                  value={p.status}
                  onChange={(e) => ubahStatus(p.id_pesanan, e.target.value)}
                  className={`px-2 py-1 rounded text-sm font-medium border ${
                    p.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : p.status === "Process"
                      ? "bg-blue-100 text-blue-800"
                      : p.status === "Done"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Process">Process</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </div>

              {/* Detail item */}
              <ul className="mt-3 border-t pt-2 text-sm">
                {p.items.map((it, idx) => {
                  const m = menuData.find((x) => x.id_menu === it.id_menu);
                  return (
                    <li
                      key={idx}
                      className="flex justify-between py-1 text-gray-700"
                    >
                      <span>{m?.nama_menu}</span>
                      <span>Rp {it.subtotal.toLocaleString()}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="text-right text-green-600 font-semibold mt-2">
                Rp {total.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
