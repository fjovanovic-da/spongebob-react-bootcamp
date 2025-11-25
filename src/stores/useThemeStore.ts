import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'cupcake' | 'aqua';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

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
