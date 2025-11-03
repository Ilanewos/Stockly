// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:4000/api"; // backend bahan & restock
const API_BASE_5000 = "http://localhost:5000"; // backend menu & order lama
const API_BASE_3000 = "http://localhost:3000/operasional"; // backend operasional baru

export const api = {
  // ====== BAHAN ======
  getBahan: async () => {
    try {
      const res = await axios.get(`${API_BASE}/bahan`);
      return res.data;
    } catch (err) {
      console.error("Error getBahan:", err);
      return [];
    }
  },

  getBahanById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/bahan/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error getBahanById:", err);
      return null;
    }
  },

  createBahan: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/bahan`, data);
      return res.data;
    } catch (err) {
      console.error("Error createBahan:", err);
      return null;
    }
  },

  updateBahan: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/bahan/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Error updateBahan:", err);
      return null;
    }
  },

  deleteBahan: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/bahan/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error deleteBahan:", err);
      return null;
    }
  },

  // ====== RESTOCK ======
  getRestock: async () => {
    try {
      const res = await axios.get(`${API_BASE}/restock`);
      return res.data;
    } catch (err) {
      console.error("Error getRestock:", err);
      return [];
    }
  },

  getRestockById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/restock/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error getRestockById:", err);
      return null;
    }
  },

  createRestock: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/restock`, data);
      return res.data;
    } catch (err) {
      console.error("Error createRestock:", err);
      return null;
    }
  },

  updateRestock: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/restock/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Error updateRestock:", err);
      return null;
    }
  },

  deleteRestock: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/restock/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error deleteRestock:", err);
      return null;
    }
  },

  // ====== MENU ======
  getMenu: async () => {
    try {
      const res = await axios.get(`http://localhost:4000/menu`);
      return res.data;
    } catch (err) {
      console.error("Error getMenu:", err);
      return [];
    }
  },

  // ====== ORDER ======
  // (1) order lama via backend port 5000 — tetap dipertahankan
  createOrderOld: async (data) => {
    try {
      const res = await axios.post(`${API_BASE_5000}/orders`, data);
      return res.data;
    } catch (err) {
      console.error("Error createOrderOld (5000):", err.response?.data || err);
      return null;
    }
  },

  // (2) order baru via backend operasional port 3000
  createOrder: async (data) => {
    try {
      const res = await axios.post(`${API_BASE_3000}/orders`, data);
      return res.data;
    } catch (err) {
      console.error("Error createOrder (3000):", err.response?.data || err);
      return null;
    }
  },

  // ====== OPERASIONAL ======
  getOrders: async (status = "") => {
    try {
      const url = status
        ? `${API_BASE_3000}/orders?status=${status}`
        : `${API_BASE_3000}/orders`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error("Error getOrders:", err);
      return [];
    }
  },

  processOrder: async (id) => {
    try {
      const res = await axios.post(`${API_BASE_3000}/orders/${id}/process`);
      return res.data;
    } catch (err) {
      console.error("Error processOrder:", err);
      return null;
    }
  },

  finishOrder: async (id) => {
    try {
      const res = await axios.post(`${API_BASE_3000}/orders/${id}/done`);
      return res.data;
    } catch (err) {
      console.error("Error finishOrder:", err);
      return null;
    }
  },

  getReport: async (from, to) => {
    try {
      let url = `${API_BASE_3000}/report`;
      if (from && to) url += `?from=${from}&to=${to}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error("Error getReport:", err);
      return null;
    }
  },

  cancelOrder: async (id) => {
  try {
    const res = await axios.delete(`${API_BASE_3000}/orders/${id}/cancel`);
    return res.data;
  } catch (err) {
    console.error("Error cancelOrder:", err);
    return null;
  }
},


  getStokBahan: async () => {
    try {
      const res = await axios.get(`${API_BASE_3000}/stok-bahan`);
      return res.data;
    } catch (err) {
      console.error("Error getStokBahan:", err);
      return [];
    }
  },
};

export default api;
