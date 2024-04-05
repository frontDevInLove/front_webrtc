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

  receiver: User | null;
  setReceiver: (receiver: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null, // текущий пользователь (начальное значение - null)
  setUser: (user) => set({ user }), // действие для обновления пользователя
  receiver: null, // получатель звонка (начальное значение - null)
  setReceiver: (receiver) => set({ receiver }), // действие для обновления получателя
}));
