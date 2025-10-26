import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function RestockPage() {
  const [bahanList, setBahanList] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0,10));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.getBahan().then(data => {
      setBahanList(data);
      setSelectedId(data[0]?.id_bahan || '');
    });
    api.getRestock().then(data => setHistory(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jumlah || !selectedId) return;

    const newRestock = { id_bahan: Number(selectedId), jumlah_tambah: Number(jumlah), tanggal };
    const created = await api.createRestock(newRestock);
    setHistory([created, ...history]);
    setJumlah('');
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Restock Bahan</h2>
      <p className="text-gray-500 mb-6">Tambah stok bahan-bahan restoran</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">+ Tambah Stok Bahan</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Pilih Bahan</label>
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full p-3 border rounded-lg">
                {bahanList.map(b => <option key={b.id_bahan} value={b.id_bahan}>{b.nama_bahan}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Jumlah Tambahan</label>
              <input value={jumlah} onChange={e=>setJumlah(e.target.value)} placeholder="Masukkan jumlah" className="w-full p-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm mb-1">Tanggal Restock</label>
              <input type="date" value={tanggal} onChange={e=>setTanggal(e.target.value)} className="w-full p-3 border rounded-lg" />
            </div>
            <button className="w-full py-2 rounded-lg bg-orange-600 text-white">+ Tambah Stok</button>
          </form>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Riwayat Restock</h3>
          {history.length === 0 ? <p className="text-gray-400">Belum ada riwayat restock</p> : (
            <ul className="space-y-3">
              {history.map(r => {
  const b = bahanList.find(x => x.id_bahan === r.id_bahan); // ganti bahanData -> bahanList
  return (
    <li key={r.id_restock} className="border rounded-lg p-3">  {/* ganti id_restok -> id_restock */}
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{b?.nama_bahan}</div>
          <div className="text-sm text-gray-500">+{r.jumlah_tambah} — {r.tanggal}</div>
        </div>
      </div>
    </li>
  )
})}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}