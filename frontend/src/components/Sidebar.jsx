import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Menu" },
  { to: "/status", label: "Status Pesanan", },
  { to: "/riwayat", label: "Riwayat Pesanan",  },
  { to: "/bahan", label: "Bahan",  },
  { to: "/restock", label: "Restock", },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay hanya muncul di mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-30 inset-y-0 left-0 bg-white h-full border-r shadow-sm
          transform transition-transform duration-300 ease-in-out w-64
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <div className="font-bold text-4xl">Stockly</div>
              </div>
            </div>

            {/* Tombol close (hanya muncul di mobile) */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex flex-col gap-2">
            {items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg font-medium ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <span>{i.icon}</span>
                <span>{i.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
