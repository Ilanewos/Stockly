import React, { useState } from 'react'
import { bahan as bahanData } from '../data'

const bahanDenganSatuan = bahanData.map(b => {
  switch (b.nama_bahan.toLowerCase()) {
    case 'minyak': return { ...b, satuan: 'ml' }
    case 'cabai': return { ...b, satuan: 'buah' }
    case 'bawang': return { ...b, satuan: 'butir' }
    case 'ayam': return { ...b, satuan: 'potong' }
    case 'nasi': return { ...b, satuan: 'porsi' }
    case 'mie': return { ...b, satuan: 'porsi' }
    case 'kecap': return { ...b, satuan: 'botol' }
    case 'sayur': return { ...b, satuan: 'ikat' }
    default: return { ...b, satuan: '' }
  }
})

export default function BahanPage(){
  const [query, setQuery] = useState('')
  const filtered = bahanDenganSatuan.filter(b => b.nama_bahan.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Daftar Bahan</h2>
      <p className="text-gray-500 mb-4">Kelola stok bahan-bahan restoran</p>

      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari bahan..." className="w-full mb-6 p-3 rounded-lg border" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(b => (
          <div key={b.id_bahan} className="card">
            <h3 className="font-semibold">{b.nama_bahan}</h3>
            <p className="text-sm text-gray-500 mt-2">Jumlah: <span className="font-semibold">{b.stok} {b.satuan}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
