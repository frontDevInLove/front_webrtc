import { create } from "zustand";

// Определение интерфейса пользователя
export interface User {
  id: string;
  username: string;
}

// Определение интерфейса состояния и действий стора
interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null, // начальное состояние
  setUser: (user) => set({ user }), // действие для обновления пользователя
}));
