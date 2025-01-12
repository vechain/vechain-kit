'use client';

import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { useState, useEffect } from 'react';
import {
    AccountMainContent,
    WalletSettingsContent,
    SmartAccountContent,
    AccountsListContent,
    SendTokenContent,
    SendTokenSummaryContent,
    ReceiveTokenContent,
} from './Contents';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'smart-account'
    | 'accounts'
    | 'send-token'
    | 'receive-token'
    | {
          type: 'send-token-summary';
          props: {
              toAddressOrDomain: string;
              resolvedDomain?: string;
              amount: string;
              selectedToken: {
                  symbol: string;
                  balance: string;
                  address: string;
                  numericBalance: number;
                  price: number;
              };
              onSend: (address: string, amount: string) => void;
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
          };
      };

export const AccountModal = ({ isOpen, onClose }: Props) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const _modalContentProps = isDesktop
        ? {}
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px',
              overflowY: 'scroll',
              overflowX: 'hidden',
          };

    const { selectedAccount } = useWallet();

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
                        wallet={selectedAccount}
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
                        wallet={selectedAccount}
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
        }
    };

    return (
        <Modal
            motionPreset="slideInBottom"
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            size="md"
            scrollBehavior="inside"
            returnFocusOnClose={true}
            preserveScrollBarGap={true}
        >
            <ModalOverlay />

            <ModalContent {...(_modalContentProps as ModalContentProps)}>
                {renderContent()}
            </ModalContent>
        </Modal>
    );
};
