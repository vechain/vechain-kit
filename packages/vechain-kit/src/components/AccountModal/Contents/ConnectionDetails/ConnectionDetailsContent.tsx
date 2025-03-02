import {
    ModalBody,
    ModalCloseButton,
    VStack,
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
import { useVeChainKitConfig } from '@/providers';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const { darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();

    const connectionCache = getConnectionCache();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Connection Details')}
                </ModalHeader>

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

                {connection.isConnectedWithDappKit && (
                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        <DappKitConnectionCard />
                    </VStack>
                )}

                {connection.isConnectedWithPrivy && <WalletSecuredBy />}
            </ModalBody>
            <ModalFooter></ModalFooter>
        </ScrollToTopWrapper>
    );
};
