'use client';

import { useWallet } from '@/hooks';
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
    ProfileContent,
    AssetsContent,
    TokenDetailContent,
    NftDetailContent,
    NftCollectionContent,
    SendNftContent,
    SendNftSummaryContent,
    TransactionHistoryContent,
    TransactionDetailContent,
    LanguageSettingsContent,
    TermsAndPrivacyContent,
    GasTokenSettingsContent,
    SelectWalletContent,
    RemoveWalletConfirmContent,
} from './Contents';
import { AccountModalContentTypes } from './Types/Types';
import { ConnectionDetailsContent } from './Contents/ConnectionDetails';
import { PrivyLinkedAccounts } from './Contents/PrivyLinkedAccounts';
import { NotificationsContent } from './Contents/Notifications/NotificationContent';
import { ExploreEcosystemContent } from './Contents/Ecosystem/ExploreEcosystemContent';
import { AppOverviewContent } from './Contents/Ecosystem/AppOverviewContent';
import { DisconnectConfirmContent } from './Contents/DisconnectConfirmation';
import { CustomizationContent, CustomizationSummaryContent } from './Contents';
import { SuccessfulOperationContent } from './Contents/SuccessfulOperation/SuccessfulOperationContent';
import { FailedOperationContent } from './Contents/FailedOperation/FailedOperationContent';
import { ManageCustomTokenContent } from './Contents/Assets/ManageCustomTokenContent';
import { TransakOnrampContent } from './Contents/TransakOnramp';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccount';
import { useModal } from '@/providers/ModalProvider';
import { ChangeCurrencyContent } from './Contents/KitSettings';
import { useVechainKitThemeConfig } from '@/providers';
import { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: AccountModalContentTypes;
};

export const AccountModal = ({
    isOpen,
    onClose,
    initialContent = 'profile',
}: Props) => {
    const { account } = useWallet();
    const { themeConfig } = useVechainKitThemeConfig();

    const {
        accountModalContent: currentContent,
        setAccountModalContent: setCurrentContent,
    } = useModal();

    // Reset refs and set initial content when modal opens
    useEffect(() => {
        if (isOpen) {
            // Modal just opened - reset everything and use initialContent
            setCurrentContent(initialContent);
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
                case 'token-detail':
                    return <TokenDetailContent {...currentContent.props} />;
                case 'nft-collection':
                    return (
                        <NftCollectionContent {...currentContent.props} />
                    );
                case 'nft-detail':
                    return <NftDetailContent {...currentContent.props} />;
                case 'send-nft':
                    return <SendNftContent {...currentContent.props} />;
                case 'send-nft-summary':
                    return (
                        <SendNftSummaryContent {...currentContent.props} />
                    );
                case 'transaction-history':
                    return (
                        <TransactionHistoryContent {...currentContent.props} />
                    );
                case 'transaction-detail':
                    return (
                        <TransactionDetailContent {...currentContent.props} />
                    );
                case 'swap-token':
                    return <SwapTokenContent {...currentContent.props} />;
                case 'receive-token':
                    return <ReceiveTokenContent {...currentContent.props} />;
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
                case 'remove-wallet-confirm':
                    return (
                        <RemoveWalletConfirmContent {...currentContent.props} />
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
                case 'failed-operation':
                    return <FailedOperationContent {...currentContent.props} />;
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
                case 'transak-onramp':
                    return <TransakOnrampContent {...currentContent.props} />;
                case 'select-wallet':
                    return (
                        <SelectWalletContent
                            setCurrentContent={setCurrentContent}
                            onClose={onClose}
                            returnTo={currentContent.props.returnTo}
                            onLogoutSuccess={
                                currentContent.props.onLogoutSuccess
                            }
                        />
                    );
                case 'main':
                    return (
                        <AccountMainContent
                            setCurrentContent={setCurrentContent}
                            onClose={onClose}
                            wallet={account}
                            switchFeedback={currentContent.props?.switchFeedback}
                        />
                    );
                case 'profile':
                    return (
                        <ProfileContent
                            setCurrentContent={setCurrentContent}
                            onLogoutSuccess={() => {
                                onClose();
                            }}
                            switchFeedback={currentContent.props?.switchFeedback}
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
                            onClose();
                        }}
                    />
                );
            case 'profile':
                return (
                    <ProfileContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={() => {
                            onClose();
                        }}
                    />
                );
            case 'assets':
                return <AssetsContent setCurrentContent={setCurrentContent} />;
            case 'notifications':
                return (
                    <NotificationsContent
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
                        onBack={() => setCurrentContent('settings')}
                    />
                );
            case 'ecosystem':
                return (
                    <ExploreEcosystemContent
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
            case 'change-language':
                return (
                    <LanguageSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'gas-token-settings':
                return (
                    <GasTokenSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'account-customization':
                return (
                    <CustomizationContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            default:
                return null;
        }
    };

    // The Transak onramp content embeds a whole external payment app (quote,
    // KYC, add-card-details) inside its widget iframe -- it needs far more
    // room than every other AccountModal screen, which are all tuned to the
    // fixed 485px/'sm' defaults below.
    const isTransakOnramp =
        typeof currentContent === 'object' &&
        currentContent.type === 'transak-onramp';

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            size={isTransakOnramp ? 'lg' : undefined}
            mobileMinHeight={
                isTransakOnramp
                    ? '600px'
                    : themeConfig?.modal?.useBottomSheetOnMobile
                      ? '520px'
                      : '510px'
            }
            mobileMaxHeight={
                isTransakOnramp
                    ? '90dvh'
                    : themeConfig?.modal?.useBottomSheetOnMobile
                      ? '520px'
                      : '510px'
            }
            desktopMinHeight={isTransakOnramp ? '650px' : '485px'}
            desktopMaxHeight={isTransakOnramp ? '90dvh' : '485px'}
        >
            {renderContent()}
        </BaseModal>
    );
};
