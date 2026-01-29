'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '../common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent, LoadingContent, ErrorContent } from './Contents';
// Import type from centralized location to avoid circular dependencies
import type { ConnectModalContentsTypes } from '../../types/modal';

// Re-export for backward compatibility - needed by internal components
export type { ConnectModalContentsTypes } from '../../types/modal';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: ConnectModalContentsTypes;
    preventAutoClose?: boolean;
};

export const ConnectModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
    preventAutoClose = false,
}: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>(initialContent);

    // Sync currentContent with initialContent when it changes (e.g., when opening from popover)
    useEffect(() => {
        if (isOpen) {
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
                        preventAutoClose={preventAutoClose}
                    />
                );
        }

        switch (currentContent) {
            case 'main':
                return (
                    <MainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        preventAutoClose={preventAutoClose}
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
