'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import {
    EcosystemContent,
    LoadingContent,
    ErrorContent,
    MoreOptionsContent,
} from './Contents';
import { PrivyAppInfo } from '@/types';
import { useWallet } from '@/hooks';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: ConnectModalContentsTypes;
    preventAutoClose?: boolean;
};

export type ConnectModalContentsTypes =
    | 'main'
    | 'faq'
    | {
          type: 'ecosystem';
          props: {
              appsInfo: PrivyAppInfo[];
              isLoading: boolean;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'loading';
          props: {
              title?: string;
              loadingText?: string;
              onTryAgain?: () => void;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'error';
          props: {
              error: string;
              onTryAgain: () => void;
          };
      }
    | {
          type: 'more';
          props: {
              showBackButton?: boolean;
          };
      };

// Stable key derived from a content value, used to retrigger the cross-fade
// animation when the user transitions between views.
const contentKey = (c: ConnectModalContentsTypes | undefined): string => {
    if (!c) return 'main';
    if (typeof c === 'string') return c;
    return c.type;
};

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
`;

export const ConnectModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
    preventAutoClose = false,
}: Props) => {
    const { connection } = useWallet();
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>(initialContent);

    useEffect(() => {
        if (isOpen) {
            setCurrentContent(initialContent);
        }
    }, [isOpen, initialContent, setCurrentContent]);

    useEffect(() => {
        if (connection.isConnected && isOpen && !preventAutoClose) {
            onClose();
        }
    }, [connection.isConnected, isOpen, onClose, preventAutoClose]);

    const renderContent = () => {
        if (!currentContent) {
            return <MainContent setCurrentContent={setCurrentContent} />;
        }

        switch (currentContent) {
            case 'main':
                return <MainContent setCurrentContent={setCurrentContent} />;
            case 'faq':
                return (
                    <FAQContent onGoBack={() => setCurrentContent('main')} />
                );
        }

        if (typeof currentContent === 'object' && 'type' in currentContent) {
            switch (currentContent.type) {
                case 'ecosystem':
                    return (
                        <EcosystemContent
                            onClose={onClose}
                            appsInfo={currentContent.props.appsInfo}
                            isLoading={currentContent.props.isLoading}
                            setCurrentContent={setCurrentContent}
                            showBackButton={currentContent.props.showBackButton}
                        />
                    );
                case 'loading':
                    return (
                        <LoadingContent
                            title={currentContent.props.title}
                            loadingText={currentContent.props.loadingText}
                            onTryAgain={currentContent.props.onTryAgain}
                            onClose={onClose}
                            onGoBack={() => setCurrentContent('main')}
                            showBackButton={
                                currentContent.props.showBackButton
                            }
                        />
                    );
                case 'error':
                    return (
                        <ErrorContent
                            error={currentContent.props.error}
                            onClose={onClose}
                            onTryAgain={currentContent.props.onTryAgain}
                            onGoBack={() => setCurrentContent('main')}
                        />
                    );
                case 'more':
                    return (
                        <MoreOptionsContent
                            onClose={onClose}
                            setCurrentContent={setCurrentContent}
                            showBackButton={
                                currentContent.props.showBackButton
                            }
                        />
                    );
            }
        }

        return null;
    };

    const rendered = renderContent();
    const key = useMemo(() => contentKey(currentContent), [currentContent]);

    const content = rendered ?? (
        <MainContent setCurrentContent={setCurrentContent} />
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            mobileMinHeight={'260px'}
            mobileMaxHeight={'520px'}
            desktopMinHeight={'250px'}
            desktopMaxHeight={'520px'}
        >
            {/* 250ms fade + 4px translate cross-fade between views.
                `key` retriggers the animation on each transition. */}
            <Box
                key={key}
                animation={`${fadeIn} 250ms cubic-bezier(0.4, 0, 0.2, 1)`}
            >
                {content}
            </Box>
        </BaseModal>
    );
};
