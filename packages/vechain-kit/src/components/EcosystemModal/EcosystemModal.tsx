'use client';

import { BaseModal } from '@/components/common';
import { EcosystemContent } from './EcosystemContent';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const EcosystemModal = ({ isOpen, onClose }: Props) => {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <EcosystemContent onClose={onClose} />
        </BaseModal>
    );
};
