'use client';

import { useState, useEffect } from 'react';
import { useWallet, useNotificationAlerts } from '@/hooks';
import { BaseModal } from '@/components/common';
import {
    AccountMainContent,
    WalletSettingsContent,
    EmbeddedWalletContent,
    SendTokenContent,
    SendTokenSummaryContent,
    ReceiveTokenContent,
    SwapTokenContent,
    ChooseNameContent,
    ChooseNameSearchContent,
    ChooseNameSummaryContent,
    FAQContent,
} from './Contents';
import { AccountModalContentTypes } from './Types/Types';
import { ConnectionDetailsContent } from './Contents/ConnectionDetails';
import { PrivyLinkedAccounts } from './Contents/PrivyLinkedAccounts';
import { NotificationsContent } from './Contents/Notifications/NotificationsContent';
import { ExploreEcosystemContent } from './Contents/Ecosystem/ExploreEcosystemContent';
import { AppOverviewContent } from './Contents/Ecosystem/AppOverviewContent';
import { DisconnectConfirmContent } from './Contents/Account/DisconnectConfirmContent';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: AccountModalContentTypes;
};

export const AccountModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
}: Props) => {
    useNotificationAlerts();

    const { account } = useWallet();
    const [currentContent, setCurrentContent] =
        useState<AccountModalContentTypes>(initialContent);

    useEffect(() => {
        if (isOpen && initialContent) {
            setCurrentContent(initialContent);
        }
    }, [isOpen, initialContent]);

    const renderContent = () => {
        if (typeof currentContent === 'object') {
            switch (currentContent.type) {
                case 'send-token':
                    return <SendTokenContent {...currentContent.props} />;
                case 'send-token-summary':
                    return (
                        <SendTokenSummaryContent {...currentContent.props} />
                    );
                case 'choose-name-search':
                    return (
                        <ChooseNameSearchContent {...currentContent.props} />
                    );
                case 'choose-name-summary':
                    return (
                        <ChooseNameSummaryContent {...currentContent.props} />
                    );
                case 'app-overview':
                    return (
                        <AppOverviewContent
                            {...currentContent.props}
                            setCurrentContent={setCurrentContent}
                        />
                    );
                case 'disconnect-confirm':
                    return (
                        <DisconnectConfirmContent {...currentContent.props} />
                    );
            }
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
            case 'notifications':
                return (
                    <NotificationsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'embedded-wallet':
                return (
                    <EmbeddedWalletContent
                        setCurrentContent={setCurrentContent}
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
            case 'choose-name':
                return (
                    <ChooseNameContent setCurrentContent={setCurrentContent} />
                );
            case 'faq':
                return (
                    <FAQContent
                        onGoBack={() => setCurrentContent('settings')}
                    />
                );
            case 'connection-details':
                return (
                    <ConnectionDetailsContent
                        onGoBack={() => setCurrentContent('settings')}
                    />
                );
            case 'privy-linked-accounts':
                return (
                    <PrivyLinkedAccounts
                        onBack={() => setCurrentContent('embedded-wallet')}
                    />
                );
            case 'ecosystem':
                return (
                    <ExploreEcosystemContent
                        setCurrentContent={setCurrentContent}
                    />
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
