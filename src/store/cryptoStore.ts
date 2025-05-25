import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CryptoState {
  selectedCrypto: string;
  dateRange: number;
  setSelectedCrypto: (crypto: string) => void;
  setDateRange: (range: number) => void;
}

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set) => ({
      selectedCrypto: 'bitcoin',
      dateRange: 7,
      setSelectedCrypto: (crypto) => set({ selectedCrypto: crypto }),
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'crypto-storage',
    },
  ),
);
