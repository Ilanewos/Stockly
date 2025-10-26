import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; // sesuaikan port backendmu

export const api = {
  // ====== BAHAN ======
  getBahan: async () => {
    try {
      const res = await axios.get(`${API_BASE}/bahan`);
      return res.data;
    } catch (err) {
      console.error('Error getBahan:', err);
      return [];
    }
  },

  getBahanById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/bahan/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error getBahanById:', err);
      return null;
    }
  },

  createBahan: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/bahan`, data);
      return res.data;
    } catch (err) {
      console.error('Error createBahan:', err);
      return null;
    }
  },

  updateBahan: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/bahan/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('Error updateBahan:', err);
      return null;
    }
  },

  deleteBahan: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/bahan/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error deleteBahan:', err);
      return null;
    }
  },

  // ====== RESTOCK ======
  getRestock: async () => {
    try {
      const res = await axios.get(`${API_BASE}/restock`);
      return res.data;
    } catch (err) {
      console.error('Error getRestock:', err);
      return [];
    }
  },

  getRestockById: async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/restock/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error getRestockById:', err);
      return null;
    }
  },

  createRestock: async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/restock`, data);
      return res.data;
    } catch (err) {
      console.error('Error createRestock:', err);
      return null;
    }
  },

  updateRestock: async (id, data) => {
    try {
      const res = await axios.put(`${API_BASE}/restock/${id}`, data);
      return res.data;
    } catch (err) {
      console.error('Error updateRestock:', err);
      return null;
    }
  },

  deleteRestock: async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/restock/${id}`);
      return res.data;
    } catch (err) {
      console.error('Error deleteRestock:', err);
      return null;
    }
  },
};
