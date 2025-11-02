import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import MenuPage from "./pages/MenuPage";
import BahanPage from "./pages/BahanPage";
import TransaksiPage from "./pages/TransaksiPage";
import LaporanPage from "./pages/LaporanPage";
import StatusPage from "./pages/StatusPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Area Konten */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <Header onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Konten utama — hanya bagian ini yang scroll */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/bahan" element={<BahanPage />} />
            <Route path="/transaksi" element={<TransaksiPage />} />
            <Route path="/laporan" element={<LaporanPage />} />
            <Route path="/status" element={<StatusPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
