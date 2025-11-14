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
import { ens_normalize } from '@adraffy/ens-normalize';

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
    const [name, setName] = useState(ens_normalize(initialName));
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
        data: vetDomainsOfAddress,
        isLoading: isVetDomainsOfAddressLoading,
    } = useGetDomainsOfAddress(account?.address, '');

    const isFetchingDomainInfo =
        isEnsCheckLoading || isDomainInfoLoading || isProtectedLoading;

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
                    fullDomain: name + '.veworld.vet',
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
        const domainType = parts.length > 2 ? `${parts[1]}.${parts[2]}` : 'vet';

        setCurrentContent({
            type: 'choose-name-summary',
            props: {
                fullDomain: selectedDomain,
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
                fullDomain: '',
                domainType: '',
                isOwnDomain: false,
                isUnsetting: true,
                setCurrentContent,
                initialContentSource,
            },
        });
    };

    const handleBack = () => {
        setCurrentContent(initialContentSource);
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Choose Name')}
                </ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    <ExistingDomainsList
                        domains={vetDomainsOfAddress?.domains || []}
                        onDomainSelect={handleDomainSelect}
                        onUnsetDomain={handleUnsetDomain}
                        isLoading={isVetDomainsOfAddressLoading}
                    />

                    <InputGroup size="lg">
                        <Input
                            placeholder={t('Enter your name')}
                            value={name}
                            onChange={(e) => {
                                setName(ens_normalize(e.target.value));
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
                            data-testid="domain-input"
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
                        <Text
                            color="#ef4444"
                            fontSize="sm"
                            data-testid="domain-availability-status"
                        >
                            {error}
                        </Text>
                    )}

                    {!error && hasInteracted && name.length >= 3 && (
                        <Text
                            fontSize="sm"
                            color={isAvailable ? 'green.500' : '#ef4444'}
                            fontWeight="500"
                            data-testid="domain-availability-status"
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
                    data-testid="continue-button"
                >
                    {t('Continue')}
                </Button>
            </ModalFooter>
        </>
    );
};
