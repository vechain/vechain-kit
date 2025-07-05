'use client';

import { useEffect } from 'react';
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
    AssetsContent,
    BridgeContent,
    GeneralSettingsContent,
    LanguageSettingsContent,
    AppearanceSettingsContent,
    TermsAndPrivacyContent,
    GasTokenSettingsContent,
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
import { ManageCustomTokenContent } from './Contents/Assets/ManageCustomTokenContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccount';
import { useModal } from '@/providers/ModalProvider';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { ChangeCurrencyContent } from './Contents/KitSettings';

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

    const {
        accountModalContent: currentContent,
        setAccountModalContent: setCurrentContent,
    } = useModal();

    useEffect(() => {
        if (isOpen && initialContent) {
            setCurrentContent(initialContent);
            Analytics.wallet.opened(!!account);
        }
    }, [isOpen, initialContent, setCurrentContent]);

    const renderContent = () => {
        if (typeof currentContent === 'object') {
            switch (currentContent.type) {
                case 'send-token':
                    return <SendTokenContent {...currentContent.props} />;
                case 'send-token-summary':
                    return (
                        <SendTokenSummaryContent {...currentContent.props} />
                    );
                case 'choose-name':
                    return <ChooseNameContent {...currentContent.props} />;
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
                case 'account-customization':
                    return <CustomizationContent {...currentContent.props} />;
                case 'account-customization-summary':
                    return (
                        <CustomizationSummaryContent
                            {...currentContent.props}
                        />
                    );
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent {...currentContent.props} />
                    );
                case 'upgrade-smart-account':
                    return (
                        <UpgradeSmartAccountContent {...currentContent.props} />
                    );
                case 'faq':
                    return <FAQContent {...currentContent.props} />;
                case 'terms-and-privacy':
                    return <TermsAndPrivacyContent {...currentContent.props} />;
                case 'ecosystem-with-category':
                    return (
                        <ExploreEcosystemContent
                            setCurrentContent={setCurrentContent}
                            selectedCategory={
                                currentContent.props.selectedCategory
                            }
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
                        onLogoutSuccess={() => {
                            Analytics.auth.logoutCompleted();
                            onClose();
                        }}
                    />
                );
            case 'profile':
                return (
                    <ProfileContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={() => {
                            Analytics.auth.logoutCompleted();
                            onClose();
                        }}
                    />
                );
            case 'assets':
                return <AssetsContent setCurrentContent={setCurrentContent} />;
            case 'bridge':
                return <BridgeContent setCurrentContent={setCurrentContent} />;
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
            case 'change-currency':
                return (
                    <ChangeCurrencyContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'general-settings':
                return (
                    <GeneralSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'change-language':
                return (
                    <LanguageSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'appearance-settings':
                return (
                    <AppearanceSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'gas-token-settings':
                return (
                    <GasTokenSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            default:
                return null;
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
