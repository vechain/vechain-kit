'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    ProfileContent,
    AssetsContent,
    BridgeContent,
    LanguageSettingsContent,
    TermsAndPrivacyContent,
    GasTokenSettingsContent,
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
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccount';
import { useModal } from '@/providers/ModalProvider';
import { ChangeCurrencyContent } from './Contents/KitSettings';
import { contentVariants, transition } from './utils/animationVariants';
import { getContentKey } from './utils/getContentKey';

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
    const previousContentRef = useRef<AccountModalContentTypes | null>(null);
    const directionRef = useRef<'forward' | 'backward'>('forward');
    const wasOpenRef = useRef(false);

    const {
        accountModalContent: currentContent,
        setAccountModalContent: setCurrentContent,
    } = useModal();

    // Use initialContent when modal first opens, otherwise use currentContent
    // This ensures we don't show old content when reopening
    const isFirstOpen = !wasOpenRef.current && isOpen;
    const displayContent = isFirstOpen ? initialContent : currentContent;

    // Reset refs and set initial content when modal opens
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            // Modal just opened - reset everything and use initialContent
            previousContentRef.current = null;
            directionRef.current = 'forward';
            setCurrentContent(initialContent);
        }
        wasOpenRef.current = isOpen;
    }, [isOpen, initialContent, setCurrentContent]);

    // Track navigation direction (computed synchronously)
    const direction = (() => {
        if (
            previousContentRef.current === null ||
            previousContentRef.current === displayContent
        ) {
            return directionRef.current;
        }
        // Determine direction based on common navigation patterns
        const prevKey = getContentKey(previousContentRef.current);
        const currKey = getContentKey(displayContent);

        // Common backward navigation patterns
        const isBackward =
            // Going back to main from any view
            currKey === 'main' ||
            // Going back to settings from sub-settings
            (currKey === 'settings' && prevKey !== 'main') ||
            // Going from summary/confirmation back to main content
            prevKey.includes('summary') ||
            prevKey.includes('confirm') ||
            prevKey.includes('operation');

        return isBackward ? 'backward' : 'forward';
    })();

    // Update refs after computing direction
    useEffect(() => {
        directionRef.current = direction;
        previousContentRef.current = displayContent;
    }, [displayContent, direction]);

    const renderContent = () => {
        if (typeof displayContent === 'object') {
            switch (displayContent.type) {
                case 'send-token':
                    return <SendTokenContent {...displayContent.props} />;
                case 'send-token-summary':
                    return (
                        <SendTokenSummaryContent {...displayContent.props} />
                    );
                case 'swap-token':
                    return <SwapTokenContent {...displayContent.props} />;
                case 'choose-name':
                    return <ChooseNameContent {...displayContent.props} />;
                case 'choose-name-search':
                    return (
                        <ChooseNameSearchContent {...displayContent.props} />
                    );
                case 'choose-name-summary':
                    return (
                        <ChooseNameSummaryContent {...displayContent.props} />
                    );
                case 'app-overview':
                    return (
                        <AppOverviewContent
                            {...displayContent.props}
                            setCurrentContent={setCurrentContent}
                        />
                    );
                case 'disconnect-confirm':
                    return (
                        <DisconnectConfirmContent {...displayContent.props} />
                    );
                case 'account-customization':
                    return <CustomizationContent {...displayContent.props} />;
                case 'account-customization-summary':
                    return (
                        <CustomizationSummaryContent
                            {...displayContent.props}
                        />
                    );
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent {...displayContent.props} />
                    );
                case 'failed-operation':
                    return <FailedOperationContent {...displayContent.props} />;
                case 'upgrade-smart-account':
                    return (
                        <UpgradeSmartAccountContent {...displayContent.props} />
                    );
                case 'faq':
                    return <FAQContent {...displayContent.props} />;
                case 'terms-and-privacy':
                    return <TermsAndPrivacyContent {...displayContent.props} />;
                case 'ecosystem-with-category':
                    return (
                        <ExploreEcosystemContent
                            setCurrentContent={setCurrentContent}
                            selectedCategory={
                                displayContent.props.selectedCategory
                            }
                        />
                    );
            }
        }

        switch (displayContent) {
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
            case 'bridge':
                return <BridgeContent setCurrentContent={setCurrentContent} />;
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
            default:
                return null;
        }
    };

    const content = renderContent();
    const contentKey = getContentKey(displayContent);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            <AnimatePresence
                mode="wait"
                initial={false}
                key={isOpen ? 'open' : 'closed'}
            >
                {isOpen && content && (
                    <motion.div
                        key={contentKey}
                        custom={directionRef.current}
                        variants={contentVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={transition}
                        style={{ width: '100%' }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </BaseModal>
    );
};
