import React from "react";

export default function Header({ onToggle }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Tombol hamburger — hanya muncul di mobile */}
        <button
          onClick={onToggle}
          className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
