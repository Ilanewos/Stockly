// src/services/orderService.js
import { API_BASE_URL } from "../config/api";

// Ambil semua pesanan (opsional filter status)
export async function getOrders(status) {
    const url = status
        ? `${API_BASE_URL}/orders?status=${encodeURIComponent(status)}`
        : `${API_BASE_URL}/orders`;
    const res = await fetch(url, { cache: "no-store" }); // 👈 Tambahkan ini
    if (!res.ok) throw new Error(`Gagal ambil pesanan: ${res.status}`);
    const json = await res.json();
    return json.data || [];
}

export async function getOrderSummary() {
    const res = await fetch(`${API_BASE_URL}/orders-summary`, {
        cache: "no-store", // 👈 Tambahkan juga di sini
    });
    if (!res.ok) throw new Error(`Gagal ambil ringkasan`);
    return res.json();
}


// Ubah status pesanan
export async function updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal ubah status");
    return json;
}

export async function getOrderHistory() {
    const res = await fetch(`${API_BASE_URL}/orders/history`, { cache: "no-store" });
    if (!res.ok) throw new Error("Gagal ambil riwayat pesanan");
    return res.json();
}
