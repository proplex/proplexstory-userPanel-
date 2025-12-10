import { create } from "zustand";

interface UserStore {
    user: {
        user_id: string;
        email: string;
        name: string;
        phone: string;
        wallet_balance: string | null;
        escrow_user_id: string | null | any;
        aadhar_verification_status: boolean;
        pan_verification_status: boolean;
    };
    setUser: (user: any) => void;
    getUser: () => UserStore['user'];
}

const useUserStore = create<UserStore>((set, get) => ({
    user: {
        user_id: "",
        email: "",
        name: "",
        phone: "",
        wallet_balance: null,
        escrow_user_id: null,
        aadhar_verification_status: false,
        pan_verification_status: false,
    },
    setUser: (user) => set({ user: user }),
    getUser: () => get().user,
}));

export default useUserStore;