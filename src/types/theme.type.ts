export type Theme = 'cupcake' | 'aqua';

export interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}
