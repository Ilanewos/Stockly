import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Package, AlertTriangle, X, Edit3 } from "lucide-react";

export default function BahanPage() {
  const [bahanList, setBahanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBahan, setSelectedBahan] = useState(null);
  const [newBahan, setNewBahan] = useState({
    nama_bahan: "",
    stok: "",
    satuan: "",
    minim_stok: "",
    harga: "",
  });
  const [editBahan, setEditBahan] = useState({});
  const [restockAmount, setRestockAmount] = useState("");
  const [restockDate, setRestockDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bahan");
      setBahanList(res.data);
    } catch (err) {
      console.error("Gagal memuat data bahan:", err);
    }
  };

  const lowStockItems = bahanList.filter((b) => b.stok <= (b.minim_stok || 0));

  const filtered = bahanList.filter((b) => {
    const match = b.nama_bahan.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "low") return match && b.stok <= (b.minim_stok || 0);
    if (filterStatus === "normal") return match && b.stok > (b.minim_stok || 0);
    return match;
  });

  // Tambah bahan
  const handleAdd = async () => {
    if (
      !newBahan.nama_bahan.trim() ||
      newBahan.stok === "" ||
      !newBahan.satuan.trim() ||
      newBahan.minim_stok === "" ||
      newBahan.harga === ""
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bahan", {
        ...newBahan,
        stok: Number(newBahan.stok),
        minim_stok: Number(newBahan.minim_stok),
        harga: Number(newBahan.harga),
      });
      fetchData();
      setNewBahan({ nama_bahan: "", stok: "", satuan: "", minim_stok: "", harga: "" });
      setShowAddDialog(false);
    } catch (err) {
      console.error("Gagal menambah bahan:", err);
    }
  };

  // Edit bahan
  const handleEdit = async () => {
    if (
      !editBahan.nama_bahan.trim() ||
      editBahan.stok === "" ||
      !editBahan.satuan.trim() ||
      editBahan.minim_stok === "" ||
      editBahan.harga === ""
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/bahan/${editBahan.id_bahan}`, {
        ...editBahan,
        stok: Number(editBahan.stok),
        minim_stok: Number(editBahan.minim_stok),
        harga: Number(editBahan.harga),
      });
      fetchData();
      setShowEditDialog(false);
    } catch (err) {
      console.error("Gagal mengedit bahan:", err);
    }
  };

  // Hapus bahan dengan konfirmasi
  const handleDelete = async (id) => {
    if (!id) return;
    if (!selectedBahan) return;
    try {
      await axios.delete(`http://localhost:5000/api/bahan/${id}`);
      fetchData();
      setShowDeleteConfirm(false);
      setSelectedBahan(null);
    } catch (err) {
      console.error("Gagal menghapus bahan:", err);
    }
  };

  // Restock bahan
  const handleRestock = async () => {
    if (!restockAmount || restockAmount <= 0) {
      alert("Jumlah stok yang ditambahkan wajib diisi dan lebih dari 0");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/restok", {
        id_bahan: selectedBahan.id_bahan,
        jumlah_tambah: Number(restockAmount),
      });
      fetchData();
      setRestockAmount("");
      setRestockDate("");
      setSelectedBahan(null);
      setShowRestockDialog(false);
    } catch (err) {
      console.error("Gagal restock:", err);
    }
  };

  const getStockStatus = (bahan) => {
    if (bahan.stok <= (bahan.minim_stok || 0)) {
      return { label: "Menipis", color: "bg-red-100 text-red-700", icon: AlertTriangle };
    }
    return { label: "Normal", color: "bg-green-100 text-green-700", icon: Package };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Bahan</h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={18} /> Tambah Bahan
        </button>
      </div>

      {/* Statistik */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold">Total Bahan</h3>
          <p className="text-2xl font-bold mt-2">{bahanList.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold">Stok Menipis</h3>
          <p className="text-2xl font-bold mt-2">{lowStockItems.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="font-semibold">Nilai Total Stok</h3>
          <p className="text-2xl font-bold mt-2">
            Rp {bahanList.reduce((sum, b) => sum + b.stok * (b.harga || 0), 0).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Filter + Table */}
      <div className="bg-white shadow rounded-xl p-4">
        <div className="flex flex-wrap gap-4 justify-between mb-4">
          <input
            type="text"
            placeholder="Cari bahan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 w-64"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="all">Semua</option>
            <option value="low">Menipis</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Stok</th>
                <th className="px-4 py-2 text-left">Satuan</th>
                <th className="px-4 py-2 text-left">Harga</th>
                <th className="px-4 py-2 text-left">Minim Stok</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const status = getStockStatus(b);
                const Icon = status.icon;
                return (
                  <tr key={b.id_bahan} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{b.nama_bahan}</td>
                    <td className="px-4 py-2">{b.stok}</td>
                    <td className="px-4 py-2">{b.satuan}</td>
                    <td className="px-4 py-2">
                      Rp {b.harga?.toLocaleString("id-ID") || "-"}
                    </td>
                    <td className="px-4 py-2">{b.minim_stok}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${status.color}`}>
                        <Icon size={14} /> {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBahan(b);
                          setRestockAmount("");
                          setRestockDate(new Date().toISOString().split("T")[0]);
                          setShowRestockDialog(true);
                        }}
                        className="bg-yellow-600 border text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                      >
                        Restock
                      </button>
                      <button
                        onClick={() => {
                          setEditBahan(b);
                          setShowEditDialog(true);
                        }}
                        className="bg-blue-800 text-white p-2 rounded-lg hover:bg-blue-800 flex items-center justify-center"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Hapus jadi hanya ikon */}
                      <button
                        onClick={() => {
                          setSelectedBahan(b);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-800 text-white p-2 rounded-lg hover:bg-red-800 flex items-center justify-center"
                        title="Hapus"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Tambah */}
      {showAddDialog && (
        <DialogWrapper title="Tambah Bahan Baru" onClose={() => setShowAddDialog(false)}>
          {["nama_bahan", "stok", "satuan", "harga", "minim_stok"].map((field) => (
            <InputField
              key={field}
              label={field.replace("_", " ")}
              type={
                field === "harga"
                  ? "number-no-spin"
                  : ["stok", "minim_stok"].includes(field)
                  ? "number"
                  : "text"
              }
              value={newBahan[field]}
              onChange={(e) =>
                setNewBahan({ ...newBahan, [field]: e.target.value })
              }
            />
          ))}
          <DialogActions
            onCancel={() => setShowAddDialog(false)}
            onConfirm={handleAdd}
            confirmLabel="Tambah"
          />
        </DialogWrapper>
      )}

      {/* Dialog Edit */}
      {showEditDialog && editBahan && (
        <DialogWrapper title={`Edit ${editBahan.nama_bahan}`} onClose={() => setShowEditDialog(false)}>
          {["nama_bahan", "stok", "satuan", "harga", "minim_stok"].map((field) => (
            <InputField
              key={field}
              label={field.replace("_", " ")}
              type={
                field === "harga"
                  ? "number-no-spin"
                  : ["stok", "minim_stok"].includes(field)
                  ? "number"
                  : "text"
              }
              value={editBahan[field]}
              onChange={(e) =>
                setEditBahan({ ...editBahan, [field]: e.target.value })
              }
            />
          ))}
          <DialogActions
            onCancel={() => setShowEditDialog(false)}
            onConfirm={handleEdit}
            confirmLabel="Simpan"
          />
        </DialogWrapper>
      )}

      {/* Dialog Restock */}
      {showRestockDialog && selectedBahan && (
        <DialogWrapper title={`Restock ${selectedBahan.nama_bahan}`} onClose={() => setShowRestockDialog(false)}>
          <InputField label="Stok Saat Ini" value={`${selectedBahan.stok} ${selectedBahan.satuan}`} disabled />
          <InputField
            label="Tambah Stok"
            type="number"
            value={restockAmount}
            onChange={(e) => setRestockAmount(Number(e.target.value))}
          />
          <InputField
            label="Tanggal Restock"
            type="date"
            value={restockDate}
            onChange={(e) => setRestockDate(e.target.value)}
          />
          <div className="mt-2">
            <label className="block text-sm mb-1 font-medium">Total Setelah Restock</label>
            <div className="p-2 bg-gray-100 rounded-lg">
              {(selectedBahan.stok || 0) + restockAmount} {selectedBahan.satuan}
            </div>
          </div>
          <DialogActions
            onCancel={() => setShowRestockDialog(false)}
            onConfirm={handleRestock}
            confirmLabel="Konfirmasi"
            disabled={!restockAmount || restockAmount <= 0}
          />
        </DialogWrapper>
      )}

      {/* POPUP KONFIRMASI HAPUS */} 
      {showDeleteConfirm && selectedBahan && (
        <DialogWrapper
          title="Konfirmasi Hapus Bahan"
          onClose={() => setShowDeleteConfirm(false)}
        >
          <p>Apakah Anda yakin ingin menghapus <b>{selectedBahan.nama_bahan}</b>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              onClick={() => handleDelete(selectedBahan.id_bahan)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus
            </button>
          </div>
        </DialogWrapper>
      )}
    </div>
  );
}

/* ------------------------- Komponen Pendukung ---------------------------- */
function DialogWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1 capitalize">
        {label}
      </label>
      <input
        type={type === "number-no-spin" ? "number" : type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-lg px-3 py-2 w-full ${
          disabled ? "bg-gray-100" : ""
        }`}
        {...(type === "number-no-spin"
          ? { style: { MozAppearance: "textfield" }, onWheel: e => e.target.blur() }
          : {})}
      />
      <style jsx>{`
        input[type="number"].no-spin::-webkit-outer-spin-button,
        input[type="number"].no-spin::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].no-spin {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

function DialogActions({ onCancel, onConfirm, confirmLabel, disabled }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={onCancel}
        className="border px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Batal
      </button>
      <button
        onClick={onConfirm}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-white ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {confirmLabel}
      </button>
    </div>
  );
}