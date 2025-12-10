import { create } from "zustand";

interface TokenState {
  token: number | null;
  setToken: (token: number | null) => void;
  getToken: () => number | null;
}

const useTokenStore = create<TokenState>((set, get) => ({
  token: null,
  setToken: (token) => set({ token }),
  getToken: () => get().token,
}));

export default useTokenStore;
