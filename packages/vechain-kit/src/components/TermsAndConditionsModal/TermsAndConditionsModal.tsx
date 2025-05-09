'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/common';
import { TermsAndConditionsContent } from './Contents/TermsAndConditionsContent';

type Props = {
    isOpen: boolean;
    onCancel: () => void;
    onAgree: () => void;
};

export type TermsAndConditionsModalContentsTypes = 'terms-and-conditions';

export const TermsAndConditionsModal = ({
    isOpen,
    onCancel,
    onAgree,
}: Props) => {
    const [currentContent, setCurrentContent] =
        useState<TermsAndConditionsModalContentsTypes>('terms-and-conditions');

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('terms-and-conditions');
        }
    }, [isOpen]);

    const renderContent = () => {
        if (currentContent === 'terms-and-conditions') {
            return (
                <TermsAndConditionsContent
                    onAgree={onAgree}
                    onCancel={onCancel}
                />
            );
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => {}} //Modal is not closable
            allowExternalFocus={true}
            blockScrollOnMount={true}
            size="md"
            isCloseable={false}
        >
            {renderContent()}
        </BaseModal>
    );
};
