import React, { useState } from 'react'
import { bahan as bahanData, restock as restockData } from '../data'

export default function RestockPage(){
  const [selectedId, setSelectedId] = useState(bahanData[0]?.id_bahan || '')
  const [jumlah, setJumlah] = useState('')
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0,10))
  const [history, setHistory] = useState(restockData)

  function handleSubmit(e){
    e.preventDefault()
    if(!jumlah) return
    const next = { id_restok: history.length+1, id_bahan: Number(selectedId), jumlah_tambah: Number(jumlah), tanggal }
    setHistory([next, ...history])
    setJumlah('')
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
                {bahanData.map(b => <option key={b.id_bahan} value={b.id_bahan}>{b.nama_bahan}</option>)}
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
                const b = bahanData.find(x => x.id_bahan === r.id_bahan)
                return (
                  <li key={r.id_restok} className="border rounded-lg p-3">
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