import { LinkedAccountWithMetadata, usePrivy } from '@privy-io/react-auth';
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
    useToken,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { SiFarcaster } from 'react-icons/si';
import {
    FaSpotify,
    FaApple,
    FaInstagram,
    FaTiktok,
    FaLinkedin,
    FaTelegram,
    FaDiscord,
} from 'react-icons/fa';
import {
    LuMail,
    LuWallet,
    LuPhone,
    LuGithub,
    LuPlus,
    LuFingerprint,
} from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { ActionButton } from '@/components';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { humanAddress } from '@/utils';

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
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="md" textAlign="center" color={textPrimary}>
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
    const { privy, dappKit } = useVeChainKitConfig();
    const [unlinkingAccount, setUnlinkingAccount] = useState<any>(null);
    const [showLinkOptions, setShowLinkOptions] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const [isLoadingUnlink, setIsLoadingUnlink] = useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
        linkDiscord,
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
        unlinkDiscord,
        linkWallet,
    } = usePrivy();

    const canLinkWallets = useMemo(() => {
        const privyWallets =
            privy?.loginMethods?.filter((method) =>
                [
                    'rabby_wallet',
                    'coinbase_wallet',
                    'rainbow',
                    'phantom',
                    'metamask',
                ].includes(method),
            ) ?? [];

        const dappKitWallets = dappKit?.allowedWallets ?? [];

        return privyWallets.length > 0 || dappKitWallets.length > 0;
    }, [privy?.loginMethods, dappKit?.allowedWallets]);

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'google_oauth':
                return FcGoogle;
            case 'email':
                return LuMail;
            case 'passkey':
                return LuFingerprint;
            case 'wallet':
                return LuWallet;
            case 'twitter_oauth':
                return FaXTwitter;
            case 'phone':
                return LuPhone;
            case 'spotify_oauth':
                return FaSpotify;
            case 'apple_oauth':
                return FaApple;
            case 'instagram_oauth':
                return FaInstagram;
            case 'tiktok_oauth':
                return FaTiktok;
            case 'github_oauth':
                return LuGithub;
            case 'linkedin_oauth':
                return FaLinkedin;
            case 'telegram':
                return FaTelegram;
            case 'farcaster':
                return SiFarcaster;
            case 'discord_oauth':
                return FaDiscord;
            default:
                return undefined;
        }
    };

    const canUnlink = () => {
        // the embedded wallet is always in this list, so we need to exclude it
        const linkedAccountsExcludingWallet = user?.linkedAccounts?.filter(
            (account) =>
                account.type !== 'wallet' ||
                (account.type === 'wallet' &&
                    account.connectorType !== 'embedded'),
        );
        return (
            linkedAccountsExcludingWallet &&
            linkedAccountsExcludingWallet?.length > 1
        );
    };

    const handleUnlink = async (account: any) => {
        if (!canUnlink()) return;

        setIsLoadingUnlink(true);

        try {
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
                case 'discord_oauth':
                    await unlinkDiscord(account.subject);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingUnlink(false);
            setUnlinkingAccount(null);
        }
    };

    const getAccountDescription = (account: LinkedAccountWithMetadata) => {
        switch (account.type) {
            case 'google_oauth':
                return account.email;
            case 'email':
                return account.address;
            case 'passkey':
                return `${account.authenticatorName} - ${account.createdWithBrowser}`;
            case 'phone':
                return account.number;
            case 'wallet':
                return `${humanAddress(account.address)} - ${
                    account.walletClientType
                }`;
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
    const canLinkDiscord =
        !linkedAccountTypes.includes('discord_oauth') &&
        availableLoginMethods.includes('discord');

    if (showLinkOptions) {
        return (
            <ScrollToTopWrapper>
                <StickyHeaderContainer>
                    <ModalHeader>
                        {t('Select Additional Login Method')}
                    </ModalHeader>
                    <ModalBackButton
                        onClick={() => setShowLinkOptions(false)}
                    />
                    <ModalCloseButton />
                </StickyHeaderContainer>
                <ModalBody w="full">
                    <VStack spacing={3} align="stretch" w="full">
                        <ActionButton
                            title={t('Set up Passkey')}
                            description={t(
                                'Set up a passkey for easier access',
                            )}
                            onClick={() => linkPasskey()}
                            leftIcon={LuFingerprint}
                        />

                        {canLinkGoogle && (
                            <ActionButton
                                title={t('Link Google Account')}
                                description={t(
                                    'Connect your Google account for easier access',
                                )}
                                onClick={() => linkGoogle()}
                                leftIcon={FcGoogle}
                            />
                        )}
                        {canLinkEmail && (
                            <ActionButton
                                title={t('Link Email Account')}
                                description={t(
                                    'Connect your email for easier access',
                                )}
                                onClick={() => linkEmail()}
                                leftIcon={LuMail}
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
                                leftIcon={FaXTwitter}
                            />
                        )}
                        {canLinkSms && (
                            <ActionButton
                                title={t('Link Phone Number')}
                                description={t(
                                    'Connect your phone number for easier access',
                                )}
                                onClick={() => linkPhone()}
                                leftIcon={LuPhone}
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
                                title={t('Link Tiktok Account')}
                                description={t(
                                    'Connect your Tiktok account for easier access',
                                )}
                                onClick={() => linkTiktok()}
                                leftIcon={FaTiktok}
                            />
                        )}
                        {canLinkGithub && (
                            <ActionButton
                                title={t('Link Github Account')}
                                description={t(
                                    'Connect your Github account for easier access',
                                )}
                                onClick={() => linkGithub()}
                                leftIcon={LuGithub}
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
                        {canLinkDiscord && (
                            <ActionButton
                                title={t('Link Discord Account')}
                                description={t(
                                    'Connect your Discord account for easier access',
                                )}
                                onClick={() => linkDiscord()}
                                leftIcon={FaDiscord}
                            />
                        )}
                        {canLinkWallets && (
                            <ActionButton
                                title={t('Link External Wallet')}
                                description={t(
                                    'Connect an external wallet for easier access',
                                )}
                                onClick={() => linkWallet()}
                                leftIcon={LuWallet}
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
                            !canLinkFarcaster &&
                            !canLinkDiscord && (
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
                <ModalFooter pt={0} />
            </ScrollToTopWrapper>
        );
    }

    if (unlinkingAccount) {
        return (
            <ScrollToTopWrapper>
                <StickyHeaderContainer>
                    <ModalHeader>{t('Remove Login Method')}</ModalHeader>
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
                <ModalFooter pt={0} />
            </ScrollToTopWrapper>
        );
    }

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Login methods')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    spacing={3}
                    align="center"
                    w={'full'}
                    justify={'center'}
                >
                    <VStack
                        spacing={1}
                        justify={'flex-start'}
                        alignItems="flex-start"
                        mb={5}
                        textAlign="left"
                        w={'full'}
                    >
                        <Text fontSize="sm" color={textSecondary}>
                            {t(
                                'These accounts are linked to your embedded wallet and can be used to login to your wallet and access your private key.',
                            )}
                        </Text>
                        {showFullText && (
                            <Text fontSize="sm" color={textSecondary}>
                                {t(
                                    'Adding more linked accounts increases security against loss of access, but also introduces additional potential attack vectors. For enhanced security, we recommend enabling MFA.',
                                )}
                            </Text>
                        )}
                        <Button
                            variant="link"
                            mt={0}
                            size="sm"
                            onClick={() => setShowFullText(!showFullText)}
                            color={textPrimary}
                        >
                            {t(showFullText ? 'Show Less' : 'Read More')}
                        </Button>
                    </VStack>

                    {user?.linkedAccounts
                        ?.filter(
                            (account) =>
                                account.type !== 'wallet' ||
                                (account.type === 'wallet' &&
                                    account.connectorType !== 'embedded'),
                        )
                        .map((account) => (
                            <Flex
                                key={account.type}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                align="center"
                                justify="space-between"
                                w={'full'}
                            >
                                <Flex align="center" gap={3}>
                                    <Icon
                                        as={getAccountIcon(account.type)}
                                        color={textPrimary}
                                    />
                                    <VStack align="start" spacing={0}>
                                        <Text
                                            fontWeight="500"
                                            color={textPrimary}
                                        >
                                            {account.type === 'google_oauth'
                                                ? t('Google')
                                                : account.type === 'email'
                                                ? t('Email')
                                                : account.type === 'passkey'
                                                ? t('Passkey')
                                                : account.type ===
                                                  'twitter_oauth'
                                                ? t('Twitter')
                                                : account.type === 'phone'
                                                ? t('Phone Number')
                                                : account.type ===
                                                  'spotify_oauth'
                                                ? t('Spotify')
                                                : account.type === 'apple_oauth'
                                                ? t('Apple')
                                                : account.type ===
                                                  'instagram_oauth'
                                                ? t('Instagram')
                                                : account.type ===
                                                  'tiktok_oauth'
                                                ? t('Tiktok')
                                                : account.type ===
                                                  'github_oauth'
                                                ? t('Github')
                                                : account.type ===
                                                  'linkedin_oauth'
                                                ? t('LinkedIn')
                                                : account.type === 'telegram'
                                                ? t('Telegram')
                                                : account.type === 'farcaster'
                                                ? t('Farcaster')
                                                : account.type ===
                                                  'discord_oauth'
                                                ? t('Discord')
                                                : t('Wallet')}
                                        </Text>
                                        <Text
                                            fontSize="sm"
                                            color={textSecondary}
                                        >
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
                </VStack>
            </ModalBody>
            <ModalFooter w={'full'}>
                <Button
                    w="full"
                    variant="vechainKitSecondary"
                    onClick={() => setShowLinkOptions(true)}
                    leftIcon={<Icon as={LuPlus} />}
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
                        !canLinkFarcaster &&
                        !canLinkDiscord
                    }
                >
                    {t('Add Login Method')}
                </Button>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
