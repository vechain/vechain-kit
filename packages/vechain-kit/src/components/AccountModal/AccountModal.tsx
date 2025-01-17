'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks';
import { BaseModal } from '@/components/common';
import {
    AccountMainContent,
    WalletSettingsContent,
    SmartAccountContent,
    AccountsListContent,
    SendTokenContent,
    SendTokenSummaryContent,
    ReceiveTokenContent,
    SwapTokenContent,
} from './Contents';
import { AccountModalContentTypes } from './Types/Types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const AccountModal = ({ isOpen, onClose }: Props) => {
    const { account } = useWallet();
    const [currentContent, setCurrentContent] =
        useState<AccountModalContentTypes>('main');

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('main');
        }
    }, [isOpen]);

    const renderContent = () => {
        if (
            typeof currentContent === 'object' &&
            currentContent.type === 'send-token-summary'
        ) {
            return <SendTokenSummaryContent {...currentContent.props} />;
        }

        switch (currentContent) {
            case 'main':
                return (
                    <AccountMainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={account}
                    />
                );
            case 'settings':
                return (
                    <WalletSettingsContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={onClose}
                    />
                );
            case 'smart-account':
                return (
                    <SmartAccountContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'accounts':
                return (
                    <AccountsListContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={account}
                    />
                );
            case 'send-token':
                return (
                    <SendTokenContent
                        setCurrentContent={setCurrentContent}
                        onSend={() => {}}
                    />
                );
            case 'receive-token':
                return (
                    <ReceiveTokenContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'swap-token':
                return (
                    <SwapTokenContent setCurrentContent={setCurrentContent} />
                );
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {renderContent()}
        </BaseModal>
    );
};
