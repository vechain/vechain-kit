'use client';

import { useState, useEffect } from 'react';
import { MainContent } from './Contents/MainContent';
import { BaseModal } from '@/components/common';
import { FAQContent } from '../AccountModal';
import { EcosystemContent } from './Contents/EcosystemContent';
import { PrivyAppInfo } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type ConnectModalContentsTypes =
    | 'main'
    | 'email-verification'
    | 'faq'
    | {
          type: 'ecosystem';
          props: { appsInfo: PrivyAppInfo[]; isLoading: boolean };
      };

export const ConnectModal = ({ isOpen, onClose }: Props) => {
    const [currentContent, setCurrentContent] =
        useState<ConnectModalContentsTypes>('main');

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('main');
        }
    }, [isOpen]);

    const renderContent = () => {
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
                        />
                    );
            }
        }

        return null;
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
