'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type ConnectModalContentsTypes = 'main' | 'email-verification' | 'faq';

export const ConnectModal = ({ isOpen, onClose }: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>('main');

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('main');
        }
    }, [isOpen]);

    const renderContent = () => {
        switch (currentContent) {
            case 'main':
                return (
                    <MainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                    />
                );
            case 'faq':
                return (
                    <FAQContent onGoBack={() => setCurrentContent('main')} />
                );
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            {renderContent()}
        </BaseModal>
    );
};
