'use client';

import { useState, useEffect } from 'react';
import { useWallet, useNotificationAlerts } from '@/hooks';
import { BaseModal } from '@/components/common';
import {
    AccountMainContent,
    SettingsContent,
    SendTokenContent,
    SendTokenSummaryContent,
    ReceiveTokenContent,
    SwapTokenContent,
    ChooseNameContent,
    ChooseNameSearchContent,
    ChooseNameSummaryContent,
    FAQContent,
    AccessAndSecurityContent,
    EmbeddedWalletContent,
    ProfileContent,
} from './Contents';
import { AccountModalContentTypes } from './Types/Types';
import { ConnectionDetailsContent } from './Contents/ConnectionDetails';
import { PrivyLinkedAccounts } from './Contents/PrivyLinkedAccounts';
import { NotificationsContent } from './Contents/Notifications/NotificationContent';
import { ExploreEcosystemContent } from './Contents/Ecosystem/ExploreEcosystemContent';
import { AppOverviewContent } from './Contents/Ecosystem/AppOverviewContent';
import { DisconnectConfirmContent } from './Contents/Account/DisconnectConfirmContent';
import { CustomizationContent, CustomizationSummaryContent } from './Contents';
import { SuccessfulOperationContent } from './Contents/SuccessfulOperation/SuccessfulOperationContent';
import { ManageCustomTokenContent } from './Contents/ManageCustomToken';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccount';

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
        if (isOpen) {
            if (initialContent) {
                setCurrentContent(initialContent);
            }
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
                case 'account-customization-summary':
                    return (
                        <CustomizationSummaryContent
                            {...currentContent.props}
                            setCurrentContent={setCurrentContent}
                        />
                    );
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent
                            {...currentContent.props}
                            setCurrentContent={setCurrentContent}
                        />
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
                    <SettingsContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={onClose}
                    />
                );
            case 'profile':
                return (
                    <ProfileContent
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
            case 'access-and-security':
                return (
                    <AccessAndSecurityContent
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
                        onBack={() => setCurrentContent('access-and-security')}
                    />
                );
            case 'ecosystem':
                return (
                    <ExploreEcosystemContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'account-customization':
                return (
                    <CustomizationContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'embedded-wallet':
                return (
                    <EmbeddedWalletContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'add-custom-token':
                return (
                    <ManageCustomTokenContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'upgrade-smart-account':
                return (
                    <UpgradeSmartAccountContent
                        setCurrentContent={setCurrentContent}
                        handleClose={onClose}
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
