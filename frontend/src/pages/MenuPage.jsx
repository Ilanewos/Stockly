import React, { useState } from "react";
import { menu, resep, bahan as bahanData } from "../data";

function Badge({ children }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mt-2">
      {children}
    </span>
  );
}

export default function MenuPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  function addToCart(menuItem) {
    setCart((prev) => [...prev, menuItem]);
  }

  function removeFromCart(index) {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }

  function getBahanForMenu(id_menu) {
    const rel = resep.filter((r) => r.id_menu === id_menu);
    return rel.map((r) => {
      const b = bahanData.find((x) => x.id_bahan === r.id_bahan);
      return b ? b.nama_bahan : "Unknown";
    });
  }

  const filteredMenu = menu.filter((m) =>
    m.nama_menu.toLowerCase().includes(search.toLowerCase())
  );
  const total = cart.reduce((sum, item) => sum + item.harga, 0);

  function handleConfirm() {
    if (!tableNumber) {
      alert("Nomor meja belum diisi!");
      return;
    }
    alert(`Pesanan untuk meja ${tableNumber} berhasil dibuat!`);
    setCart([]);
    setTableNumber("");
    setShowModal(false);
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Menu Restoran</h1>
        <p className="text-gray-500 mt-1">Pilih menu untuk dipesan</p>
        <div className="mt-4 relative">
          <input
            type="text"
            placeholder="🔍 Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Daftar Menu */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.length === 0 ? (
            <p className="text-gray-500">Menu tidak ditemukan.</p>
          ) : (
            filteredMenu.map((m) => (
              <div
                key={m.id_menu}
                className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{m.nama_menu}</h3>
                <p className="text-orange-600 font-bold text-xl mb-3">
                  Rp {m.harga.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mb-2">Bahan:</p>
                <div className="flex flex-wrap mb-4">
                  {getBahanForMenu(m.id_menu).map((b, i) => (
                    <Badge key={i}>{b}</Badge>
                  ))}
                </div>
                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-all font-medium"
                  onClick={() => addToCart(m)}
                >
                  + Pesan Menu Ini
                </button>
              </div>
            ))
          )}
        </div>

        {/* Keranjang Pesanan */}
        <div
          style={{ width: 320 }}
          className="rounded-2xl border bg-white shadow-sm p-6 h-fit"
        >
          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🛒 Keranjang Pesanan
          </h4>
          {cart.length === 0 ? (
            <p className="text-gray-400 mt-4">Belum ada pesanan</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {cart.map((c, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center border rounded-lg p-2"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {c.nama_menu}
                      </p>
                      <p className="text-sm text-gray-500">
                        Rp {c.harga.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(idx)}
                      className="text-red-500 hover:text-red-600 text-lg"
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-2 flex justify-between font-semibold text-orange-600">
                <span>Total:</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-all"
              >
                🧾 Buat Pesanan
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Konfirmasi Pesanan
            </h3>
            <label className="block text-sm font-medium mb-1">
              Nomor Meja
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Masukkan nomor meja"
            />

            <div className="mb-2">
              <h4 className="font-medium text-gray-700">Detail Pesanan:</h4>
              <ul className="text-sm mt-1 text-gray-600">
                {cart.map((c, i) => (
                  <li key={i}>
                    {c.nama_menu} x1 — Rp {c.harga.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>

            <div className="font-semibold mt-2 border-t pt-2 flex justify-between text-orange-600">
              <span>Total:</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
