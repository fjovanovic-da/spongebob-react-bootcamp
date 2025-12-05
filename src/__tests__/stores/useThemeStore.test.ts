import { beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "../../stores/useThemeStore";

describe("useThemeStore", () => {
    beforeEach(() => {
        // Reset store state before each test
        useThemeStore.setState({ theme: "cupcake" });
    });

    describe("initial state", () => {
        it("should have 'cupcake' as default theme", () => {
            const { theme } = useThemeStore.getState();
            expect(theme).toBe("cupcake");
        });
    });

    describe("toggleTheme", () => {
        it("should toggle from 'cupcake' to 'aqua'", () => {
            const { toggleTheme } = useThemeStore.getState();

            toggleTheme();

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("aqua");
        });

        it("should toggle from 'aqua' to 'cupcake'", () => {
            useThemeStore.setState({ theme: "aqua" });

            const { toggleTheme } = useThemeStore.getState();
            toggleTheme();

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("cupcake");
        });

        it("should toggle back and forth", () => {
            const { toggleTheme } = useThemeStore.getState();

            // cupcake -> aqua
            toggleTheme();
            expect(useThemeStore.getState().theme).toBe("aqua");

            // aqua -> cupcake
            toggleTheme();
            expect(useThemeStore.getState().theme).toBe("cupcake");

            // cupcake -> aqua
            toggleTheme();
            expect(useThemeStore.getState().theme).toBe("aqua");
        });
    });

    describe("setTheme", () => {
        it("should set theme to 'aqua'", () => {
            const { setTheme } = useThemeStore.getState();

            setTheme("aqua");

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("aqua");
        });

        it("should set theme to 'cupcake'", () => {
            useThemeStore.setState({ theme: "aqua" });

            const { setTheme } = useThemeStore.getState();
            setTheme("cupcake");

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("cupcake");
        });

        it("should set same theme without error", () => {
            const { setTheme } = useThemeStore.getState();

            setTheme("cupcake");

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("cupcake");
        });
    });

    describe("setTheme and toggleTheme interaction", () => {
        it("should toggle correctly after setTheme to cupcake", () => {
            const { setTheme, toggleTheme } = useThemeStore.getState();

            setTheme("cupcake");
            toggleTheme();

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("aqua");
        });

        it("should toggle correctly after setTheme to aqua", () => {
            const { setTheme, toggleTheme } = useThemeStore.getState();

            setTheme("aqua");
            toggleTheme();

            const { theme } = useThemeStore.getState();
            expect(theme).toBe("cupcake");
        });
    });
});
