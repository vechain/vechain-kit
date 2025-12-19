'use client';

import { useState, useEffect, useRef } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent, LoadingContent, ErrorContent } from './Contents';
import { PrivyAppInfo } from '@/types';

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
    const previousContentRef = useRef<ConnectModalContentsTypes | null>(null);
    const wasOpenRef = useRef(false);

    // Sync currentContent with initialContent when it changes (e.g., when opening from popover)
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            // Modal just opened - reset everything and use initialContent
            previousContentRef.current = null;
            setCurrentContent(initialContent);
        }
    }, [isOpen, initialContent, setCurrentContent]);

    const renderContent = () => {
        // Ensure displayContent is valid
        if (!currentContent) {
            return (
                <MainContent
                    setCurrentContent={setCurrentContent}
                    onClose={onClose}
                />
            );
        }

        switch (currentContent) {
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
                            showBackButton={currentContent.props.showBackButton}
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
                mobileMinHeight={'260px'}
                mobileMaxHeight={'400px'}
                desktopMinHeight={'250px'}
                desktopMaxHeight={'400px'}
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
            mobileMinHeight={'260px'}
            mobileMaxHeight={'400px'}
            desktopMinHeight={'250px'}
            desktopMaxHeight={'400px'}
        >
            {content}
        </BaseModal>
    );
};
