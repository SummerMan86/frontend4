/**
 * uiStore.ts
 * Global UI state management using Zustand
 * Created by SummerMan86 on 2025-05-14
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

// UI state interface
interface UiState {
  // Navigation state
  navbarCollapsed: boolean;
  toggleNavbar: () => void;
  setNavbarCollapsed: (collapsed: boolean) => void;
  
  // Theme state
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark') => void;
  
  // Error state
  hasError: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

// Create the store with persistence and dev tools
export const useUiStore = create<UiState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        navbarCollapsed: false,
        colorScheme: 'light',
        hasError: false,
        error: null,
        
        // Navigation actions
        toggleNavbar: () => set(
          state => ({ navbarCollapsed: !state.navbarCollapsed }),
          false,
          'toggleNavbar'
        ),
        
        setNavbarCollapsed: (collapsed) => set(
          { navbarCollapsed: collapsed },
          false,
          'setNavbarCollapsed'
        ),
        
        // Theme actions
        toggleColorScheme: () => set(
          (state) => ({ 
            colorScheme: state.colorScheme === 'light' ? 'dark' : 'light' 
          }),
          false,
          'toggleColorScheme'
        ),
        
        setColorScheme: (scheme) => set(
          { colorScheme: scheme },
          false,
          'setColorScheme'
        ),
        
        // Error handling
        setError: (error) => set({
          hasError: !!error,
          error
        }),
      }),
      { 
        name: 'ui-storage',
        storage: createJSONStorage(() => {
          // Handle localStorage not available
          try {
            return localStorage;
          } catch (e) {
            console.warn('localStorage unavailable, using in-memory storage');
            let store: Record<string, string> = {};
            return {
              getItem: (key) => store[key] || null,
              setItem: (key, value) => { store[key] = value },
              removeItem: (key) => { delete store[key] }
            };
          }
        }),
        partialize: (state) => ({
          navbarCollapsed: state.navbarCollapsed,
          colorScheme: state.colorScheme
        }),
      }
    )
  )
);