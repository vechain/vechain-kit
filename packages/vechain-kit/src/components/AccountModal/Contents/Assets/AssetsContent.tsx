import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { TokenWithValue } from '@/hooks';
import { AccountModalContentTypes } from '../../Types';
import { AssetsHeader } from './Components/AssetsHeader';
import {
    AssetsTabIndex,
    AssetsTabs,
} from './Components/AssetsTabs';
import { TokensTab } from './Components/TokensTab';
import { StakingTab } from './Components/StakingTab';

export type AssetsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AssetsContent = ({ setCurrentContent }: AssetsContentProps) => {
    const { t } = useTranslation();
    const { allowCustomTokens } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();
    const [tabIndex, setTabIndex] = useState<AssetsTabIndex>(0);

    const handleTokenSelect = (token: TokenWithValue) => {
        setCurrentContent({
            type: 'token-detail',
            props: { setCurrentContent, token },
        });
    };

    const handleSend = () => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                onBack: () => setCurrentContent('assets'),
            },
        });
    };

    const handleSwap = () => {
        setCurrentContent({
            type: 'swap-token',
            props: {
                setCurrentContent,
                onBack: () => setCurrentContent('assets'),
            },
        });
    };

    const handleHistory = () => {
        setCurrentContent({
            type: 'transaction-history',
            props: { setCurrentContent },
        });
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Assets')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('main')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        <AssetsHeader
                            onSend={handleSend}
                            onSwap={handleSwap}
                            onHistory={handleHistory}
                        />

                        <AssetsTabs
                            tabIndex={tabIndex}
                            onTabChange={setTabIndex}
                            tokenPanel={
                                <TokensTab onSelect={handleTokenSelect} />
                            }
                            stakingPanel={<StakingTab />}
                            onManageTokens={
                                allowCustomTokens
                                    ? () =>
                                          setCurrentContent('add-custom-token')
                                    : undefined
                            }
                        />
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
