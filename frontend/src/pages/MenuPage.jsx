import React, { useState } from "react";
import { Plus, ChefHat, Trash2 } from "lucide-react";
import { resep as initialResep, bahan as bahanData } from "../data";

export default function MenuPage() {
  const [menus, setMenus] = useState([
    { id_menu: 1, nama_menu: "Nasi Goreng", harga: 15000 },
    { id_menu: 2, nama_menu: "Mie Goreng", harga: 12000 },
    { id_menu: 3, nama_menu: "Es Teh", harga: 5000 },
  ]);
  const [recipes, setRecipes] = useState(initialResep);
  const [search, setSearch] = useState("");
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [newMenu, setNewMenu] = useState({ nama_menu: "", harga: "" });
  const [recipeItems, setRecipeItems] = useState([]);
  const [editMenu, setEditMenu] = useState(null);

  const filteredMenus = menus.filter((m) =>
    m.nama_menu.toLowerCase().includes(search.toLowerCase())
  );

  const getRecipeForMenu = (id_menu) => recipes.filter((r) => r.id_menu === id_menu);

  const handleAddMenu = () => {
    if (!newMenu.nama_menu || !newMenu.harga) {
      alert("Nama dan harga wajib diisi!");
      return;
    }
    setMenus((prev) => [
      ...prev,
      { ...newMenu, id_menu: Date.now(), harga: parseInt(newMenu.harga) },
    ]);
    setNewMenu({ nama_menu: "", harga: "" });
    setShowMenuModal(false);
  };

  const handleOpenEditMenu = (menu) => {
    setEditMenu({ ...menu });
    setShowMenuModal(true);
  };

  const handleSaveEditMenu = () => {
    if (!editMenu.nama_menu || !editMenu.harga) {
      alert("Nama dan harga wajib diisi!");
      return;
    }
    setMenus((prev) =>
      prev.map((m) =>
        m.id_menu === editMenu.id_menu ? { ...editMenu, harga: parseInt(editMenu.harga) } : m
      )
    );
    setEditMenu(null);
    setShowMenuModal(false);
  };

  const handleDeleteMenu = (id_menu) => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      setMenus((prev) => prev.filter((m) => m.id_menu !== id_menu));
      setRecipes((prev) => prev.filter((r) => r.id_menu !== id_menu));
    }
  };

  const openRecipeModal = (menu) => {
    setSelectedMenu(menu);
    const existing = getRecipeForMenu(menu.id_menu);
    setRecipeItems(existing.map((r) => ({ id_bahan: r.id_bahan, jumlah: r.jumlah })));
    setShowRecipeModal(true);
  };

  const handleAddRecipeItem = () => {
    setRecipeItems((prev) => [...prev, { id_bahan: "", jumlah: 0 }]);
  };

  const handleRemoveRecipeItem = (i) => {
    setRecipeItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleChangeRecipeItem = (i, field, val) => {
    const newItems = [...recipeItems];
    newItems[i][field] = val;
    setRecipeItems(newItems);
  };

  const handleSaveRecipe = () => {
    if (!selectedMenu) return;
    const newResep = recipeItems
      .filter((r) => r.id_bahan && r.jumlah > 0)
      .map((r) => ({
        id_resep: `${selectedMenu.id_menu}-${r.id_bahan}-${Date.now()}`,
        id_menu: selectedMenu.id_menu,
        id_bahan: r.id_bahan,
        jumlah: parseFloat(r.jumlah),
      }));
    const filtered = recipes.filter((r) => r.id_menu !== selectedMenu.id_menu);
    setRecipes([...filtered, ...newResep]);
    setShowRecipeModal(false);
    setRecipeItems([]);
    setSelectedMenu(null);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🍽️ Manajemen Menu & Resep</h1>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          onClick={() => {
            setShowMenuModal(true);
            setEditMenu(null);
          }}
        >
          <Plus className="w-4 h-4" /> Tambah Menu
        </button>
      </div>

      {/* PENCARIAN */}
      <input
        type="text"
        placeholder="Cari menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-4 py-2 w-full md:w-1/3 mb-4"
      />

      {/* TABEL MENU */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table-auto border-collapse w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Nama</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenus.map((m) => (
              <tr key={m.id_menu} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 font-medium">{m.nama_menu}</td>
                <td className="p-3">Rp {m.harga.toLocaleString()}</td>
                <td className="p-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => openRecipeModal(m)}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1 rounded-lg flex items-center gap-1 transition"
                  >
                    <ChefHat className="w-4 h-4" /> Resep
                  </button>
                  <button
                    onClick={() => handleOpenEditMenu(m)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(m.id_menu)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4 inline-block mr-1" /> Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH / EDIT MENU */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editMenu ? "Edit Menu" : "Tambah Menu Baru"}
            </h2>

            <label className="block mb-1 text-sm font-medium">Nama Menu</label>
            <input
              className="w-full border rounded px-3 py-2 mb-3"
              value={editMenu ? editMenu.nama_menu : newMenu.nama_menu}
              onChange={(e) =>
                editMenu
                  ? setEditMenu({ ...editMenu, nama_menu: e.target.value })
                  : setNewMenu({ ...newMenu, nama_menu: e.target.value })
              }
            />

            <label className="block mb-1 text-sm font-medium">Harga</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 mb-3"
              value={editMenu ? editMenu.harga : newMenu.harga}
              onChange={(e) =>
                editMenu
                  ? setEditMenu({ ...editMenu, harga: e.target.value })
                  : setNewMenu({ ...newMenu, harga: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => {
                  setShowMenuModal(false);
                  setEditMenu(null);
                  setNewMenu({ nama_menu: "", harga: "" });
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded"
                onClick={editMenu ? handleSaveEditMenu : handleAddMenu}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESEP */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              Atur Resep: {selectedMenu?.nama_menu}
            </h2>

            {recipeItems.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm mb-1 font-medium">Bahan</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={item.id_bahan}
                    onChange={(e) => handleChangeRecipeItem(i, "id_bahan", e.target.value)}
                  >
                    <option value="">Pilih bahan</option>
                    {bahanData.map((b) => (
                      <option key={b.id_bahan} value={b.id_bahan}>
                        {b.nama_bahan} ({b.satuan})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm mb-1 font-medium">Jumlah</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={item.jumlah}
                    onChange={(e) => handleChangeRecipeItem(i, "jumlah", e.target.value)}
                  />
                </div>
                <button
                  className="p-2 text-rose-500 hover:text-rose-700"
                  onClick={() => handleRemoveRecipeItem(i)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddRecipeItem}
              className="w-full border border-dashed rounded py-2 mb-4 text-gray-600 hover:bg-gray-50"
            >
              + Tambah Bahan
            </button>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                onClick={() => setShowRecipeModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded"
                onClick={handleSaveRecipe}
              >
                Simpan Resep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
