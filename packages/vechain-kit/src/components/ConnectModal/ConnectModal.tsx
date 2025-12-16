'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent } from './Contents/EcosystemContent';
import { PrivyAppInfo } from '@/types';
import {
    contentVariants,
    transition,
    getContentKey,
} from '@/components/common';

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
          props: { appsInfo: PrivyAppInfo[]; isLoading: boolean };
      };

export const ConnectModal = ({
    isOpen,
    onClose,
    initialContent = 'main',
}: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>('main');
    const previousContentRef = useRef<ConnectModalContentsTypes | null>(null);
    const directionRef = useRef<'forward' | 'backward'>('forward');
    const wasOpenRef = useRef(false);

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
    }, [isOpen, initialContent]);

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

    const renderContent = () => {
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
                        />
                    );
            }
        }

        return null;
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
