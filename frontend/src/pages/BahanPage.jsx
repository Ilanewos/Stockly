import React, { useState, useEffect } from "react";
import { Plus, Package, AlertTriangle, X, Edit3, RefreshCw, Trash2 } from "lucide-react";

export default function BahanPage() {
  const [bahanList, setBahanList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRestockDialog, setShowRestockDialog] = useState(false);
  const [selectedBahan, setSelectedBahan] = useState(null);
  const [newBahan, setNewBahan] = useState({
    nama_bahan: "",
    stok: 0,
    satuan: "",
    min_stok: 0,
    harga: 0,
    last_restock: "",
  });
  const [editBahan, setEditBahan] = useState({});
  const [restockAmount, setRestockAmount] = useState(0);
  const [restockDate, setRestockDate] = useState("");

  useEffect(() => {
    setBahanList([
      { id_bahan: 1, nama_bahan: "Tepung Terigu", stok: 10, satuan: "kg", min_stok: 5, harga: 15000, last_restock: "2025-10-29" },
      { id_bahan: 2, nama_bahan: "Telur Ayam", stok: 50, satuan: "butir", min_stok: 30, harga: 2000, last_restock: "2025-10-28" },
      { id_bahan: 3, nama_bahan: "Gula Pasir", stok: 3, satuan: "kg", min_stok: 5, harga: 14000, last_restock: "2025-10-27" },
    ]);
  }, []);

  const lowStockItems = bahanList.filter((b) => b.stok <= (b.min_stok || 0));
  const filtered = bahanList.filter((b) => {
    const match = b.nama_bahan.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "low") return match && b.stok <= (b.min_stok || 0);
    if (filterStatus === "normal") return match && b.stok > (b.min_stok || 0);
    return match;
  });

  const handleAdd = () => {
    if (!newBahan.nama_bahan || newBahan.stok <= 0) return;
    const newId = bahanList.length ? Math.max(...bahanList.map((b) => b.id_bahan)) + 1 : 1;
    const created = {
      ...newBahan,
      id_bahan: newId,
      last_restock: new Date().toLocaleDateString("id-ID"),
    };
    setBahanList([...bahanList, created]);
    setNewBahan({ nama_bahan: "", stok: 0, satuan: "", min_stok: 0, harga: 0, last_restock: "" });
    setShowAddDialog(false);
  };

  const handleRestock = () => {
    if (selectedBahan && restockAmount > 0) {
      const updated = {
        ...selectedBahan,
        stok: selectedBahan.stok + restockAmount,
        last_restock: restockDate || new Date().toLocaleDateString("id-ID"),
      };
      setBahanList(
        bahanList.map((b) => (b.id_bahan === selectedBahan.id_bahan ? updated : b))
      );
      setRestockAmount(0);
      setRestockDate("");
      setSelectedBahan(null);
      setShowRestockDialog(false);
    }
  };

  const handleEdit = () => {
    if (!editBahan.nama_bahan) return;
    setBahanList(
      bahanList.map((b) => (b.id_bahan === editBahan.id_bahan ? editBahan : b))
    );
    setShowEditDialog(false);
  };

  const handleDelete = (id) => {
    setBahanList(bahanList.filter((b) => b.id_bahan !== id));
  };

  const getStockStatus = (bahan) => {
    if (bahan.stok <= (bahan.min_stok || 0)) {
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
        <StatCard title="Total Bahan" value={bahanList.length} />
        <StatCard title="Stok Menipis" value={lowStockItems.length} color="text-orange-600" />
        <StatCard
          title="Nilai Total Stok"
          value={`Rp ${bahanList
            .reduce((sum, b) => sum + b.stok * (b.harga || 0), 0)
            .toLocaleString("id-ID")}`}
        />
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
            className="border rounded-lg px-3 py-2 bg-white text-gray-800 cursor-pointer hover:bg-gray-200 transition-colors"
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
                <th className="px-4 py-2 text-left">Min Stok</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Terakhir Restock</th>
                <th className="px-4 py-2 text-center">Aksi</th>
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
                    <td className="px-4 py-2">Rp {b.harga?.toLocaleString("id-ID") || "-"}</td>
                    <td className="px-4 py-2">{b.min_stok}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${status.color}`}
                      >
                        <Icon size={14} /> {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-2">{b.last_restock || "-"}</td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      <IconButton
                        color="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        icon={<RefreshCw size={18} />}
                        onClick={() => {
                          setSelectedBahan(b);
                          setRestockAmount(0);
                          setRestockDate(b.last_restock || new Date().toISOString().split("T")[0]);
                          setShowRestockDialog(true);
                        }}
                      />
                      <IconButton
                        color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                        icon={<Edit3 size={18} />}
                        onClick={() => {
                          setEditBahan(b);
                          setShowEditDialog(true);
                        }}
                      />
                      <IconButton
                        color="bg-red-100 text-red-700 hover:bg-red-200"
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(b.id_bahan)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Tambah / Edit / Restock */}
      {showAddDialog && (
        <DialogWrapper title="Tambah Bahan Baru" onClose={() => setShowAddDialog(false)}>
          {["nama_bahan", "stok", "satuan", "harga", "min_stok"].map((field) => (
            <InputField
              key={field}
              label={field.replace("_", " ")}
              type={["stok", "harga", "min_stok"].includes(field) ? "number" : "text"}
              value={newBahan[field]}
              onChange={(e) => setNewBahan({ ...newBahan, [field]: e.target.value })}
            />
          ))}
          <DialogActions onCancel={() => setShowAddDialog(false)} onConfirm={handleAdd} confirmLabel="Tambah" />
        </DialogWrapper>
      )}

      {showEditDialog && editBahan && (
        <DialogWrapper title={`Edit ${editBahan.nama_bahan}`} onClose={() => setShowEditDialog(false)}>
          {["nama_bahan", "stok", "satuan", "harga", "min_stok"].map((field) => (
            <InputField
              key={field}
              label={field.replace("_", " ")}
              type={["stok", "harga", "min_stok"].includes(field) ? "number" : "text"}
              value={editBahan[field]}
              onChange={(e) => setEditBahan({ ...editBahan, [field]: e.target.value })}
            />
          ))}
          <DialogActions onCancel={() => setShowEditDialog(false)} onConfirm={handleEdit} confirmLabel="Simpan" />
        </DialogWrapper>
      )}

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
          <DialogActions onCancel={() => setShowRestockDialog(false)} onConfirm={handleRestock} confirmLabel="Konfirmasi" />
        </DialogWrapper>
      )}
    </div>
  );
}

/* Komponen kecil */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color || ""}`}>{value}</p>
    </div>
  );
}

function IconButton({ color, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors duration-150 ${color}`}
    >
      {icon}
    </button>
  );
}

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
      <label className="block text-sm font-medium mb-1 capitalize">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded-lg px-3 py-2 w-full ${disabled ? "bg-gray-100" : ""}`}
      />
    </div>
  );
}

function DialogActions({ onCancel, onConfirm, confirmLabel }) {
  return (
    <div className="flex justify-end gap-2 mt-4">
      <button onClick={onCancel} className="border px-4 py-2 rounded-lg hover:bg-gray-100">
        Batal
      </button>
      <button onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        {confirmLabel}
      </button>
    </div>
  );
}
