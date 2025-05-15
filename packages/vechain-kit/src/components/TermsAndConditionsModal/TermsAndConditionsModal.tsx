'use client';

import { BaseModal } from '@/components/common';
import { TermsAndConditionsContent } from './TermsAndConditionsContent';
import { TermsAndConditions } from '@/types';
type Props = {
    isOpen: boolean;
    onCancel: () => void;
    onAgree: (terms: TermsAndConditions | TermsAndConditions[]) => void;
};

export type TermsAndConditionsModalContentsTypes = 'terms-and-conditions';

export const TermsAndConditionsModal = ({
    isOpen,
    onCancel,
    onAgree,
}: Props) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => {}} //Modal is not closable
            allowExternalFocus={true}
            blockScrollOnMount={true}
            isCloseable={false}
        >
            <TermsAndConditionsContent onAgree={onAgree} onCancel={onCancel} />
        </BaseModal>
    );
};
