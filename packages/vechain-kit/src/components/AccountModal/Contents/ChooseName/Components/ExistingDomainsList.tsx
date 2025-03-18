import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    Icon,
    List,
    ListItem,
    Tag,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { useWalletMetadata } from '@/hooks/api/wallet/useWalletMetadata';
import { AccountAvatar } from '@/components/common';
import { getPicassoImage } from '@/utils';

type ExistingDomainsListProps = {
    domains: { name: string }[];
    onDomainSelect: (domain: string) => void;
    isLoading?: boolean;
};

const DomainListItem = ({
    domain,
    isCurrentDomain,
    onSelect,
}: {
    domain: { name: string };
    isCurrentDomain: boolean;
    onSelect: (name: string) => void;
}) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    const { connection } = useWallet();
    const { t } = useTranslation();
    const metadata = useWalletMetadata(domain.name, connection.network);

    return (
        <ListItem
            key={domain.name}
            p={4}
            bg={isDark ? '#1f1f1e' : 'white'}
            borderRadius="xl"
            cursor={isCurrentDomain ? 'default' : 'pointer'}
            opacity={isCurrentDomain ? 0.7 : 1}
            border={`1px solid ${isDark ? '#2d2d2d' : '#eaeaea'}`}
            _hover={{
                bg: isCurrentDomain
                    ? isDark
                        ? '#1f1f1e'
                        : 'white'
                    : isDark
                    ? '#252525'
                    : 'gray.50',
                borderColor: isDark ? '#3d3d3d' : '#dedede',
            }}
            onClick={() => !isCurrentDomain && onSelect(domain.name)}
            transition="all 0.2s"
        >
            <HStack spacing={3} align="center">
                <AccountAvatar
                    props={{
                        width: '40px',
                        height: '40px',
                        src: metadata.image ?? getPicassoImage(domain.name),
                        alt: domain.name,
                    }}
                />

                <VStack align="start" spacing={0} flex={1}>
                    <Text
                        color={isDark ? 'whiteAlpha.900' : 'gray.700'}
                        fontSize="md"
                        fontWeight="500"
                    >
                        {domain.name}
                    </Text>
                    {isCurrentDomain && (
                        <Text
                            fontSize="sm"
                            color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                        >
                            {t('Current domain')}
                        </Text>
                    )}
                </VStack>

                {isCurrentDomain && (
                    <Tag
                        size="sm"
                        bg={isDark ? '#ffffff0a' : 'whiteAlpha.100'}
                        color={isDark ? 'whiteAlpha.900' : 'blackAlpha.600'}
                        px={3}
                        py={1}
                        borderRadius="full"
                    >
                        {t('Current')}
                    </Tag>
                )}
            </HStack>
        </ListItem>
    );
};

export const ExistingDomainsList = ({
    domains,
    onDomainSelect,
    isLoading,
}: ExistingDomainsListProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { account } = useWallet();

    // avoid flickering after loading by returning null, so if no domains are found, it will not show the accordion
    if (domains.length === 0 || isLoading) {
        return null;
    }

    return (
        <Accordion allowToggle>
            <AccordionItem border="none">
                {({ isExpanded }) => (
                    <>
                        <AccordionButton
                            bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
                            borderRadius="xl"
                            _hover={{
                                bg: isDark ? 'whiteAlpha.100' : 'gray.100',
                            }}
                            opacity={isLoading ? 0.7 : 1}
                            transition="all 0.2s"
                            disabled={isLoading}
                        >
                            <Box flex="1" textAlign="left" py={2}>
                                <Text fontWeight="500">
                                    {isLoading
                                        ? t('Loading your domains...')
                                        : `${t('Your existing domains')} (${
                                              domains.length
                                          })`}
                                </Text>
                            </Box>
                            <Icon
                                as={isExpanded ? IoChevronUp : IoChevronDown}
                                fontSize="20px"
                                opacity={0.5}
                            />
                        </AccordionButton>
                        <AccordionPanel pb={4} pt={2}>
                            <List spacing={2}>
                                {domains.map((domain) => (
                                    <DomainListItem
                                        key={domain.name}
                                        domain={domain}
                                        isCurrentDomain={
                                            domain.name === account?.domain
                                        }
                                        onSelect={onDomainSelect}
                                    />
                                ))}
                            </List>
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
};
