import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MenuPage from "./pages/MenuPage";
import BahanPage from "./pages/BahanPage";
import RestockPage from "./pages/RestockPage";
import RiwayatPesananPage from "./pages/RiwayatPesananPage";


export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onToggle={() => setOpen(true)} />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/bahan" element={<BahanPage />} />
            <Route path="/restock" element={<RestockPage />} />
            <Route path="/riwayat" element={<RiwayatPesananPage />} />


          </Routes>
        </main>
      </div>
    </div>
  );
}
