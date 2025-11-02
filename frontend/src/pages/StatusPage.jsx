import React, { useState, useEffect } from "react";

// Komponen dropdown custom
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

  // Ambil transaksi dari localStorage
  useEffect(() => {
    const savedTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
    setTransaksi(savedTransaksi);
  }, []);

  // Sinkronisasi dengan laporan_hari_ini
  useEffect(() => {
    const checkTutupHari = () => {
      const laporan = JSON.parse(localStorage.getItem("laporan_hari_ini"));
      if (!laporan || laporan.transaksi.length === 0) {
        setTransaksi([]);
        localStorage.removeItem("transaksi");
      }
    };

    checkTutupHari();

    const handleStorageChange = (e) => {
      if (e.key === "laporan_hari_ini") checkTutupHari();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Ubah status pesanan
  const ubahStatus = (id, statusBaru) => {
    setTransaksi((prev) => {
      let updated = prev.map((t) => (t.id === id ? { ...t, status: statusBaru } : t));
      const target = updated.find((t) => t.id === id);
      if (!target) return updated;

      if (statusBaru === "Done") {
        const laporan = JSON.parse(localStorage.getItem("laporan_hari_ini")) || {
          tanggal: new Date().toLocaleDateString("id-ID"),
          total_transaksi: 0,
          total_penjualan: 0,
          rata_rata_transaksi: 0,
          transaksi: [],
          stok_bahan: JSON.parse(localStorage.getItem("bahan")) || [],
        };

        const recipes = JSON.parse(localStorage.getItem("resep")) || [];
        const bahanList = laporan.stok_bahan;

        target.items.forEach((item) => {
          const resepMenu = recipes.filter((r) => r.id_menu === item.menuId);
          resepMenu.forEach((r) => {
            const bahanIdx = bahanList.findIndex((b) => b.id_bahan === r.id_bahan);
            if (bahanIdx > -1) {
              bahanList[bahanIdx].stok -= r.jumlah * item.quantity;
              if (bahanList[bahanIdx].stok < 0) bahanList[bahanIdx].stok = 0;
            }
          });
        });

        const transaksiBaru = target.items.map((item) => ({
          id: item.menuId,
          menu_nama: item.name,
          qty: item.quantity,
          total: item.subtotal,
          waktu_transaksi: new Date(target.date).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        const allTransaksi = [...laporan.transaksi, ...transaksiBaru];
        laporan.transaksi = allTransaksi;
        laporan.total_transaksi = allTransaksi.length;
        laporan.total_penjualan = allTransaksi.reduce((sum, t) => sum + t.total, 0);
        laporan.rata_rata_transaksi = laporan.total_transaksi
          ? laporan.total_penjualan / laporan.total_transaksi
          : 0;
        laporan.stok_bahan = bahanList;

        localStorage.setItem("laporan_hari_ini", JSON.stringify(laporan));
        localStorage.setItem("bahan", JSON.stringify(bahanList));
      }

      localStorage.setItem("transaksi", JSON.stringify(updated));
      return updated;
    });
  };

  // Hitung jumlah per status
  const count = (status) => transaksi.filter((t) => t.status === status).length;

  // 🔹 Filter hanya transaksi yang belum selesai atau batal
  const transaksiAktif = transaksi.filter((t) => t.status === "Process");

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">
        Status Pesanan
      </h1>

      {/* Ringkasan status */}
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

      {/* Daftar hanya yang status Process */}
      {transaksiAktif.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {transaksiAktif
            .slice()
            .reverse()
            .map((t) => (
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
                        : "Invalid Date"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Meja {t.tableNumber || "-"}
                    </div>
                  </div>

                  {/* Custom dropdown status */}
                  <DropdownStatus
                    value={t.status}
                    onChange={(statusBaru) => ubahStatus(t.id, statusBaru)}
                  />
                </div>

                <div className="space-y-1">
                  {t.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} x Rp {item.price.toLocaleString("id-ID")} = Rp{" "}
                        {item.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                {t.note && (
                  <p className="text-sm italic text-gray-600 mt-2">Catatan: {t.note}</p>
                )}

                <div className="text-right font-semibold pt-2 border-t">
                  Total: Rp {t.total.toLocaleString("id-ID")}
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
