'use client';

import { BaseModal } from '@/components/common';
import { EcosystemContent } from './EcosystemContent';
import { PrivyAppInfo } from '@/types';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
};

export const EcosystemModal = ({
    isOpen,
    onClose,
    appsInfo,
    isLoading,
}: Props) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            backdropFilter={'blur(3px)'}
        >
            <EcosystemContent
                onClose={onClose}
                appsInfo={appsInfo}
                isLoading={isLoading}
            />
        </BaseModal>
    );
};
