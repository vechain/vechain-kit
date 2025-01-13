'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { EcosystemContent } from './Contents/EcosystemContent';
import { BaseModal } from '@/components/common';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    logo?: string;
};

export type ConnectModalContents = 'main' | 'ecosystem' | 'email-verification';

export const ConnectModal = ({ isOpen, onClose, logo }: Props) => {
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
                        logo={logo}
                    />
                );
            case 'ecosystem':
                return (
                    <EcosystemContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                    />
                );
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {renderContent()}
        </BaseModal>
    );
};
