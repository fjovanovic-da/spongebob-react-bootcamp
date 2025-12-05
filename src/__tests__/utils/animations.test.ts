import { describe, it, expect } from "vitest";
import {
    containerVariants,
    itemVariants,
    listVariants,
    listItemVariants,
    emptyStateVariants,
    statsContainerVariants,
    statItemVariants,
    favoritesGridVariants,
    chartVariants,
    favoriteStatVariants,
    backdropVariants,
    modalVariants,
    buttonHoverTap,
    iconButtonHoverTap,
    valueChangeAnimation,
    pulseAnimation,
    badgeCompletionAnimation,
} from "../../utils/animations";

describe("animations", () => {
    describe("containerVariants", () => {
        it("should have hidden state with opacity 0", () => {
            expect(containerVariants.hidden).toEqual({ opacity: 0 });
        });

        it("should have visible state with opacity 1 and stagger children", () => {
            expect(containerVariants.visible).toMatchObject({
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                },
            });
        });
    });

    describe("itemVariants", () => {
        it("should have hidden state with opacity 0 and y offset", () => {
            expect(itemVariants.hidden).toEqual({ opacity: 0, y: 20 });
        });

        it("should have visible state with opacity 1 and y 0", () => {
            expect(itemVariants.visible).toMatchObject({
                opacity: 1,
                y: 0,
            });
        });

        it("should have transition duration of 0.5", () => {
            const visible = itemVariants.visible as { transition: { duration: number } };
            expect(visible.transition.duration).toBe(0.5);
        });
    });

    describe("listVariants", () => {
        it("should have hidden state with opacity 0", () => {
            expect(listVariants.hidden).toEqual({ opacity: 0 });
        });

        it("should stagger children at 0.08 intervals", () => {
            const visible = listVariants.visible as { transition: { staggerChildren: number } };
            expect(visible.transition.staggerChildren).toBe(0.08);
        });
    });

    describe("listItemVariants", () => {
        it("should have hidden state with opacity 0 and x offset", () => {
            expect(listItemVariants.hidden).toEqual({ opacity: 0, x: -20 });
        });

        it("should have visible state with opacity 1 and x 0", () => {
            expect(listItemVariants.visible).toMatchObject({
                opacity: 1,
                x: 0,
            });
        });

        it("should have exit state with opacity 0 and positive x offset", () => {
            expect(listItemVariants.exit).toMatchObject({
                opacity: 0,
                x: 20,
            });
        });
    });

    describe("emptyStateVariants", () => {
        it("should have hidden state with opacity 0 and scale 0.8", () => {
            expect(emptyStateVariants.hidden).toEqual({ opacity: 0, scale: 0.8 });
        });

        it("should have visible state with opacity 1 and scale 1", () => {
            expect(emptyStateVariants.visible).toMatchObject({
                opacity: 1,
                scale: 1,
            });
        });
    });

    describe("statsContainerVariants", () => {
        it("should have hidden state with opacity 0", () => {
            expect(statsContainerVariants.hidden).toEqual({ opacity: 0 });
        });

        it("should stagger children at 0.15 intervals", () => {
            const visible = statsContainerVariants.visible as { transition: { staggerChildren: number } };
            expect(visible.transition.staggerChildren).toBe(0.15);
        });
    });

    describe("statItemVariants", () => {
        it("should have hidden state with opacity 0 and scale 0.8", () => {
            expect(statItemVariants.hidden).toEqual({ opacity: 0, scale: 0.8 });
        });

        it("should have visible state with opacity 1 and scale 1", () => {
            expect(statItemVariants.visible).toMatchObject({
                opacity: 1,
                scale: 1,
            });
        });
    });

    describe("favoritesGridVariants", () => {
        it("should have hidden state with opacity 0", () => {
            expect(favoritesGridVariants.hidden).toEqual({ opacity: 0 });
        });

        it("should stagger children at 0.2 intervals", () => {
            const visible = favoritesGridVariants.visible as { transition: { staggerChildren: number } };
            expect(visible.transition.staggerChildren).toBe(0.2);
        });
    });

    describe("chartVariants", () => {
        it("should have hidden state with opacity 0 and scale 0.9", () => {
            expect(chartVariants.hidden).toEqual({ opacity: 0, scale: 0.9 });
        });

        it("should have visible state with opacity 1 and scale 1", () => {
            expect(chartVariants.visible).toMatchObject({
                opacity: 1,
                scale: 1,
            });
        });
    });

    describe("favoriteStatVariants", () => {
        it("should have hidden state with opacity 0 and negative y offset", () => {
            expect(favoriteStatVariants.hidden).toEqual({ opacity: 0, y: -20 });
        });

        it("should have visible state with opacity 1 and y 0", () => {
            expect(favoriteStatVariants.visible).toMatchObject({
                opacity: 1,
                y: 0,
            });
        });
    });

    describe("modalVariants", () => {
        it("should have hidden state", () => {
            expect(modalVariants.hidden).toEqual({
                opacity: 0,
                scale: 0.8,
                y: 20,
            });
        });

        it("should have visible state", () => {
            expect(modalVariants.visible).toMatchObject({
                opacity: 1,
                scale: 1,
                y: 0,
            });
        });

        it("should have exit state matching hidden state values", () => {
            expect(modalVariants.exit).toMatchObject({
                opacity: 0,
                scale: 0.8,
                y: 20,
            });
        });
    });

    describe("backdropVariants", () => {
        it("should have hidden state with opacity 0", () => {
            expect(backdropVariants.hidden).toEqual({ opacity: 0 });
        });

        it("should have visible state with opacity 1", () => {
            expect(backdropVariants.visible).toEqual({ opacity: 1 });
        });
    });

    describe("buttonHoverTap", () => {
        it("should scale up on hover", () => {
            expect(buttonHoverTap.whileHover).toEqual({ scale: 1.02 });
        });

        it("should scale down on tap", () => {
            expect(buttonHoverTap.whileTap).toEqual({ scale: 0.98 });
        });
    });

    describe("iconButtonHoverTap", () => {
        it("should scale up more on hover than regular button", () => {
            expect(iconButtonHoverTap.whileHover).toEqual({ scale: 1.1 });
        });

        it("should scale down on tap", () => {
            expect(iconButtonHoverTap.whileTap).toEqual({ scale: 0.95 });
        });
    });

    describe("valueChangeAnimation", () => {
        it("should have initial scale of 1.2", () => {
            expect(valueChangeAnimation.initial).toEqual({ scale: 1.2 });
        });

        it("should animate to scale 1", () => {
            expect(valueChangeAnimation.animate).toEqual({ scale: 1 });
        });

        it("should have duration of 0.3", () => {
            expect(valueChangeAnimation.transition).toEqual({ duration: 0.3 });
        });
    });

    describe("pulseAnimation", () => {
        it("should animate scale in a pulse pattern", () => {
            expect(pulseAnimation.animate).toEqual({ scale: [1, 1.1, 1] });
        });

        it("should repeat infinitely", () => {
            expect(pulseAnimation.transition.repeat).toBe(Number.POSITIVE_INFINITY);
        });

        it("should have a repeat delay", () => {
            expect(pulseAnimation.transition.repeatDelay).toBe(1);
        });
    });

    describe("badgeCompletionAnimation", () => {
        it("should return scale animation when complete", () => {
            const result = badgeCompletionAnimation(true);
            expect(result.animate.scale).toEqual([1, 1.2, 1]);
        });

        it("should return no scale animation when not complete", () => {
            const result = badgeCompletionAnimation(false);
            expect(result.animate.scale).toBe(1);
        });

        it("should have initial set to false", () => {
            const result = badgeCompletionAnimation(true);
            expect(result.initial).toBe(false);
        });

        it("should have transition duration of 0.3", () => {
            const result = badgeCompletionAnimation(true);
            expect(result.transition).toEqual({ duration: 0.3 });
        });
    });
});
