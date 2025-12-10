import { create } from 'zustand';

interface UserState {
  avatar: string;
  name: string;
  updateAvatar: (newAvatar: string) => void;
  updateName: (newName: string) => void;
}

const useProfilePhotoStore = create<UserState>((set) => ({
  avatar: "",
  name: "",
  updateAvatar: (newAvatar: string) => set({ avatar: newAvatar }),
  updateName: (newName: string) => set({ name: newName }),
}));

export default useProfilePhotoStore;