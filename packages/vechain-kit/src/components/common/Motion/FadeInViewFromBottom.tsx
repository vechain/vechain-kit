import { motion } from 'framer-motion';
import React, { ReactNode, useEffect } from 'react';

type Props = {
    children: ReactNode;
};

export const FadeInViewFromBottom = ({ children }: Props) => {
    // Prevent scroll position from affecting animation
    useEffect(() => {
        const modalContent = document.querySelector('.chakra-modal__content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.2,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
};
