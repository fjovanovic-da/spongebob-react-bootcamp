import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeState } from '../types';

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'cupcake',
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'cupcake' ? 'aqua' : 'cupcake',
                })),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'theme-storage',
        }
    )
);
