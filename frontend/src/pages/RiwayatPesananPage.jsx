import React from 'react'
import { pesanan, menu as menuData } from '../data'

export default function RiwayatPesananPage(){
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-3">Riwayat Pesanan</h2>
      <p className="text-gray-500 mb-6">Daftar pesanan yang pernah dibuat</p>

      <div className="space-y-4">
        {pesanan.map(p => (
          <div key={p.id_pesanan} className="card">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Pesanan #{p.id_pesanan}</div>
                <div className="text-sm text-gray-500">{p.tanggal}</div>
              </div>
              <div className="text-lg font-semibold">Rp {p.total_bayar.toLocaleString()}</div>
            </div>

            <ul className="mt-4">
              {p.items.map((it, idx) => {
                const m = menuData.find(x => x.id_menu === it.id_menu)
                return (<li key={idx} className="flex justify-between border-t pt-2 mt-2"><div>{m?.nama_menu}</div><div>Rp {it.subtotal.toLocaleString()}</div></li>)
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}