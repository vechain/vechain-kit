import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalHeader,
    Text,
    Alert,
    AlertIcon,
    AlertDescription,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';
import { useGasTokenSelection } from '@/hooks';
import { GasTokenType } from '@/types/gasToken';
import { GasTokenDragList } from './GasTokenDragList';
import { useCallback } from 'react';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const GasTokenSettingsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { preferences, reorderTokenPriority, toggleTokenExclusion } =
        useGasTokenSelection();

    const { darkMode: isDark } = useVeChainKitConfig();

    const handleReorder = useCallback(
        (newOrder: GasTokenType[]) => {
            reorderTokenPriority(newOrder);
            Analytics.settings.gasTokenReordered();
        },
        [reorderTokenPriority],
    );

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Gas Token Preferences')}</ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('general-settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w="full">
                <VStack
                    justify="center"
                    spacing={6}
                    align="flex-start"
                    w="full"
                >
                    <VStack w="full" justifyContent="center" spacing={3} mb={3}>
                        <Text fontSize="sm" opacity={0.7} textAlign="center">
                            {t(
                                'Choose which tokens to use for transaction fees when the app is not covering them.',
                            )}
                        </Text>
                    </VStack>

                    {/* Warning when all tokens are disabled */}
                    {preferences.availableGasTokens.length === 0 && (
                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription fontSize="sm">
                                {t(
                                    'You must enable at least one token to perform transactions. Without any enabled tokens, you will not be able to pay for gas fees.' as any,
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Token Priority List */}
                    <VStack w="full" align="start" spacing={3}>
                        <Text fontSize="md" fontWeight="semibold">
                            {t('Token Priority Order')}
                        </Text>
                        <Text
                            fontSize="sm"
                            color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                        >
                            {t(
                                'Drag to reorder. The system will automatically use the highest priority token with sufficient balance.',
                            )}
                        </Text>

                        <GasTokenDragList
                            tokens={preferences.tokenPriority}
                            excludedTokens={preferences.excludedTokens}
                            onReorder={handleReorder}
                            onToggleExclusion={toggleTokenExclusion}
                        />
                    </VStack>
                </VStack>
            </ModalBody>
        </ScrollToTopWrapper>
    );
};
