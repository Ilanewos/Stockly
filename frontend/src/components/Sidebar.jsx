import React from "react";
import { NavLink } from "react-router-dom";
import {
  X,
  ShoppingCart,
  ClipboardList,
  Utensils,
  Package,
  BarChart2,
} from "lucide-react"; // import ikon yang sesuai

const items = [
  { to: "/transaksi", label: "Transaksi", icon: <ShoppingCart size={18} /> },
  { to: "/status", label: "Status Pesanan", icon: <ClipboardList size={18} /> },
  { to: "/", label: "Menu", icon: <Utensils size={18} /> },
  { to: "/bahan", label: "Bahan", icon: <Package size={18} /> },
  { to: "/laporan", label: "Laporan", icon: <BarChart2 size={18} /> },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay untuk mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar kiri */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-white border-r shadow-sm
          transform transition-transform duration-300 ease-in-out z-30
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          flex flex-col justify-between
        `}
      >
        {/* Bagian atas */}
        <div className="flex flex-col flex-grow overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-extrabold text-gray-800">Stockly</h1>
            <button
              className="md:hidden text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigasi */}
          <nav className="flex flex-col gap-2">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-gray-400 text-sm border-t">
          © 2025 Stockly
        </div>
      </aside>
    </>
  );
}
