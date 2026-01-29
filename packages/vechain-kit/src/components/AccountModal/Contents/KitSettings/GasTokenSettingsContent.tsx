import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalHeader,
    Text,
    Alert,
    AlertIcon,
    AlertDescription,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '../../../common';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';
import { useGasTokenSelection } from '../../../../hooks';
import type { GasTokenType } from '../../../../types/gasToken';
import { GasTokenDragList } from './GasTokenDragList';
import { useCallback } from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const GasTokenSettingsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { preferences, reorderTokenPriority, toggleTokenExclusion } =
        useGasTokenSelection();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleReorder = useCallback(
        (newOrder: GasTokenType[]) => {
            reorderTokenPriority(newOrder);
        },
        [reorderTokenPriority],
    );

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Gas Token Preferences')}</ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
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
                        <Text
                            fontSize="sm"
                            color={textSecondary}
                            textAlign="center"
                        >
                            {t(
                                'Choose which tokens to use for transaction fees when the app is not covering them.',
                            )}
                        </Text>
                    </VStack>

                    {/* Warning when all tokens are disabled */}
                    {preferences.availableGasTokens.length === 0 && (
                        <Alert status="warning" borderRadius="md">
                            <AlertIcon />
                            <AlertDescription
                                fontSize="sm"
                                color={textSecondary}
                            >
                                {t(
                                    'You must enable at least one token to perform transactions. Without any enabled tokens, you will not be able to pay for gas fees.' as any,
                                )}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Token Priority List */}
                    <VStack w="full" align="start" spacing={3}>
                        <Text
                            fontSize="md"
                            fontWeight="semibold"
                            color={textPrimary}
                        >
                            {t('Token Priority Order')}
                        </Text>
                        <Text fontSize="sm" color={textSecondary}>
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
