import { GridItem, useDisclosure } from '@chakra-ui/react';
import { IoPlanet } from 'react-icons/io5';
import { ConnectionButton, EcosystemModal } from '@/components';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    privySocialLoginEnabled: boolean;
};

export const EcosystemButton = ({ isDark, privySocialLoginEnabled }: Props) => {
    const { t } = useTranslation();
    const ecosystemModal = useDisclosure();

    return (
        <>
            <GridItem colSpan={privySocialLoginEnabled ? 1 : 2} w={'full'}>
                <ConnectionButton
                    isDark={isDark}
                    onClick={ecosystemModal.onOpen}
                    icon={IoPlanet}
                    text={!privySocialLoginEnabled ? t('Ecosystem') : undefined}
                />
            </GridItem>

            <EcosystemModal
                isOpen={ecosystemModal.isOpen}
                onClose={ecosystemModal.onClose}
            />
        </>
    );
};
