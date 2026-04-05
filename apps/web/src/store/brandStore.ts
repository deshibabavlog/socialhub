import { create } from 'zustand';
import axios from 'axios';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
}

interface BrandState {
  brands: Brand[];
  selectedBrandId: string | null;
  loading: boolean;
  error: string | null;
  
  fetchBrands: () => Promise<void>;
  selectBrand: (brandId: string) => void;
  addBrand: (brand: Brand) => void;
  removeBrand: (brandId: string) => void;
  updateBrand: (brandId: string, brand: Partial<Brand>) => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useBrandStore = create<BrandState>((set) => ({
  brands: [],
  selectedBrandId: null,
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/brands`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ brands: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch brands', loading: false });
    }
  },

  selectBrand: (brandId: string) => {
    set({ selectedBrandId: brandId });
    localStorage.setItem('selectedBrandId', brandId);
  },

  addBrand: (brand: Brand) => {
    set((state) => ({
      brands: [...state.brands, brand],
    }));
  },

  removeBrand: (brandId: string) => {
    set((state) => ({
      brands: state.brands.filter((b) => b.id !== brandId),
    }));
  },

  updateBrand: (brandId: string, updates: Partial<Brand>) => {
    set((state) => ({
      brands: state.brands.map((b) =>
        b.id === brandId ? { ...b, ...updates } : b,
      ),
    }));
  },
}));
