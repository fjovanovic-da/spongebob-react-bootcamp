import type { Variants } from "framer-motion";

// Common easing curve
const easeOut = [0.25, 0.1, 0.25, 1] as const;

// Dashboard container animations
export const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: easeOut,
        },
    },
};

// List animations
export const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

export const listItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
        },
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: {
            duration: 0.2,
        },
    },
};

// Empty state animations
export const emptyStateVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: easeOut,
        },
    },
};

// Stats animations
export const statsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export const statItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: easeOut,
        },
    },
};

// Favorites section animations
export const favoritesGridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export const chartVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: easeOut,
        },
    },
};

export const favoriteStatVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: easeOut,
        },
    },
};

// Modal animations
export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: easeOut,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        y: 20,
        transition: {
            duration: 0.2,
        },
    },
};

// Reusable hover/tap animations
export const buttonHoverTap = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
};

export const iconButtonHoverTap = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
};

// Value change animation (for numbers)
export const valueChangeAnimation = {
    initial: { scale: 1.2 },
    animate: { scale: 1 },
    transition: { duration: 0.3 },
};

// Pulse animation for icons
export const pulseAnimation = {
    animate: { scale: [1, 1.1, 1] },
    transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: 1,
    },
};

// Badge completion animation
export const badgeCompletionAnimation = (isComplete: boolean) => ({
    initial: false,
    animate: {
        scale: isComplete ? [1, 1.2, 1] : 1,
    },
    transition: { duration: 0.3 },
});
