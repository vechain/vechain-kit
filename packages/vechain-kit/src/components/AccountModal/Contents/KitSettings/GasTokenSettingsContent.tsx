import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Switch,
    FormControl,
    FormLabel,
    Button,
    useToast,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useTranslation } from 'react-i18next';
import { MdRefresh } from 'react-icons/md';
import { AccountModalContentTypes } from '../../Types';
import { useGasTokenSelection } from '@/hooks';
import { GasTokenType } from '@/types/gasToken';
import { GasTokenDragList } from './GasTokenDragList';
import { useCallback } from 'react';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const GasTokenSettingsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const toast = useToast();
    const {
        preferences,
        updatePreferences,
        reorderTokenPriority,
        toggleTokenExclusion,
        resetToDefaults,
    } = useGasTokenSelection();

    const handleReorder = useCallback(
        (newOrder: GasTokenType[]) => {
            reorderTokenPriority(newOrder);
            Analytics.settings.gasTokenReordered();
        },
        [reorderTokenPriority],
    );


    const handleToggleCostBreakdown = useCallback(
        (checked: boolean) => {
            updatePreferences({ showCostBreakdown: checked });
            Analytics.settings.gasTokenCostBreakdownToggled(checked);
        },
        [updatePreferences],
    );

    const handleResetDefaults = useCallback(() => {
        resetToDefaults();
        toast({
            title: t('Settings Reset'),
            description: t('Gas token preferences have been reset to defaults'),
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        Analytics.settings.gasTokenSettingsReset();
    }, [resetToDefaults, toast, t]);

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
                                'Configure your preferred tokens for gas fee payments when developer delegation is unavailable.',
                            )}
                        </Text>
                    </VStack>

                    {/* Token Priority List */}
                    <VStack w="full" align="start" spacing={3}>
                        <Text fontSize="md" fontWeight="semibold">
                            {t('Token Priority Order')}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
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

                        <Text fontSize="xs" color="gray.500" fontStyle="italic">
                            {t(
                                'Note: Only tokens supported by the Generic Delegator will be available for use.',
                            )}
                        </Text>
                    </VStack>

                    {/* Settings Switches */}
                    <VStack w="full" spacing={4} align="start">
                        <Text fontSize="md" fontWeight="semibold">
                            {t('Transaction Preferences')}
                        </Text>


                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="cost-breakdown" mb="0" flex="1">
                                <VStack align="start" spacing={1}>
                                    <Text>{t('Show gas cost breakdown')}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                        {t(
                                            'Display detailed cost information including service fees',
                                        )}
                                    </Text>
                                </VStack>
                            </FormLabel>
                            <Switch
                                id="cost-breakdown"
                                isChecked={preferences.showCostBreakdown}
                                onChange={(e) =>
                                    handleToggleCostBreakdown(e.target.checked)
                                }
                                colorScheme="blue"
                            />
                        </FormControl>
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter pt={4}>
                <Button
                    leftIcon={<MdRefresh />}
                    variant="outline"
                    size="sm"
                    onClick={handleResetDefaults}
                >
                    {t('Reset to Defaults')}
                </Button>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
