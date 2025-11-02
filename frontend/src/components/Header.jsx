import React from "react";
import { Menu } from "lucide-react"; // ikon hamburger yang lebih modern

export default function Header({ onToggle }) {
  return (
    <header className="flex items-center justify-between  border-b shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Tombol hamburger — hanya muncul di mobile */}
        <button
          onClick={onToggle}
          className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </header>
  );
}
