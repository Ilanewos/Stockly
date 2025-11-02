import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { Plus, ChefHat, Trash2 } from "lucide-react";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [bahanList, setBahanList] = useState([]);
  const [search, setSearch] = useState("");
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [newMenu, setNewMenu] = useState({ nama_menu: "", harga: "" });
  const [recipeItems, setRecipeItems] = useState([]);
  const [editMenu, setEditMenu] = useState(null);

  const API_MENU = "http://localhost:4000/menu";
  const API_RESEP = "http://localhost:4000/resep";
  const API_BAHAN = "http://localhost:5000/api/bahan";

  // ================== FETCH DATA DARI BACKEND ==================
  const fetchMenus = async () => {
    try {
      const res = await axios.get(API_MENU);
      setMenus(res.data);
    } catch (err) {
      console.error("Error fetch menu:", err);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(API_RESEP);
      setRecipes(res.data);
    } catch (err) {
      console.error("Error fetch resep:", err);
    }
  };

  const fetchBahan = async () => {
    try {
      const res = await axios.get(API_BAHAN);
      setBahanList(res.data);
    } catch (err) {
      console.error("Error fetch bahan:", err);
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchRecipes();
    fetchBahan();
  }, []);

  // ================== FILTER MENU ==================
  const filteredMenus = menus.filter((m) =>
    m.nama_menu.toLowerCase().includes(search.toLowerCase())
  );

  // ================== AMBIL RESEP PER MENU ==================
  const getRecipeForMenu = (id_menu) =>
    recipes.filter((r) => r.id_menu === id_menu);

  // ================== CRUD MENU ==================
  const handleAddMenu = async () => {
    if (!newMenu.nama_menu || !newMenu.harga) {
      alert("Nama dan harga wajib diisi!");
      return;
    }
    try {
      await axios.post(API_MENU, {
        nama_menu: newMenu.nama_menu,
        harga: parseInt(newMenu.harga)
      });
      setNewMenu({ nama_menu: "", harga: "" });
      setShowMenuModal(false);
      fetchMenus();
    } catch (err) {
      console.error("Error add menu:", err);
    }
  };

  const handleOpenEditMenu = (menu) => {
    setEditMenu({ ...menu });
    setShowMenuModal(true);
  };

  const handleSaveEditMenu = async () => {
    if (!editMenu.nama_menu || !editMenu.harga) {
      alert("Nama dan harga wajib diisi!");
      return;
    }
    try {
      await axios.put(`${API_MENU}/${editMenu.id_menu}`, {
        nama_menu: editMenu.nama_menu,
        harga: parseInt(editMenu.harga)
      });
      setEditMenu(null);
      setShowMenuModal(false);
      fetchMenus();
    } catch (err) {
      console.error("Error update menu:", err);
    }
  };

  const handleDeleteMenu = async (id_menu) => {
    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await axios.delete(`${API_MENU}/${id_menu}`);
        fetchMenus();
        // Hapus resep terkait menu ini
        const relatedRecipes = recipes.filter(r => r.id_menu === id_menu);
        for (const r of relatedRecipes) {
          await axios.delete(`${API_RESEP}/${r.id_resep}`);
        }
        fetchRecipes();
      } catch (err) {
        console.error("Error delete menu:", err);
      }
    }
  };

  // ================== CRUD RESEP ==================
  const openRecipeModal = (menu) => {
    setSelectedMenu(menu);
    const existing = getRecipeForMenu(menu.id_menu);
    setRecipeItems(
      existing.map((r) => ({ id_bahan: r.id_bahan, jumlah: r.jumlah_bahan }))
    );
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

  const handleSaveRecipe = async () => {
    if (!selectedMenu) return;

    try {
      // Hapus resep lama
      const oldRecipes = getRecipeForMenu(selectedMenu.id_menu);
      for (const r of oldRecipes) {
        await axios.delete(`${API_RESEP}/${r.id_resep}`);
      }

      // Tambah resep baru
      for (const r of recipeItems.filter((r) => r.id_bahan && r.jumlah > 0)) {
        await axios.post(API_RESEP, {
          id_menu: selectedMenu.id_menu,
          id_bahan: r.id_bahan,
          jumlah_bahan: parseFloat(r.jumlah),
        });
      }

      setShowRecipeModal(false);
      setRecipeItems([]);
      setSelectedMenu(null);
      fetchRecipes();
    } catch (err) {
      console.error("Error save resep:", err);
    }
  };

  // ================== RENDER ==================
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🍽️ Manajemen Menu & Resep</h1>
        <button
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
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
              <tr key={m.id_menu} className="border-t">
                <td className="p-3 font-medium">{m.nama_menu}</td>
                <td className="p-3">Rp {m.harga.toLocaleString()}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => openRecipeModal(m)}
                    className="bg-yellow-500 hover:bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    <ChefHat className="w-4 h-4" /> Resep
                  </button>
                  <button
                    onClick={() => handleOpenEditMenu(m)}
                    className="bg-blue-800 hover:bg-blue-800 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(m.id_menu)}
                    className="bg-red-800 hover:bg-red-800 text-white px-3 py-1 rounded"
                  >
                    Hapus
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
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => {
                  setShowMenuModal(false);
                  setEditMenu(null);
                  setNewMenu({ nama_menu: "", harga: "" });
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
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
                    {bahanList.map((b) => (
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
                  className="p-2 text-red-500 hover:text-red-700"
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
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowRecipeModal(false)}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
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