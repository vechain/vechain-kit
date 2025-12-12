// Animation variants for smooth modal content transitions
export const contentVariants = {
    enter: (direction: 'forward' | 'backward') => ({
        opacity: 0,
        x: direction === 'forward' ? 20 : -20,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (direction: 'forward' | 'backward') => ({
        opacity: 0,
        x: direction === 'forward' ? -20 : 20,
    }),
};

export const transition = {
    duration: 0.17,
    ease: [0.4, 0, 0.2, 1] as const,
};
