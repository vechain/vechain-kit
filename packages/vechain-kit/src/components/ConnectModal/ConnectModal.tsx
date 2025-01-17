'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type ConnectModalContents = 'main' | 'email-verification';

export const ConnectModal = ({ isOpen, onClose }: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContents>('main');

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
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={false}
        >
            {renderContent()}
        </BaseModal>
    );
};
