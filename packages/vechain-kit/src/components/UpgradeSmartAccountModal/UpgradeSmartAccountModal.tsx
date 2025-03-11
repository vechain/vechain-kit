'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/common';
import {
    SuccessfulOperationContent,
    SuccessfulOperationContentProps,
} from './Contents/SuccessfulOperationContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccountContent';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type UpgradeSmartAccountModalContentsTypes =
    | 'upgrade-smart-account'
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      };

export const UpgradeSmartAccountModal = ({ isOpen, onClose }: Props) => {
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
        >
            {renderContent()}
        </BaseModal>
    );
};
