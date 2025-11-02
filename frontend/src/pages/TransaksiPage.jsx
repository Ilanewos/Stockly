import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TransaksiPage() {
  const navigate = useNavigate();

  // 🔹 fallback menu
  const initialMenu = [
    { id_menu: 1, nama_menu: "Nasi Goreng", harga: 15000 },
    { id_menu: 2, nama_menu: "Mie Goreng", harga: 12000 },
    { id_menu: 3, nama_menu: "Es Teh Manis", harga: 5000 },
  ];

  // 🔹 ambil menu dari localStorage MenuPage jika ada
  const [menus, setMenus] = useState(() => {
    const savedMenus = JSON.parse(localStorage.getItem("menus"));
    if (savedMenus && savedMenus.length > 0) {
      return savedMenus.map((m) => ({
        id: m.id_menu,
        name: m.nama_menu,
        price: m.harga,
        isActive: true,
      }));
    }
    return initialMenu.map((m) => ({
      id: m.id_menu,
      name: m.nama_menu,
      price: m.harga,
      isActive: true,
    }));
  });

  // 🔹 update menu otomatis saat localStorage berubah
  useEffect(() => {
    const handleStorage = () => {
      const savedMenus = JSON.parse(localStorage.getItem("menus")) || [];
      setMenus(
        savedMenus.map((m) => ({
          id: m.id_menu,
          name: m.nama_menu,
          price: m.harga,
          isActive: true,
        }))
      );
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const [transaksi, setTransaksi] = useState([]);
  const [cart, setCart] = useState([]);
  const [newTransaksi, setNewTransaksi] = useState({
    tableNumber: "",
    note: "",
  });

  const getMenuById = (id) => menus.find((m) => m.id === Number(id));
  const activeMenus = menus.filter((m) => m.isActive);

  // 🔹 Komponen gambar menu
  const MenuImage = ({ name }) => {
    const imageMap = {
      "Nasi Goreng":
        "https://images.pexels.com/photos/9980760/pexels-photo-9980760.jpeg",
      "Mie Goreng":
        "https://images.pexels.com/photos/30506288/pexels-photo-30506288.jpeg",
      "Es Teh Manis":
        "https://images.pexels.com/photos/32403262/pexels-photo-32403262.jpeg",
    };

    const imgSrc =
      imageMap[name.trim()] ||
      "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=300";

    return (
      <div className="w-full h-32 overflow-hidden rounded-md bg-gray-100">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=300";
          }}
        />
      </div>
    );
  };

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
  const processTransaction = () => {
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

    const savedTrans = JSON.parse(localStorage.getItem("transaksi")) || [];
    const updatedTrans = [...savedTrans, newTrans];
    localStorage.setItem("transaksi", JSON.stringify(updatedTrans));

    const laporan = JSON.parse(localStorage.getItem("laporan_hari_ini")) || null;
    if (laporan && laporan.tanggal === new Date().toLocaleDateString("id-ID")) {
      laporan.transaksi = [...(laporan.transaksi || []), newTrans];
      laporan.total_transaksi = laporan.transaksi.length;
      laporan.total_penjualan = laporan.transaksi.reduce(
        (sum, t) => sum + t.total,
        0
      );
      laporan.rata_rata_transaksi =
        laporan.total_transaksi > 0
          ? laporan.total_penjualan / laporan.total_transaksi
          : 0;
      localStorage.setItem("laporan_hari_ini", JSON.stringify(laporan));
    }

    setTransaksi(updatedTrans);
    setCart([]);
    setNewTransaksi({ tableNumber: "", note: "" });

    alert("✅ Transaksi berhasil disimpan!");
  };

  const totalPendapatan = transaksi.reduce((s, t) => s + (t.total || 0), 0);
  const totalTransaksi = transaksi.length;
  const rataRataTransaksi =
    totalTransaksi > 0 ? totalPendapatan / totalTransaksi : 0;

  // 🔹 useEffect untuk reset transaksi harian
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
          <h2 className="text-2xl font-bold">
             {totalTransaksi.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium">Pendapatan</p>
          <h2 className="text-2xl font-bold">
            Rp {totalPendapatan.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm font-medium">Rata-rata Transaksi</p>
          <h2 className="text-2xl font-bold">
            Rp {Math.round(rataRataTransaksi).toLocaleString("id-ID")}
          </h2>
        </div>
      </div>

      <button
        onClick={() => navigate("/status")}
        className="mt-4 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900"
      >
        Lihat Status Pesanan
      </button>

      {/* Layout utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu */}
        <div className="bg-white p-4 rounded-lg shadow space-y-3">
          <h2 className="font-semibold text-lg">Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => addToCart(menu.id)}
                className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white"
              >
                <MenuImage name={menu.name} />
                <div className="p-2 text-center">
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
            <p className="text-gray-500 text-center py-6">
              Belum ada pesanan.
            </p>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => {
                const menu = getMenuById(item.menuId);
                return (
                  <div
                    key={item.menuId}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    {/* Nama menu */}
                    <div>
                      <p className="font-medium">{menu?.name}</p>
                      <p className="text-sm text-gray-600">
                        Rp {menu?.price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Kontrol jumlah */}
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

                      <span className="min-w-[24px] text-center font-medium">
                        {item.quantity}
                      </span>

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
