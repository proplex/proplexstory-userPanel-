import { create } from "zustand";

interface AuthTokenStore {
    authToken: string;
    setAuthToken: (token: string) => void;
    getAuthToken: () => string;
}

const useAuthTokenStore = create<AuthTokenStore>((set, get) => ({
    authToken: "",
    setAuthToken: (JWTToken) => set({ authToken: JWTToken }),
    getAuthToken: () => get().authToken,
}));

export default useAuthTokenStore;