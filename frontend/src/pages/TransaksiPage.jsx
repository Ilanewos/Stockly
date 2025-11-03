import React, { useState, useEffect, useMemo } from "react";
import { Plus, Minus, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function TransaksiPage() {
  const navigate = useNavigate();

  // 🔹 Ambil menu dari backend
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await api.getMenu();
        const fetched = response.map((m) => ({
          id: m.id_menu,
          name: m.nama_menu,
          price: m.harga,
          isActive: true,
        }));
        setMenus(fetched);
        localStorage.setItem("menus", JSON.stringify(response));
      } catch (err) {
        console.error("⚠️ Gagal memuat menu:", err.message);
      }
    };
    fetchMenu();
  }, []);

  const [transaksi, setTransaksi] = useState([]);
  const [cart, setCart] = useState([]);
  const [newTransaksi, setNewTransaksi] = useState({
    tableNumber: "",
    note: "",
  });

  const getMenuById = (id) => menus.find((m) => m.id === Number(id));
  const activeMenus = menus.filter((m) => m.isActive);

  // 🔹 Tambah ke keranjang
  const addToCart = (menuId) => {
    const exist = cart.find((c) => c.menuId === menuId);
    if (exist) {
      setCart(
        cart.map((c) =>
          c.menuId === menuId ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { menuId, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuId) =>
    setCart(cart.filter((c) => c.menuId !== menuId));

  const calculateCartTotal = () =>
    cart.reduce((sum, item) => {
      const menu = getMenuById(item.menuId);
      return sum + (menu ? menu.price * item.quantity : 0);
    }, 0);

  // 🔹 Proses transaksi
  const processTransaction = async () => {
    if (cart.length === 0) return alert("Keranjang kosong!");

    const newTrans = {
      id: `${Date.now()}`,
      status: "Process",
      tanggal: new Date().toLocaleDateString("id-ID"),
      waktu: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      meja: newTransaksi.tableNumber || "-",
      catatan: newTransaksi.note || "-",
      items: cart.map((item) => {
        const menu = getMenuById(item.menuId);
        return {
          menuId: item.menuId,
          name: menu?.name || "Menu tidak ditemukan",
          price: menu?.price || 0,
          quantity: item.quantity,
          subtotal: (menu?.price || 0) * item.quantity,
        };
      }),
    };

    newTrans.total = newTrans.items.reduce((s, i) => s + i.subtotal, 0);

    // Simpan ke localStorage
    const savedTrans = JSON.parse(localStorage.getItem("transaksi")) || [];
    const updatedTrans = [...savedTrans, newTrans];
    localStorage.setItem("transaksi", JSON.stringify(updatedTrans));

    // Kirim ke backend operasional
    try {
    const response = await api.createOrder({
  id_menu: cart[0]?.menuId,
  total_jumlah: cart[0]?.quantity,
  total_harga: newTrans.total,
  catatan: newTransaksi.note || "",
  status_pesanan: "pending",
  nomor_meja: newTransaksi.tableNumber || "-", // ✅ tambahkan ini
});

      console.log("✅ Transaksi dikirim ke backend:", response);
    } catch (err) {
      console.error("⚠️ Gagal kirim transaksi ke backend:", err.message);
    }

    setTransaksi((prev) => [...prev, newTrans]);
    setCart([]);
    setNewTransaksi({ tableNumber: "", note: "" });
    alert("✅ Transaksi berhasil disimpan!");
  };

  // 🔹 Statistik responsif
  const totalPendapatan = useMemo(
    () => transaksi.reduce((sum, t) => sum + (t.total || 0), 0),
    [transaksi]
  );

  const totalTransaksi = useMemo(() => transaksi.length, [transaksi]);

  const rataRataTransaksi = useMemo(() => {
    return totalTransaksi > 0 ? totalPendapatan / totalTransaksi : 0;
  }, [totalPendapatan, totalTransaksi]);

  useEffect(() => {
    const laporan = JSON.parse(localStorage.getItem("laporan_hari_ini")) || null;
    if (!laporan || laporan.tanggal !== new Date().toLocaleDateString("id-ID")) {
      setTransaksi([]);
      setCart([]);
      setNewTransaksi({ tableNumber: "", note: "" });
    } else {
      setTransaksi(JSON.parse(localStorage.getItem("transaksi")) || []);
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Transaksi Penjualan</h1>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium">Total Transaksi</p>
          <h2 className="text-2xl font-bold">{totalTransaksi.toLocaleString("id-ID")}</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium">Pendapatan</p>
          <h2 className="text-2xl font-bold">Rp {totalPendapatan.toLocaleString("id-ID")}</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium">Rata-rata Transaksi</p>
          <h2 className="text-2xl font-bold">Rp {Math.round(rataRataTransaksi).toLocaleString("id-ID")}</h2>
        </div>
      </div>

      {/* Shortcut */}
      <button
        onClick={() => navigate("/status")}
        className="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors"
      >
        Lihat Status Pesanan
      </button>

      {/* Layout Menu & Keranjang */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold text-lg">Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => addToCart(menu.id)}
                className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white p-2"
              >
                <div className="text-center">
                  <p className="font-medium text-gray-800">{menu.name}</p>
                  <p className="text-sm text-gray-600">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Keranjang */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold text-lg">Keranjang Pesanan</h2>

          <div className="mb-3">
            <label className="block text-sm font-medium">Nomor Meja</label>
            <input
              value={newTransaksi.tableNumber}
              onChange={(e) =>
                setNewTransaksi({ ...newTransaksi, tableNumber: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Masukkan nomor meja"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium">Catatan Pesanan</label>
            <textarea
              value={newTransaksi.note}
              onChange={(e) =>
                setNewTransaksi({ ...newTransaksi, note: e.target.value })
              }
              className="w-full border rounded p-2"
              placeholder="Contoh: tanpa sambal, porsi besar, bungkus..."
              rows="2"
            />
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Belum ada pesanan.</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => {
                const menu = getMenuById(item.menuId);
                return (
                  <div
                    key={item.menuId}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{menu?.name}</p>
                      <p className="text-sm text-gray-600">
                        Rp {menu?.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            setCart(
                              cart.map((c) =>
                                c.menuId === item.menuId
                                  ? { ...c, quantity: c.quantity - 1 }
                                  : c
                              )
                            );
                          } else {
                            removeFromCart(item.menuId);
                          }
                        }}
                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="min-w-[24px] text-center font-medium">{item.quantity}</span>

                      <button
                        onClick={() =>
                          setCart(
                            cart.map((c) =>
                              c.menuId === item.menuId
                                ? { ...c, quantity: c.quantity + 1 }
                                : c
                            )
                          )
                        }
                        className="p-1 border rounded text-gray-700 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.menuId)}
                        className="text-red-500 hover:text-red-700"
                        title="Hapus menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="text-right font-semibold pt-2 border-t">
                Total: Rp {calculateCartTotal().toLocaleString("id-ID")}
              </div>

              <button
                onClick={processTransaction}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 flex justify-center items-center gap-2 mt-2"
              >
                <CheckCircle className="w-4 h-4" /> Proses Transaksi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
