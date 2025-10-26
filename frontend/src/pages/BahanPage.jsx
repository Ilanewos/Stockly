import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function BahanPage() {
  const [bahanList, setBahanList] = useState([]);
  const [query, setQuery] = useState('');
  const [newBahan, setNewBahan] = useState({ nama_bahan: '', stok: '' });
  const [editingId, setEditingId] = useState(null);
  const [editBahan, setEditBahan] = useState({ nama_bahan: '', stok: '' });
  const [menuOpenId, setMenuOpenId] = useState(null);

  useEffect(() => {
    api.getBahan().then(data => setBahanList(data));
  }, []);

  const filtered = bahanList
  .filter(b => b && b.nama_bahan)
  .filter(b => b.nama_bahan.toLowerCase().includes(query.toLowerCase()));


  const handleAdd = async () => {
  if (!newBahan.nama_bahan || !newBahan.stok) return;


    // Tentukan satuan
    let satuan = '';
    switch (newBahan.nama_bahan.toLowerCase()) {
      case 'minyak': satuan = 'ml'; break;
      case 'cabai': satuan = 'buah'; break;
      case 'bawang': satuan = 'butir'; break;
      case 'ayam': satuan = 'potong'; break;
      case 'nasi': satuan = 'porsi'; break;
      case 'mie': satuan = 'porsi'; break;
      case 'kecap': satuan = 'botol'; break;
      case 'sayur': satuan = 'ikat'; break;
      default: satuan = ''; break;
    }

    const newData = { nama_bahan: newBahan.nama_bahan, stok: Number(newBahan.stok) };

  try {
    await api.createBahan(newData);
    const updatedList = await api.getBahan(); // ambil ulang semua data
    setBahanList(updatedList); // langsung update state
    setNewBahan({ nama_bahan: '', stok: '' });
  } catch (error) {
    console.error("Gagal menambah bahan:", error);
  }
}

  const handleUpdate = async (id) => {
    await api.updateBahan(id, editBahan);
    setBahanList(bahanList.map(b => b.id_bahan === id ? { ...b, ...editBahan } : b));
    setEditingId(null);
    setEditBahan({ nama_bahan: '', stok: '' });
  }

  const handleDelete = async (id) => {
    await api.deleteBahan(id);
    setBahanList(bahanList.filter(b => b.id_bahan !== id));
  }

  

  console.log('bahanList:', bahanList);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Daftar Bahan</h2>
      <p className="text-gray-500 mb-4">Kelola stok bahan-bahan restoran</p>

      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Cari bahan..."
        className="w-full mb-6 p-3 rounded-lg border"
      />

      {/* Form Tambah Bahan */}
      <div className="mb-6 flex gap-2">
        <input
          value={newBahan.nama_bahan}
          onChange={e => setNewBahan({ ...newBahan, nama_bahan: e.target.value })}
          placeholder="Nama bahan"
          className="flex-1 p-2 border rounded"
        />
        <input
          type="number"
          value={newBahan.stok}
          onChange={e => setNewBahan({ ...newBahan, stok: e.target.value })}
          placeholder="Stok"
          className="w-24 p-2 border rounded"
        />
        <button
  onClick={handleAdd}
  className="bg-orange-600 text-white px-4 rounded hover:bg-blue-600"
>
  Tambah
</button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(b => (
          <div key={b.id_bahan} className="border rounded p-4 shadow-sm hover:shadow-md relative">
            {editingId === b.id_bahan ? (
              <>
                <input
                  value={editBahan.nama_bahan}
                  onChange={e => setEditBahan({ ...editBahan, nama_bahan: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="number"
                  value={editBahan.stok}
                  onChange={e => setEditBahan({ ...editBahan, stok: e.target.value })}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex gap-2">
                  <button
  onClick={() => handleUpdate(b.id_bahan)}
  className="bg-orange-600 text-white px-3 rounded hover:bg-blue-600"
>
  Simpan
</button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 px-3 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{b.nama_bahan}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Jumlah: <span className="font-semibold">{b.stok} {b.satuan}</span>
                </p>

                {/* Tiga titik menu */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === b.id_bahan ? null : b.id_bahan)}
                    className="text-gray-500 hover:text-gray-700 font-bold"
                  >
                    ⋮
                  </button>

                  {menuOpenId === b.id_bahan && (
                    <div className="absolute right-0 mt-1 w-24 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => { setEditingId(b.id_bahan); setEditBahan({ nama_bahan: b.nama_bahan, stok: b.stok }); setMenuOpenId(null); }}
                        className="w-full text-left px-2 py-1 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
  className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm text-black"
  onClick={() => { handleDelete(b.id_bahan); setMenuOpenId(null) }}
>
  Hapus
</button>

                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
