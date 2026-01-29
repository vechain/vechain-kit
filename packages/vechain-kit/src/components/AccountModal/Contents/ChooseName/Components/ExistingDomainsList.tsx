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
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp, LuTrash2 } from 'react-icons/lu';
import { useWallet } from '../../../../../hooks';
import { useWalletMetadata } from '../../../../../hooks/api/wallet/useWalletMetadata';
import { AccountAvatar } from '../../../../common';
import { getPicassoImage, humanDomain } from '../../../../../utils';

type ExistingDomainsListProps = {
    domains: { name: string }[];
    onDomainSelect: (domain: string) => void;
    onUnsetDomain: () => void;
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
    const { connection } = useWallet();
    const { t } = useTranslation();
    const metadata = useWalletMetadata(domain.name, connection.network);

    const cardBg = useToken('colors', 'vechain-kit-card');
    const cardBgHover = useToken('colors', 'vechain-kit-card-hover');
    const borderColor = useToken('colors', 'vechain-kit-border');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const buttonBg = useToken('colors', 'vechain-kit-card');

    return (
        <ListItem
            key={domain.name}
            p={4}
            bg={cardBg}
            borderRadius="xl"
            cursor={isCurrentDomain ? 'default' : 'pointer'}
            opacity={isCurrentDomain ? 0.7 : 1}
            border={`1px solid ${borderColor}`}
            _hover={{
                bg: isCurrentDomain ? cardBgHover : cardBg,
                borderColor: borderColor,
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
                    <Text color={textPrimary} fontSize="md" fontWeight="500">
                        {humanDomain(domain.name, 24, 0)}
                    </Text>
                    {isCurrentDomain && (
                        <Text fontSize="sm" color={textSecondary}>
                            {t('Current domain')}
                        </Text>
                    )}
                </VStack>

                {isCurrentDomain && (
                    <Tag
                        size="sm"
                        bg={buttonBg}
                        color={textPrimary}
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

const UnsetDomainListItem = ({ onUnset }: { onUnset: () => void }) => {
    const cardBg = useToken('colors', 'vechain-kit-card');
    const cardBgHover = useToken('colors', 'vechain-kit-card-hover');
    const borderColor = useToken('colors', 'vechain-kit-border');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const errorColor = useToken('colors', 'vechain-kit-error');

    const { t } = useTranslation();

    return (
        <ListItem
            key={'unset-domain-list-item'}
            p={4}
            bg={cardBg}
            borderRadius="xl"
            cursor={'pointer'}
            opacity={1}
            border={`1px solid ${borderColor}`}
            _hover={{
                bg: cardBgHover,
                borderColor: borderColor,
                color: 'red.400',
            }}
            onClick={onUnset}
            transition="all 0.2s"
            role="button"
            aria-label={t('Unset current domain')}
        >
            <HStack spacing={3} align="center">
                <Box
                    width="40px"
                    height="40px"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={cardBg}
                >
                    <Icon as={LuTrash2} fontSize="18px" color={errorColor} />
                </Box>
                <VStack align="start" spacing={0} flex={1}>
                    <Text color={textPrimary} fontSize="md" fontWeight="500">
                        {t('Unset current domain')}
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                        {t('Remove your current domain name')}
                    </Text>
                </VStack>
            </HStack>
        </ListItem>
    );
};

export const ExistingDomainsList = ({
    domains,
    onDomainSelect,
    onUnsetDomain,
    isLoading,
}: ExistingDomainsListProps) => {
    const { t } = useTranslation();
    const { account } = useWallet();

    const cardBg = useToken('colors', 'vechain-kit-card');
    const cardBgHover = useToken('colors', 'vechain-kit-card-hover');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
                            bg={cardBg}
                            borderRadius="xl"
                            _hover={{
                                bg: cardBgHover,
                            }}
                            opacity={isLoading ? 0.7 : 1}
                            transition="all 0.2s"
                            disabled={isLoading}
                        >
                            <Box flex="1" textAlign="left" py={2}>
                                <Text fontWeight="500" color={textPrimary}>
                                    {isLoading
                                        ? t('Loading your domains...')
                                        : `${t('Your existing domains')} (${
                                              domains.length
                                          })`}
                                </Text>
                            </Box>
                            <Icon
                                as={isExpanded ? LuChevronUp : LuChevronDown}
                                fontSize="20px"
                                color={textSecondary}
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
                                {account?.domain && (
                                    <UnsetDomainListItem
                                        onUnset={onUnsetDomain}
                                    />
                                )}
                            </List>
                        </AccordionPanel>
                    </>
                )}
            </AccordionItem>
        </Accordion>
    );
};
