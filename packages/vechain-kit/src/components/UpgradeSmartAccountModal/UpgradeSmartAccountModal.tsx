'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/common';
import {
    SuccessfulOperationContent,
    SuccessfulOperationContentProps,
} from './Contents/SuccessfulOperationContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccountContent';
import { ThemeTypings } from '@chakra-ui/react';

export type UpgradeSmartAccountModalStyle = {
    accentColor?: string;
    modalSize?: ThemeTypings['components']['Modal']['sizes'];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    style?: UpgradeSmartAccountModalStyle;
};

export type UpgradeSmartAccountModalContentsTypes =
    | 'upgrade-smart-account'
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      };

export const UpgradeSmartAccountModal = ({ isOpen, onClose, style }: Props) => {
    const [currentContent, setCurrentContent] =
        useState<UpgradeSmartAccountModalContentsTypes>(
            'upgrade-smart-account',
        );

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('upgrade-smart-account');
        }
    }, [isOpen]);

    const renderContent = () => {
        if (typeof currentContent === 'object') {
            switch (currentContent.type) {
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent {...currentContent.props} />
                    );
            }
        } else if (currentContent === 'upgrade-smart-account') {
            return (
                <UpgradeSmartAccountContent
                    setCurrentContent={setCurrentContent}
                    handleClose={onClose}
                    style={style}
                />
            );
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            size={style?.modalSize}
        >
            {renderContent()}
        </BaseModal>
    );
};
