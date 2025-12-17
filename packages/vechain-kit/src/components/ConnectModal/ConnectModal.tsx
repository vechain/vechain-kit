'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent, LoadingContent, ErrorContent } from './Contents';
import { PrivyAppInfo } from '@/types';
import {
    contentVariants,
    transition,
    getContentKey,
} from '@/components/common';
import { useWallet } from '@/hooks';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: ConnectModalContentsTypes;
};

export type ConnectModalContentsTypes =
    | 'main'
    | 'email-verification'
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
    const directionRef = useRef<'forward' | 'backward'>('forward');
    const wasOpenRef = useRef(false);
    const { connection } = useWallet();

    // Reset refs and set initial content when modal opens
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            // Modal just opened - reset everything and use initialContent
            previousContentRef.current = null;
            directionRef.current = 'forward';
            setCurrentContent(initialContent || 'main');
            wasOpenRef.current = true;
        } else if (!isOpen && wasOpenRef.current) {
            // Modal just closed - reset the ref
            wasOpenRef.current = false;
        }
    }, [isOpen, initialContent]);

    // Use currentContent for display, with fallback to 'main'
    const displayContent = currentContent || 'main';

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
    const contentKey = getContentKey(displayContent);

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
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen && (
                        <motion.div
                            key="main-fallback"
                            custom={directionRef.current}
                            variants={contentVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={transition}
                            style={{ width: '100%' }}
                        >
                            {fallbackContent}
                        </motion.div>
                    )}
                </AnimatePresence>
            </BaseModal>
        );
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isOpen && (
                    <motion.div
                        key={contentKey || 'main'}
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
