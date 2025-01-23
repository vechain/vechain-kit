import { usePrivy } from '@privy-io/react-auth';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Flex,
    Text,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import {
    FaGoogle,
    FaEnvelope,
    FaWallet,
    FaTwitter,
    FaPhone,
    FaSpotify,
    FaApple,
    FaInstagram,
    FaTiktok,
    FaGithub,
    FaLinkedin,
    FaTelegram,
    FaPlus,
} from 'react-icons/fa';
import { SiFarcaster } from 'react-icons/si';
import { ActionButton } from '@/components';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { IoIosFingerPrint } from 'react-icons/io';

type ConfirmUnlinkProps = {
    accountType: string;
    accountDescription: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmUnlink = ({
    accountType,
    accountDescription,
    isLoading,
    onConfirm,
    onCancel,
}: ConfirmUnlinkProps) => {
    const { t } = useTranslation();
    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="md" textAlign="center">
                {t(
                    'Are you sure you want to unlink {{accountType}} as a login method linked to {{accountDescription}}?',
                    {
                        accountType,
                        accountDescription,
                    },
                )}
            </Text>

            <VStack spacing={3} w="full">
                <Button
                    height="60px"
                    colorScheme="red"
                    w="full"
                    onClick={onConfirm}
                    isLoading={isLoading}
                >
                    {t('Remove Login Method')}
                </Button>
                <Button
                    isLoading={isLoading}
                    height="60px"
                    w="full"
                    onClick={onCancel}
                >
                    {t('Cancel')}
                </Button>
            </VStack>
        </VStack>
    );
};

type PrivyLinkedAccountsProps = {
    onBack: () => void;
};

export const PrivyLinkedAccounts = ({ onBack }: PrivyLinkedAccountsProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const [unlinkingAccount, setUnlinkingAccount] = useState<any>(null);
    const [showLinkOptions, setShowLinkOptions] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const [isLoadingUnlink, setIsLoadingUnlink] = useState(false);

    const {
        user,
        linkEmail,
        linkGoogle,
        linkTwitter,
        linkPhone,
        linkSpotify,
        linkApple,
        linkInstagram,
        linkTiktok,
        linkGithub,
        linkLinkedIn,
        linkTelegram,
        linkFarcaster,
        linkPasskey,
        unlinkEmail,
        unlinkGoogle,
        unlinkApple,
        unlinkSpotify,
        unlinkInstagram,
        unlinkTiktok,
        unlinkGithub,
        unlinkLinkedIn,
        unlinkTelegram,
        unlinkFarcaster,
        unlinkPhone,
        unlinkPasskey,
    } = usePrivy();

    const { privy } = useVeChainKitConfig();

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'google_oauth':
                return FaGoogle;
            case 'email':
                return FaEnvelope;
            case 'passkey':
                return IoIosFingerPrint;
            case 'wallet':
                return FaWallet;
            case 'twitter_oauth':
                return FaTwitter;
            case 'phone':
                return FaPhone;
            case 'spotify_oauth':
                return FaSpotify;
            case 'apple_oauth':
                return FaApple;
            case 'instagram_oauth':
                return FaInstagram;
            case 'tiktok_oauth':
                return FaTiktok;
            case 'github_oauth':
                return FaGithub;
            case 'linkedin_oauth':
                return FaLinkedin;
            case 'telegram':
                return FaTelegram;
            case 'farcaster':
                return SiFarcaster;
            default:
                return undefined;
        }
    };

    const canUnlink = () => {
        return user?.linkedAccounts && user?.linkedAccounts?.length > 1;
    };

    const handleUnlink = async (account: any) => {
        if (!canUnlink()) return;

        setIsLoadingUnlink(true);

        switch (account.type) {
            case 'google_oauth':
                await unlinkGoogle(account.subject);
                break;
            case 'email':
                await unlinkEmail(account.address);
                break;
            case 'passkey':
                await unlinkPasskey(account.subject);
                break;
            case 'phone':
                await unlinkPhone(account.number);
                break;
            case 'spotify_oauth':
                await unlinkSpotify(account.subject);
                break;
            case 'apple_oauth':
                await unlinkApple(account.subject);
                break;
            case 'instagram_oauth':
                await unlinkInstagram(account.subject);
                break;
            case 'tiktok_oauth':
                await unlinkTiktok(account.subject);
                break;
            case 'github_oauth':
                await unlinkGithub(account.subject);
                break;
            case 'linkedin_oauth':
                await unlinkLinkedIn(account.subject);
                break;
            case 'telegram':
                await unlinkTelegram(account.subject);
                break;
            case 'farcaster':
                await unlinkFarcaster(account.subject);
                break;
            default:
                break;
        }

        setIsLoadingUnlink(false);
        setUnlinkingAccount(null);
    };

    const getAccountDescription = (account: any) => {
        switch (account.type) {
            case 'google_oauth':
                return account.email;
            case 'email':
                return account.address;
            case 'passkey':
                return `${account.authenticatorName} - ${account.createdWithBrowser}`;
            case 'phone':
                return account.number;
            default:
                return '';
        }
    };

    const linkedAccountTypes =
        user?.linkedAccounts?.map((account) => account.type) || [];
    const availableLoginMethods = privy?.loginMethods || [];

    const canLinkGoogle =
        !linkedAccountTypes.includes('google_oauth') &&
        availableLoginMethods.includes('google');
    const canLinkEmail =
        !linkedAccountTypes.includes('email') &&
        availableLoginMethods.includes('email');
    const canLinkTwitter =
        !linkedAccountTypes.includes('twitter_oauth') &&
        availableLoginMethods.includes('twitter');
    const canLinkSms =
        !linkedAccountTypes.includes('phone') &&
        availableLoginMethods.includes('sms');
    const canLinkSpotify =
        !linkedAccountTypes.includes('spotify_oauth') &&
        availableLoginMethods.includes('spotify');
    const canLinkApple =
        !linkedAccountTypes.includes('apple_oauth') &&
        availableLoginMethods.includes('apple');
    const canLinkInstagram =
        !linkedAccountTypes.includes('instagram_oauth') &&
        availableLoginMethods.includes('instagram');
    const canLinkTiktok =
        !linkedAccountTypes.includes('tiktok_oauth') &&
        availableLoginMethods.includes('tiktok');
    const canLinkGithub =
        !linkedAccountTypes.includes('github_oauth') &&
        availableLoginMethods.includes('github');
    const canLinkLinkedin =
        !linkedAccountTypes.includes('linkedin_oauth') &&
        availableLoginMethods.includes('linkedin');
    const canLinkTelegram =
        !linkedAccountTypes.includes('telegram') &&
        availableLoginMethods.includes('telegram');
    const canLinkFarcaster =
        !linkedAccountTypes.includes('farcaster') &&
        availableLoginMethods.includes('farcaster');

    if (showLinkOptions) {
        return (
            <ScrollToTopWrapper>
                <StickyHeaderContainer>
                    <ModalHeader
                        fontSize={'md'}
                        fontWeight={'500'}
                        textAlign={'center'}
                        color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    >
                        {t('Add Login Method')}
                    </ModalHeader>
                    <ModalBackButton
                        onClick={() => setShowLinkOptions(false)}
                    />
                    <ModalCloseButton />
                </StickyHeaderContainer>
                <ModalBody>
                    <VStack spacing={3} align="stretch">
                        {canLinkGoogle && (
                            <ActionButton
                                title={t('Link Google Account')}
                                description={t(
                                    'Connect your Google account for easier access',
                                )}
                                onClick={() => linkGoogle()}
                                leftIcon={FaGoogle}
                            />
                        )}
                        {canLinkEmail && (
                            <ActionButton
                                title={t('Link Email Account')}
                                description={t(
                                    'Connect your email for easier access',
                                )}
                                onClick={() => linkEmail()}
                                leftIcon={FaEnvelope}
                                stacked={true}
                            />
                        )}
                        {canLinkTwitter && (
                            <ActionButton
                                title={t('Link Twitter Account')}
                                description={t(
                                    'Connect your Twitter account for easier access',
                                )}
                                onClick={() => linkTwitter()}
                                leftIcon={FaTwitter}
                            />
                        )}
                        {canLinkSms && (
                            <ActionButton
                                title={t('Link Phone Number')}
                                description={t(
                                    'Connect your phone number for easier access',
                                )}
                                onClick={() => linkPhone()}
                                leftIcon={FaPhone}
                            />
                        )}
                        {canLinkSpotify && (
                            <ActionButton
                                title={t('Link Spotify Account')}
                                description={t(
                                    'Connect your Spotify account for easier access',
                                )}
                                onClick={() => linkSpotify()}
                                leftIcon={FaSpotify}
                            />
                        )}
                        {canLinkApple && (
                            <ActionButton
                                title={t('Link Apple Account')}
                                description={t(
                                    'Connect your Apple account for easier access',
                                )}
                                onClick={() => linkApple()}
                                leftIcon={FaApple}
                            />
                        )}
                        {canLinkInstagram && (
                            <ActionButton
                                title={t('Link Instagram Account')}
                                description={t(
                                    'Connect your Instagram account for easier access',
                                )}
                                onClick={() => linkInstagram()}
                                leftIcon={FaInstagram}
                            />
                        )}
                        {canLinkTiktok && (
                            <ActionButton
                                title={t('Link TikTok Account')}
                                description={t(
                                    'Connect your TikTok account for easier access',
                                )}
                                onClick={() => linkTiktok()}
                                leftIcon={FaTiktok}
                            />
                        )}
                        {canLinkGithub && (
                            <ActionButton
                                title={t('Link GitHub Account')}
                                description={t(
                                    'Connect your GitHub account for easier access',
                                )}
                                onClick={() => linkGithub()}
                                leftIcon={FaGithub}
                            />
                        )}
                        {canLinkLinkedin && (
                            <ActionButton
                                title={t('Link LinkedIn Account')}
                                description={t(
                                    'Connect your LinkedIn account for easier access',
                                )}
                                onClick={() => linkLinkedIn()}
                                leftIcon={FaLinkedin}
                            />
                        )}
                        {canLinkTelegram && (
                            <ActionButton
                                title={t('Link Telegram Account')}
                                description={t(
                                    'Connect your Telegram account for easier access',
                                )}
                                onClick={() => linkTelegram()}
                                leftIcon={FaTelegram}
                            />
                        )}
                        {canLinkFarcaster && (
                            <ActionButton
                                title={t('Link Farcaster Account')}
                                description={t(
                                    'Connect your Farcaster account for easier access',
                                )}
                                onClick={() => linkFarcaster()}
                                leftIcon={SiFarcaster}
                            />
                        )}
                        {!canLinkGoogle &&
                            !canLinkEmail &&
                            !canLinkTwitter &&
                            !canLinkSms &&
                            !canLinkSpotify &&
                            !canLinkApple &&
                            !canLinkInstagram &&
                            !canLinkTiktok &&
                            !canLinkGithub &&
                            !canLinkLinkedin &&
                            !canLinkTelegram &&
                            !canLinkFarcaster && (
                                <Text
                                    fontSize="sm"
                                    textAlign="center"
                                    opacity={0.7}
                                >
                                    {t(
                                        'No additional accounts available to link',
                                    )}
                                </Text>
                            )}
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ScrollToTopWrapper>
        );
    }

    if (unlinkingAccount) {
        return (
            <ScrollToTopWrapper>
                <StickyHeaderContainer>
                    <ModalHeader
                        fontSize={'md'}
                        fontWeight={'500'}
                        textAlign={'center'}
                        color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    >
                        {t('Remove Login Method')}
                    </ModalHeader>
                    <ModalBackButton
                        onClick={() => setUnlinkingAccount(null)}
                    />
                    <ModalCloseButton />
                </StickyHeaderContainer>
                <ModalBody>
                    <ConfirmUnlink
                        accountType={unlinkingAccount.type}
                        accountDescription={getAccountDescription(
                            unlinkingAccount,
                        )}
                        isLoading={isLoadingUnlink}
                        onConfirm={() => handleUnlink(unlinkingAccount)}
                        onCancel={() => setUnlinkingAccount(null)}
                    />
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ScrollToTopWrapper>
        );
    }

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('Login methods')}
                </ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack spacing={3} align="stretch">
                    <VStack spacing={1} align="stretch" mb={5}>
                        <Text fontSize="sm" opacity={0.5}>
                            {t(
                                'These accounts are linked to your embedded wallet and can be used to login to your account.',
                            )}
                        </Text>
                        {showFullText && (
                            <Text fontSize="sm" opacity={0.5}>
                                {t(
                                    'Adding more linked accounts increases security against loss of access, but also introduces additional potential attack vectors. For enhanced security, we recommend enabling MFA.',
                                )}
                            </Text>
                        )}
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => setShowFullText(!showFullText)}
                            color="blue.500"
                        >
                            {t(showFullText ? 'Show Less' : 'Read More')}
                        </Button>
                    </VStack>

                    {user?.linkedAccounts
                        ?.filter((account) => account.type !== 'wallet')
                        .map((account) => (
                            <Flex
                                key={account.type}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                align="center"
                                justify="space-between"
                            >
                                <Flex align="center" gap={3}>
                                    <Icon as={getAccountIcon(account.type)} />
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="500">
                                            {t(
                                                account.type === 'google_oauth'
                                                    ? 'Google'
                                                    : account.type === 'email'
                                                    ? 'Email'
                                                    : account.type === 'passkey'
                                                    ? 'Passkey'
                                                    : account.type ===
                                                      'twitter_oauth'
                                                    ? 'Twitter'
                                                    : account.type === 'phone'
                                                    ? 'Phone Number'
                                                    : account.type ===
                                                      'spotify_oauth'
                                                    ? 'Spotify'
                                                    : account.type ===
                                                      'apple_oauth'
                                                    ? 'Apple'
                                                    : account.type ===
                                                      'instagram_oauth'
                                                    ? 'Instagram'
                                                    : account.type ===
                                                      'tiktok_oauth'
                                                    ? 'TikTok'
                                                    : account.type ===
                                                      'github_oauth'
                                                    ? 'GitHub'
                                                    : account.type ===
                                                      'linkedin_oauth'
                                                    ? 'LinkedIn'
                                                    : account.type ===
                                                      'telegram'
                                                    ? 'Telegram'
                                                    : account.type ===
                                                      'farcaster'
                                                    ? 'Farcaster'
                                                    : 'Wallet',
                                            )}
                                        </Text>
                                        <Text fontSize="sm" opacity={0.8}>
                                            {getAccountDescription(account)}
                                        </Text>
                                    </VStack>
                                </Flex>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    isDisabled={!canUnlink()}
                                    onClick={() => {
                                        if (account.type === 'passkey') {
                                            linkPasskey();
                                        } else {
                                            setUnlinkingAccount(account);
                                        }
                                    }}
                                >
                                    {t('Remove')}
                                </Button>
                            </Flex>
                        ))}

                    <Button
                        mt={2}
                        w="full"
                        variant="vechainKitSecondary"
                        onClick={() => setShowLinkOptions(true)}
                        leftIcon={<Icon as={FaPlus} />}
                        isDisabled={
                            !canLinkGoogle &&
                            !canLinkEmail &&
                            !canLinkTwitter &&
                            !canLinkSms &&
                            !canLinkSpotify &&
                            !canLinkApple &&
                            !canLinkInstagram &&
                            !canLinkTiktok &&
                            !canLinkGithub &&
                            !canLinkLinkedin &&
                            !canLinkTelegram &&
                            !canLinkFarcaster
                        }
                    >
                        {t('Add Login Method')}
                    </Button>
                </VStack>
            </ModalBody>
            <ModalFooter></ModalFooter>
        </ScrollToTopWrapper>
    );
};
