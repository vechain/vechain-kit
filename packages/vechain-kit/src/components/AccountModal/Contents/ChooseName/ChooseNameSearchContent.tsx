import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Input,
    InputGroup,
    Box,
    Button,
    ModalFooter,
    InputRightElement,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useState, useEffect } from 'react';
import {
    useEnsRecordExists,
    useWallet,
    useVechainDomain,
    useIsDomainProtected,
    useGetDomainsOfAddress,
} from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { ExistingDomainsList } from './Components/ExistingDomainsList';
import { Analytics } from '@/utils/mixpanelClientInstance';

export type ChooseNameSearchContentProps = {
    name: string;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameSearchContent = ({
    name: initialName,
    setCurrentContent,
    initialContentSource = 'settings',
}: ChooseNameSearchContentProps) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { darkMode: isDark } = useVeChainKitConfig();
    const [name, setName] = useState(initialName);
    const [error, setError] = useState<string | null>(null);
    const [isOwnDomain, setIsOwnDomain] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const { data: ensRecordExists, isLoading: isEnsCheckLoading } =
        useEnsRecordExists(name);
    const { data: domainInfo, isLoading: isDomainInfoLoading } =
        useVechainDomain(`${name}.veworld.vet`);
    const { data: isProtected, isLoading: isProtectedLoading } =
        useIsDomainProtected(name);

    const {
        data: veworldDomainsOfAddress,
        isLoading: isVeWorldDomainsOfAddressLoading,
    } = useGetDomainsOfAddress(account?.address, 'veworld.vet');

    const {
        data: vetDomainsOfAddress,
        isLoading: isVetDomainsOfAddressLoading,
    } = useGetDomainsOfAddress(account?.address, 'vet');

    const isLoadingOwnedDomains =
        isVeWorldDomainsOfAddressLoading || isVetDomainsOfAddressLoading;

    const isFetchingDomainInfo =
        isEnsCheckLoading || isDomainInfoLoading || isProtectedLoading;

    const allUserDomains = [
        ...(veworldDomainsOfAddress?.domains || []),
        ...(vetDomainsOfAddress?.domains || []),
    ];

    useEffect(() => {
        if (!hasInteracted) return;

        // Add validation for special characters, spaces, and periods
        const hasSpecialChars = /[^a-zA-Z0-9-]|\s/.test(name);

        if (name.length < 3) {
            setError(t('Name must be at least 3 characters long'));
            setIsAvailable(false);
            setIsOwnDomain(false);
        } else if (hasSpecialChars) {
            setError(t('Only letters, numbers, and hyphens are allowed'));
            setIsAvailable(false);
            setIsOwnDomain(false);
        } else if (isProtected) {
            setError(t('This domain is protected'));
            setIsAvailable(false);
            setIsOwnDomain(false);
        } else if (ensRecordExists) {
            // Check if the domain belongs to the current user
            const isOwnDomain =
                domainInfo?.address?.toLowerCase() ===
                account?.address?.toLowerCase();

            if (isOwnDomain) {
                setError(null);
                setIsAvailable(true);
                setIsOwnDomain(true);
            } else {
                setError(t('This domain is already taken'));
                setIsAvailable(false);
                setIsOwnDomain(false);
            }
        } else if (!isEnsCheckLoading) {
            setError(null);
            setIsAvailable(true);
            setIsOwnDomain(false);
        }

        if (name.length >= 3 && !isFetchingDomainInfo) {
            Analytics.nameSelection.searched(name, isAvailable);
        }
    }, [
        name,
        hasInteracted,
        ensRecordExists,
        isEnsCheckLoading,
        domainInfo,
        account?.address,
        isProtected,
        isAvailable,
        isFetchingDomainInfo,
    ]);

    const handleContinue = () => {
        if (isAvailable && !error) {
            setCurrentContent({
                type: 'choose-name-summary',
                props: {
                    name,
                    isOwnDomain,
                    setCurrentContent,
                    initialContentSource,
                },
            });
        }
    };

    const handleDomainSelect = (selectedDomain: string) => {
        // Extract the domain type and base name
        const parts = selectedDomain.split('.');
        const baseName = parts[0];
        const domainType = parts.length > 2 ? `${parts[1]}.${parts[2]}` : 'vet';

        setCurrentContent({
            type: 'choose-name-summary',
            props: {
                name: baseName,
                domainType: domainType,
                isOwnDomain: true,
                setCurrentContent,
                initialContentSource,
            },
        });
    };

    const handleUnsetDomain = () => {
        setCurrentContent({
            type: 'choose-name-summary',
            props: {
                name: '',
                domainType: '',
                isOwnDomain: false,
                isUnsetting: true,
                setCurrentContent,
                initialContentSource,
            },
        });
    };

    const handleClose = () => {
        Analytics.nameSelection.dropOff('search', {
            isError: false,
            name,
            error: 'modal_closed',
        });
    };

    const handleBack = () => {
        Analytics.nameSelection.dropOff('search', {
            isError: false,
            name,
            reason: 'back_button',
        });
        setCurrentContent(initialContentSource);
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Choose Name')}</ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton onClick={handleClose} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    <ExistingDomainsList
                        domains={allUserDomains}
                        onDomainSelect={handleDomainSelect}
                        onUnsetDomain={handleUnsetDomain}
                        isLoading={isLoadingOwnedDomains}
                    />

                    <InputGroup size="lg">
                        <Input
                            placeholder={t('Enter your name')}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (!hasInteracted) setHasInteracted(true);
                            }}
                            paddingRight="120px"
                            fontSize="lg"
                            height="60px"
                            bg={isDark ? '#00000038' : 'white'}
                            border={`1px solid ${
                                isDark ? '#ffffff29' : '#ebebeb'
                            }`}
                            _hover={{
                                border: `1px solid ${
                                    isDark ? '#ffffff40' : '#e0e0e0'
                                }`,
                            }}
                            _focus={{
                                border: `1px solid ${
                                    isDark ? '#ffffff60' : '#d0d0d0'
                                }`,
                                boxShadow: 'none',
                            }}
                            isInvalid={!!error}
                        />
                        <InputRightElement
                            width="auto"
                            paddingRight="12px"
                            h={'full'}
                        >
                            <Box
                                mr={4}
                                fontSize="sm"
                                color={
                                    isDark ? 'whiteAlpha.800' : 'blackAlpha.600'
                                }
                            >
                                .veworld.vet
                            </Box>
                        </InputRightElement>
                    </InputGroup>

                    {error && hasInteracted && (
                        <Text color="#ef4444" fontSize="sm">
                            {error}
                        </Text>
                    )}

                    {!error && hasInteracted && name.length >= 3 && (
                        <Text
                            fontSize="sm"
                            color={isAvailable ? 'green.500' : '#ef4444'}
                            fontWeight="500"
                        >
                            {isOwnDomain
                                ? t('YOU OWN THIS')
                                : isAvailable
                                ? t('AVAILABLE')
                                : t('UNAVAILABLE')}
                        </Text>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    isDisabled={
                        !isAvailable ||
                        !!error ||
                        isProtected ||
                        isFetchingDomainInfo
                    }
                    onClick={handleContinue}
                >
                    {t('Continue')}
                </Button>
            </ModalFooter>
        </>
    );
};
