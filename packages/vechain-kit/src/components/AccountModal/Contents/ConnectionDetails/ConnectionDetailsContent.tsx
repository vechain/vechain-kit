import { ModalBody, ModalFooter, ModalHeader } from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
    ModalCloseButton,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';
import { ConnectionCard, WalletSecuredBy } from './Components';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache() ?? undefined;

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Connection Details')}</ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        onGoBack();
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <ConnectionCard connectionCache={connectionCache} />
                <WalletSecuredBy />
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
