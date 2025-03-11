import {
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache, useWallet } from '@/hooks';
import {
    CrossAppConnectionCard,
    DappKitConnectionCard,
    PrivyConnectionCard,
    WalletSecuredBy,
} from './Components';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const { connection } = useWallet();

    const connectionCache = getConnectionCache();

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
                {connection.isConnectedWithCrossApp && connectionCache && (
                    <CrossAppConnectionCard connectionCache={connectionCache} />
                )}

                {connection.isConnectedWithSocialLogin && (
                    <PrivyConnectionCard />
                )}

                {connection.isConnectedWithDappKit && <DappKitConnectionCard />}

                {connection.isConnectedWithPrivy && <WalletSecuredBy />}
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
