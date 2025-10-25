import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MenuPage from "./pages/MenuPage";

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
          </Routes>
        </main>
      </div>
    </div>
  );
}
