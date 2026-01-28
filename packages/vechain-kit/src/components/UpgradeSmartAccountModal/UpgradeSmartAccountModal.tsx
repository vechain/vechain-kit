'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '../common';
import { SuccessfulOperationContent } from './Contents/SuccessfulOperationContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccountContent';
// Import types from centralized location to avoid circular dependencies
import type {
    UpgradeSmartAccountModalStyle,
    UpgradeSmartAccountModalContentsTypes,
} from '../../types/modal';

// Re-export for backward compatibility - needed by internal components and hooks
export type {
    UpgradeSmartAccountModalStyle,
    UpgradeSmartAccountModalContentsTypes,
} from '../../types/modal';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    style?: UpgradeSmartAccountModalStyle;
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
