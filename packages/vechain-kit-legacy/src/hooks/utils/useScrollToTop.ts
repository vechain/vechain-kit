import { useEffect } from 'react';

export const useScrollToTop = () => {
    useEffect(() => {
        // Target the modal content directly
        const modalContent = document.querySelector('.chakra-modal__content');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, []);
};
