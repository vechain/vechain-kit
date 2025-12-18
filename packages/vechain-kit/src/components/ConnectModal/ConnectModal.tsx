'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent, LoadingContent, ErrorContent } from './Contents';
import { PrivyAppInfo } from '@/types';
import { useWallet } from '@/hooks';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: ConnectModalContentsTypes;
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
      };

export const ConnectModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
}: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>(initialContent);
    const { connection } = useWallet();

    // Use currentContent for display, with fallback to 'main'
    const displayContent = currentContent || 'main';

    // Close modal when connection becomes connected (works for all content types)
    useEffect(() => {
        if (connection.isConnected && isOpen) {
            onClose();
        }
    }, [connection.isConnected, isOpen, onClose]);

    const renderContent = () => {
        // Ensure displayContent is valid
        if (!displayContent) {
            return (
                <MainContent
                    setCurrentContent={setCurrentContent}
                    onClose={onClose}
                />
            );
        }

        switch (displayContent) {
            case 'main':
                return (
                    <MainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                    />
                );
            case 'faq':
                return (
                    <FAQContent onGoBack={() => setCurrentContent('main')} />
                );
        }

        if (typeof displayContent === 'object' && 'type' in displayContent) {
            switch (displayContent.type) {
                case 'ecosystem':
                    return (
                        <EcosystemContent
                            onClose={onClose}
                            appsInfo={displayContent.props.appsInfo}
                            isLoading={displayContent.props.isLoading}
                            setCurrentContent={setCurrentContent}
                            showBackButton={displayContent.props.showBackButton}
                        />
                    );
                case 'loading':
                    return (
                        <LoadingContent
                            title={displayContent.props.title}
                            loadingText={displayContent.props.loadingText}
                            onTryAgain={displayContent.props.onTryAgain}
                            onClose={onClose}
                            onGoBack={() => setCurrentContent('main')}
                            showBackButton={displayContent.props.showBackButton}
                        />
                    );
                case 'error':
                    return (
                        <ErrorContent
                            error={displayContent.props.error}
                            onClose={onClose}
                            onTryAgain={displayContent.props.onTryAgain}
                            onGoBack={() => setCurrentContent('main')}
                        />
                    );
            }
        }

        return null;
    };

    const content = renderContent();

    // Ensure we have valid content before rendering
    if (!content) {
        // Fallback to main content if renderContent returns null
        const fallbackContent = (
            <MainContent
                setCurrentContent={setCurrentContent}
                onClose={onClose}
            />
        );
        return (
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                allowExternalFocus={true}
                blockScrollOnMount={true}
            >
                {fallbackContent}
            </BaseModal>
        );
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            mobileMinHeight={'30vh'}
            mobileMaxHeight={'45vh'}
            desktopMinHeight={'27vh'}
            desktopMaxHeight={'45vh'}
        >
            {content}
        </BaseModal>
    );
};
