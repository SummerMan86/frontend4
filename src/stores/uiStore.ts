/**
 * uiStore.ts
 * Хранилище состояния UI с помощью Zustand
 */

import { create } from 'zustand';

interface UiState {
  // Состояние ошибок
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Состояние уведомлений
  notifications: number;
  increaseNotifications: () => void;
  clearNotifications: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  notifications: 0,
  increaseNotifications: () => set((state) => ({ notifications: state.notifications + 1 })),
  clearNotifications: () => set({ notifications: 0 }),
}));