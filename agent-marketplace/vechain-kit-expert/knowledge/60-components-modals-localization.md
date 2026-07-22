# VeChain Kit — Components, modals, notifications, and localization

Public and supporting UI components, modal hooks, notification hooks, language/currency hooks, and localization utilities. Translation JSON is intentionally excluded because it duplicates UI strings across locales.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `packages/vechain-kit/src/components/AccountModal/AccountModal.tsx`

````tsx
'use client';

import { useWallet } from '@/hooks';
import { BaseModal } from '@/components/common';
import {
    AccountMainContent,
    SettingsContent,
    SendTokenContent,
    SendTokenSummaryContent,
    ReceiveTokenContent,
    SwapTokenContent,
    ChooseNameContent,
    ChooseNameSearchContent,
    ChooseNameSummaryContent,
    FAQContent,
    ProfileContent,
    AssetsContent,
    TokenDetailContent,
    NftDetailContent,
    NftCollectionContent,
    SendNftContent,
    SendNftSummaryContent,
    TransactionHistoryContent,
    TransactionDetailContent,
    LanguageSettingsContent,
    TermsAndPrivacyContent,
    GasTokenSettingsContent,
    SelectWalletContent,
    RemoveWalletConfirmContent,
} from './Contents';
import { AccountModalContentTypes } from './Types/Types';
import { ConnectionDetailsContent } from './Contents/ConnectionDetails';
import { PrivyLinkedAccounts } from './Contents/PrivyLinkedAccounts';
import { NotificationsContent } from './Contents/Notifications/NotificationContent';
import { ExploreEcosystemContent } from './Contents/Ecosystem/ExploreEcosystemContent';
import { AppOverviewContent } from './Contents/Ecosystem/AppOverviewContent';
import { DisconnectConfirmContent } from './Contents/DisconnectConfirmation';
import { CustomizationContent, CustomizationSummaryContent } from './Contents';
import { SuccessfulOperationContent } from './Contents/SuccessfulOperation/SuccessfulOperationContent';
import { FailedOperationContent } from './Contents/FailedOperation/FailedOperationContent';
import { ManageCustomTokenContent } from './Contents/Assets/ManageCustomTokenContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccount';
import { useModal } from '@/providers/ModalProvider';
import { ChangeCurrencyContent } from './Contents/KitSettings';
import { useVechainKitThemeConfig } from '@/providers';
import { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    initialContent?: AccountModalContentTypes;
};

export const AccountModal = ({
    isOpen,
    onClose,
    initialContent = 'profile',
}: Props) => {
    const { account } = useWallet();
    const { themeConfig } = useVechainKitThemeConfig();

    const {
        accountModalContent: currentContent,
        setAccountModalContent: setCurrentContent,
    } = useModal();

    // Reset refs and set initial content when modal opens
    useEffect(() => {
        if (isOpen) {
            // Modal just opened - reset everything and use initialContent
            setCurrentContent(initialContent);
        }
    }, [isOpen, initialContent, setCurrentContent]);

    const renderContent = () => {
        if (typeof currentContent === 'object') {
            switch (currentContent.type) {
                case 'send-token':
                    return <SendTokenContent {...currentContent.props} />;
                case 'send-token-summary':
                    return (
                        <SendTokenSummaryContent {...currentContent.props} />
                    );
                case 'token-detail':
                    return <TokenDetailContent {...currentContent.props} />;
                case 'nft-collection':
                    return (
                        <NftCollectionContent {...currentContent.props} />
                    );
                case 'nft-detail':
                    return <NftDetailContent {...currentContent.props} />;
                case 'send-nft':
                    return <SendNftContent {...currentContent.props} />;
                case 'send-nft-summary':
                    return (
                        <SendNftSummaryContent {...currentContent.props} />
                    );
                case 'transaction-history':
                    return (
                        <TransactionHistoryContent {...currentContent.props} />
                    );
                case 'transaction-detail':
                    return (
                        <TransactionDetailContent {...currentContent.props} />
                    );
                case 'swap-token':
                    return <SwapTokenContent {...currentContent.props} />;
                case 'receive-token':
                    return <ReceiveTokenContent {...currentContent.props} />;
                case 'choose-name':
                    return <ChooseNameContent {...currentContent.props} />;
                case 'choose-name-search':
                    return (
                        <ChooseNameSearchContent {...currentContent.props} />
                    );
                case 'choose-name-summary':
                    return (
                        <ChooseNameSummaryContent {...currentContent.props} />
                    );
                case 'app-overview':
                    return (
                        <AppOverviewContent
                            {...currentContent.props}
                            setCurrentContent={setCurrentContent}
                        />
                    );
                case 'disconnect-confirm':
                    return (
                        <DisconnectConfirmContent {...currentContent.props} />
                    );
                case 'remove-wallet-confirm':
                    return (
                        <RemoveWalletConfirmContent {...currentContent.props} />
                    );
                case 'account-customization':
                    return <CustomizationContent {...currentContent.props} />;
                case 'account-customization-summary':
                    return (
                        <CustomizationSummaryContent
                            {...currentContent.props}
                        />
                    );
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent {...currentContent.props} />
                    );
                case 'failed-operation':
                    return <FailedOperationContent {...currentContent.props} />;
                case 'upgrade-smart-account':
                    return (
                        <UpgradeSmartAccountContent {...currentContent.props} />
                    );
                case 'faq':
                    return <FAQContent {...currentContent.props} />;
                case 'terms-and-privacy':
                    return <TermsAndPrivacyContent {...currentContent.props} />;
                case 'ecosystem-with-category':
                    return (
                        <ExploreEcosystemContent
                            setCurrentContent={setCurrentContent}
                            selectedCategory={
                                currentContent.props.selectedCategory
                            }
                        />
                    );
                case 'select-wallet':
                    return (
                        <SelectWalletContent
                            setCurrentContent={setCurrentContent}
                            onClose={onClose}
                            returnTo={currentContent.props.returnTo}
                            onLogoutSuccess={
                                currentContent.props.onLogoutSuccess
                            }
                        />
                    );
                case 'main':
                    return (
                        <AccountMainContent
                            setCurrentContent={setCurrentContent}
                            onClose={onClose}
                            wallet={account}
                            switchFeedback={currentContent.props?.switchFeedback}
                        />
                    );
                case 'profile':
                    return (
                        <ProfileContent
                            setCurrentContent={setCurrentContent}
                            onLogoutSuccess={() => {
                                onClose();
                            }}
                            switchFeedback={currentContent.props?.switchFeedback}
                        />
                    );
            }
        }

        switch (currentContent) {
            case 'main':
                return (
                    <AccountMainContent
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={account}
                    />
                );
            case 'settings':
                return (
                    <SettingsContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={() => {
                            onClose();
                        }}
                    />
                );
            case 'profile':
                return (
                    <ProfileContent
                        setCurrentContent={setCurrentContent}
                        onLogoutSuccess={() => {
                            onClose();
                        }}
                    />
                );
            case 'assets':
                return <AssetsContent setCurrentContent={setCurrentContent} />;
            case 'notifications':
                return (
                    <NotificationsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'receive-token':
                return (
                    <ReceiveTokenContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'swap-token':
                return (
                    <SwapTokenContent setCurrentContent={setCurrentContent} />
                );
            case 'connection-details':
                return (
                    <ConnectionDetailsContent
                        onGoBack={() => setCurrentContent('settings')}
                    />
                );
            case 'privy-linked-accounts':
                return (
                    <PrivyLinkedAccounts
                        onBack={() => setCurrentContent('settings')}
                    />
                );
            case 'ecosystem':
                return (
                    <ExploreEcosystemContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'add-custom-token':
                return (
                    <ManageCustomTokenContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'change-currency':
                return (
                    <ChangeCurrencyContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'change-language':
                return (
                    <LanguageSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'gas-token-settings':
                return (
                    <GasTokenSettingsContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            case 'account-customization':
                return (
                    <CustomizationContent
                        setCurrentContent={setCurrentContent}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            mobileMinHeight={
                themeConfig?.modal?.useBottomSheetOnMobile ? '520px' : '510px'
            }
            mobileMaxHeight={
                themeConfig?.modal?.useBottomSheetOnMobile ? '520px' : '510px'
            }
            desktopMinHeight={'485px'}
            desktopMaxHeight={'485px'}
        >
            {renderContent()}
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/AccountDetailsButton.tsx`

````tsx
import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
} from '@chakra-ui/react';
import { ElementType } from 'react';
import { humanAddress, humanDomain } from '@/utils';
import { useTranslation } from 'react-i18next';
import { Wallet } from '@/types';
import { useVeChainKitConfig } from '@/providers';

interface AccountDetailsButtonProps {
    title: string;
    wallet: Wallet;
    onClick: () => void;
    leftIcon?: ElementType;
    rightIcon?: ElementType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    isActive?: boolean;
}

export const AccountDetailsButton = ({
    leftIcon,
    rightIcon,
    title,
    wallet,
    onClick,
    leftImage,
    isActive = false,
}: AccountDetailsButtonProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <Button
            w={'full'}
            minH={'70px'}
            h={'fit-content'}
            py={4}
            onClick={onClick}
            backgroundColor={isDark ? 'transparent' : 'transparent'}
            border={`1px solid ${isDark ? '#ffffff29' : '#ebebeb'}`}
        >
            <HStack w={'full'} justify={'space-between'}>
                <Box minW={'40px'} justifyContent={'center'}>
                    {leftImage ? (
                        <Image
                            justifySelf={'center'}
                            src={leftImage}
                            w={'28px'}
                            alt="left-image"
                        />
                    ) : (
                        <Icon as={leftIcon} fontSize={'28px'} />
                    )}
                </Box>
                <VStack textAlign={'left'} w={'full'} flex={1}>
                    <HStack
                        w={'full'}
                        spacing={2}
                        justifyContent={'flex-start'}
                    >
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                    </HStack>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'500'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                    >
                        {wallet?.domain
                            ? humanDomain(wallet?.domain ?? '', 18, 0)
                            : humanAddress(wallet?.address ?? '', 6, 4)}
                    </Text>
                </VStack>
                <VStack minW={'40px'} justifyContent={'flex-end'}>
                    <HStack justifyContent={'flex-end'} minW={'40px'}>
                        {isActive && (
                            <Tag size={'sm'} colorScheme={'green'}>
                                {t('Active')}
                            </Tag>
                        )}
                        <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                    </HStack>
                </VStack>
            </HStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/AccountSelector.tsx`

````tsx
'use client';

import {
    Text,
    Icon,
    HStack,
    Button,
    StackProps,
    IconButton,
} from '@chakra-ui/react';
import { humanAddress, humanDomain } from '../../../utils';
import { copyToClipboard } from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import {
    LuChevronRight,
    LuCheck,
    LuCopy,
    LuArrowLeftRight,
} from 'react-icons/lu';
import { AccountAvatar } from '@/components/common';
import { useState } from 'react';
import { AccountModalContentTypes } from '../Types/Types';
import { useTranslation } from 'react-i18next';
import { useSwitchWallet } from '@/hooks';

type Props = {
    wallet: Wallet;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    size?: string;
    onClick?: () => void;
    onClose: () => void;
    mt?: number;
    style?: StackProps;
};

export const AccountSelector = ({
    wallet,
    setCurrentContent,
    size = 'md',
    onClick,
    onClose,
    mt,
    style,
}: Props) => {
    const { t } = useTranslation();
    const { switchWallet, isSwitching, isInAppBrowser, canSwitchWallet } =
        useSwitchWallet();

    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = async () => {
        const success = await copyToClipboard(
            wallet?.domain ?? wallet?.address ?? '',
        );
        if (success) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const handleSwitchWallet = () => {
        if (isInAppBrowser) {
            switchWallet();
        } else {
            // Desktop: navigate to select wallet screen
            setCurrentContent?.({
                type: 'select-wallet',
                props: {
                    setCurrentContent: setCurrentContent!,
                    onClose,
                    returnTo: 'main',
                    onLogoutSuccess: onClose,
                },
            });
        }
    };

    return (
        <HStack
            mt={mt}
            w={'full'}
            {...style}
            justifyContent={'flex-start'}
            alignItems={'center'}
        >
            <Button
                w="full"
                h={12}
                aria-label="Wallet"
                onClick={onClick}
                variant="vechainKitSecondary"
                p={3}
                data-testid="profile-button"
            >
                <HStack
                    spacing={2}
                    align="center"
                    justifyContent={'space-between'}
                    w={'full'}
                >
                    <HStack spacing={2} justifyContent={'flex-start'}>
                        <AccountAvatar
                            wallet={wallet}
                            props={{ width: 7, height: 7 }}
                        />
                        <Text fontSize={size} fontWeight="500">
                            {copied
                                ? t('Copied!')
                                : humanDomain(wallet?.domain ?? '', 22, 0) ||
                                  humanAddress(wallet?.address ?? '', 6, 4)}
                        </Text>
                    </HStack>

                    <Icon
                        boxSize={5}
                        as={LuChevronRight}
                        cursor="pointer"
                        opacity={0.5}
                    />
                </HStack>
            </Button>

            {canSwitchWallet ? (
                <IconButton
                    aria-label="Switch wallet"
                    icon={<Icon as={LuArrowLeftRight} />}
                    onClick={handleSwitchWallet}
                    w="60px"
                    h={12}
                    variant="vechainKitSecondary"
                    p={3}
                    isLoading={isSwitching}
                    isDisabled={isSwitching}
                    data-testid="switch-wallet-button"
                />
            ) : (
                <IconButton
                    aria-label="Copy address"
                    icon={<Icon as={copied ? LuCheck : LuCopy} />}
                    onClick={handleCopyToClipboard}
                    w="60px"
                    h={12}
                    variant="vechainKitSecondary"
                    p={3}
                />
            )}

            {/* <IconButton
                aria-label="Logout"
                icon={<Icon as={LuLogOut} />}
                onClick={() =>
                    setCurrentContent({
                        type: 'disconnect-confirm',
                        props: {
                            onDisconnect: handleLogout,
                            onBack: () => setCurrentContent('main'),
                        },
                    })
                }
                variant="ghost"
                size="sm"
                opacity={0.5}
                _hover={{ opacity: 0.8 }}
                colorScheme="red"
            /> */}
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/ActionButton.tsx`

````tsx
import {
    Button,
    Box,
    HStack,
    VStack,
    Text,
    Icon,
    Image,
    Tag,
    ButtonProps,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';

type ActionButtonProps = {
    title: string;
    description?: string;
    onClick: () => void;
    leftIcon?: IconType;
    rightIcon?: IconType;
    leftImage?: string;
    backgroundColor?: string;
    border?: string;
    hide?: boolean;
    _hover?: object;
    showComingSoon?: boolean;
    isDisabled?: boolean;
    stacked?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    style?: ButtonProps;
    extraContent?: React.ReactNode;
    dataTestId?: string;
    variant?: string;
};

export const ActionButton = ({
    leftIcon,
    rightIcon,
    title,
    onClick,
    leftImage,
    hide = false,
    showComingSoon = false,
    backgroundColor,
    _hover,
    isDisabled = false,
    stacked = false,
    isLoading,
    loadingText,
    style,
    extraContent,
    dataTestId,
    variant = 'actionButton',
}: ActionButtonProps) => {
    const { t } = useTranslation();

    // Map actionButton to vechainKitSecondary for consistency
    // Maintain backward compatibility by allowing override
    const standardVariant = variant === 'actionButton' ? 'vechainKitSecondary' : variant;

    return (
        <Button
            variant={standardVariant}
            py={stacked ? 0 : 2}
            minHeight="50px"
            height="fit-content"
            p={0}
            onClick={onClick}
            display={hide ? 'none' : 'flex'}
            isDisabled={showComingSoon || isDisabled}
            isLoading={isLoading}
            loadingText={loadingText}
            bgColor={backgroundColor}
            _hover={_hover}
            data-testid={dataTestId}
            {...style}
        >
            <HStack w={'full'} justify={'space-between'} alignItems={'center'}>
                <Box minW={'40px'} h={'20px'}>
                    {leftImage ? (
                        <Image
                            src={leftImage}
                            w={'30px'}
                            h={'30px'}
                            borderRadius={'full'}
                            alt="left-image"
                            alignSelf={'end'}
                            objectFit="cover"
                        />
                    ) : (
                        <Icon
                            as={leftIcon}
                            fontSize={'20px'}
                            h={'full'}
                            alignContent={'center'}
                        />
                    )}
                </Box>
                <VStack
                    textAlign={'left'}
                    w={'full'}
                    flex={1}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    <HStack justify={'flex-start'} alignItems={'baseline'}>
                        <Text fontSize={'sm'} fontWeight={'400'}>
                            {title}
                        </Text>
                        {showComingSoon && (
                            <Tag size="sm" colorScheme="red">
                                {t('Coming Soon!')}
                            </Tag>
                        )}
                        {extraContent}
                    </HStack>

                    {/* <Text
                        fontSize={'xs'}
                        fontWeight={'400'}
                        opacity={0.5}
                        overflowWrap={'break-word'}
                        wordBreak={'break-word'}
                        whiteSpace={'normal'}
                        w={'full'}
                        pr={rightIcon ? '0px' : '10px'}
                    >
                        {description}
                    </Text> */}
                </VStack>

                {rightIcon && (
                    <VStack minW={'40px'} justifyContent={'flex-end'}>
                        <Icon as={rightIcon} fontSize={'20px'} opacity={0.5} />
                    </VStack>
                )}
            </HStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Alerts/DomainRequiredAlert.tsx`

````tsx
import { Alert, AlertIcon, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const DomainRequiredAlert = () => {
    const { t } = useTranslation();

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} mt={'10px'} />
                    <Text w="full">
                        {t(
                            'A .vet domain is required to customize your profile. Choose an account name to get started.',
                        )}
                    </Text>
                </HStack>
            </VStack>
        </Alert>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Alerts/ExchangeWarningAlert.tsx`

````tsx
import { Alert, AlertIcon, Text, VStack, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const ExchangeWarningAlert = () => {
    const { t } = useTranslation();

    return (
        <Alert status="warning" fontSize={'xs'} borderRadius={'xl'} p={2}>
            <VStack spacing={1} align="stretch" w="full">
                <HStack spacing={2} align="flex-start">
                    <AlertIcon boxSize={4} mt={'10px'} />
                    <Text w="full">
                        {t(
                            'Sending to OceanX or other exchanges may result in loss of funds.',
                        )}
                    </Text>
                </HStack>
            </VStack>
        </Alert>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Alerts/FeatureAnnouncementCard.tsx`

````tsx
import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    useToken,
    Tag,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AccountModalContentTypes } from '../../Types';

type FeatureAnnouncementCardProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};
export const FeatureAnnouncementCard = ({
    setCurrentContent,
}: FeatureAnnouncementCardProps) => {
    const { t } = useTranslation();
    // const { closeAnnouncement } = useFeatureAnnouncement();

    const titleColor = useToken('colors', 'vechain-kit-text-primary');
    const descriptionColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleOnClick = () => {
        setCurrentContent({
            type: 'choose-name',
            props: {
                setCurrentContent,
                onBack: () => setCurrentContent('profile'),
                initialContentSource: 'profile',
            },
        });
        // closeAnnouncement();
    };

    // We always show the announcement card for now
    // if (!isVisible) return null;

    return (
        <Card
            w="full"
            variant={'featureAnnouncement'}
            overflow="hidden"
            onClick={handleOnClick}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
        >
            <CardBody p={4}>
                <HStack justify="space-between" align="flex-start" spacing={3}>
                    <VStack align="flex-start" spacing={1}>
                        <HStack spacing={2}>
                            <Text
                                fontSize="sm"
                                fontWeight="400"
                                color={titleColor}
                            >
                                {t('Claim your vet domain!')}
                            </Text>
                            <Tag size="sm" colorScheme="red">
                                {t('New')}
                            </Tag>
                        </HStack>
                        <Text fontSize="xs" color={descriptionColor}>
                            {t(
                                'Say goodbye to 0x addresses, claim your .veworld.vet subdomain now for free!',
                            )}
                        </Text>
                    </VStack>
                </HStack>
            </CardBody>
        </Card>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/BalanceSection.tsx`

````tsx
import {
    Heading,
    VStack,
    HStack,
    Icon,
    IconButton,
    Button,
    useToken,
} from '@chakra-ui/react';
import {
    useRefreshBalances,
    useWallet,
    useTotalBalance,
    LocalStorageKey,
    useLocalStorage,
} from '@/hooks';
import { PriceChangeBadge } from '@/components/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuRefreshCw } from 'react-icons/lu';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';
import { LuChevronRight } from 'react-icons/lu';
import { GoEye, GoEyeClosed } from 'react-icons/go';

export const BalanceSection = ({
    mb,
    mt,
    onAssetsClick,
}: {
    mb?: number;
    mt?: number;
    onAssetsClick?: () => void;
}) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { formattedBalance, isLoading, priceChange24hPct } = useTotalBalance({
        address: account?.address ?? '',
    });

    const { refresh } = useRefreshBalances();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refresh();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };
    const [showAssets, setShowAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    return (
        <VStack w="full" justifyContent={'start'} spacing={1} mt={mt} mb={mb}>
            <HStack
                w={'full'}
                justifyContent={'space-between'}
                alignItems={'center'}
                spacing={0}
                role="group"
            >
                <Heading
                    size={'xs'}
                    fontWeight={'800'}
                    color={textSecondary}
                    textTransform={'uppercase'}
                    letterSpacing={1.2}
                    ml={'5px'}
                >
                    {t('Assets')}
                </Heading>

                <HStack
                    spacing={0}
                    alignItems="center"
                >
                    <IconButton
                        aria-label="Refresh balances"
                        variant="ghost"
                        size="sm"
                        opacity={0.5}
                        _hover={{ opacity: 0.8 }}
                        onClick={handleRefresh}
                        icon={<Icon as={LuRefreshCw} boxSize={4} />}
                        isLoading={isLoading || isRefreshing}
                        sx={{
                            '& > span.chakra-button__spinner': {
                                width: '16px',
                                height: '16px',
                                position: 'absolute',
                            },
                        }}
                    />
                    <IconButton
                        aria-label="Show/hide assets"
                        variant="ghost"
                        size="sm"
                        opacity={0.5}
                        _hover={{ opacity: 0.8 }}
                        onClick={() => setShowAssets(!showAssets)}
                        icon={<Icon as={showAssets ? GoEye : GoEyeClosed} boxSize={4} />}
                    />
                </HStack>
            </HStack>

            <Button
                onClick={onAssetsClick}
                h="fit-content"
                variant="vechainKitSecondary"
            >
                <VStack
                    spacing={2}
                    w="full"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    mt={4}
                    mb={4}
                >
                    <HStack spacing={3} align="baseline">
                        <Heading size={'2xl'} fontWeight={'700'}>
                            {showAssets ? formattedBalance : '$****'}
                        </Heading>
                        {showAssets && (
                            <PriceChangeBadge
                                valuePct={priceChange24hPct}
                                showSuffix
                                fontSize="sm"
                            />
                        )}
                    </HStack>

                    <HStack
                        w={'full'}
                        justifyContent={'flex-start'}
                        data-testid="all-assets-button"
                        mt={2}
                    >
                        <AssetIcons
                            style={{
                                width: '100%',
                                justifyContent: 'space-between',
                            }}
                            maxIcons={10}
                            iconSize={26}
                            iconsGap={3}
                            address={account?.address ?? ''}
                            showNoAssetsWarning={true}
                            rightIcon={
                                <Icon
                                    as={LuChevronRight}
                                    boxSize={5}
                                    opacity={0.5}
                                    marginLeft={2}
                                />
                            }
                        />
                    </HStack>
                </VStack>
            </Button>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/CrossAppConnectionSecurityCard.tsx`

````tsx
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    HStack,
    Text,
    Icon,
    Button,
    VStack,
    Center,
    Box,
} from '@chakra-ui/react';
import { LuExternalLink, LuUserCog, LuShieldCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';
import { VEBETTERDAO_GOVERNANCE_BASE_URL } from '@/constants';

export const CrossAppConnectionSecurityCard = () => {
    const { t } = useTranslation();

    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache();

    return (
        <Card variant="vechainKitBase" w="full">
            <CardHeader p={4} pl={6} borderBottomWidth="1px">
                <Text fontWeight="medium" opacity={0.8}>
                    {t('Security preferences')}
                </Text>

                <Text fontSize="xs" mt={1} opacity={0.7}>
                    {t(
                        'For security reasons, you can manage your embedded wallet settings only on the {{appName}} platform.',
                        {
                            appName:
                                connectionCache?.ecosystemApp.name ??
                                'origin app',
                        },
                    )}
                </Text>
            </CardHeader>

            <CardBody borderRadius={'none'}>
                <VStack spacing={3} align="stretch">
                    <HStack spacing={3} align="center">
                        <Center
                            w={'fit-content'}
                            h={'fit-content'}
                            p={2}
                            borderRadius="full"
                            bg="blackAlpha.100"
                            flexShrink={0}
                        >
                            <Icon as={LuUserCog} />
                        </Center>
                        <Box flex={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="shorter"
                            >
                                {t('Login methods')}
                            </Text>
                            <Text
                                fontSize="xs"
                                opacity={0.7}
                                lineHeight="shorter"
                            >
                                {t('Manage your login methods and passkeys')}
                            </Text>
                        </Box>
                    </HStack>

                    <HStack spacing={3} align="center">
                        <Center
                            w={'fit-content'}
                            h={'fit-content'}
                            p={2}
                            borderRadius="full"
                            bg="blackAlpha.100"
                            flexShrink={0}
                        >
                            <Icon as={LuShieldCheck} />
                        </Center>
                        <Box flex={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="shorter"
                            >
                                {t('Security settings')}
                            </Text>
                            <Text
                                fontSize="xs"
                                opacity={0.7}
                                lineHeight="shorter"
                            >
                                {t(
                                    'Backup your wallet, configure MFA and set recovery options',
                                )}
                            </Text>
                        </Box>
                    </HStack>
                </VStack>
            </CardBody>

            <CardFooter>
                <Button
                    variant="vechainKitSecondary"
                    w="full"
                    onClick={() => {
                        window.open(
                            connectionCache?.ecosystemApp.website ??
                                VEBETTERDAO_GOVERNANCE_BASE_URL,
                            '_blank',
                        );
                    }}
                >
                    {t('Manage on {{appName}}', {
                        appName:
                            connectionCache?.ecosystemApp.name ?? 'origin app',
                    })}
                    <Icon as={LuExternalLink} ml={2} />
                </Button>
            </CardFooter>
        </Card>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/QuickActionsSection.tsx`

````tsx
import {
    Grid,
    Icon,
    IconButton,
    VStack,
    Text,
    HStack,
    Box,
} from '@chakra-ui/react';
import { AccountModalContentTypes } from '../Types';
import { useUpgradeRequired, useWallet, useTotalBalance } from '@/hooks';
import { useTranslation } from 'react-i18next';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuArrowUpFromLine,
} from 'react-icons/lu';
import { AccountQuickAction, useVeChainKitConfig } from '@/providers';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type QuickAction = {
    id: AccountQuickAction;
    icon: React.ElementType;
    label: string;
    onClick: (setCurrentContent: Props['setCurrentContent']) => void;
    isDisabled?: (hasAnyBalance: boolean) => boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'send',
        icon: LuArrowUpFromLine,
        label: 'Send',
        onClick: (setCurrentContent) =>
            setCurrentContent({
                type: 'send-token',
                props: {
                    setCurrentContent,
                },
            }),
        isDisabled: (hasAnyBalance) => !hasAnyBalance,
    },
    {
        id: 'swap',
        icon: LuArrowLeftRight,
        label: 'Swap',
        onClick: (setCurrentContent) => {
            setCurrentContent('swap-token');
        },
        isDisabled: (hasAnyBalance) => !hasAnyBalance,
    },
    {
        id: 'receive',
        icon: LuArrowDownToLine,
        label: 'Receive',
        onClick: (setCurrentContent) => {
            setCurrentContent('receive-token');
        },
    },
];

const QuickActionButton = ({
    icon,
    label,
    onClick,
    isDisabled,
    showRedDot,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    showRedDot?: boolean;
}) => {
    const { t } = useTranslation();

    return (
        <IconButton
            variant="vechainKitSecondary"
            h="80px"
            w="full"
            aria-label={label}
            isDisabled={isDisabled}
            p={3}
            icon={
                <VStack spacing={4}>
                    <Icon as={icon} boxSize={5} opacity={0.9} />

                    <HStack p={0} alignItems={'baseline'} spacing={1}>
                        <Text
                            fontSize="sm"
                            fontWeight="600"
                            data-testid={`${label.toLowerCase()}-button-label`}
                        >
                            {t(label, label)}
                        </Text>
                        {showRedDot && (
                            <Box
                                minWidth="8px"
                                height="8px"
                                bg="red.500"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            />
                        )}
                    </HStack>
                </VStack>
            }
            onClick={onClick}
        />
    );
};

export const QuickActionsSection = ({ mt, setCurrentContent }: Props) => {
    const { account, smartAccount, connectedWallet, connection } = useWallet();
    const { hiddenQuickActions = [] } = useVeChainKitConfig();
    const { hasAnyBalance } = useTotalBalance({
        address: account?.address ?? '',
    });

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    const showRedDot = connection.isConnectedWithPrivy && upgradeRequired;
    const visibleQuickActions = QUICK_ACTIONS.filter(
        (action) => !hiddenQuickActions.includes(action.id),
    );

    if (!visibleQuickActions.length) {
        return null;
    }

    return (
        <Grid
            templateColumns={`repeat(${visibleQuickActions.length}, 1fr)`}
            gap={2}
            w="full"
            mt={mt}
        >
            {visibleQuickActions.map((action) => (
                <QuickActionButton
                    key={action.id}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => action.onClick(setCurrentContent)}
                    isDisabled={action.isDisabled?.(hasAnyBalance)}
                    showRedDot={showRedDot && action.label === 'Settings'}
                />
            ))}
        </Grid>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Tabs/Contents/ActivityTabPanel.tsx`

````tsx
import { Icon, Text, VStack } from '@chakra-ui/react';
import { LuArrowLeftRight } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export const ActivityTabPanel = () => {
    const { t } = useTranslation();
    return (
        <VStack spacing={4} align="center" mt={8}>
            <Icon
                as={LuArrowLeftRight}
                boxSize={12}
                opacity={0.5}
                p={2}
                bg="whiteAlpha.100"
                borderRadius="xl"
            />
            <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="500">
                    {t('Coming soon')}
                </Text>
                <Text fontSize="sm" opacity={0.5} textAlign="center">
                    {t('Stay tuned for our upcoming Activity feature')}
                </Text>
            </VStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Account/AccountMainContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Tag,
    ModalFooter,
} from '@chakra-ui/react';
import {
    StickyHeaderContainer,
    ScrollToTopWrapper,
    WalletSwitchFeedback,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import {
    AccountSelector,
    BalanceSection,
    ModalBackButton,
    QuickActionsSection,
} from '@/components';
import { Wallet } from '@/types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useAccountModalOptions } from '@/hooks';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    wallet: Wallet;
    switchFeedback?: { showFeedback: boolean };
};

export const AccountMainContent = ({
    setCurrentContent,
    wallet,
    onClose,
    switchFeedback,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => {
                            setCurrentContent('profile');
                        }}
                    />
                )}
                <ModalHeader>
                    {t('Wallet')}

                    {network?.type !== 'main' && (
                        <Tag
                            size="xs"
                            colorScheme="orange"
                            fontSize={'2xs'}
                            p={1}
                            ml={1}
                            textTransform={'uppercase'}
                        >
                            {`${network?.type}`}
                        </Tag>
                    )}
                </ModalHeader>

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    w={'full'}
                    overflow={'hidden'}
                    justifyContent={'flex-start'}
                    spacing={8}
                >
                    <WalletSwitchFeedback
                        showFeedback={switchFeedback?.showFeedback}
                    />
                    <AccountSelector
                        style={{ justifyContent: 'flex-start' }}
                        onClick={() => {
                            setCurrentContent('profile');
                        }}
                        setCurrentContent={setCurrentContent}
                        onClose={onClose}
                        wallet={wallet}
                    />

                    <BalanceSection
                        onAssetsClick={() => {
                            setCurrentContent('assets');
                        }}
                    />

                    <QuickActionsSection
                        setCurrentContent={setCurrentContent}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0}></ModalFooter>
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/AssetsContent.tsx`

````tsx
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
import { NftsTab } from './Components/NftsTab';

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

    const handleCollectionSelect = (collectionAddress: string) => {
        setCurrentContent({
            type: 'nft-collection',
            props: {
                setCurrentContent,
                collectionAddress,
                onBack: () => setCurrentContent('assets'),
            },
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
                                <TokensTab
                                    onSelect={handleTokenSelect}
                                    onManageTokens={
                                        allowCustomTokens
                                            ? () =>
                                                  setCurrentContent(
                                                      'add-custom-token',
                                                  )
                                            : undefined
                                    }
                                />
                            }
                            stakingPanel={<StakingTab />}
                            nftsPanel={
                                <NftsTab
                                    onSelectCollection={handleCollectionSelect}
                                />
                            }
                        />
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/AssetsHeader.tsx`

````tsx
import {
    Heading,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
} from '@chakra-ui/react';
import {
    LuArrowLeftRight,
    LuArrowUpFromLine,
    LuHistory,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    LocalStorageKey,
    useCurrency,
    useLocalStorage,
    usePortfolioPriceHistory24h,
    useTotalBalance,
    useWallet,
} from '@/hooks';
import { PriceChangeBadge, PriceChart } from '@/components/common';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';

type Props = {
    onSend: () => void;
    onSwap: () => void;
    onHistory: () => void;
    hideHistory?: boolean;
};

const ActionButton = ({
    icon,
    label,
    onClick,
    isDisabled,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
}) => {
    const { t } = useTranslation();
    const translatedLabel = t(label, label);
    return (
        <IconButton
            variant="vechainKitSecondary"
            h="44px"
            flex={1}
            borderRadius="lg"
            aria-label={translatedLabel}
            isDisabled={isDisabled}
            onClick={onClick}
            icon={
                <HStack spacing={1.5}>
                    <Icon as={icon} boxSize={3.5} opacity={0.85} />
                    <Text fontSize="sm" fontWeight="600">
                        {translatedLabel}
                    </Text>
                </HStack>
            }
        />
    );
};

export const AssetsHeader = ({
    onSend,
    onSwap,
    onHistory,
    hideHistory,
}: Props) => {
    const { account } = useWallet();
    const {
        formattedBalance,
        hasAnyBalance,
        isLoading,
        priceChange24hPct,
    } = useTotalBalance({
        address: account?.address ?? '',
    });
    const { points: chartPoints } = usePortfolioPriceHistory24h(
        account?.address,
    );
    const { currentCurrency } = useCurrency();
    const chartTone: 'up' | 'down' | 'neutral' =
        typeof priceChange24hPct === 'number'
            ? priceChange24hPct > 0
                ? 'up'
                : priceChange24hPct < 0
                ? 'down'
                : 'neutral'
            : 'neutral';
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    return (
        <VStack w="full" spacing={4} align="stretch">
            <HStack spacing={3} align="baseline">
                <Heading size="2xl" fontWeight="700">
                    {isLoading
                        ? '...'
                        : showAssets
                        ? formattedBalance
                        : '$****'}
                </Heading>
                {showAssets && (
                    <PriceChangeBadge
                        valuePct={priceChange24hPct}
                        showSuffix
                        fontSize="sm"
                    />
                )}
            </HStack>

            {showAssets && chartPoints.length > 1 && (
                <PriceChart
                    points={chartPoints}
                    tone={chartTone}
                    chartHeight={72}
                    interactive
                    formatValue={(v) =>
                        formatCompactCurrency(v, {
                            currency: currentCurrency as SupportedCurrency,
                        })
                    }
                />
            )}

            <HStack spacing={2} w="full">
                <ActionButton
                    icon={LuArrowLeftRight}
                    label="Swap"
                    onClick={onSwap}
                    isDisabled={!hasAnyBalance}
                />
                <ActionButton
                    icon={LuArrowUpFromLine}
                    label="Send"
                    onClick={onSend}
                    isDisabled={!hasAnyBalance}
                />
                {!hideHistory && (
                    <ActionButton
                        icon={LuHistory}
                        label="History"
                        onClick={onHistory}
                    />
                )}
            </HStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/AssetsTabs.tsx`

````tsx
import {
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type AssetsTabIndex = 0 | 1 | 2;

type Props = {
    tabIndex: AssetsTabIndex;
    onTabChange: (index: AssetsTabIndex) => void;
    tokenPanel: React.ReactNode;
    stakingPanel: React.ReactNode;
    nftsPanel: React.ReactNode;
};

export const AssetsTabs = ({
    tabIndex,
    onTabChange,
    tokenPanel,
    stakingPanel,
    nftsPanel,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Tabs
            index={tabIndex}
            onChange={(idx) => onTabChange((idx as AssetsTabIndex) ?? 0)}
            variant="unstyled"
            isLazy
        >
            <TabList>
                <Tab fontWeight="600" fontSize="md">
                    {t('Token')}
                </Tab>
                <Tab fontWeight="600" fontSize="md">
                    {t('Staking')}
                </Tab>
                <Tab fontWeight="600" fontSize="md">
                    {t('NFTs')}
                </Tab>
            </TabList>
            <TabIndicator mt="-2px" height="2px" bg="vechain-kit-accent" />

            <TabPanels>
                <TabPanel px={0} pt={4}>
                    {tokenPanel}
                </TabPanel>
                <TabPanel px={0} pt={4}>
                    {stakingPanel}
                </TabPanel>
                <TabPanel px={0} pt={4}>
                    {nftsPanel}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/CollectionCard.tsx`

````tsx
import {
    AspectRatio,
    Box,
    Image,
    Skeleton,
    Text,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl, humanAddress } from '@/utils';
import {
    OwnedNft,
    useNftCollectionName,
    useNftMetadata,
} from '@/hooks/api/nfts';

type Props = {
    collectionAddress: string;
    tokens: OwnedNft[];
    onClick: () => void;
};

export const CollectionCard = ({
    collectionAddress,
    tokens,
    onClick,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const previewToken = tokens[0];

    const { metadata, isLoading: isLoadingMetadata } = useNftMetadata(
        previewToken?.collectionAddress,
        previewToken?.tokenId,
    );
    const { name: onChainName } = useNftCollectionName(collectionAddress);

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const imageUrl = useMemo(() => {
        const raw = metadata?.image;
        if (!raw) return undefined;
        try {
            return convertUriToUrl(raw, network.type) ?? raw;
        } catch {
            return raw;
        }
    }, [metadata?.image, network.type]);

    const collectionName =
        onChainName ??
        metadata?.name?.split('#')[0]?.trim() ??
        humanAddress(collectionAddress);

    return (
        <Box
            as="button"
            onClick={onClick}
            bg={cardBg}
            borderRadius="xl"
            overflow="hidden"
            textAlign="left"
            w="full"
            _hover={{ opacity: 0.85 }}
            transition="opacity 120ms ease"
        >
            <AspectRatio ratio={1} w="full">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={collectionName}
                        objectFit="cover"
                        fallback={<Skeleton w="full" h="full" />}
                    />
                ) : (
                    <Skeleton isLoaded={!isLoadingMetadata} fadeDuration={0}>
                        <Box w="full" h="full" bg={cardBg} />
                    </Skeleton>
                )}
            </AspectRatio>
            <Box px={2} py={2}>
                <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={textPrimary}
                    noOfLines={1}
                >
                    {collectionName}
                </Text>
                <Text fontSize="xs" color={textSecondary}>
                    {tokens.length === 1
                        ? t('{{count}} item', { count: tokens.length })
                        : t('{{count}} items', { count: tokens.length })}
                </Text>
            </Box>
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/NftCard.tsx`

````tsx
import { AspectRatio, Box, Image, Skeleton, Text, useToken } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl } from '@/utils';
import { OwnedNft, useNftMetadata } from '@/hooks/api/nfts';

type Props = {
    nft: OwnedNft;
    onClick: () => void;
};

export const NftCard = ({ nft, onClick }: Props) => {
    const { network } = useVeChainKitConfig();
    const { metadata, isLoading } = useNftMetadata(
        nft.collectionAddress,
        nft.tokenId,
    );

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const imageUrl = useMemo(() => {
        const raw = metadata?.image;
        if (!raw) return undefined;
        try {
            return convertUriToUrl(raw, network.type) ?? raw;
        } catch {
            return raw;
        }
    }, [metadata?.image, network.type]);

    const displayName = metadata?.name ?? `#${nft.tokenId}`;

    return (
        <Box
            as="button"
            onClick={onClick}
            bg={cardBg}
            borderRadius="xl"
            overflow="hidden"
            textAlign="left"
            w="full"
            _hover={{ opacity: 0.85 }}
            transition="opacity 120ms ease"
        >
            <AspectRatio ratio={1} w="full">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={displayName}
                        objectFit="cover"
                        fallback={<Skeleton w="full" h="full" />}
                    />
                ) : (
                    <Skeleton isLoaded={!isLoading} fadeDuration={0}>
                        <Box w="full" h="full" bg={cardBg} />
                    </Skeleton>
                )}
            </AspectRatio>
            <Box px={2} py={2}>
                <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={textPrimary}
                    noOfLines={1}
                >
                    {displayName}
                </Text>
                <Text fontSize="xs" color={textSecondary} noOfLines={1}>
                    #{nft.tokenId}
                </Text>
            </Box>
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/NftsTab.tsx`

````tsx
import {
    Box,
    Button,
    Skeleton,
    SimpleGrid,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { OwnedNft, useOwnedNftsFiltered } from '@/hooks/api/nfts';
import { useWallet } from '@/hooks';
import { CollectionCard } from './CollectionCard';

type Props = {
    onSelectCollection: (collectionAddress: string, tokens: OwnedNft[]) => void;
};

type CollectionGroup = {
    address: string;
    tokens: OwnedNft[];
};

const groupByCollection = (items: OwnedNft[]): CollectionGroup[] => {
    const map = new Map<string, OwnedNft[]>();
    for (const item of items) {
        const key = item.collectionAddress.toLowerCase();
        const list = map.get(key);
        if (list) list.push(item);
        else map.set(key, [item]);
    }
    return Array.from(map.entries())
        .map(([address, tokens]) => ({ address, tokens }))
        .sort((a, b) => b.tokens.length - a.tokens.length);
};

export const NftsTab = ({ onSelectCollection }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const {
        items,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isUnsupportedNetwork,
    } = useOwnedNftsFiltered(account?.address);

    const groups = useMemo(() => groupByCollection(items), [items]);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const node = sentinelRef.current;
        if (!node || !hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting) && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '120px' },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isUnsupportedNetwork) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>
                    {t('NFTs are not available on this network')}
                </Text>
            </Box>
        );
    }

    if (isLoading && groups.length === 0) {
        return (
            <SimpleGrid columns={2} spacing={3} w="full">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} h="160px" borderRadius="xl" />
                ))}
            </SimpleGrid>
        );
    }

    if (!groups.length) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>{t('No NFTs yet')}</Text>
            </Box>
        );
    }

    return (
        <VStack spacing={3} align="stretch" w="full">
            <SimpleGrid columns={2} spacing={3} w="full">
                {groups.map((g) => (
                    <CollectionCard
                        key={g.address}
                        collectionAddress={g.address}
                        tokens={g.tokens}
                        onClick={() => onSelectCollection(g.address, g.tokens)}
                    />
                ))}
            </SimpleGrid>

            {hasNextPage && (
                <Box ref={sentinelRef} py={2} textAlign="center">
                    <Button
                        variant="vechainKitSecondary"
                        size="sm"
                        isLoading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        {t('Load more')}
                    </Button>
                </Box>
            )}
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingCards/BetterSwapLpCard.tsx`

````tsx
import { useTranslation } from 'react-i18next';
import { useBetterSwapLpPositions, useWallet } from '@/hooks';
import { BetterSwapLogo } from '@/assets/icons/BetterSwapLogo';
import { StakingCard, StakingRow } from './StakingCard';

const BETTERSWAP_URL = 'https://www.betterswap.io/';

export const BetterSwapLpCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { positions, totalValueInCurrency, isLoading } =
        useBetterSwapLpPositions(account?.address);

    if (isLoading || !positions.length) return null;

    return (
        <StakingCard
            name="BetterSwap"
            logoFallback={<BetterSwapLogo boxSize="24px" />}
            totalValueInCurrency={totalValueInCurrency}
            tag={t('Liquidity')}
            platformUrl={BETTERSWAP_URL}
        >
            {positions.map((p) => {
                const pairLabel = `${p.token0.symbol || '?'} / ${
                    p.token1.symbol || '?'
                }`;
                const amount = `${p.lpBalance.toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                })} LP`;
                return (
                    <StakingRow
                        key={p.pairAddress}
                        label={pairLabel}
                        amount={amount}
                        valueInCurrency={p.valueInCurrency}
                    />
                );
            })}
        </StakingCard>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingCards/JuicyFinanceCard.tsx`

````tsx
import { Box, HStack, Tag, Text, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    useCurrency,
    useJuicyPosition,
    useWallet,
} from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { StakingCard, StakingRow } from './StakingCard';

const JUICY_URL = 'https://www.juicyfinance.io/';
const JUICY_LOGO = 'https://www.juicyfinance.io/logo192.png';

const formatHealth = (hf: number | null) => {
    if (hf == null) return null;
    if (!Number.isFinite(hf)) return null;
    if (hf >= 1000) return `${Math.round(hf)}`;
    return hf.toFixed(2);
};

const healthTone = (hf: number | null) => {
    if (hf == null) return undefined;
    if (hf < 1.1) return 'red';
    if (hf < 1.5) return 'orange';
    return 'green';
};

export const JuicyFinanceCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { currentCurrency } = useCurrency();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const {
        supplied,
        borrowed,
        totalSuppliedInCurrency,
        totalBorrowedInCurrency,
        healthFactor,
        netValueInCurrency,
        hasPosition,
        isLoading,
    } = useJuicyPosition(account?.address);

    if (isLoading || !hasPosition) return null;

    const tagLabel = borrowed.length ? t('Borrowing') : t('Lending');
    const healthLabel = formatHealth(healthFactor);
    const healthScheme = healthTone(healthFactor);

    return (
        <StakingCard
            name="Juicy Finance"
            logoSrc={JUICY_LOGO}
            totalValueInCurrency={netValueInCurrency}
            tag={tagLabel}
            platformUrl={JUICY_URL}
        >
            {healthLabel && (
                <HStack
                    w="full"
                    justify="space-between"
                    align="center"
                    px={1}
                >
                    <Text fontSize="xs" color={textSecondary}>
                        {t('Health rate')}
                    </Text>
                    <Tag
                        size="sm"
                        colorScheme={healthScheme}
                        borderRadius="md"
                    >
                        {healthLabel}
                    </Tag>
                </HStack>
            )}

            {supplied.length > 0 && (
                <Box w="full">
                    <HStack
                        w="full"
                        justify="space-between"
                        align="center"
                        px={1}
                        mb={1}
                    >
                        <Text fontSize="xs" color={textSecondary}>
                            {t('Supplied')}
                        </Text>
                        <Text fontSize="xs" color={textSecondary}>
                            {formatCompactCurrency(totalSuppliedInCurrency, {
                                currency:
                                    currentCurrency as SupportedCurrency,
                            })}
                        </Text>
                    </HStack>
                    {supplied.map((p) => (
                        <StakingRow
                            key={`s-${p.asset}`}
                            label={p.symbol}
                            amount={`${p.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 4,
                            })} ${p.symbol}`}
                            valueInCurrency={p.valueInCurrency}
                            iconSrc={TOKEN_LOGOS[p.symbol]}
                        />
                    ))}
                </Box>
            )}

            {borrowed.length > 0 && (
                <Box w="full">
                    <HStack
                        w="full"
                        justify="space-between"
                        align="center"
                        px={1}
                        mb={1}
                        mt={2}
                    >
                        <Text fontSize="xs" color={textSecondary}>
                            {t('Borrowed')}
                        </Text>
                        <Text fontSize="xs" color={textSecondary}>
                            {formatCompactCurrency(
                                totalBorrowedInCurrency,
                                {
                                    currency:
                                        currentCurrency as SupportedCurrency,
                                },
                            )}
                        </Text>
                    </HStack>
                    {borrowed.map((p) => (
                        <StakingRow
                            key={`b-${p.asset}`}
                            label={p.symbol}
                            amount={`${p.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 4,
                            })} ${p.symbol}`}
                            valueInCurrency={p.valueInCurrency}
                            iconSrc={TOKEN_LOGOS[p.symbol]}
                        />
                    ))}
                </Box>
            )}
        </StakingCard>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingCards/NavigatorsCard.tsx`

````tsx
import { useTranslation } from 'react-i18next';
import { useNavigatorPosition, useWallet } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { humanAddress } from '@/utils/formattingUtils';
import { StakingCard, StakingRow } from './StakingCard';

const VEBETTERDAO_URL = 'https://governance.vebetterdao.org';

export const NavigatorsCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const {
        isNavigator,
        isDelegated,
        stakedB3TR,
        delegatedAmount,
        navigatorAddress,
        totalValueInCurrency,
        isLoading,
    } = useNavigatorPosition(account?.address);

    if (isLoading) return null;
    if (!isNavigator && !isDelegated) return null;

    return (
        <StakingCard
            name="VeBetter"
            logoSrc={TOKEN_LOGOS['B3TR']}
            totalValueInCurrency={totalValueInCurrency}
            tag={isNavigator ? t('Navigator') : t('Delegating')}
            platformUrl={VEBETTERDAO_URL}
        >
            {isNavigator && (
                <StakingRow
                    label={t('Staked B3TR')}
                    amount={`${stakedB3TR.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} B3TR`}
                    valueInCurrency={totalValueInCurrency * (
                        (stakedB3TR + delegatedAmount) > 0
                            ? stakedB3TR / (stakedB3TR + delegatedAmount)
                            : 1
                    )}
                    iconSrc={TOKEN_LOGOS['B3TR']}
                />
            )}
            {isDelegated && (
                <StakingRow
                    label={t('Delegated to {{name}}', {
                        name: navigatorAddress
                            ? humanAddress(navigatorAddress, 4, 4)
                            : t('navigator'),
                    })}
                    amount={`${delegatedAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} B3TR`}
                    valueInCurrency={totalValueInCurrency * (
                        (stakedB3TR + delegatedAmount) > 0
                            ? delegatedAmount / (stakedB3TR + delegatedAmount)
                            : 1
                    )}
                    iconSrc={TOKEN_LOGOS['B3TR']}
                />
            )}
        </StakingCard>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingCards/StakingCard.tsx`

````tsx
import {
    Box,
    Button,
    Divider,
    HStack,
    Heading,
    Image,
    Tag,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import { useCurrency } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { SupportedCurrency } from '@/utils/currencyUtils';

export type StakingCardProps = {
    name: string;
    logoSrc?: string;
    logoFallback?: React.ReactNode;
    totalValueInCurrency: number;
    tag?: string;
    platformUrl?: string;
    children?: React.ReactNode;
};

export const StakingCard = ({
    name,
    logoSrc,
    logoFallback,
    totalValueInCurrency,
    tag,
    platformUrl,
    children,
}: StakingCardProps) => {
    const { t } = useTranslation();
    const { currentCurrency } = useCurrency();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    return (
        <VStack
            w="full"
            align="stretch"
            spacing={3}
            p={4}
            borderRadius="xl"
            bg={cardBg}
        >
            <HStack w="full" justify="space-between" align="center">
                <HStack spacing={2}>
                    {logoSrc ? (
                        <Image
                            src={logoSrc}
                            alt={name}
                            boxSize="24px"
                            borderRadius="full"
                            fallback={
                                <Box
                                    boxSize="24px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                />
                            }
                        />
                    ) : (
                        logoFallback ?? (
                            <Box
                                boxSize="24px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                            />
                        )
                    )}
                    <Heading size="sm" color={textPrimary}>
                        {name}
                    </Heading>
                </HStack>
                <Text fontWeight="600" color={textPrimary}>
                    {formatCompactCurrency(totalValueInCurrency, {
                        currency: currentCurrency as SupportedCurrency,
                    })}
                </Text>
            </HStack>

            {tag && (
                <Box>
                    <Tag size="sm" colorScheme="purple" borderRadius="md">
                        {tag}
                    </Tag>
                </Box>
            )}

            <Divider opacity={0.2} />

            <VStack w="full" align="stretch" spacing={2}>
                {children}
            </VStack>

            {platformUrl && (
                <Button
                    as="a"
                    href={platformUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="vechainKitSecondary"
                    size="xs"
                    leftIcon={<LuExternalLink size={11} />}
                    fontSize="xs"
                    h="40px"
                    px={3}
                    mt={1}
                >
                    {t('Go to platform')}
                </Button>
            )}
        </VStack>
    );
};

export type StakingRowProps = {
    label: string;
    amount: string;
    valueInCurrency: number;
    rightLabel?: React.ReactNode;
    iconSrc?: string;
    iconFallback?: React.ReactNode;
};

export const StakingRow = ({
    label,
    amount,
    valueInCurrency,
    rightLabel,
    iconSrc,
    iconFallback,
}: StakingRowProps) => {
    const { currentCurrency } = useCurrency();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <HStack w="full" justify="space-between" align="center">
            <HStack spacing={2}>
                {iconSrc ? (
                    <Image
                        src={iconSrc}
                        alt={label}
                        boxSize="20px"
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize="20px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                            />
                        }
                    />
                ) : (
                    iconFallback
                )}
                <VStack spacing={0} align="flex-start">
                    <Text fontSize="sm" color={textSecondary}>
                        {label}
                    </Text>
                    <Text fontSize="sm" color={textPrimary}>
                        {amount}
                    </Text>
                </VStack>
            </HStack>
            <VStack spacing={0} align="flex-end">
                <Text fontSize="sm" color={textPrimary}>
                    {formatCompactCurrency(valueInCurrency, {
                        currency: currentCurrency as SupportedCurrency,
                    })}
                </Text>
                {rightLabel}
            </VStack>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingCards/StargateCard.tsx`

````tsx
import { Tag, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useStargatePositions, useWallet } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { StakingCard, StakingRow } from './StakingCard';

const STARGATE_LOGO = 'https://app.stargate.vechain.org/stargate-icon.png';
const STARGATE_URL = 'https://app.stargate.vechain.org/';

export const StargateCard = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { positions, totalValueInCurrency, isLoading } = useStargatePositions(
        account?.address,
    );

    if (isLoading || !positions.length) return null;

    const anyDelegated = positions.some((p) => p.isDelegated);

    return (
        <StakingCard
            name="StarGate"
            logoSrc={STARGATE_LOGO}
            totalValueInCurrency={totalValueInCurrency}
            tag={anyDelegated ? t('Delegating') : t('Staked')}
            platformUrl={STARGATE_URL}
        >
            {positions.map((p) => (
                <StakingRow
                    key={p.tokenId}
                    label={t('Supplied')}
                    amount={`${p.vetAmountFormatted.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })} VET`}
                    valueInCurrency={p.valueInCurrency}
                    iconSrc={TOKEN_LOGOS['VET']}
                    rightLabel={
                        p.isDelegated ? (
                            <Tag size="sm" colorScheme="green" borderRadius="md">
                                {t('Delegated')}
                            </Tag>
                        ) : (
                            <Text fontSize="xs" opacity={0.6}>
                                {t('Not delegated')}
                            </Text>
                        )
                    }
                />
            ))}
        </StakingCard>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/StakingTab.tsx`

````tsx
import { Box, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    useBetterSwapLpPositions,
    useJuicyPosition,
    useNavigatorPosition,
    useStargatePositions,
    useWallet,
} from '@/hooks';
import { StargateCard } from './StakingCards/StargateCard';
import { NavigatorsCard } from './StakingCards/NavigatorsCard';
import { BetterSwapLpCard } from './StakingCards/BetterSwapLpCard';
import { JuicyFinanceCard } from './StakingCards/JuicyFinanceCard';

export const StakingTab = () => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const stargate = useStargatePositions(account?.address);
    const navigators = useNavigatorPosition(account?.address);
    const lp = useBetterSwapLpPositions(account?.address);
    const juicy = useJuicyPosition(account?.address);

    const hasAnyStargate = stargate.positions.length > 0;
    const hasNavigator = navigators.isNavigator || navigators.isDelegated;
    const hasLp = lp.positions.length > 0;
    const hasJuicy = juicy.hasPosition;

    const isLoading =
        stargate.isLoading ||
        navigators.isLoading ||
        lp.isLoading ||
        juicy.isLoading;
    const hasAny = hasAnyStargate || hasNavigator || hasLp || hasJuicy;

    if (!isLoading && !hasAny) {
        return (
            <Box py={6} textAlign="center">
                <Text color={textSecondary}>
                    {t('No staking positions yet')}
                </Text>
            </Box>
        );
    }

    return (
        <VStack spacing={3} align="stretch" w="full">
            {hasAnyStargate && <StargateCard />}
            {hasNavigator && <NavigatorsCard />}
            {hasJuicy && <JuicyFinanceCard />}
            {hasLp && <BetterSwapLpCard />}
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/Components/TokensTab.tsx`

````tsx
import {
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Tooltip,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuPencil, LuSearch } from 'react-icons/lu';
import { useState } from 'react';
import { AssetButton } from '@/components/common';
import {
    TokenWithValue,
    useCurrency,
    useTokensWithValues,
    useWallet,
} from '@/hooks';
import { SupportedCurrency } from '@/utils/currencyUtils';
import { useVeChainKitConfig } from '@/providers';
import { useTranslation } from 'react-i18next';

type Props = {
    onSelect: (token: TokenWithValue) => void;
    onManageTokens?: () => void;
};

export const TokensTab = ({ onSelect, onManageTokens }: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { darkMode } = useVeChainKitConfig();
    const { sortedTokens } = useTokensWithValues({ address: account?.address });
    const { currentCurrency } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');

    const filteredTokens = sortedTokens.filter(({ symbol }) =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <VStack spacing={3} align="stretch" w="full">
            <HStack spacing={2}>
                <InputGroup size="md" flex={1}>
                    <Input
                        placeholder={t('Search token')}
                        bg={darkMode ? '#00000038' : 'gray.50'}
                        borderRadius="lg"
                        height="40px"
                        pl={10}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="search-token-input"
                    />
                    <InputLeftElement h="40px" w="40px" pl={3}>
                        <LuSearch color={textTertiary} />
                    </InputLeftElement>
                </InputGroup>
                {onManageTokens && (
                    <Tooltip label={t('Manage Custom Tokens')}>
                        <IconButton
                            aria-label={t('Manage Custom Tokens')}
                            icon={<LuPencil />}
                            variant="vechainKitSecondary"
                            size="md"
                            height="40px"
                            width="40px"
                            minW="40px"
                            borderRadius="lg"
                            onClick={onManageTokens}
                        />
                    </Tooltip>
                )}
            </HStack>

            <VStack spacing={2} align="stretch">
                {filteredTokens.map((token) => (
                    <AssetButton
                        key={token.address}
                        symbol={token.symbol}
                        amount={Number(token.balance)}
                        currencyValue={token.valueInCurrency}
                        currentCurrency={
                            currentCurrency as SupportedCurrency
                        }
                        onClick={() => onSelect(token)}
                        priceChange24hPct={token.priceChange24hPct}
                    />
                ))}
            </VStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/ManageCustomTokenContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Button,
    Text,
    Box,
    HStack,
    FormControl,
    Image,
    IconButton,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useCustomTokens } from '@/hooks/api/wallet/useCustomTokens';
import { humanAddress, TOKEN_LOGOS } from '@/utils';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

export type ManageCustomTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

// Add form values type
type FormValues = {
    newTokenAddress: string;
};

export const ManageCustomTokenContent = ({
    setCurrentContent,
}: ManageCustomTokenContentProps) => {
    const { t } = useTranslation();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const backgroundCard = useToken('colors', 'vechain-kit-card');
    const backgroundOverlay = useToken('colors', 'vechain-kit-overlay');

    const {
        addToken,
        removeToken,
        isTokenIncluded,
        isDefaultToken,
        customTokens,
    } = useCustomTokens();

    // Form setup with validation rules
    const {
        register,
        setError,
        setValue,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            newTokenAddress: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: FormValues) => {
        if (!data.newTokenAddress) return;

        if (
            isTokenIncluded(data.newTokenAddress) ||
            isDefaultToken(data.newTokenAddress)
        ) {
            return setError('newTokenAddress', {
                type: 'manual',
                message: t('Token already added'),
            });
        }

        try {
            await addToken(data.newTokenAddress);
            setValue('newTokenAddress', ''); // Clear the input after successful addition
        } catch (error) {
            console.error('Error adding token:', error);
            setError('newTokenAddress', {
                type: 'manual',
                message: t('Invalid token address'),
            });
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Manage Custom Tokens')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('assets')} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch">
                    {/* Input Section */}
                    <Box p={4} borderRadius="xl" bg={backgroundCard}>
                        <VStack align="stretch" spacing={3}>
                            <Text fontSize="sm" color={textSecondary}>
                                {t(
                                    'Paste a token contract address to track its balance in your wallet.',
                                )}
                            </Text>
                            <FormControl isInvalid={!!errors.newTokenAddress}>
                                <HStack spacing={2}>
                                    <Input
                                        {...register('newTokenAddress', {
                                            required: t('Address is required'),
                                            pattern: {
                                                value: /^0x[a-fA-F0-9]{40}$/,
                                                message: t(
                                                    'Please enter a valid contract address',
                                                ),
                                            },
                                            validate: (value) =>
                                                /^0x[a-fA-F0-9]{40}$/.test(
                                                    value,
                                                ) ||
                                                t('Invalid contract address'),
                                        })}
                                        onChange={(e) => {
                                            const trimmed =
                                                e.target.value.trim();
                                            e.target.value = trimmed;
                                            setValue(
                                                'newTokenAddress',
                                                trimmed,
                                                { shouldValidate: true },
                                            );
                                        }}
                                        placeholder="0x..."
                                        variant="outline"
                                        fontSize="md"
                                        fontWeight="medium"
                                        flex={1}
                                    />
                                    <IconButton
                                        aria-label={t('Add Token')}
                                        icon={<LuPlus />}
                                        variant="vechainKitPrimary"
                                        size="md"
                                        minW="40px"
                                        w="40px"
                                        h="40px"
                                        borderRadius="lg"
                                        isDisabled={!isValid}
                                        onClick={handleSubmit(onSubmit)}
                                    />
                                </HStack>
                                {errors.newTokenAddress && (
                                    <Text
                                        color="#ef4444"
                                        fontSize="sm"
                                        mt={1}
                                    >
                                        {errors.newTokenAddress.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>

                    {/* Existing Tokens List */}
                    <Box>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={textSecondary}
                            mb={2}
                            px={1}
                        >
                            {t('Existing Custom Tokens')}
                        </Text>
                        {customTokens.length > 0 ? (
                            <VStack align="stretch" spacing={2}>
                                {customTokens.map((token) => (
                                    <HStack
                                        key={token.address}
                                        justify="space-between"
                                        fontSize="sm"
                                        p={3}
                                        borderRadius="xl"
                                        bg={backgroundOverlay}
                                    >
                                        <HStack spacing={3}>
                                            <Image
                                                src={TOKEN_LOGOS[token?.symbol]}
                                                alt={`${token.symbol} logo`}
                                                boxSize="28px"
                                                borderRadius="full"
                                                fallback={
                                                    <Box
                                                        boxSize="28px"
                                                        borderRadius="full"
                                                        bg="whiteAlpha.200"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Text
                                                            fontSize="9px"
                                                            fontWeight="bold"
                                                            color={textPrimary}
                                                        >
                                                            {token.symbol?.slice(
                                                                0,
                                                                3,
                                                            )}
                                                        </Text>
                                                    </Box>
                                                }
                                            />
                                            <VStack
                                                spacing={0}
                                                align="start"
                                            >
                                                <Text
                                                    fontWeight="medium"
                                                    color={textPrimary}
                                                    fontSize="sm"
                                                >
                                                    {token.symbol ?? 'Unknown'}
                                                </Text>
                                                <Text
                                                    color={textSecondary}
                                                    fontSize="xs"
                                                >
                                                    {humanAddress(
                                                        token.address ?? '',
                                                        6,
                                                        4,
                                                    )}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            color={textSecondary}
                                            borderRadius="md"
                                            p={2}
                                            onClick={() =>
                                                removeToken(token.address)
                                            }
                                        >
                                            <LuTrash2 size={16} />
                                        </Button>
                                    </HStack>
                                ))}
                            </VStack>
                        ) : (
                            <Box
                                p={6}
                                borderRadius="xl"
                                bg={backgroundOverlay}
                                textAlign="center"
                            >
                                <Text
                                    fontSize="sm"
                                    color={textSecondary}
                                >
                                    {t('No custom tokens added yet.')}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </VStack>
            </ModalBody>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Bridge/BridgeContent.tsx`

````tsx
import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Button,
    Icon,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { LuExternalLink } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { VechainEnergy } from '@/assets';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { VECHAIN_ENERGY_SWAP_BASE_URL } from '@/constants';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const BridgeContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();

    const handleLaunchVeChainEnergy = () => {
        window.open(VECHAIN_ENERGY_SWAP_BASE_URL, '_blank');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Bridge')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton onClick={() => setCurrentContent('main')} />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={6} align="center" w="full">
                        <VechainEnergy isDark={isDark} borderRadius={'xl'} />

                        <Text fontSize="sm" textAlign="center">
                            {t(
                                'Exchange your digital assets between VeChain and other blockchain networks easily and securely. Swaps are executed through partners that leverage both decentralized and centralized exchanges to convert tokens.',
                            )}
                        </Text>
                    </VStack>
                </ModalBody>
            </Container>

            <ModalFooter>
                <Button
                    variant="vechainKitSecondary"
                    onClick={handleLaunchVeChainEnergy}
                >
                    {t('Launch vechain.energy')}
                    <Icon as={LuExternalLink} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ChooseName/ChooseNameContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Icon,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { LuSquareUser } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type ChooseNameContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onBack?: () => void;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameContent = ({
    setCurrentContent,
    onBack = () => setCurrentContent('settings'),
    initialContentSource = 'settings',
}: ChooseNameContentProps) => {
    const { t } = useTranslation();

    const { isolatedView } = useAccountModalOptions();

    const textColor = useToken('colors', 'vechain-kit-text-primary');
    const secondaryTextColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleBack = () => {
        onBack();
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Choose your account name')}
                </ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" py={8}>
                    <Icon
                        as={LuSquareUser}
                        boxSize={16}
                        color={secondaryTextColor}
                    />
                    <VStack spacing={2}>
                        <Text
                            fontSize="lg"
                            fontWeight="500"
                            textAlign="center"
                            color={textColor}
                        >
                            {t('Finally say goodbye to 0x addresses')}
                        </Text>
                        <Text
                            fontSize="md"
                            color={secondaryTextColor}
                            textAlign="center"
                            px={4}
                        >
                            {t(
                                'Name your account to make it easier to exchange assets',
                            )}
                        </Text>
                    </VStack>
                </VStack>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    onClick={() =>
                        setCurrentContent({
                            type: 'choose-name-search',
                            props: {
                                name: '',
                                setCurrentContent: setCurrentContent,
                                initialContentSource,
                            },
                        })
                    }
                    data-testid="choose-name-button"
                >
                    {t('Choose name')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ChooseName/ChooseNameSearchContent.tsx`

````tsx
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
    useToken,
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
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

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
    const { isolatedView } = useAccountModalOptions();
    const [name, setName] = useState(ens_normalize(initialName));
    const [error, setError] = useState<string | null>(null);
    const [isOwnDomain, setIsOwnDomain] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const errorColor = useToken('colors', 'vechain-kit-error');
    const successColor = useToken('colors', 'vechain-kit-success');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

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
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
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
                            <Box mr={4} fontSize="sm" color={textSecondary}>
                                .veworld.vet
                            </Box>
                        </InputRightElement>
                    </InputGroup>

                    {error && hasInteracted && (
                        <Text
                            color={errorColor}
                            fontSize="sm"
                            data-testid="domain-availability-status"
                        >
                            {error}
                        </Text>
                    )}

                    {!error && hasInteracted && name.length >= 3 && (
                        <Text
                            fontSize="sm"
                            color={isAvailable ? successColor : errorColor}
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
                    isLoading={isFetchingDomainInfo}
                    onClick={handleContinue}
                    loadingText={t('Checking...')}
                    data-testid="continue-button"
                >
                    {t('Continue')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ChooseName/ChooseNameSummaryContent.tsx`

````tsx
import React from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    ModalFooter,
    Text,
    useToken,
    Icon,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useClaimVeWorldSubdomain } from '@/hooks/api/vetDomains/useClaimVeWorldSubdomain';
import { useClaimVetDomain } from '@/hooks/api/vetDomains/useClaimVetDomain';
import { useUnsetDomain } from '@/hooks/api/vetDomains/useUnsetDomain';
import { useTranslation } from 'react-i18next';
import {
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType } from '@/types/gasToken';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { LuSquareUser } from 'react-icons/lu';

export type ChooseNameSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    fullDomain: string;
    domainType?: string;
    isOwnDomain: boolean;
    isUnsetting?: boolean;
    initialContentSource?: AccountModalContentTypes;
};

export const ChooseNameSummaryContent = ({
    setCurrentContent,
    fullDomain,
    domainType = 'veworld.vet',
    isOwnDomain,
    isUnsetting = false,
    initialContentSource = 'settings',
}: ChooseNameSummaryContentProps) => {
    const { t } = useTranslation();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const { isolatedView, closeAccountModal } = useAccountModalOptions();
    const { account, connectedWallet, connection } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const { preferences } = useGasTokenSelection();
    const { feeDelegation } = useVeChainKitConfig();

    const handleError = (error: string) => {
        console.error('Transaction failed:', error);
    };

    // Use the unset domain hook if we're unsetting
    const unsetDomainHook = useUnsetDomain({
        onSuccess: () => handleSuccess(),
    });

    // If not unsetting, determine if this is a .veworld.vet subdomain or a primary .vet domain
    const isVeWorldSubdomain = domainType.endsWith('veworld.vet');

    // Use the appropriate claim hook based on domain type (only when not unsetting)
    const veWorldSubdomainHook = useClaimVeWorldSubdomain({
        subdomain: fullDomain.split('.veworld.vet')[0],
        domain: domainType,
        alreadyOwned: isOwnDomain,
        onSuccess: () => handleSuccess(),
    });

    const vetDomainHook = useClaimVetDomain({
        domain: !isUnsetting && !isVeWorldSubdomain ? fullDomain : '',
        alreadyOwned: isOwnDomain,
        onSuccess: () => handleSuccess(),
    });

    // Use the appropriate hook based on action and domain type
    const {
        sendTransaction,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses,
    } = isUnsetting
        ? unsetDomainHook
        : isVeWorldSubdomain
        ? veWorldSubdomainHook
        : vetDomainHook;

    const handleSuccess = () => {
        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId: txReceipt?.meta.txID,
                title: isUnsetting ? t('Domain unset') : t('Domain set'),
                description: isUnsetting
                    ? t('Your domain has been unset successfully.')
                    : t(`Your address has been successfully set to {{name}}`, {
                          name: fullDomain,
                      }),
                onDone: () => {
                    if (isolatedView) {
                        closeAccountModal();
                    } else {
                        setCurrentContent(initialContentSource);
                    }
                },
            },
        });
    };

    const handleConfirm = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
            await sendTransaction();
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };

    const handleRetry = () => {
        handleConfirm();
    };

    const handleBack = () => {
        setCurrentContent({
            type: 'choose-name-search',
            props: {
                setCurrentContent,
                name: fullDomain,
                initialContentSource,
            },
        });
    };

    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    // Track the user's manual selection to show it during loading (before estimation completes)
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    // VeChain pays gas for domain CLAIMS via the kit-sponsored delegator
    // (see useClaimVetDomain / useClaimVeWorldSubdomain). The unset path
    // (useUnsetDomain) is NOT sponsored — the user pays — so we still
    // need the gas-token UI and balance check for that case. Drives:
    // skip estimation, hide GasFeeSummary, force hasEnoughGasBalance,
    // and suppress gas-estimation errors.
    const KIT_PAYS_GAS = !isUnsetting;

    const shouldEstimateGas =
        !KIT_PAYS_GAS &&
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: clauses(),
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        !KIT_PAYS_GAS &&
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token); // Track user's choice
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance =
        KIT_PAYS_GAS || (!!usedGasToken && !gasEstimationError);

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    // Keep userSelectedGasToken to show during loading, but actual result will show the token that succeeds
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="confirm-domain">
                    {isUnsetting
                        ? t('Confirm Unset Domain')
                        : t('Confirm Name')}
                </ModalHeader>
                <ModalBackButton
                    onClick={handleBack}
                    isDisabled={isTransactionPending}
                />
                <ModalCloseButton isDisabled={isTransactionPending} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuSquareUser}
                        color={textPrimary}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {isUnsetting
                            ? t(
                                  'By confirming, your current domain will be unset',
                              )
                            : t(
                                  'By confirming, your address will be set to {{domain}}',
                                  {
                                      domain: fullDomain,
                                  },
                              )}
                    </Text>
                </VStack>
                {!isUnsetting && (
                    <VStack spacing={4} align="stretch" mt={6}>
                        <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={textPrimary}
                            textAlign="center"
                            data-testid="preconfirm-domain-val"
                        >
                            {fullDomain}
                        </Text>
                    </VStack>
                )}
                {!KIT_PAYS_GAS && connection.isConnectedWithPrivy && (
                    <GasFeeSummary
                        estimation={gasEstimation}
                        isLoading={gasEstimationLoading}
                        isLoadingTransaction={isTransactionPending}
                        onTokenChange={handleGasTokenChange}
                        clauses={clauses() as any}
                        userSelectedToken={userSelectedGasToken}
                    />
                )}
            </ModalBody>

            <ModalFooter gap={4} w="full">
                <TransactionButtonAndStatus
                    transactionError={txError}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    onConfirm={handleConfirm}
                    onRetry={handleRetry}
                    transactionPendingText={
                        isUnsetting
                            ? t('Unsetting current domain...')
                            : t('Claiming name...')
                    }
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isTransactionPending ||
                        disableConfirmButtonDuringEstimation
                    }
                    onError={handleError}
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !KIT_PAYS_GAS &&
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="domain"
                />
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ChooseName/Components/ExistingDomainsList.tsx`

````tsx
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
import { useWallet } from '@/hooks';
import { useWalletMetadata } from '@/hooks/api/wallet/useWalletMetadata';
import { AccountAvatar } from '@/components/common';
import { getPicassoImage, humanDomain } from '@/utils';

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
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ConnectionDetails/Components/ConnectionCard.tsx`

````tsx
import { getConfig } from '@/config';
import {
    useFetchAppInfo,
    useWallet,
    useFetchPrivyStatus,
    useGetAccountVersion,
} from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import {
    VStack,
    Text,
    Spinner,
    HStack,
    useToken,
    useClipboard,
    Icon,
    Divider,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CrossAppConnectionCache } from '@/types';
import { useWallet as useWalletDappKit } from '@vechain/dapp-kit-react';
import packageJson from '../../../../../../package.json';
import { humanAddress } from '@/utils';
import { LuCheck, LuCopy } from 'react-icons/lu';

// Get DAppKit version from package.json (this is the version constraint, not the installed version)
const dappKitVersion =
    packageJson.dependencies?.['@vechain/dapp-kit-react'] ||
    packageJson.peerDependencies?.['@vechain/dapp-kit-react'] ||
    'unknown';

// Get Privy version from package.json
const privyVersion =
    packageJson.dependencies?.['@privy-io/react-auth'] || 'unknown';

type Props = {
    connectionCache?: CrossAppConnectionCache;
};

export const ConnectionCard = ({ connectionCache }: Props) => {
    const { t } = useTranslation();
    const { connection, smartAccount, connectedWallet } = useWallet();
    const { source: sourceDappKit } = useWalletDappKit();
    const { privy, network } = useVeChainKitConfig();

    const privyAppId = privy?.appId;
    const { data: appInfo, isLoading: isPrivyLoading } = useFetchAppInfo(
        privyAppId ? privyAppId : [],
    );

    const { onCopy, hasCopied } = useClipboard('');

    const { data: privyStatus, isLoading: isPrivyStatusLoading } =
        useFetchPrivyStatus();

    const { data: accountVersion, isLoading: isAccountVersionLoading } =
        useGetAccountVersion(
            smartAccount.address ?? '',
            connectedWallet?.address ?? '',
        );

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textColorSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const getConnectionName = (): string | null => {
        if (
            connection.isConnectedWithCrossApp &&
            connectionCache?.ecosystemApp
        ) {
            return connectionCache.ecosystemApp.name;
        }
        if (connection.isConnectedWithSocialLogin && appInfo) {
            const first = Object.values(appInfo)[0];
            return first?.name ?? null;
        }
        if (connection.isConnectedWithDappKit && sourceDappKit) {
            return sourceDappKit;
        }
        return null;
    };

    const connectionName = getConnectionName();
    const isLoading = connection.isConnectedWithSocialLogin && isPrivyLoading;

    const InfoRow = ({
        label,
        value,
        isLoading: isLoadingRow = false,
        href,
    }: {
        label: string;
        value: string | number;
        isLoading?: boolean;
        href?: string;
    }) => (
        <HStack w="full" justifyContent="space-between">
            <Text fontSize="sm" color={textPrimary}>
                {label}:
            </Text>
            <Text
                fontSize="sm"
                as={href ? 'a' : undefined}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: href ? 'underline' : 'none' }}
                color={textColorSecondary}
            >
                {isLoadingRow ? 'Loading...' : value}
            </Text>
        </HStack>
    );

    if (isLoading) {
        return (
            <VStack
                w="full"
                h="full"
                justify="center"
                align="center"
                minH="200px"
                borderRadius={'xl'}
                bg={cardBg}
            >
                <Spinner />
            </VStack>
        );
    }

    if (!connectionName) {
        return null;
    }

    return (
        <VStack
            p={4}
            bg={cardBg}
            borderRadius={'xl'}
            spacing={4}
            w="full"
            justifyContent="space-between"
        >
            <InfoRow label={t('Logged in with')} value={connectionName} />

            {connection.isConnectedWithCrossApp &&
                connectionCache?.timestamp && (
                    <InfoRow
                        label={t('At')}
                        value={new Date(
                            connectionCache.timestamp,
                        ).toLocaleString()}
                    />
                )}

            <InfoRow
                label={t('Connection Type')}
                value={connection.source.type}
                isLoading={connection.isLoading}
            />

            <Divider />

            <InfoRow label={t('Network')} value={network.type} />
            <InfoRow
                label={t('Node URL')}
                value={network.nodeUrl || getConfig(network.type).nodeUrl}
            />

            {connection.isConnectedWithPrivy && <Divider />}

            {connection.isConnectedWithPrivy && (
                <HStack w="full" justifyContent="space-between">
                    <Text fontSize="sm" color={textPrimary}>
                        {t('Embedded wallet')}:
                    </Text>

                    <HStack>
                        <Text fontSize="sm" color={textColorSecondary}>
                            {connectedWallet?.address
                                ? humanAddress(connectedWallet.address, 8, 7)
                                : '-'}
                        </Text>

                        <Icon
                            color={textColorSecondary}
                            onClick={() => {
                                if (connectedWallet?.address)
                                    onCopy(connectedWallet.address);
                            }}
                            opacity={connectedWallet?.address ? 1 : 0.4}
                            pointerEvents={
                                connectedWallet?.address ? 'auto' : 'none'
                            }
                            cursor="pointer"
                            as={hasCopied ? LuCheck : LuCopy}
                        />
                    </HStack>
                </HStack>
            )}

            {connection.isConnectedWithPrivy ? (
                <>
                    <InfoRow
                        label={t('Smart Account')}
                        value={`v${accountVersion?.version ?? ''} ${
                            accountVersion?.isDeployed ? '' : '(not deployed)'
                        }`}
                        isLoading={isAccountVersionLoading}
                    />
                    <InfoRow
                        label={t('Privy Status')}
                        value={privyStatus || ''}
                        isLoading={isPrivyStatusLoading}
                    />
                </>
            ) : (
                smartAccount.isDeployed && (
                    <InfoRow
                        label={t('Smart Account')}
                        value={`v${accountVersion?.version ?? ''}`}
                        isLoading={isAccountVersionLoading}
                    />
                )
            )}

            <Divider />

            <InfoRow
                label={t('VeChain Kit')}
                value={packageJson.version}
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
            />

            <InfoRow label={'DAppKit'} value={dappKitVersion} />

            <InfoRow label={'Privy'} value={privyVersion} />
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ConnectionDetails/Components/WalletSecuredBy.tsx`

````tsx
import { PrivyLogo, VechainLogo } from '@/assets';
import { useCrossAppConnectionCache, useWallet } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { HStack, Icon, Image, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuMinus } from 'react-icons/lu';

export const WalletSecuredBy = () => {
    const { connection } = useWallet();
    const { t } = useTranslation();
    const { privy, darkMode: isDark } = useVeChainKitConfig();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache();
    const cardBg = useToken('colors', 'vechain-kit-card');

    if (!connection.isConnectedWithPrivy) {
        return null;
    }

    return (
        <VStack
            w={'full'}
            align="stretch"
            textAlign={'center'}
            mt={5}
            p={3}
            borderRadius="lg"
            bg={cardBg}
            shadow="sm"
        >
            <Text fontSize={'xs'} fontWeight={'800'}>
                {t('Wallet secured by')}
            </Text>
            <HStack justify={'center'}>
                <PrivyLogo isDark={isDark} w={'50px'} />
                <Icon as={LuMinus} ml={3} />

                {connection.isConnectedWithVeChain ? (
                    <VechainLogo
                        isDark={isDark}
                        w={'80px'}
                        h={'auto'}
                        mb={'3px'}
                    />
                ) : (
                    connection.isConnectedWithCrossApp &&
                    connectionCache && (
                        <Image
                            src={connectionCache.ecosystemApp.logoUrl}
                            alt={connectionCache.ecosystemApp.name}
                            maxW="40px"
                            borderRadius="md"
                        />
                    )
                )}

                {connection.isConnectedWithSocialLogin &&
                    !connection.isConnectedWithVeChain && (
                        <Image
                            src={privy?.appearance.logo}
                            alt={privy?.appearance.logo}
                            maxW="40px"
                            borderRadius="md"
                        />
                    )}
            </HStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ConnectionDetails/ConnectionDetailsContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '@/hooks';
import { ConnectionCard, WalletSecuredBy } from './Components';

type Props = {
    onGoBack: () => void;
};

export const ConnectionDetailsContent = ({ onGoBack }: Props) => {
    const { t } = useTranslation();
    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache() ?? undefined;

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Connection Details')}</ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        onGoBack();
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <ConnectionCard connectionCache={connectionCache} />
                <WalletSecuredBy />
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/DisconnectConfirmation/DisconnectConfirmContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    useToken,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import { LuLogOut } from 'react-icons/lu';

export type DisconnectConfirmContentProps = {
    onDisconnect: () => void;
    onBack: () => void;
    onClose?: () => void;
    text?: string;
    showCloseButton?: boolean;
};

export const DisconnectConfirmContent = ({
    onDisconnect,
    onBack,
    onClose,
    showCloseButton = true,
    text,
}: DisconnectConfirmContentProps) => {
    const { t } = useTranslation();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textTitle =
        text ?? t('Are you sure you want to disconnect your wallet?');
    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Logout')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                {showCloseButton ? (
                    <ModalCloseButton onClick={onClose} />
                ) : null}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuLogOut}
                        color={'#ef4444'}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {textTitle}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter w="full" mt={4}>
                <VStack spacing={3} w="full">
                    <Button
                        onClick={onDisconnect}
                        data-testid="disconnect-button"
                        variant="vechainKitLogout"
                    >
                        {t('Confirm')}
                    </Button>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={onBack}
                        data-testid="cancel-logout-button"
                    >
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/AppOverviewContent.tsx`

````tsx
import {
    Button,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    Flex,
    HStack,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from 'react-icons/lu';
import { ShortcutButton } from './Components/ShortcutButton';
import { CategoryLabel, AllowedCategories } from './Components/CategoryLabel';
import { CategoryFilter } from './Components/CategoryFilterSection';

export type AppOverviewContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    image: string;
    url: string;
    description: string;
    category?: AllowedCategories;
    selectedCategory?: CategoryFilter;
    logoComponent?: JSX.Element;
};

export const AppOverviewContent = ({
    setCurrentContent,
    name,
    image,
    url,
    description,
    category,
    selectedCategory,
    logoComponent,
}: AppOverviewContentProps) => {
    const { t } = useTranslation();

    const handleLaunchApp = () => {
        window.open(url, '_blank');
    };

    const handleBackClick = () => {
        if (selectedCategory) {
            setCurrentContent({
                type: 'ecosystem-with-category',
                props: {
                    selectedCategory,
                    setCurrentContent,
                },
            });
        } else {
            setCurrentContent('ecosystem');
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{name}</ModalHeader>
                <ModalBackButton onClick={handleBackClick} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" w="full">
                    <Flex direction="column" align="center">
                        {logoComponent ? (
                            logoComponent
                        ) : (
                            <Image
                                src={image}
                                alt={name}
                                w={'200px'}
                                h={'200px'}
                                objectFit="contain"
                                borderRadius={'xl'}
                            />
                        )}

                        {category && (
                            <HStack mt={2}>
                                <CategoryLabel category={category} />
                            </HStack>
                        )}
                    </Flex>

                    <Text fontSize="sm" textAlign="center">
                        {description}
                    </Text>

                    <Text fontSize="sm" textAlign="center">
                        {t(
                            'Click below to access {{ name }} and explore its features.',
                            { name },
                        )}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <VStack w="full" spacing={4}>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={handleLaunchApp}
                    >
                        {t('Launch {{name}}', { name })}
                        <Icon as={LuExternalLink} ml={2} />
                    </Button>

                    <ShortcutButton
                        name={name}
                        image={image}
                        url={url}
                        description={description}
                    />
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/AppComponent.tsx`

````tsx
import { useIpfsImage, useXAppMetadata, XApp } from '@/hooks';
import { SharedAppCard } from './SharedAppCard';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { Skeleton } from '@chakra-ui/react';
import { CategoryFilter } from './CategoryFilterSection';

type Props = {
    xApp: XApp;
    selectedCategory?: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AppComponent = ({
    xApp,
    setCurrentContent,
    selectedCategory,
}: Props) => {
    const { data: appMetadata, isLoading: appMetadataLoading } =
        useXAppMetadata(xApp.id);
    const { data: logo, isLoading: isLogoLoading } = useIpfsImage(
        appMetadata?.logo,
    );

    const handleAppClick = () => {
        if (appMetadata?.name) {
            setCurrentContent({
                type: 'app-overview',
                props: {
                    name: appMetadata.name,
                    image: logo?.image ?? '',
                    url: appMetadata?.external_url ?? '',
                    description: appMetadata?.description ?? '',
                    category: 'vebetter',
                    selectedCategory,
                    setCurrentContent,
                },
            });
        }
    };

    return (
        <Skeleton
            isLoaded={!appMetadataLoading && !isLogoLoading}
            borderRadius="md"
            height="100%"
        >
            <SharedAppCard
                name={appMetadata?.name ?? ''}
                imageUrl={logo?.image ?? ''}
                linkUrl={appMetadata?.external_url ?? ''}
                category="vebetter"
                onClick={handleAppClick}
            />
        </Skeleton>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/CategoryFilterSection.tsx`

````tsx
import { Box, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { CategoryLabel, AllowedCategories } from './CategoryLabel';

export type CategoryFilter = string | null;

type CategoryFilterSectionProps = {
    selectedCategory: CategoryFilter;
    onCategoryChange: (category: CategoryFilter) => void;
    categories: AllowedCategories[];
    darkMode: boolean;
};

export const CategoryFilterSection = ({
    selectedCategory,
    onCategoryChange,
    categories,
    darkMode,
}: CategoryFilterSectionProps) => {
    const { t } = useTranslation();

    return (
        <Box width="full" mb={4}>
            <Text fontSize="sm" fontWeight="500" mb={2}>
                {t('Filter by category')}
            </Text>
            <Wrap spacing={2}>
                <WrapItem>
                    <Tag
                        size="md"
                        borderRadius="full"
                        variant={
                            selectedCategory === null ? 'solid' : 'outline'
                        }
                        colorScheme={darkMode ? 'gray' : 'blackAlpha'}
                        cursor="pointer"
                        onClick={() => onCategoryChange(null)}
                    >
                        {t('All')}
                    </Tag>
                </WrapItem>

                {categories.map((category) => (
                    <WrapItem key={category}>
                        <CategoryLabel
                            category={category}
                            size="md"
                            variant={
                                selectedCategory === category
                                    ? 'solid'
                                    : 'outline'
                            }
                            cursor="pointer"
                            onClick={() => onCategoryChange(category)}
                        />
                    </WrapItem>
                ))}
            </Wrap>
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/CategoryLabel.tsx`

````tsx
import { Tag, TagProps } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type AllowedCategories =
    | 'defi'
    | 'games'
    | 'collectibles'
    | 'marketplaces'
    | 'utilities'
    | 'vebetter';

type CategoryProps = {
    category: AllowedCategories;
} & Omit<TagProps, 'category'>;

const getCategoryColor = (category: AllowedCategories): string => {
    switch (category) {
        case 'defi':
            return 'blue';
        case 'games':
            return 'green';
        case 'collectibles':
            return 'purple';
        case 'marketplaces':
            return 'orange';
        case 'utilities':
            return 'cyan';
        default:
            return 'gray';
    }
};

export const CategoryLabel = ({ category, ...props }: CategoryProps) => {
    const { t } = useTranslation();

    const categoryKey = category.toLowerCase() as AllowedCategories;
    const color = getCategoryColor(categoryKey);

    return (
        <Tag
            size="sm"
            colorScheme={color}
            borderRadius="full"
            px={2}
            {...props}
        >
            {t(categoryKey)}
        </Tag>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/CustomAppComponent.tsx`

````tsx
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { SharedAppCard } from './SharedAppCard';
import { CategoryFilter } from './CategoryFilterSection';
import { AllowedCategories } from './CategoryLabel';

type Props = {
    name: string;
    image: string;
    url: string;
    description: string;
    category?: AllowedCategories;
    logoComponent?: JSX.Element;
    selectedCategory?: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const CustomAppComponent = ({
    name,
    image,
    url,
    description,
    category,
    logoComponent,
    selectedCategory,
    setCurrentContent,
}: Props) => {
    const handleAppClick = () => {
        setCurrentContent({
            type: 'app-overview',
            props: {
                name,
                image,
                url,
                description,
                category,
                logoComponent,
                selectedCategory,
                setCurrentContent,
            },
        });
    };

    return (
        <SharedAppCard
            name={name}
            imageUrl={image}
            linkUrl={url}
            category={category}
            onClick={handleAppClick}
            {...(logoComponent && { logoComponent })}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/SharedAppCard.tsx`

````tsx
import { Card, CardBody, Image, Text, VStack, Box } from '@chakra-ui/react';
import { notFoundImage } from '@/utils';
import { CategoryLabel, AllowedCategories } from './CategoryLabel';

export type SharedAppCardProps = {
    name?: string;
    imageUrl: string;
    linkUrl: string;
    category?: AllowedCategories;
    logoComponent?: JSX.Element;
    onClick: () => void;
    size?: 'sm' | 'md';
};

export const SharedAppCard = ({
    name,
    imageUrl,
    logoComponent,
    category,
    onClick,
    size = 'md',
}: SharedAppCardProps) => {
    return (
        <Card
            variant="vechainKitAppCard"
            _hover={{ opacity: 0.8 }}
            cursor="pointer"
            onClick={onClick}
            position="relative"
        >
            {category && (
                <Box position="absolute" top="2" right="2" zIndex="1">
                    <CategoryLabel category={category} />
                </Box>
            )}
            <CardBody p={size === 'sm' ? 2 : 4} alignItems="center">
                <VStack spacing={2} h="100%" justifyContent="space-between">
                    {logoComponent
                        ? logoComponent
                        : imageUrl && (
                              <Image
                                  src={imageUrl}
                                  fallbackSrc={notFoundImage}
                                  alt={name}
                                  height="90px"
                                  objectFit="contain"
                                  rounded="full"
                              />
                          )}
                    {name && (
                        <Text
                            fontWeight="medium"
                            wordBreak="break-word"
                            noOfLines={1}
                            textAlign="center"
                            w="full"
                        >
                            {name}
                        </Text>
                    )}
                </VStack>
            </CardBody>
        </Card>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/ShortcutButton.tsx`

````tsx
import { Button, Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuBookmark, LuBookmarkCheck } from 'react-icons/lu';
import { useEcosystemShortcuts } from '@/hooks';

type Props = {
    name: string;
    image: string;
    url: string;
    description?: string;
};

export const ShortcutButton = ({ name, image, url, description }: Props) => {
    const { t } = useTranslation();
    const { isShortcut, addShortcut, removeShortcut } = useEcosystemShortcuts();
    const hasShortcut = isShortcut(url);

    const handleShortcutClick = () => {
        if (hasShortcut) {
            removeShortcut(url);
        } else {
            addShortcut({ name, image, url, description });
        }
    };

    return (
        <Button
            px={4}
            width="full"
            height="45px"
            variant="vechainKitSecondary"
            borderRadius="xl"
            onClick={handleShortcutClick}
            leftIcon={<Icon as={hasShortcut ? LuBookmarkCheck : LuBookmark} />}
        >
            {hasShortcut ? t('Remove from shortcuts') : t('Add to shortcuts')}
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/ShortcutsSection.tsx`

````tsx
import {
    Card,
    CardBody,
    Grid,
    GridItem,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEcosystemShortcuts } from '@/hooks';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { useTranslation } from 'react-i18next';
import { notFoundImage } from '@/utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ShortcutsSection = ({}: Props) => {
    const { t } = useTranslation();
    const { shortcuts } = useEcosystemShortcuts();

    if (shortcuts.length === 0) return null;

    return (
        <VStack w="full" align="flex-start" spacing={2}>
            <Text fontSize="sm" fontWeight="500">
                {t('Shortcuts')}
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full">
                {shortcuts.map((shortcut) => (
                    <GridItem key={shortcut.url}>
                        <Card
                            _hover={{ opacity: 0.8 }}
                            cursor="pointer"
                            onClick={() => window.open(shortcut.url, '_blank')}
                        >
                            <CardBody p={2} alignItems="center">
                                <Image
                                    src={shortcut.image}
                                    fallbackSrc={notFoundImage}
                                    alt={shortcut.name}
                                    objectFit="contain"
                                    rounded="full"
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/Components/SkeletonAppCard.tsx`

````tsx
import { Card, CardBody, VStack, Skeleton } from '@chakra-ui/react';

export const SkeletonAppCard = () => {
    return (
        <Card variant="vechainKitAppCard">
            <CardBody p={4} alignItems="center">
                <VStack
                    spacing={3}
                    align="center"
                    justify="center"
                    width="100%"
                >
                    <Skeleton height="100px" width="100%" rounded="12px" />
                    <Skeleton height="20px" width="80%" rounded="md" />
                </VStack>
            </CardBody>
        </Card>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/ExploreEcosystemContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Grid,
    GridItem,
    ModalFooter,
    Text,
    Spinner,
    Center,
    useToken,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import React, { useState, useMemo, useEffect } from 'react';
import {
    useCurrentAllocationsRoundId,
    useEcosystemShortcuts,
    useMostVotedAppsInRound,
    XAppMetadata,
} from '@/hooks';
import { useAppHubApps, AppHubApp } from '@/hooks';
import { AppComponent } from './Components/AppComponent';
import { CustomAppComponent } from './Components/CustomAppComponent';
import { ShortcutsSection } from './Components/ShortcutsSection';
import {
    CategoryFilterSection,
    CategoryFilter,
} from './Components/CategoryFilterSection';
import { AllowedCategories } from './Components/CategoryLabel';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    VEBETTERDAO_GOVERNANCE_BASE_URL,
    VET_DOMAINS_BASE_URL,
    COINMARKETCAP_STATIC_BASE_URL,
} from '@/constants';

export type EcosystemWithCategoryProps = {
    selectedCategory: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    selectedCategory?: CategoryFilter;
};

// Mock data - Replace with real data from your API
const DEFAULT_APPS: XAppMetadata[] = [
    {
        name: 'VeBetterDAO',
        description: 'Engage, earn and prosper by doing sustainable actions.',
        external_url: VEBETTERDAO_GOVERNANCE_BASE_URL,
        logo: new URL(
            '/static/img/coins/64x64/33509.png',
            COINMARKETCAP_STATIC_BASE_URL,
        ).toString(),
        banner: new URL(
            '/static/img/icons/vbd.png',
            COINMARKETCAP_STATIC_BASE_URL,
        ).toString(),
        screenshots: [],
        social_urls: [],
        app_urls: [],
        tweets: [],
        ve_world: {
            banner: new URL(
                '/static/img/icons/vbd.png',
                COINMARKETCAP_STATIC_BASE_URL,
            ).toString(),
        },
        categories: [],
    },
    {
        name: 'vet.domains',
        description:
            '.vet.domains provides a unique and unchangeable identity for Vechain users by linking information to their wallet addresses. It becomes easier for people to use the blockchain by replacing complicated wallet addresses with easy-to-remember names.',
        external_url: VET_DOMAINS_BASE_URL,
        logo: new URL(
            '/assets/walletconnect.png',
            VET_DOMAINS_BASE_URL,
        ).toString(),
        banner: new URL(
            '/assets/walletconnect.png',
            VET_DOMAINS_BASE_URL,
        ).toString(),
        screenshots: [],
        social_urls: [],
        app_urls: [],
        tweets: [],
        ve_world: {
            banner: new URL(
                '/assets/walletconnect.png',
                VET_DOMAINS_BASE_URL,
            ).toString(),
        },
        categories: [],
    },
];

export const ExploreEcosystemContent = ({
    setCurrentContent,
    selectedCategory,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();

    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const [searchQuery, setSearchQuery] = useState('');

    // Initialize currentCategory with selectedCategory or null
    const [currentCategory, setCurrentCategory] = useState<CategoryFilter>(
        selectedCategory || null,
    );

    // Update currentCategory when selectedCategory changes
    useEffect(() => {
        if (selectedCategory !== undefined) {
            setCurrentCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const { data: currentRoundId } = useCurrentAllocationsRoundId();
    const { data: vbdApps } = useMostVotedAppsInRound(
        currentRoundId ? (parseInt(currentRoundId) - 1).toString() : '1',
    );
    const {
        data: appHubApps,
        isLoading: appHubLoading,
        error: appHubError,
    } = useAppHubApps();

    // Extract unique categories from app hub apps and add VeBetter category
    const categories = useMemo(() => {
        const categorySet = new Set<AllowedCategories>();

        // Add VeBetter category if there are VBD apps and we're on mainnet
        if (network.type === 'main' && vbdApps && vbdApps.length > 0) {
            categorySet.add('vebetter');
        }

        // Add categories from app hub
        if (appHubApps) {
            appHubApps.forEach((app) => {
                if (app.category) {
                    categorySet.add(app.category);
                }
            });
        }

        return Array.from(categorySet).sort();
    }, [appHubApps, vbdApps, network.type]);

    // Only show VBD apps if we're on mainnet
    const isMainnet = network.type === 'main';

    // Filter VeBetterDAO apps based on search query
    const filteredVbdApps = isMainnet
        ? vbdApps.filter((dapp) =>
              dapp.app.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [];

    // Filter default apps based on search query
    const filteredDefaultApps = DEFAULT_APPS.filter((dapp) =>
        dapp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filter App Hub apps based on search query and selected category
    const filteredAppHubApps =
        appHubApps?.filter(
            (app: AppHubApp) =>
                // Text search filter
                (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    app.tags.some((tag: string) =>
                        tag.toLowerCase().includes(searchQuery.toLowerCase()),
                    )) &&
                // Category filter
                (currentCategory === null || app.category === currentCategory),
        ) || [];

    // Determine which apps to display based on category filter
    const shouldShowDefaultApps = currentCategory === null;
    const shouldShowVbdApps =
        currentCategory === null || currentCategory === 'vebetter';

    const { shortcuts } = useEcosystemShortcuts();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (category: CategoryFilter) => {
        setCurrentCategory(category);
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Ecosystem')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('settings')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody overflowY="auto" minH="300px">
                <VStack spacing={6} w="full">
                    <ShortcutsSection setCurrentContent={setCurrentContent} />

                    {shortcuts.length > 0 && (
                        <Text
                            fontSize="sm"
                            fontWeight="500"
                            w="full"
                            textAlign="left"
                        >
                            {t('All apps')}
                        </Text>
                    )}
                    <InputGroup size="lg">
                        <Input
                            placeholder={t('Search Apps')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            bg={isDark ? '#00000038' : 'gray.50'}
                            borderRadius="xl"
                            height="56px"
                            pl={12}
                        />
                        <InputLeftElement h="56px" w="56px" pl={4}>
                            <LuSearch color={textTertiary} />
                        </InputLeftElement>
                    </InputGroup>

                    {/* Category filter section */}
                    {categories.length > 0 && (
                        <CategoryFilterSection
                            selectedCategory={currentCategory}
                            onCategoryChange={handleCategoryChange}
                            categories={categories}
                            darkMode={isDark}
                        />
                    )}

                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        {/* Default Apps */}
                        {shouldShowDefaultApps &&
                            filteredDefaultApps.length > 0 && (
                                <>
                                    {filteredDefaultApps.map((dapp) => (
                                        <GridItem key={dapp.name}>
                                            <CustomAppComponent
                                                name={dapp.name}
                                                image={dapp.logo}
                                                url={dapp.external_url}
                                                setCurrentContent={
                                                    setCurrentContent
                                                }
                                                description={dapp.description}
                                                selectedCategory={
                                                    currentCategory
                                                }
                                            />
                                        </GridItem>
                                    ))}
                                </>
                            )}

                        {/* VeBetterDAO Apps */}
                        {shouldShowVbdApps && filteredVbdApps.length > 0 && (
                            <>
                                {filteredVbdApps.map((dapp) => (
                                    <GridItem key={dapp.id}>
                                        <AppComponent
                                            xApp={dapp.app}
                                            setCurrentContent={
                                                setCurrentContent
                                            }
                                            selectedCategory={currentCategory}
                                        />
                                    </GridItem>
                                ))}
                            </>
                        )}

                        {/* App Hub Apps */}
                        {appHubLoading ? (
                            <GridItem colSpan={2}>
                                <Center py={4}>
                                    <Spinner />
                                </Center>
                            </GridItem>
                        ) : appHubError ? (
                            <GridItem colSpan={2}>
                                <Text color="red.500" textAlign="center">
                                    {t('Failed to load App Hub apps')}
                                </Text>
                            </GridItem>
                        ) : filteredAppHubApps.length > 0 ? (
                            filteredAppHubApps.map((app: AppHubApp) => (
                                <GridItem key={app.id}>
                                    <CustomAppComponent
                                        name={app.name}
                                        image={app.logo}
                                        url={app.url}
                                        setCurrentContent={setCurrentContent}
                                        description={app.description}
                                        category={app.category}
                                        selectedCategory={currentCategory}
                                    />
                                </GridItem>
                            ))
                        ) : (
                            currentCategory &&
                            !shouldShowVbdApps && (
                                <GridItem colSpan={2}>
                                    <Center py={4}>
                                        <Text>
                                            {t(
                                                'No apps found in this category',
                                            )}
                                        </Text>
                                    </Center>
                                </GridItem>
                            )
                        )}
                    </Grid>
                </VStack>
            </ModalBody>

            <ModalFooter pt={0} />
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/FAQ/FAQAccordion.tsx`

````tsx
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    Icon,
    VStack,
    InputGroup,
    Input,
    InputLeftElement,
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp, LuSearch, LuSlash } from 'react-icons/lu';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

export const FAQAccordion = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');

    // Use semantic tokens for colors
    const inputBg = useToken('colors', 'vechain-kit-card');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const accordionBg = useToken('colors', 'vechain-kit-card');
    const accordionBgHover = useToken('colors', 'vechain-kit-card-elevated');

    const faqItems: FAQItem[] = [
        {
            question: t('What is VeChain?'),
            answer: t(
                'VeChain, headquartered in San Marino, Europe, is a pioneering blockchain ecosystem and creator of VeChainThor, a world-class smart contract platform driving real-world blockchain adoption. Founded in 2015 by Sunny Lu, VeChain has consistently worked to deliver a transparent, efficient, scalable, and adaptable blockchain solution.',
            ),
        },
        {
            question: t('What is a wallet?'),
            answer: t(
                'A wallet is your gateway to the VeChain blockchain. It stores your private keys and allows you to securely manage your digital assets, send and receive tokens, and interact with decentralized applications. Think of it as your digital bank account for blockchain transactions.',
            ),
        },
        {
            question: t('What is a Smart Account?'),
            answer: t(
                'A Smart Account is a smart contract wallet that provides enhanced security and functionality. It allows for features like social recovery, transaction batching, and more.',
            ),
        },
        {
            question: t('How is my wallet secured?'),
            answer: t(
                'Your wallet security depends on how you access it. With self-custody options like the VeWorld extension, mobile app, or hardware wallet, you have complete control over your private keys. This extension itself has no access to your private keys. When logging in with social accounts or VeChain, your wallet is created and secured by Privy and managed by VeChain, providing an easier onboarding experience while maintaining security.',
            ),
        },
        {
            question: t('How do I backup my wallet?'),
            answer: t(
                "Backing up your wallet is crucial as you are the only one with access to your private keys. If something goes wrong, having your private key is the only way to recover your assets. How to backup depends on how you access your wallet: If using VeWorld, the backup option is available within the app. For social login users, you can find backup options in the Wallet section. If you're connected through VeChain or another ecosystem app, you'll need to visit the original website, log in, and access the Wallet section from there.",
            ),
        },
        {
            question: t('What is a network?'),
            answer: t(
                "A network in blockchain refers to the environment where transactions take place. VeChain has two main networks: Mainnet (the live network where real transactions occur) and Testnet (a testing environment for developers). The network you're connected to is displayed at the top of this modal.",
            ),
        },
        {
            question: t('What is a domain name?'),
            answer: t(
                'A domain name is a sort of nickname for your wallet address. It allows you to easily identify your wallet and interact with dApps using a human-readable name. For example, if your wallet address is 0x1234567890, your nickname could be "alice.vechain".',
            ),
        },
        {
            question: t('What is Privy?'),
            answer: t(
                'Privy builds user onboarding and embedded wallet infrastructure to enable better products built on crypto rails. This means embedding asset control within applications themselves to enable users, businesses or machines to use digital assets through seamless product experiences.',
            ),
        },
        {
            question: t('What is VeBetterDAO?'),
            answer: t(
                'VeBetterDAO is a decentralized organization on VeChain blockchain focused on sustainability. Members participate in the governance of the DAO using B3TR tokens for rewards and VOT3 for voting in proposals and weekly token allocation rounds.',
            ),
        },
        {
            question: t('What is an x2earn application?'),
            answer: t(
                'An X2Earn application in VeBetterDAO is a sustainable app that rewards users with B3TR tokens for eco-friendly actions. These apps must distribute B3TR, link user wallets, and provide proof of sustainable actions. They join VeBetterDAO through endorsement and participate in weekly token allocation rounds.',
            ),
        },
        {
            question: t('What is B3TR?'),
            answer: t(
                'B3TR is the incentive token of VeBetterDAO, built on VechainThor blockchain. It has a capped supply of 1 billion tokens, emitted weekly over 12 years. B3TR is used for rewards, governance, and backing VOT3 tokens 1:1. It supports sustainability applications and DAO treasury management.',
            ),
        },
        {
            question: t('What is VET?'),
            answer: t(
                'VET is the primary cryptocurrency of the VeChain network. It represents value and ownership in the VeChain ecosystem, similar to how stocks represent ownership in a company. Holding VET automatically generates VTHO, which is needed to pay for transactions on the network.',
            ),
        },
        {
            question: t('What is VTHO?'),
            answer: t(
                "VTHO (VeThor) is the energy or 'gas' token of the VeChain network. It's used to pay for transaction fees when interacting with the blockchain. VTHO is automatically generated by holding VET tokens, creating a two-token system that helps maintain network stability and manage transaction costs.",
            ),
        },
        {
            question: t('How do I send tokens?'),
            answer: t(
                "You can send tokens by clicking the send icon in the Quick Actions section. Enter the recipient's address or VeChain domain name, select the token, and specify the amount you want to send.",
            ),
        },
        {
            question: t('What is fee delegation?'),
            answer: t(
                "Fee delegation is a unique feature of VeChain that allows someone else (a delegator) to pay for your transaction fees. While many dApps and service providers act as delegators to make it easier for new users to get started, some transactions may still require you to pay fees using your own VTHO. Fees are necessary to prevent network spam and compensate the nodes that process and validate transactions on the blockchain. When paying fees yourself, you'll be able to select VTHO from your assets to cover the transaction cost.",
            ),
        },
    ];

    // Filter FAQ items based on search query
    const filteredFaqItems = faqItems.filter(
        (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof item.answer === 'string' &&
                item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    return (
        <VStack spacing={4} align="stretch">
            <InputGroup size="lg">
                <Input
                    placeholder={t('Search FAQ')}
                    bg={inputBg}
                    borderRadius="xl"
                    height="56px"
                    pl={12}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputLeftElement h="56px" w="56px" pl={4}>
                    <LuSearch color={textTertiary} />
                </InputLeftElement>
            </InputGroup>

            {filteredFaqItems.length === 0 ? (
                <VStack spacing={2} py={8} color={textSecondary}>
                    <Icon as={LuSlash} boxSize={12} opacity={0.5} />
                    <Text fontSize="lg">{t('No questions found')}</Text>
                    <Text fontSize="md">
                        {t('Try searching with a different term')}
                    </Text>
                </VStack>
            ) : (
                <Accordion allowMultiple>
                    {filteredFaqItems.map((item, index) => (
                        <AccordionItem key={index} border="none" mb={2}>
                            {({ isExpanded }) => (
                                <>
                                    <AccordionButton
                                        bg={accordionBg}
                                        borderRadius="xl"
                                        color={textSecondary}
                                        _hover={{
                                            bg: accordionBgHover,
                                        }}
                                    >
                                        <Box flex="1" textAlign="left" py={2}>
                                            <Text fontWeight="500" color={textSecondary}>
                                                {item.question}
                                            </Text>
                                        </Box>
                                        <Icon
                                            as={
                                                isExpanded
                                                    ? LuChevronUp
                                                    : LuChevronDown
                                            }
                                            fontSize="20px"
                                            opacity={0.5}
                                        />
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        <Text fontSize="sm" color={textSecondary} opacity={0.8}>
                                            {item.answer}
                                        </Text>
                                    </AccordionPanel>
                                </>
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/FAQ/FAQContent.tsx`

````tsx
import {
    Button,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Icon,
    Select,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { FAQAccordion } from './FAQAccordion';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { VECHAIN_KIT_DOCS_BASE_URL } from '@/constants';

export type FAQContentProps = {
    onGoBack: () => void;
    showLanguageSelector?: boolean;
};

export const FAQContent = ({
    onGoBack,
    showLanguageSelector = true,
}: FAQContentProps) => {
    const { i18n, t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    // Use semantic tokens for colors
    const selectBg = useToken('colors', 'vechain-kit-card');
    const selectBorder = useToken('colors', 'vechain-kit-border');
    const selectBorderHover = useToken('colors', 'vechain-kit-border-hover');

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Help')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={onGoBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack spacing={6} align="stretch">
                    {showLanguageSelector && (
                        <Select
                            borderRadius={'md'}
                            size="sm"
                            width="auto"
                            value={i18n.language}
                            onChange={handleLanguageChange}
                            bg={selectBg}
                            borderColor={selectBorder}
                            _hover={{
                                borderColor: selectBorderHover,
                            }}
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {
                                        languageNames[
                                            lang as keyof typeof languageNames
                                        ]
                                    }
                                </option>
                            ))}
                        </Select>
                    )}

                    <Button
                        as={Link}
                        href={VECHAIN_KIT_DOCS_BASE_URL}
                        isExternal
                        variant="vechainKitSecondary"
                        rightIcon={<Icon as={LuExternalLink} />}
                    >
                        {t('For developers')}
                    </Button>

                    <FAQAccordion />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/FailedOperation/FailedOperationContent.tsx`

````tsx
import {
    Button,
    HStack,
    Icon,
    Link,
    Text,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { StatusScreen } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';

export type FailedOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    txId?: string;
    title: string;
    description?: string;
    onDone: () => void;
};

export const FailedOperationContent = ({
    txId,
    title,
    description,
    onDone,
}: FailedOperationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <StatusScreen
            status={'error'}
            title={title}
            description={description}
            actions={
                <Button
                    onClick={onDone}
                    variant={'vechainKitSecondary'}
                    width={'full'}
                >
                    {t('Done')}
                </Button>
            }
            footerExtras={
                txId ? (
                    <Link
                        href={`${explorerUrl}/${txId}`}
                        isExternal
                        opacity={0.6}
                        fontSize={'14px'}
                        textDecoration={'underline'}
                    >
                        <HStack
                            spacing={1}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Text color={textSecondary}>
                                {t('View transaction on the explorer')}
                            </Text>
                            <Icon as={LuExternalLink} boxSize={'14px'} />
                        </HStack>
                    </Link>
                ) : undefined
            }
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/ChangeCurrencyContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    ModalFooter,
    Text,
    Icon,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { CURRENCY, CURRENCY_SYMBOLS } from '@/types';
import { useCurrency } from '@/hooks';
import { LuCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { setLocalStorageItem } from '@/utils/ssrUtils';

export type ChangeCurrencyContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ChangeCurrencyContent = ({
    setCurrentContent,
}: ChangeCurrencyContentProps) => {
    const { t } = useTranslation();
    const { currentCurrency, changeCurrency, allCurrencies } = useCurrency();
    const selectedBg = useColorModeValue(
        'rgba(0, 0, 0, 0.1)',
        'rgba(255, 255, 255, 0.05)',
    );

    useEffect(() => {
        // Ensure we mark the currency settings as visited when this component mounts
        setLocalStorageItem('settings-currency-visited', 'true');
    }, []);

    const renderCurrencyButton = (currency: CURRENCY) => {
        const isSelected = currentCurrency === currency;
        return (
            <Button
                key={currency}
                w="full"
                variant="ghost"
                justifyContent="space-between"
                onClick={() => changeCurrency(currency)}
                py={6}
                px={4}
                bg={isSelected ? selectedBg : undefined}
            >
                <HStack spacing={3}>
                    <Text fontSize="xl">{CURRENCY_SYMBOLS[currency]}</Text>
                    <Text>{currency.toUpperCase()}</Text>
                </HStack>
                {isSelected && (
                    <Icon as={LuCheck} boxSize={5} color="blue.500" />
                )}
            </Button>
        );
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select currency')}</ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>
            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={3}
                    align="flex-start"
                    w={'full'}
                >
                    {allCurrencies.map((cur) => renderCurrencyButton(cur))}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/GasTokenDragList.tsx`

````tsx
import { useState, useRef } from 'react';
import {
    Box,
    HStack,
    VStack,
    Text,
    Switch,
    Icon,
    useToken,
} from '@chakra-ui/react';
import { LuGripVertical } from 'react-icons/lu';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS } from '@/utils/constants';
import { useVeChainKitConfig } from '@/providers';

interface DragListProps {
    tokens: GasTokenType[];
    excludedTokens: GasTokenType[];
    onReorder: (newOrder: GasTokenType[]) => void;
    onToggleExclusion: (token: GasTokenType) => void;
}

interface TokenItemProps {
    token: GasTokenType;
    index: number;
    isExcluded: boolean;
    onToggleExclusion: (token: GasTokenType) => void;
    onDragStart: (index: number) => void;
    onDragOver: (index: number) => void;
    onDrop: (index: number) => void;
    onTouchStart: (index: number, event: React.TouchEvent) => void;
    onTouchMove: (event: React.TouchEvent) => void;
    onTouchEnd: () => void;
    isDragging: boolean;
    isDraggedOver: boolean;
}

const TokenPriorityItem = ({
    token,
    index,
    isExcluded,
    onToggleExclusion,
    onDragStart,
    onDragOver,
    onDrop,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isDragging,
    isDraggedOver,
}: TokenItemProps) => {
    const tokenInfo = SUPPORTED_GAS_TOKENS[token];
    const { darkMode: isDark } = useVeChainKitConfig();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    return (
        <Box
            bg={isDark ? '#ffffff0a' : 'blackAlpha.50'}
            borderRadius="md"
            border="1px"
            borderColor={
                isDragging
                    ? isDark
                        ? 'blue.500'
                        : 'blue.300'
                    : isDraggedOver
                    ? isDark
                        ? 'blue.400'
                        : 'blue.200'
                    : cardBg
            }
            p={3}
            mb={2}
            opacity={isDragging ? 0.5 : isExcluded ? 0.5 : 1}
            cursor="move"
            transition="background-color 0.2s ease, border-color 0.2s ease"
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver(index);
            }}
            onDrop={() => onDrop(index)}
            onTouchStart={(e) => onTouchStart(index, e)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            _hover={{
                backgroundColor: isDark ? '#ffffff12' : 'blackAlpha.200',
            }}
        >
            <HStack justify="space-between">
                <HStack opacity={isExcluded ? 0.5 : 1}>
                    <Box
                        cursor="grab"
                        _active={{ cursor: 'grabbing' }}
                        pointerEvents="none"
                    >
                        <Icon as={LuGripVertical} color={textSecondary} />
                    </Box>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textPrimary}>
                            {tokenInfo.name}
                        </Text>
                        <Text fontSize="sm" color={textSecondary}>
                            {tokenInfo.description}
                        </Text>
                    </VStack>
                </HStack>
                <Switch
                    isChecked={!isExcluded}
                    onChange={() => onToggleExclusion(token)}
                    colorScheme="blue"
                    size="sm"
                />
            </HStack>
        </Box>
    );
};

export const GasTokenDragList = ({
    tokens,
    excludedTokens,
    onReorder,
    onToggleExclusion,
}: DragListProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const touchStartY = useRef<number>(0);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (index: number) => {
        setDragOverIndex(index);
    };

    const handleDrop = (dropIndex: number) => {
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newOrder = [...tokens];
        const draggedToken = newOrder[draggedIndex];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(dropIndex, 0, draggedToken);

        onReorder(newOrder);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Touch event handlers for mobile support
    const handleTouchStart = (index: number, event: React.TouchEvent) => {
        touchStartY.current = event.touches[0].clientY;
        setDraggedIndex(index);
    };

    const handleTouchMove = (event: React.TouchEvent) => {
        if (draggedIndex === null) return;

        const touch = event.touches[0];
        const currentY = touch.clientY;

        // Find which item is under the current touch position
        for (let i = 0; i < itemRefs.current.length; i++) {
            const element = itemRefs.current[i];
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            if (currentY >= rect.top && currentY <= rect.bottom) {
                setDragOverIndex(i);
                break;
            }
        }
    };

    const handleTouchEnd = () => {
        if (
            draggedIndex !== null &&
            dragOverIndex !== null &&
            draggedIndex !== dragOverIndex
        ) {
            const newOrder = [...tokens];
            const draggedToken = newOrder[draggedIndex];
            newOrder.splice(draggedIndex, 1);
            newOrder.splice(dragOverIndex, 0, draggedToken);
            onReorder(newOrder);
        }

        setDraggedIndex(null);
        setDragOverIndex(null);
        touchStartY.current = 0;
    };

    return (
        <Box w="full">
            {tokens.map((token, index) => (
                <Box
                    key={token}
                    ref={(el) => {
                        itemRefs.current[index] = el;
                    }}
                >
                    <TokenPriorityItem
                        token={token}
                        index={index}
                        isExcluded={excludedTokens.includes(token)}
                        onToggleExclusion={onToggleExclusion}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        isDragging={draggedIndex === index}
                        isDraggedOver={dragOverIndex === index}
                    />
                </Box>
            ))}
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/GasTokenSettingsContent.tsx`

````tsx
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
} from '@/components/common';
import { useTranslation } from 'react-i18next';
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
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/LanguageSettingsContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    Text,
    Button,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../../../i18n';
import { LuCheck } from 'react-icons/lu';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const LanguageSettingsContent = ({ setCurrentContent }: Props) => {
    const { t, i18n } = useTranslation();
    const selectedBg = useColorModeValue(
        'rgba(0, 0, 0, 0.1)',
        'rgba(255, 255, 255, 0.05)',
    );

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const renderLanguageButton = (lang: string) => {
        const isSelected = i18n.language === lang;
        return (
            <Button
                key={lang}
                w="full"
                variant="ghost"
                justifyContent="space-between"
                onClick={() => handleLanguageChange(lang)}
                py={6}
                px={4}
                bg={isSelected ? selectedBg : undefined}
            >
                <Text>{languageNames[lang as keyof typeof languageNames]}</Text>
                {isSelected && (
                    <Icon as={LuCheck} boxSize={5} color="blue.500" />
                )}
            </Button>
        );
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select language')}</ModalHeader>

                <ModalBackButton
                    onClick={() => setCurrentContent('settings')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack
                    justify={'center'}
                    spacing={3}
                    align="flex-start"
                    w={'full'}
                >
                    {supportedLanguages.map((lang: string) =>
                        renderLanguageButton(lang),
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/SettingsContent.tsx`

````tsx
import {
    ModalBody,
    VStack,
    ModalFooter,
    ModalHeader,
    Box,
    ModalCloseButton,
    Text,
    useToken,
} from '@chakra-ui/react';
import {
    useMfaEnrollment,
    usePrivy,
    useUpgradeRequired,
    useWallet,
} from '@/hooks';
import {
    LuChevronRight,
    LuCircleHelp,
    LuShield,
    LuLogOut,
    LuDollarSign,
    LuLanguages,
    LuFuel,
    LuLayoutGrid,
    LuUserCog,
    LuKey,
    LuShieldCheck,
    LuSettings2,
    LuFingerprint,
} from 'react-icons/lu';
import { ActionButton } from '@/components';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuUnlink } from 'react-icons/lu';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';

export type SettingsContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
};

export const SettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: SettingsContentProps) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const { exportWallet, linkPasskey } = usePrivy();
    const { showMfaEnrollmentModal } = useMfaEnrollment();

    const { feeDelegation } = useVeChainKitConfig();

    const { connection, disconnect, smartAccount, connectedWallet } =
        useWallet();

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    const handleUpgradeSmartAccountClick = () => {
        setCurrentContent({
            type: 'upgrade-smart-account',
            props: {
                setCurrentContent,
                initialContent: 'settings',
            },
        });
    };

    const handleConnectionDetails = () => {
        setCurrentContent('connection-details');
    };

    const handleLogout = () => {
        disconnect();
        onLogoutSuccess();
    };

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleCurrencyClick = () => {
        setCurrentContent('change-currency');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Settings')}</ModalHeader>

                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('profile')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={2}>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        color={textSecondary}
                        textAlign={'left'}
                        w={'full'}
                    >
                        {t('General')}
                    </Text>

                    <ActionButton
                        title={t('Currency')}
                        onClick={handleCurrencyClick}
                        leftIcon={LuDollarSign}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Language')}
                        onClick={() => {
                            setCurrentContent('change-language');
                        }}
                        leftIcon={LuLanguages}
                        rightIcon={LuChevronRight}
                    />

                    {connection.isConnectedWithPrivy &&
                        !feeDelegation?.delegatorUrl && (
                            <ActionButton
                                title={t('Gas Token Preferences')}
                                onClick={() => {
                                    setCurrentContent('gas-token-settings');
                                }}
                                leftIcon={LuFuel}
                                rightIcon={LuChevronRight}
                            />
                        )}

                    <ActionButton
                        title={t('Terms and Policies')}
                        onClick={() => {
                            setCurrentContent({
                                type: 'terms-and-privacy',
                                props: {
                                    onGoBack: () =>
                                        setCurrentContent('settings'),
                                },
                            });
                        }}
                        leftIcon={LuShield}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Logout')}
                        onClick={() =>
                            setCurrentContent({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: handleLogout,
                                    onBack: () => setCurrentContent('settings'),
                                },
                            })
                        }
                        leftIcon={LuLogOut}
                    />
                </VStack>

                {upgradeRequired && (
                    <VStack w={'full'} spacing={2} mt={4}>
                        <ActionButton
                            title={t('Upgrade Smart Account to V3')}
                            description={t(
                                'A new version is available for your account',
                            )}
                            onClick={handleUpgradeSmartAccountClick}
                            leftIcon={LuSettings2}
                            extraContent={
                                <Box
                                    minWidth="8px"
                                    height="8px"
                                    bg="red.500"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    ml={2}
                                />
                            }
                        />
                    </VStack>
                )}

                {connection.isConnectedWithSocialLogin && (
                    <VStack w={'full'} spacing={2} mt={4}>
                        <Text
                            fontSize={'sm'}
                            fontWeight={'bold'}
                            color={textSecondary}
                            textAlign={'left'}
                            w={'full'}
                        >
                            {t('Access and security')}
                        </Text>
                        <ActionButton
                            title={t('Passkey')}
                            onClick={() => linkPasskey()}
                            leftIcon={LuFingerprint}
                        />

                        <ActionButton
                            title={t('Backup')}
                            onClick={() => {
                                exportWallet();
                            }}
                            leftIcon={LuKey}
                        />

                        <ActionButton
                            title={t('Manage MFA')}
                            onClick={() => {
                                showMfaEnrollmentModal();
                            }}
                            leftIcon={LuShieldCheck}
                        />

                        <ActionButton
                            title={t('Login methods')}
                            onClick={() => {
                                setCurrentContent('privy-linked-accounts');
                            }}
                            leftIcon={LuUserCog}
                            rightIcon={LuChevronRight}
                        />
                    </VStack>
                )}

                <VStack w={'full'} spacing={2} mt={4}>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'bold'}
                        color={textSecondary}
                        textAlign={'left'}
                        w={'full'}
                    >
                        {t('Help')}
                    </Text>

                    <ActionButton
                        title={t('Connection details')}
                        onClick={handleConnectionDetails}
                        leftIcon={LuUnlink}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Explore ecosystem')}
                        onClick={() => setCurrentContent('ecosystem')}
                        leftIcon={LuLayoutGrid}
                        rightIcon={LuChevronRight}
                    />

                    <ActionButton
                        title={t('Frequently asked questions')}
                        onClick={() =>
                            setCurrentContent({
                                type: 'faq',
                                props: {
                                    onGoBack: () =>
                                        setCurrentContent('settings'),
                                    showLanguageSelector: false,
                                },
                            })
                        }
                        leftIcon={LuCircleHelp}
                        rightIcon={LuChevronRight}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter p={0} />
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/NftCollection/NftCollectionContent.tsx`

````tsx
import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    SimpleGrid,
    VStack,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { humanAddress } from '@/utils';
import {
    OwnedNft,
    useNftCollectionName,
    useOwnedNftsFiltered,
} from '@/hooks/api/nfts';
import { useWallet } from '@/hooks';
import { useMemo } from 'react';
import { AccountModalContentTypes } from '../../Types';
import { NftCard } from '../Assets/Components/NftCard';

export type NftCollectionContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    collectionAddress: string;
    onBack?: () => void;
};

export const NftCollectionContent = ({
    setCurrentContent,
    collectionAddress,
    onBack,
}: NftCollectionContentProps) => {
    const { isolatedView } = useAccountModalOptions();
    const { account } = useWallet();
    const { items } = useOwnedNftsFiltered(account?.address);
    const { name: onChainName } = useNftCollectionName(collectionAddress);

    const tokens = useMemo(
        () =>
            items.filter(
                (n) =>
                    n.collectionAddress.toLowerCase() ===
                    collectionAddress.toLowerCase(),
            ),
        [items, collectionAddress],
    );

    const headerName = onChainName ?? humanAddress(collectionAddress);

    const backToCollection = () =>
        setCurrentContent({
            type: 'nft-collection',
            props: { setCurrentContent, collectionAddress },
        });

    const handleSelectNft = (nft: OwnedNft) => {
        setCurrentContent({
            type: 'nft-detail',
            props: {
                setCurrentContent,
                nft,
                onBack: backToCollection,
            },
        });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else setCurrentContent('assets');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{headerName}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={3} align="stretch" w="full">
                        <SimpleGrid columns={2} spacing={3} w="full">
                            {tokens.map((nft) => (
                                <NftCard
                                    key={nft.id}
                                    nft={nft}
                                    onClick={() => handleSelectNft(nft)}
                                />
                            ))}
                        </SimpleGrid>
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/NftDetail/NftDetailContent.tsx`

````tsx
import {
    AspectRatio,
    Box,
    Button,
    Container,
    Divider,
    HStack,
    Heading,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';
import { convertUriToUrl, humanAddress } from '@/utils';
import { OwnedNft, useNftMetadata } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type NftDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    onBack?: () => void;
};

const formatTransferTimestamp = (ts?: number, locale?: string) => {
    if (!ts) return undefined;
    try {
        const date = new Date(ts * 1000);
        return date.toLocaleString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    } catch {
        return undefined;
    }
};

export const NftDetailContent = ({
    setCurrentContent,
    nft,
    onBack,
}: NftDetailContentProps) => {
    const { t, i18n } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();
    const { metadata, isLoading } = useNftMetadata(
        nft.collectionAddress,
        nft.tokenId,
    );

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const imageUrl = useMemo(() => {
        const raw = metadata?.image;
        if (!raw) return undefined;
        try {
            return convertUriToUrl(raw, network.type) ?? raw;
        } catch {
            return raw;
        }
    }, [metadata?.image, network.type]);

    const collectionName =
        metadata?.name?.split('#')[0]?.trim() ||
        humanAddress(nft.collectionAddress);
    const displayName = metadata?.name ?? `#${nft.tokenId}`;
    const lastTransfer = formatTransferTimestamp(
        nft.lastTransferTimestamp,
        i18n.language,
    );
    const attributes = metadata?.attributes ?? [];

    const backToDetail = () =>
        setCurrentContent({
            type: 'nft-detail',
            props: { setCurrentContent, nft },
        });

    const handleSend = () => {
        setCurrentContent({
            type: 'send-nft',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                onBack: backToDetail,
            },
        });
    };

    const handleBack = () => {
        if (onBack) onBack();
        else setCurrentContent('assets');
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{displayName}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={5} align="stretch" w="full">
                        <AspectRatio
                            ratio={1}
                            w="full"
                            borderRadius="xl"
                            overflow="hidden"
                            bg={cardBg}
                        >
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={displayName}
                                    objectFit="cover"
                                    fallback={<Skeleton w="full" h="full" />}
                                />
                            ) : (
                                <Skeleton
                                    isLoaded={!isLoading}
                                    fadeDuration={0}
                                >
                                    <Box w="full" h="full" bg={cardBg} />
                                </Skeleton>
                            )}
                        </AspectRatio>

                        <Box bg={cardBg} borderRadius="xl" p={4}>
                            <VStack spacing={3} align="stretch">
                                <HStack justify="space-between">
                                    <Text
                                        color={textSecondary}
                                        fontSize="sm"
                                    >
                                        {t('Collection')}
                                    </Text>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="600"
                                        noOfLines={1}
                                    >
                                        {collectionName}
                                    </Text>
                                </HStack>
                                <HStack justify="space-between">
                                    <Text
                                        color={textSecondary}
                                        fontSize="sm"
                                    >
                                        {t('ID')}
                                    </Text>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="600"
                                    >
                                        {nft.tokenId}
                                    </Text>
                                </HStack>
                                {lastTransfer && (
                                    <HStack justify="space-between">
                                        <Text
                                            color={textSecondary}
                                            fontSize="sm"
                                        >
                                            {t('Last transfer on')}
                                        </Text>
                                        <Text
                                            color={textPrimary}
                                            fontSize="sm"
                                            fontWeight="600"
                                        >
                                            {lastTransfer}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Box>

                        {attributes.length > 0 && (
                            <Box>
                                <Heading
                                    size="sm"
                                    mb={3}
                                    color={textPrimary}
                                >
                                    {t('Attributes')}
                                </Heading>
                                <VStack
                                    spacing={2}
                                    align="stretch"
                                    bg={cardBg}
                                    borderRadius="xl"
                                    p={2}
                                >
                                    {attributes.map((attr, i) => (
                                        <Box key={`${attr.trait_type}-${i}`}>
                                            <HStack
                                                justify="space-between"
                                                px={2}
                                                py={1}
                                            >
                                                <Text
                                                    color={textSecondary}
                                                    fontSize="sm"
                                                >
                                                    {attr.trait_type ??
                                                        t('Trait')}
                                                </Text>
                                                <Text
                                                    color={textPrimary}
                                                    fontSize="sm"
                                                    fontWeight="600"
                                                    noOfLines={1}
                                                >
                                                    {String(attr.value ?? '—')}
                                                </Text>
                                            </HStack>
                                            {i < attributes.length - 1 && (
                                                <Divider opacity={0.2} />
                                            )}
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="vechainKitPrimary"
                        w="full"
                        onClick={handleSend}
                    >
                        {t('Send')}
                    </Button>
                </ModalFooter>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Notifications/Components/EmptyNotifications.tsx`

````tsx
import { useTranslation } from 'react-i18next';
import { EmptyContent } from '@/components/common/EmptyContent';
import { LuBell, LuArchive } from 'react-icons/lu';

type Props = {
    showArchived: boolean;
};

export const EmptyNotifications = ({ showArchived }: Props) => {
    const { t } = useTranslation();

    return (
        <EmptyContent
            title={
                showArchived
                    ? t('No archived notifications')
                    : t('No notifications')
            }
            description={
                showArchived
                    ? t('Cleared notifications will appear here')
                    : t('When you have notifications, they will appear here')
            }
            icon={showArchived ? LuArchive : LuBell}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Notifications/Components/NotificationItem.tsx`

````tsx
import {
    Alert,
    AlertIcon,
    Box,
    AlertDescription,
    IconButton,
    AlertTitle,
} from '@chakra-ui/react';
import { LuCircleX } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { Notification } from '@/hooks/notifications/types';

type Props = {
    notification: Notification;
    isArchiveView: boolean;
    onMarkAsRead: (id: string) => void;
};

export const NotificationItem = ({
    notification,
    isArchiveView,
    onMarkAsRead,
}: Props) => {
    const { t } = useTranslation();

    const handleDismiss = () => {
        onMarkAsRead(notification.id);
    };

    if (notification.isRead && !isArchiveView) {
        return null;
    }

    return (
        <Alert
            key={notification.id}
            status={notification.status}
            variant="subtle"
            borderRadius={'lg'}
            pr={8}
            position="relative"
            opacity={notification.isRead ? 0.7 : 1}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
            data-testid="notification-item"
        >
            <AlertIcon boxSize={'16px'} />
            <Box>
                <AlertTitle fontSize={'sm'} data-testid="notification-title">
                    {/* @ts-ignore */}
                    {t(notification.title)}
                </AlertTitle>
                <AlertDescription fontSize={'xs'} lineHeight={'1.2'} data-testid="notification-text">
                    {/* @ts-ignore */}
                    {t(notification.description)}
                </AlertDescription>
            </Box>
            {!isArchiveView && !notification.isRead && (
                <IconButton
                    position="absolute"
                    right={1}
                    top={1}
                    size="sm"
                    variant="ghost"
                    icon={<LuCircleX />}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                    aria-label="Mark as read and archive"
                    data-testid="remove-notification-button"
                />
            )}
        </Alert>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Notifications/NotificationContent.tsx`

````tsx
import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Icon,
    ModalFooter,
    Button,
    HStack,
} from '@chakra-ui/react';
import { LuBell, LuArchive } from 'react-icons/lu';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@/hooks/notifications';
import { useState } from 'react';
import { EmptyNotifications } from './Components/EmptyNotifications';
import { NotificationItem } from './Components/NotificationItem';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const NotificationsContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const {
        getNotifications,
        getArchivedNotifications,
        clearAllNotifications,
        markAsRead,
    } = useNotifications();
    const [isArchiveView, setIsArchiveView] = useState(false);
    const [notifications, setNotifications] = useState(getNotifications());
    const [archivedNotifications, setArchivedNotifications] = useState(
        getArchivedNotifications(),
    );

    const handleClearAll = () => {
        clearAllNotifications();
        setArchivedNotifications([...archivedNotifications, ...notifications]);
        setNotifications([]);
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
        const notificationToArchive = notifications.find((n) => n.id === id);
        setNotifications(notifications.filter((n) => n.id !== id));
        if (notificationToArchive) {
            setArchivedNotifications([
                { ...notificationToArchive, isRead: true },
                ...archivedNotifications,
            ]);
        }
    };

    const handleToggleView = () => {
        setIsArchiveView(!isArchiveView);
    };

    const currentNotifications = isArchiveView
        ? archivedNotifications
        : notifications;

    // Sort notifications by date in descending order (newest first)
    const sortedNotifications = [...currentNotifications].sort((a, b) => {
        // Welcome notification always first
        if (a.id === 'welcome') return -1;
        if (b.id === 'welcome') return 1;

        // Smart account second
        if (a.id === 'smart-account') return -1;
        if (b.id === 'smart-account') return 1;

        // Multiclause third
        if (a.id === 'multiclause') return -1;
        if (b.id === 'multiclause') return 1;

        // All other notifications sorted by timestamp
        return b.timestamp - a.timestamp;
    });

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                {!isolatedView && (
                    <ModalBackButton onClick={() => setCurrentContent('main')} />
                )}
                <ModalHeader data-testid="modal-title">
                    {isArchiveView
                        ? t('Archived Notifications')
                        : t('Notifications')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={4} align="stretch" w="full">
                        <HStack justify="space-between">
                            <Button
                                variant="ghost"
                                leftIcon={
                                    <Icon
                                        as={isArchiveView ? LuBell : LuArchive}
                                    />
                                }
                                size="sm"
                                onClick={handleToggleView}
                                data-testid="toggle-view-button"
                            >
                                {isArchiveView ? t('Current') : t('Archived')}
                            </Button>
                            {!isArchiveView && notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    data-testid="clear-all-button"
                                >
                                    {t('Clear all')}
                                </Button>
                            )}
                        </HStack>

                        {currentNotifications.length === 0 ? (
                            <EmptyNotifications showArchived={isArchiveView} />
                        ) : (
                            <VStack spacing={3}>
                                {sortedNotifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        isArchiveView={isArchiveView}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter pt={0} />
            </Container>
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/PrivyLinkedAccounts/PrivyLinkedAccounts.tsx`

````tsx
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
                    variant="vechainKitPrimary"
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
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/Components/ProfileCard/ProfileCard.tsx`

````tsx
import {
    Box,
    HStack,
    Icon,
    Link,
    Text,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { AccountAvatar, AddressDisplay } from '@/components/common';
import { useWalletMetadata } from '@/hooks';
import { LuMail, LuGlobe, LuPencil } from 'react-icons/lu';
import { FaXTwitter } from 'react-icons/fa6';
import { getPicassoImage } from '@/utils';
import { useVeChainKitConfig } from '@/providers';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';

export type ProfileCardProps = {
    address: string;
    onEditClick?: () => void;
    showHeader?: boolean;
    showLinks?: boolean;
    showDescription?: boolean;
    showDisplayName?: boolean;
    showEdit?: boolean;
    /** When true, reserves space for name/description when empty. Use when user has .vet domain (no announcement card). */
    reserveNameDescriptionSpace?: boolean;
    setCurrentContent?: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ProfileCard = ({
    address,
    showHeader = true,
    showLinks = true,
    showDescription = true,
    showDisplayName = true,
    reserveNameDescriptionSpace = false,
    setCurrentContent,
}: ProfileCardProps) => {
    const { network } = useVeChainKitConfig();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const metadata = useWalletMetadata(address, network.type);

    const headerImageSvg = getPicassoImage(address);

    const hasLinks =
        metadata?.records?.url ||
        metadata?.records?.['com.x'] ||
        metadata?.records?.email;

    const safeHttpUrl = (raw: string): string | null => {
        try {
            const u = new URL(raw);
            return u.protocol === 'http:' || u.protocol === 'https:'
                ? u.toString()
                : null;
        } catch {
            return null;
        }
    };

    return (
        <VStack spacing={0} w="full">
            <Box
                p={0}
                backgroundSize="100% !important"
                backgroundPosition="center"
                position="relative"
                // h="80px"
                background={
                    showHeader ? `no-repeat url('${headerImageSvg}')` : 'none'
                }
                w="100%"
                borderRadius="14px 14px 0 0"
            />
            <Box
                position="relative"
                display="inline-block"
                cursor={setCurrentContent ? 'pointer' : 'default'}
                onClick={
                    setCurrentContent
                        ? () => {
                              setCurrentContent({
                                  type: 'account-customization',
                                  props: {
                                      setCurrentContent,
                                      initialContentSource: 'profile',
                                  },
                              });
                          }
                        : undefined
                }
            >
                <AccountAvatar
                    wallet={{
                        address,
                        domain: metadata?.domain,
                        image: metadata?.image,
                        isLoadingMetadata: metadata?.isLoading,
                        metadata: metadata?.records,
                    }}
                    props={{
                        width: '120px',
                        height: '120px',
                        // boxShadow: '0px 0px 3px 2px #00000024',
                    }}
                />
                {setCurrentContent && (
                    <Icon
                        as={LuPencil}
                        position="absolute"
                        bottom="0"
                        right="0"
                        bg={cardBg}
                        color={textPrimary}
                        p="1"
                        borderRadius="full"
                        boxSize="6"
                        border="2px solid"
                        borderColor={cardBg}
                    />
                )}
            </Box>

            <VStack w={'full'} spacing={2}>
                {showDisplayName && (
                    metadata?.records?.display ? (
                        <Text
                            fontSize="xl"
                            color={textPrimary}
                            fontWeight="bold"
                            w="full"
                            textAlign="center"
                            mt={2}
                            data-testid="display-name-val"
                        >
                            {metadata?.records?.display}
                        </Text>
                    ) : (
                        reserveNameDescriptionSpace && (
                            <Box mt={2} minH="28px" aria-hidden />
                        )
                    )
                )}

                {showDescription && (
                    metadata?.records?.description ? (
                        <Text
                            fontSize="sm"
                            color={textSecondary}
                            w="full"
                            textAlign="center"
                            data-testid="description-val"
                        >
                            {metadata?.records?.description}
                        </Text>
                    ) : (
                        reserveNameDescriptionSpace && (
                            <Box minH="20px" aria-hidden />
                        )
                    )
                )}

                {showLinks && hasLinks && (
                    <HStack w={'full'} justify={'center'} spacing={5} mt={4}>
                        {metadata?.records?.email && (
                            <Link
                                href={`mailto:${metadata?.records?.email}`}
                                target="_blank"
                                data-testid="mail-link"
                            >
                                <Icon as={LuMail} color={textPrimary} />
                            </Link>
                        )}
                        {metadata?.records?.url && (
                            <Link
                                href={
                                    safeHttpUrl(metadata.records.url) ??
                                    undefined
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="website-link"
                            >
                                <Icon as={LuGlobe} color={textPrimary} />
                            </Link>
                        )}
                        {metadata?.records?.['com.x'] && (
                            <Link
                                href={`https://x.com/${encodeURIComponent(
                                    String(metadata.records['com.x']),
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-testid="twitter-link"
                            >
                                <Icon as={FaXTwitter} color={textPrimary} />
                            </Link>
                        )}
                    </HStack>
                )}

                <AddressDisplay
                    wallet={{
                        address,
                        domain: metadata?.domain,
                        image: metadata?.image,
                        isLoadingMetadata: metadata?.isLoading,
                        metadata: metadata?.records,
                    }}
                    style={{ mt: 4 }}
                    setCurrentContent={setCurrentContent}
                />
            </VStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/Customization/CustomizationContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    Box,
    ModalFooter,
    Icon,
    Input,
    Textarea,
    FormControl,
    FormLabel,
    useToken,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useWallet } from '@/hooks';
import { LuChevronRight, LuCamera, LuSquareUser } from 'react-icons/lu';
import { ActionButton } from '../../../Components';
import { useSingleImageUpload } from '@/hooks/api/ipfs';
import { useRef, useState, useEffect, useMemo } from 'react';
import { uploadBlobToIPFS } from '@/utils/ipfs';
import { AccountAvatar } from '@/components/common';
import { DomainRequiredAlert } from '../../../Components/Alerts';
import { AccountModalContentTypes } from '../../../Types';
import { useForm } from 'react-hook-form';

// Update FormValues type to include validation
type FormValues = {
    displayName: string;
    description: string;
};

export type AccountCustomizationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    initialContentSource?: AccountModalContentTypes;
};

export const CustomizationContent = ({
    setCurrentContent,
    initialContentSource = 'profile',
}: AccountCustomizationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { account } = useWallet();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { onUpload } = useSingleImageUpload({
        compressImage: true,
    });

    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [avatarIpfsHash, setAvatarIpfsHash] = useState<string | null>(null);
    const hasDomain = !!account?.domain;

    // Add these state variables for initial values
    const [initialAvatarHash, setInitialAvatarHash] = useState<string | null>(
        null,
    );
    const [initialDisplayName, setInitialDisplayName] = useState('');
    const [initialDescription, setInitialDescription] = useState('');

    // Update form initialization with validation rules
    const {
        register,
        watch,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        defaultValues: {
            displayName: account?.metadata?.display || '',
            description: account?.metadata?.description || '',
        },
        mode: 'onChange',
    });

    // Update effect to reset image when domain changes
    useEffect(() => {
        if (account?.metadata) {
            const metadata = account.metadata;
            setInitialDisplayName(metadata.display || '');
            setInitialDescription(metadata.description || '');
            setInitialAvatarHash(
                account.image ? account.image.replace('ipfs://', '') : null,
            );

            // Only set the preview URL if it hasn't been set yet
            setPreviewImageUrl((prev) => prev ?? account.image ?? null);
        }
    }, [account, network.type]);

    // Watch all form values for changes
    const formValues = watch();

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Clear the previous preview URL first
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }

            // Create temporary preview URL
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewImageUrl(newPreviewUrl);

            const uploadedImage = await onUpload(file);
            if (!uploadedImage) throw new Error('Failed to compress image');

            const ipfsHash = await uploadBlobToIPFS(
                uploadedImage.file,
                file.name,
                network.type,
            );
            setAvatarIpfsHash(ipfsHash);
        } catch (error) {
            console.error('Error uploading image:', error);
            setPreviewImageUrl(null);
        } finally {
            setIsUploading(false);
        }
    };

    // This cleanup effect is important for memory management in the browser. Here's why:
    // When you create a URL using URL.createObjectURL() (which happens in the handleImageUpload function),
    // the browser creates a unique URL that points to the file/blob in memory.
    // This URL remains valid and the object remains in memory until explicitly revoked.
    // If you don't revoke these URLs, you can create memory leaks,
    // especially if users upload multiple images or the component remounts frequently.
    useEffect(() => {
        return () => {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    // Update getChangedValues to use form values
    const getChangedValues = () => {
        const changes: {
            avatarIpfsHash?: string;
            displayName?: string;
            description?: string;
        } = {};

        if (avatarIpfsHash !== initialAvatarHash && avatarIpfsHash)
            changes.avatarIpfsHash = avatarIpfsHash;
        if (formValues.displayName !== initialDisplayName)
            changes.displayName = formValues.displayName;
        if (formValues.description !== initialDescription)
            changes.description = formValues.description;
        return changes;
    };

    // Add this function to check if there are any changes
    const hasChanges = useMemo(() => {
        const changes = getChangedValues();
        return Object.keys(changes).length > 0;
    }, [getChangedValues]);

    const handleSaveChanges = () => {
        setCurrentContent({
            type: 'account-customization-summary',
            props: {
                setCurrentContent,
                changes: getChangedValues(),
                onDoneRedirectContent: initialContentSource,
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
                    {t('Customization')}
                </ModalHeader>
                <ModalBackButton onClick={handleBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <Box
                    cursor={hasDomain ? 'pointer' : 'default'}
                    pt={2}
                    display="flex"
                    justifyContent="center"
                    position="relative"
                    onClick={() => hasDomain && fileInputRef.current?.click()}
                >
                    <AccountAvatar
                        wallet={account}
                        props={{
                            width: '100px',
                            height: '100px',
                            boxShadow: '0px 0px 3px 2px #00000024',
                            src: previewImageUrl ?? undefined,
                        }}
                    />
                    {hasDomain && (
                        <Icon
                            as={LuCamera}
                            position="absolute"
                            top="80px"
                            left="60%"
                            bg={cardBg}
                            color={textPrimary}
                            p="1"
                            borderRadius="full"
                            boxSize="6"
                        />
                    )}
                    {isUploading && (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            backgroundColor="rgba(0, 0, 0, 0.5)"
                            position="absolute"
                            transform="translateX(0%)"
                            width="100px"
                            height="100px"
                            borderRadius="full"
                            zIndex={10}
                        >
                            <Text fontSize="xs" color="white">
                                {isUploading ? 'Uploading...' : 'Processing...'}
                            </Text>
                        </Box>
                    )}
                </Box>

                <VStack spacing={6} mt={4}>
                    {!hasDomain && <DomainRequiredAlert />}

                    <ActionButton
                        title={account?.domain ?? t('Choose account name')}
                        description={t(
                            'Choose a unique .vet domain name for your account.',
                        )}
                        onClick={() => {
                            if (account?.domain) {
                                setCurrentContent({
                                    type: 'choose-name-search',
                                    props: {
                                        name: '',
                                        setCurrentContent,
                                        initialContentSource: {
                                            type: 'account-customization',
                                            props: {
                                                setCurrentContent,
                                            },
                                        },
                                    },
                                });
                            } else {
                                setCurrentContent({
                                    type: 'choose-name',
                                    props: {
                                        setCurrentContent,
                                        initialContentSource: {
                                            type: 'account-customization',
                                            props: {
                                                setCurrentContent,
                                            },
                                        },
                                        onBack: () =>
                                            setCurrentContent({
                                                type: 'account-customization',
                                                props: {
                                                    setCurrentContent,
                                                },
                                            }),
                                    },
                                });
                            }
                        }}
                        leftIcon={LuSquareUser}
                        rightIcon={LuChevronRight}
                        dataTestId="set-domain-name-button"
                    />

                    <FormControl
                        isDisabled={!hasDomain}
                        isInvalid={!!errors.displayName}
                    >
                        <FormLabel
                            fontSize="sm"
                            fontWeight="medium"
                            color={textPrimary}
                        >
                            {t('Display Name')}
                        </FormLabel>
                        <Input
                            {...register('displayName', {
                                maxLength: {
                                    value: 25,
                                    message: t(
                                        'Display name must be less than 25 characters',
                                    ),
                                },
                            })}
                            placeholder={
                                !hasDomain
                                    ? t('Set a domain first')
                                    : t('Enter your display name')
                            }
                            fontWeight="medium"
                            color={textPrimary}
                            data-testid="display-name-input"
                        />
                        {errors.displayName && (
                            <Text
                                color={errorColor}
                                fontSize="sm"
                                mt={1}
                                fontWeight="medium"
                            >
                                {errors.displayName.message}
                            </Text>
                        )}
                    </FormControl>

                    <FormControl
                        isDisabled={!hasDomain}
                        isInvalid={!!errors.description}
                    >
                        <FormLabel
                            fontSize="sm"
                            fontWeight="medium"
                            color={textPrimary}
                        >
                            {t('Description')}
                        </FormLabel>
                        <Textarea
                            {...register('description', {
                                maxLength: {
                                    value: 100,
                                    message: t(
                                        'Description must be less than 100 characters',
                                    ),
                                },
                            })}
                            placeholder={t('Eg: DevRel @ ENS Labs')}
                            fontWeight="medium"
                            color={textPrimary}
                            data-testid="description-input"
                            minH="50px"
                        />
                        {errors.description && (
                            <Text
                                color={errorColor}
                                mt={1}
                                fontSize="sm"
                                fontWeight="medium"
                            >
                                {errors.description.message}
                            </Text>
                        )}
                    </FormControl>
                </VStack>

                <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={async (event) => await handleImageUpload(event)}
                />
                <input
                    type="file"
                    ref={coverInputRef}
                    hidden
                    accept="image/*"
                    onChange={async (event) => {
                        /* Add cover upload handler */
                        event.preventDefault();
                    }}
                />
            </ModalBody>

            <ModalFooter w="full">
                <Button
                    variant="vechainKitPrimary"
                    onClick={handleSaveChanges}
                    isDisabled={!hasDomain || !hasChanges || !isValid}
                    isLoading={isUploading}
                    loadingText={t('Preparing changes...')}
                    data-testid="save-changes-button"
                >
                    {t('Save Changes')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/Customization/CustomizationSummaryContent.tsx`

````tsx
import React, { useMemo } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    Icon,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import {
    useWallet,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    getAvatarQueryKey,
    getAvatarOfAddressQueryKey,
    getTextRecordsQueryKey,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useUpdateTextRecord } from '@/hooks';
import { useForm } from 'react-hook-form';
import { useGetResolverAddress } from '@/hooks/api/vetDomains/useGetResolverAddress';
import { useQueryClient } from '@tanstack/react-query';
import { convertUriToUrl } from '@/utils';
import { GasTokenType } from '@/types/gasToken';
import { LuFileText } from 'react-icons/lu';

export type CustomizationSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    changes: {
        avatarIpfsHash?: string | null;
        displayName?: string;
        description?: string;
        twitter?: string;
        website?: string;
        email?: string;
    };
    onDoneRedirectContent: AccountModalContentTypes;
};

type FormValues = {
    avatarIpfsHash?: string;
    displayName?: string;
    description?: string;
    twitter?: string;
    website?: string;
    email?: string;
};

export const CustomizationSummaryContent = ({
    setCurrentContent,
    changes,
    onDoneRedirectContent,
}: CustomizationSummaryContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark, network, feeDelegation } = useVeChainKitConfig();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const { account, connectedWallet, connection } = useWallet();
    const { preferences } = useGasTokenSelection();

    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const { handleSubmit } = useForm<FormValues>({
        defaultValues: {
            ...changes,
            avatarIpfsHash: changes.avatarIpfsHash ?? undefined,
        },
    });

    const domain = account?.domain ?? '';

    // Pre-fetch the resolver address
    const { data: resolverAddress } = useGetResolverAddress(domain);

    const queryClient = useQueryClient();

    const {
        sendTransaction: updateTextRecord,
        txReceipt,
        error: txError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses: getClauses,
    } = useUpdateTextRecord({
        resolverAddress, // Pass the pre-fetched resolver address
        signerAccountAddress: account?.address ?? '',
        onSuccess: async () => {
            try {
                await refresh();
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        },
        onError: (error) => {
            console.error('Error updating text record:', error);
        },
    });

    // Track if we've already shown success to prevent duplicate calls
    const [hasShownSuccess, setHasShownSuccess] = React.useState(false);

    // Handle successful transaction via useEffect to avoid synchronous state updates
    React.useEffect(() => {
        // Guard clauses
        if (!txReceipt) return;
        if (txReceipt.reverted) return;
        if (hasShownSuccess) return;
        if (isTransactionPending) return;

        const txId = txReceipt.meta.txID;
        if (!txId) return;

        setHasShownSuccess(true);
        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: t('Profile Updated'),
                description: t('Your changes have been saved successfully.'),
                onDone: () => {
                    setCurrentContent(onDoneRedirectContent);
                },
            },
        });
    }, [
        txReceipt,
        hasShownSuccess,
        isTransactionPending,
        setCurrentContent,
        t,
        onDoneRedirectContent,
    ]);

    // Reset the flag when starting a new transaction
    React.useEffect(() => {
        if (isTransactionPending) {
            setHasShownSuccess(false);
        }
    }, [isTransactionPending]);

    // Build the text record updates immediately
    const textRecordUpdates = useMemo(() => {
        const domain = account?.domain ?? '';
        const CHANGES_TO_TEXT_RECORDS = {
            displayName: 'display',
            description: 'description',
            twitter: 'com.x',
            website: 'url',
            email: 'email',
            avatarIpfsHash: 'avatar',
        } as const;

        return Object.entries(changes)
            .filter(
                (entry): entry is [string, string] =>
                    entry[1] !== undefined && entry[1] !== null,
            )
            .map(([key, value]) => ({
                domain,
                key: CHANGES_TO_TEXT_RECORDS[key as keyof FormValues],
                value: key === 'avatarIpfsHash' ? `ipfs://${value}` : value,
            }));
    }, [changes, account?.domain]);

    // Build clauses synchronously only if resolver address is available
    const clauses = useMemo(() => {
        try {
            // Don't build clauses until we have a resolver address
            if (
                !resolverAddress ||
                textRecordUpdates.length === 0 ||
                !getClauses
            ) {
                return [];
            }
            return getClauses(textRecordUpdates);
        } catch (error) {
            console.error('Error building clauses:', error);
            return [];
        }
    }, [textRecordUpdates, getClauses, resolverAddress]);

    // Gas estimation
    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    // Track the user's manual selection to show it during loading (before estimation completes)
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    // VeChain pays gas for profile updates via the kit-sponsored delegator
    // (see useUpdateTextRecord). Skip the gas-token UI and "do you have
    // enough VTHO" check so users with no gas tokens can still proceed.
    const KIT_PAYS_GAS = true;

    const shouldEstimateGas =
        !KIT_PAYS_GAS &&
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        !KIT_PAYS_GAS &&
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token); // Track user's choice
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance =
        KIT_PAYS_GAS || (!!usedGasToken && !gasEstimationError);

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    // Keep userSelectedGasToken to show during loading, but actual result will show the token that succeeds
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    const onSubmit = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
            if (textRecordUpdates.length > 0) {
                await updateTextRecord(textRecordUpdates);
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    const renderField = (label: string, value: string) => {
        if (!value?.trim()) return null;
        return (
            <VStack align="flex-start" w="full" spacing={1}>
                <Text
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                >
                    {label}
                </Text>
                <Text fontSize="md">{value}</Text>
            </VStack>
        );
    };

    const handleRetry = () => {
        handleSubmit(onSubmit)();
    };

    const handleBack = () => {
        setCurrentContent({
            type: 'account-customization',
            props: {
                setCurrentContent,
            },
        });
    };

    const refresh = async () => {
        // only update avatar data if it's being changed
        if (changes.avatarIpfsHash) {
            queryClient.setQueryData(
                getAvatarQueryKey(domain, network.type),
                convertUriToUrl(
                    'ipfs://' + changes.avatarIpfsHash,
                    network.type,
                ),
            );

            queryClient.setQueryData(
                getAvatarOfAddressQueryKey(account?.address ?? ''),
                convertUriToUrl(
                    'ipfs://' + changes.avatarIpfsHash,
                    network.type,
                ),
            );
        }

        // still refresh text records since they might have other changes
        await queryClient.invalidateQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });

        await queryClient.refetchQueries({
            queryKey: getTextRecordsQueryKey(domain, network.type),
        });
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Confirm Changes')}</ModalHeader>
                <ModalBackButton
                    isDisabled={isTransactionPending}
                    onClick={handleBack}
                />
                <ModalCloseButton isDisabled={isTransactionPending} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuFileText}
                        color={textPrimary}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {t(
                            'By confirming, the following details attached to your name ({{domain}}) will be updated',
                            {
                                domain,
                            },
                        )}
                    </Text>
                </VStack>
                <VStack spacing={4} align="stretch" mt={6}>
                    {changes.avatarIpfsHash && (
                        <VStack align="flex-start" w="full" spacing={1}>
                            <Text
                                fontSize="sm"
                                color={
                                    isDark ? 'whiteAlpha.600' : 'blackAlpha.600'
                                }
                            >
                                {t('Profile Image')}
                            </Text>
                            <Text fontSize="md">{t('New image selected')}</Text>
                        </VStack>
                    )}

                    {changes.displayName &&
                        renderField(t('Display Name'), changes.displayName)}
                    {changes.description &&
                        renderField(t('Description'), changes.description)}
                    {changes.twitter &&
                        renderField(t('Twitter'), changes.twitter)}
                    {changes.website &&
                        renderField(t('Website'), changes.website)}
                    {changes.email && renderField(t('Email'), changes.email)}
                </VStack>
                {!KIT_PAYS_GAS && connection.isConnectedWithPrivy && (
                    <GasFeeSummary
                        estimation={gasEstimation}
                        isLoading={gasEstimationLoading}
                        isLoadingTransaction={isTransactionPending}
                        onTokenChange={handleGasTokenChange}
                        clauses={clauses as any}
                        userSelectedToken={userSelectedGasToken}
                    />
                )}
            </ModalBody>

            <ModalFooter gap={4} w="full">
                <TransactionButtonAndStatus
                    transactionError={txError}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    onConfirm={handleSubmit(onSubmit)}
                    onRetry={handleRetry}
                    transactionPendingText={t('Saving changes...')}
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isTransactionPending ||
                        disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !KIT_PAYS_GAS &&
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="customization"
                />
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/ProfileContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalFooter,
    VStack,
    HStack,
    Button,
    Icon,
    Text,
} from '@chakra-ui/react';
import {
    useSwitchWallet,
    useWallet,
    useTotalBalance,
    LocalStorageKey,
    useLocalStorage,
} from '@/hooks';
import { FeatureAnnouncementCard } from '@/components';
import { ProfileCard } from './Components/ProfileCard/ProfileCard';
import {
    StickyHeaderContainer,
    WalletSwitchFeedback,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { LuArrowLeftRight, LuLogOut, LuWalletCards } from 'react-icons/lu';
import { ModalSettingsButton } from '@/components/common/ModalSettingsButton';
import { AssetIcons } from '@/components/WalletButton/AssetIcons';

export type ProfileContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onLogoutSuccess: () => void;
    switchFeedback?: { showFeedback: boolean };
};

export const ProfileContent = ({
    setCurrentContent,
    onLogoutSuccess,
    switchFeedback,
}: ProfileContentProps) => {
    const { t } = useTranslation();
    const { account, disconnect } = useWallet();
    const { switchWallet, isSwitching, isInAppBrowser, canSwitchWallet } =
        useSwitchWallet();
    const { hasAnyBalance, formattedBalance } = useTotalBalance({
        address: account?.address,
    });
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    const handleSwitchWallet = () => {
        if (isInAppBrowser) {
            switchWallet();
        } else {
            // Desktop: navigate to select wallet screen
            setCurrentContent({
                type: 'select-wallet',
                props: {
                    setCurrentContent,
                    onClose: () => {},
                    returnTo: 'profile',
                    onLogoutSuccess,
                },
            });
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader data-testid="modal-title">
                    {t('Profile')}
                </ModalHeader>

                <ModalSettingsButton
                    onClick={() => {
                        setCurrentContent('settings');
                    }}
                    data-testid="settings-button"
                />

                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={6}>
                    <WalletSwitchFeedback
                        showFeedback={switchFeedback?.showFeedback}
                    />
                    {!account?.domain && (
                        <FeatureAnnouncementCard
                            setCurrentContent={setCurrentContent}
                        />
                    )}

                    <ProfileCard
                        reserveNameDescriptionSpace={!!account?.domain}
                        onEditClick={() => {
                            setCurrentContent({
                                type: 'account-customization',
                                props: {
                                    setCurrentContent,
                                    initialContentSource: 'profile',
                                },
                            });
                        }}
                        address={account?.address ?? ''}
                        showHeader={false}
                        setCurrentContent={setCurrentContent}
                    />
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <HStack w="full" justify="space-between" spacing={3} mt={4}>
                    <Button
                        size="md"
                        flex={1}
                        height="40px"
                        variant="vechainKitSecondary"
                        leftIcon={
                            hasAnyBalance ? undefined : (
                                <Icon as={LuWalletCards} />
                            )
                        }
                        onClick={() => setCurrentContent('main')}
                        data-testid="wallet-button"
                    >
                        {hasAnyBalance ? (
                            <HStack spacing={2} w="full" justify="center">
                                <AssetIcons
                                    address={account?.address ?? ''}
                                    maxIcons={2}
                                />
                                <Text fontWeight="600">
                                    {showAssets ? formattedBalance : '$****'}
                                </Text>
                            </HStack>
                        ) : (
                            t('Wallet')
                        )}
                    </Button>

                    {/* In VeWorld mobile we call switchWallet
                    on the desktop we call setCurrentContent to select-wallet
                    */}
                    {canSwitchWallet ? (
                        <Button
                            size="md"
                            flex={1}
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuArrowLeftRight} />}
                            onClick={async () => {
                                handleSwitchWallet();
                            }}
                            isLoading={isSwitching}
                            isDisabled={isSwitching}
                            data-testid="switch-wallet-button"
                        >
                            {t('Switch')}
                        </Button>
                    ) : (
                        <Button
                            size="md"
                            flex={1}
                            height="40px"
                            variant="vechainKitSecondary"
                            leftIcon={<Icon as={LuLogOut} />}
                            onClick={() =>
                                setCurrentContent({
                                    type: 'disconnect-confirm',
                                    props: {
                                        onDisconnect: () => {
                                            disconnect();
                                            onLogoutSuccess?.();
                                        },
                                        onBack: () =>
                                            setCurrentContent?.('profile'),
                                    },
                                })
                            }
                            data-testid="logout-button"
                        >
                            {t('Logout')}
                        </Button>
                    )}
                </HStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Receive/ReceiveTokenContent.tsx`

````tsx
import {
    Container,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    ModalFooter,
    useToken,
} from '@chakra-ui/react';
import { QRCode } from 'react-qrcode-logo';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplay,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useWallet } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type ReceiveTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onBack?: () => void;
};

export const ReceiveTokenContent = ({
    setCurrentContent,
    onBack,
}: ReceiveTokenContentProps) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const handleBack = onBack ?? (() => setCurrentContent('main'));

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Receive')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton onClick={handleBack} />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={4} align="center" w="full">
                        <QRCode
                            value={account?.address ?? ''}
                            size={200}
                            removeQrCodeBehindLogo={true}
                            eyeRadius={4}
                            logoPaddingStyle={'circle'}
                            style={{
                                borderRadius: '16px',
                            }}
                        />

                        <AddressDisplay wallet={account} style={{ w: '85%' }} />

                        <Text
                            fontSize="sm"
                            textAlign="center"
                            color={textPrimary}
                        >
                            {t('Copy your address or scan this QR code')}
                        </Text>

                        <Text
                            fontSize="xs"
                            textAlign="center"
                            color={textSecondary}
                        >
                            {t('This address only supports VeChain assets.')}
                        </Text>
                    </VStack>
                </ModalBody>
                <ModalFooter pt={0} />
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SelectWallet/Components/WalletCard.tsx`

````tsx
import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    IconButton,
    Icon,
    useToken,
    Box,
} from '@chakra-ui/react';
import { AccountAvatar } from '@/components/common';
import { humanAddress, humanDomain } from '@/utils';
import { useTotalBalance, useWalletMetadata } from '@/hooks';
import { StoredWallet } from '@/hooks/api/wallet/useWalletStorage';
import { LuTrash2, LuCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    wallet: StoredWallet;
    isActive: boolean;
    onSelect: () => void;
    onRemove: () => void;
    showRemove?: boolean;
};

export const WalletCard = ({
    wallet,
    isActive,
    onSelect,
    onRemove,
    showRemove = true,
}: Props) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { formattedBalance, isLoading: isLoadingBalance } = useTotalBalance({
        address: wallet.address,
    });
    const {
        domain,
        image,
        isLoading: isLoadingMetadata,
    } = useWalletMetadata(wallet.address, network.type);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const borderColor = useToken('colors', 'vechain-kit-border');

    const isLoading = isLoadingBalance || isLoadingMetadata;

    return (
        <Card
            variant="vechainKitWalletCard"
            onClick={onSelect}
            borderWidth={isActive ? '2px' : '1px'}
            borderColor={isActive ? 'vechain-kit-primary' : borderColor}
            _hover={{
                borderColor: isActive
                    ? 'vechain-kit-primary'
                    : 'vechain-kit-text-secondary',
            }}
        >
            <CardBody p={4}>
                <HStack spacing={3} w="full" justifyContent="space-between">
                    <HStack spacing={3} flex={1} minW={0}>
                        <AccountAvatar
                            wallet={{
                                address: wallet.address,
                                domain: domain ?? undefined,
                                image: image ?? undefined,
                                isLoadingMetadata,
                            }}
                            props={{ width: 10, height: 10 }}
                        />
                        <VStack
                            spacing={0}
                            alignItems="flex-start"
                            flex={1}
                            minW={0}
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {domain
                                    ? humanDomain(domain, 22, 0)
                                    : humanAddress(wallet.address, 6, 4)}
                            </Text>
                            <Text
                                fontSize="xs"
                                color={textSecondary}
                                noOfLines={1}
                            >
                                {isLoading ? t('Loading...') : formattedBalance}
                            </Text>
                        </VStack>
                    </HStack>
                    {isActive && (
                        <Box>
                            <Icon
                                as={LuCheck}
                                boxSize={5}
                                color="vechain-kit-primary"
                            />
                        </Box>
                    )}
                    {showRemove && !isActive && (
                        <IconButton
                            aria-label={t('Remove wallet')}
                            icon={<Icon as={LuTrash2} />}
                            variant="vechainKitSecondary"
                            height="30px"
                            w="30px"
                            borderRadius="5px"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        />
                    )}
                </HStack>
            </CardBody>
        </Card>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SelectWallet/RemoveWalletConfirmContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Text,
    useToken,
    Icon,
    ModalFooter,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { LuTrash2 } from 'react-icons/lu';
import { humanAddress, humanDomain } from '@/utils';
import { useWalletMetadata } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';

export type RemoveWalletConfirmContentProps = {
    walletAddress: string;
    walletDomain: string | null; // Kept for backward compatibility but will be fetched dynamically
    onConfirm: () => void;
    onBack: () => void;
    onClose?: () => void;
};

export const RemoveWalletConfirmContent = ({
    walletAddress,
    walletDomain: _walletDomain,
    onConfirm,
    onBack,
    onClose,
}: RemoveWalletConfirmContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const { domain } = useWalletMetadata(walletAddress, network.type);
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const displayName = domain
        ? humanDomain(domain, 20, 0)
        : humanAddress(walletAddress, 6, 4);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Remove')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                {onClose && <ModalCloseButton onClick={onClose} />}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" mt={10}>
                    <Icon
                        as={LuTrash2}
                        color={'#ef4444'}
                        fontSize={'60px'}
                        opacity={0.5}
                    />
                    <Text fontSize="md" textAlign="center" color={textPrimary}>
                        {t('Are you sure you want to remove this wallet?')}
                    </Text>
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="vechain-kit-text-secondary"
                        fontWeight="600"
                    >
                        {displayName}
                    </Text>
                    <Text
                        fontSize="sm"
                        textAlign="center"
                        color="vechain-kit-text-secondary"
                    >
                        {humanAddress(walletAddress, 8, 7)}
                    </Text>
                </VStack>
            </ModalBody>
            <ModalFooter w="full" mt={4}>
                <VStack spacing={3} w="full">
                    <Button
                        onClick={onConfirm}
                        data-testid="remove-wallet-button"
                        variant="vechainKitLogout"
                    >
                        {t('Remove')}
                    </Button>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={onBack}
                        data-testid="cancel-remove-button"
                    >
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SelectWallet/SelectWalletContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Button,
    Heading,
    useToken,
    ModalFooter,
} from '@chakra-ui/react';
import { StickyHeaderContainer, ModalBackButton } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { WalletCard } from './Components/WalletCard';
import {
    useSwitchWallet,
    useWallet,
    useRefreshBalances,
    useDAppKitWallet,
    useDAppKitWalletModal,
} from '@/hooks';
import { useWalletStorage } from '@/hooks/api/wallet/useWalletStorage';
import { useAccountModalOptions } from '@/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoredWallet } from '@/hooks/api/wallet/useWalletStorage';
import { LuLogOut, LuPlus } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { simpleHash } from '@/utils';

const hashWallets = (wallets: StoredWallet[]): string => {
    const addresses = wallets
        .map((w) => w.address.toLowerCase())
        .sort()
        .join('|');
    return simpleHash(addresses);
};

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onClose: () => void;
    returnTo?: 'main' | 'profile';
    onLogoutSuccess?: () => void;
};

export const SelectWalletContent = ({
    setCurrentContent,
    returnTo = 'main',
    onLogoutSuccess: _onLogoutSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const {
        account,
        accounts: kitAccounts,
        setActiveAccount,
        connection,
        disconnect,
    } = useWallet();
    const {
        disconnect: dappKitDisconnect,
        switchWallet: dappKitSwitchWallet,
        requestPermissions: dappKitRequestPermissions,
        revokeAccount: dappKitRevokeAccount,
        availableMethods: dappKitAvailableMethods,
    } = useDAppKitWallet();
    const { open: openDappKitModal } = useDAppKitWalletModal();
    const { getStoredWallets, setActiveWallet, removeWallet } =
        useSwitchWallet();
    const { saveWallet } = useWalletStorage();
    const { refresh } = useRefreshBalances();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    // On desktop dapp-kit, use `kitAccounts` as the source of truth;
    // otherwise fall back to legacy storage. Use a stable primitive key in
    // dep arrays — `kitAccounts` reference changes on every valtio write.
    const kitAccountsRef = useRef(kitAccounts);
    kitAccountsRef.current = kitAccounts;
    const kitAccountsKey = useMemo(
        () =>
            kitAccounts
                .map((a) => a.address.toLowerCase())
                .sort()
                .join('|'),
        [kitAccounts],
    );

    const useDappKitAccountsAsSource = useMemo(
        () =>
            connection.isConnectedWithDappKit &&
            !connection.isInAppBrowser &&
            kitAccounts.length > 0,
        [
            connection.isConnectedWithDappKit,
            connection.isInAppBrowser,
            kitAccounts.length,
        ],
    );

    const initialWallets = useMemo<StoredWallet[]>(() => {
        if (useDappKitAccountsAsSource) {
            const activeLower = account?.address?.toLowerCase();
            return kitAccountsRef.current.map((a) => ({
                address: a.address,
                connectedAt: Date.now(),
                isActive: a.address.toLowerCase() === activeLower,
            }));
        }
        return getStoredWallets();
    }, [useDappKitAccountsAsSource, kitAccountsKey, account?.address, getStoredWallets]);

    const [wallets, setWallets] = useState<StoredWallet[]>(initialWallets);
    const walletsHashRef = useRef(hashWallets(initialWallets));

    // Function to refresh wallets list
    const refreshWallets = useCallback(() => {
        if (useDappKitAccountsAsSource) {
            const activeLower = account?.address?.toLowerCase();
            const next: StoredWallet[] = kitAccountsRef.current.map((a) => ({
                address: a.address,
                connectedAt: Date.now(),
                isActive: a.address.toLowerCase() === activeLower,
            }));
            setWallets(next);
            walletsHashRef.current = hashWallets(next);
            return;
        }
        const updatedWallets = getStoredWallets();
        setWallets(updatedWallets);
        walletsHashRef.current = hashWallets(updatedWallets);
    }, [useDappKitAccountsAsSource, kitAccountsKey, account?.address, getStoredWallets]);

    useEffect(() => {
        refreshWallets();
    }, [refreshWallets, account?.address]);

    // Listen for wallet switch events to refresh the list
    useEffect(() => {
        const handleWalletSwitch = () => {
            // Small delay to ensure storage is updated
            setTimeout(() => {
                refreshWallets();
            }, 100);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('wallet_switched', handleWalletSwitch);
            return () => {
                window.removeEventListener(
                    'wallet_switched',
                    handleWalletSwitch,
                );
            };
        }
    }, [refreshWallets]);

    // Poll for wallet changes when modal is open to catch new wallets being added
    // This ensures we catch wallets added via dappkit modal even if account doesn't change immediately
    useEffect(() => {
        const interval = setInterval(() => {
            const currentWallets = getStoredWallets();
            const currentHash = hashWallets(currentWallets);

            // If wallet hash changed, refresh
            if (currentHash !== walletsHashRef.current) {
                refreshWallets();
            }
        }, 200); // Check every 200ms

        return () => clearInterval(interval);
    }, [getStoredWallets, refreshWallets]);

    // Always use the stored active wallet from cache
    // This is the wallet the user has selected as active
    const activeWalletAddress = useMemo(() => {
        const storedActive = wallets.find((w) => w.isActive);
        // Use stored active wallet if it exists
        if (storedActive) {
            return storedActive.address;
        }
        // Fallback to account address if no stored active wallet (new connection)
        return account?.address ?? null;
    }, [wallets, account?.address]);

    const activeWallet = useMemo(() => {
        return wallets.find(
            (w) =>
                w.address.toLowerCase() === activeWalletAddress?.toLowerCase(),
        );
    }, [wallets, activeWalletAddress]);

    const otherWallets = useMemo(() => {
        return wallets.filter(
            (w) =>
                w.address.toLowerCase() !== activeWalletAddress?.toLowerCase(),
        );
    }, [wallets, activeWalletAddress]);

    const handleWalletSelect = useCallback(
        (address: string) => {
            if (address.toLowerCase() === activeWalletAddress?.toLowerCase()) {
                return;
            }

            if (useDappKitAccountsAsSource) {
                // Dapp-kit v2: switch without re-signing.
                setActiveAccount(address);
            } else {
                if (activeWallet) {
                    saveWallet(activeWallet.address);
                }
                setActiveWallet(address);
            }

            // Refresh wallets list immediately after switch
            setTimeout(() => {
                refreshWallets();
            }, 50);
            // Refresh balances after switching
            refresh();

            // Close modal and go back to the screen we came from
            // Pass feedback flag through content props
            setCurrentContent({
                type: returnTo,
                props: {
                    switchFeedback: {
                        showFeedback: true,
                    },
                },
            });
        },
        [
            activeWalletAddress,
            activeWallet,
            useDappKitAccountsAsSource,
            setActiveAccount,
            setActiveWallet,
            refresh,
            setCurrentContent,
            refreshWallets,
            saveWallet,
            returnTo,
        ],
    );

    const handleRemoveWallet = useCallback(
        (wallet: StoredWallet) => {
            const isActiveWallet =
                wallet.address.toLowerCase() ===
                activeWalletAddress?.toLowerCase();
            const remainingWallets = wallets.filter(
                (w) => w.address.toLowerCase() !== wallet.address.toLowerCase(),
            );
            const supportsRevokeAccount =
                useDappKitAccountsAsSource &&
                Array.isArray(dappKitAvailableMethods) &&
                dappKitAvailableMethods.includes(
                    'wallet_revokeAccountPermission',
                ) &&
                typeof dappKitRevokeAccount === 'function';

            // Navigate to remove wallet confirmation screen
            setCurrentContent({
                type: 'remove-wallet-confirm',
                props: {
                    walletAddress: wallet.address,
                    walletDomain: null, // Domain will be fetched dynamically in RemoveWalletConfirmContent
                    onConfirm: async () => {
                        if (supportsRevokeAccount) {
                            await dappKitRevokeAccount(wallet.address);
                            setTimeout(() => {
                                refreshWallets();
                            }, 50);

                            if (remainingWallets.length === 0) {
                                _onLogoutSuccess?.();
                                return;
                            }

                            setCurrentContent({
                                type: 'select-wallet',
                                props: {
                                    setCurrentContent,
                                    onClose: () => {},
                                    returnTo,
                                    onLogoutSuccess: _onLogoutSuccess,
                                },
                            });
                            return;
                        }

                        // If removing the active wallet and there are other wallets, switch to the first one
                        if (isActiveWallet && remainingWallets.length > 0) {
                            const nextActiveWallet = remainingWallets[0];
                            setActiveWallet(nextActiveWallet.address);
                        } else if (
                            isActiveWallet &&
                            remainingWallets.length === 0
                        ) {
                            // If removing the last wallet, disconnect
                            try {
                                await dappKitDisconnect();
                            } catch (error) {
                                console.error('Error disconnecting:', error);
                            }
                        }

                        removeWallet(wallet.address);

                        // Refresh wallets list after removal
                        setTimeout(() => {
                            refreshWallets();
                        }, 50);

                        // If no wallets remain, close the modal
                        if (remainingWallets.length === 0) {
                            if (_onLogoutSuccess) {
                                _onLogoutSuccess();
                            }
                            return;
                        }

                        // Go back to select wallet screen
                        setCurrentContent({
                            type: 'select-wallet',
                            props: {
                                setCurrentContent,
                                onClose: () => {},
                                returnTo,
                                onLogoutSuccess: _onLogoutSuccess,
                            },
                        });
                    },
                    onBack: () => {
                        setCurrentContent({
                            type: 'select-wallet',
                            props: {
                                setCurrentContent,
                                onClose: () => {},
                                returnTo,
                                onLogoutSuccess: _onLogoutSuccess,
                            },
                        });
                    },
                },
            });
        },
        [
            removeWallet,
            refreshWallets,
            setCurrentContent,
            returnTo,
            _onLogoutSuccess,
            activeWalletAddress,
            wallets,
            setActiveWallet,
            dappKitDisconnect,
            dappKitAvailableMethods,
            dappKitRevokeAccount,
            useDappKitAccountsAsSource,
        ],
    );

    const supportsRequestPermissions =
        Array.isArray(dappKitAvailableMethods) &&
        dappKitAvailableMethods.includes('wallet_requestPermissions') &&
        typeof dappKitRequestPermissions === 'function';
    const supportsRevokeAccount =
        Array.isArray(dappKitAvailableMethods) &&
        dappKitAvailableMethods.includes('wallet_revokeAccountPermission') &&
        typeof dappKitRevokeAccount === 'function';

    const handleAddNewWallet = useCallback(() => {
        if (useDappKitAccountsAsSource) {
            // VeWorld v2: prefer EIP-2255 `wallet_requestPermissions`,
            // fall back to legacy `thor_switchWallet`.
            if (supportsRequestPermissions) {
                dappKitRequestPermissions()
                    .then(() => {
                        refresh();
                    })
                    .catch((e) => {
                        console.error('dapp-kit requestPermissions failed', e);
                    });
                return;
            }
            dappKitSwitchWallet().catch((e) => {
                console.error('dapp-kit switchWallet failed', e);
            });
            return;
        }
        openDappKitModal();
    }, [
        useDappKitAccountsAsSource,
        supportsRequestPermissions,
        dappKitRequestPermissions,
        dappKitSwitchWallet,
        openDappKitModal,
        refresh,
    ]);

    const handleLogout = () => {
        disconnect();
        _onLogoutSuccess?.();
    };

    return (
        <>
            <StickyHeaderContainer>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => {
                            setCurrentContent(returnTo);
                        }}
                    />
                )}
                <ModalHeader>{t('Select Wallet')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack w={'full'} spacing={4}>
                    {activeWallet && (
                        <VStack w={'full'} spacing={2} alignItems="flex-start">
                            <Heading size="sm" color={textSecondary}>
                                {t('Active Wallet')}
                            </Heading>
                            <WalletCard
                                wallet={activeWallet}
                                isActive={true}
                                onSelect={() => {}}
                                onRemove={() =>
                                    handleRemoveWallet(activeWallet)
                                }
                                showRemove={
                                    !useDappKitAccountsAsSource &&
                                    wallets.length > 1
                                }
                            />
                        </VStack>
                    )}

                    {otherWallets.length > 0 && (
                        <VStack w={'full'} spacing={2} alignItems="flex-start">
                            <Heading size="sm" color={textSecondary}>
                                {t('Other Wallets')}
                            </Heading>
                            {otherWallets.map((wallet) => (
                                <WalletCard
                                    key={wallet.address}
                                    wallet={wallet}
                                    isActive={false}
                                    onSelect={() =>
                                        handleWalletSelect(wallet.address)
                                    }
                                    onRemove={() => handleRemoveWallet(wallet)}
                                    showRemove={
                                        !useDappKitAccountsAsSource ||
                                        supportsRevokeAccount
                                    }
                                />
                            ))}
                        </VStack>
                    )}
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <VStack w="full" spacing={2}>
                    <Button
                        w="full"
                        leftIcon={<LuPlus />}
                        variant="vechainKitSecondary"
                        onClick={handleAddNewWallet}
                    >
                        {useDappKitAccountsAsSource
                            ? t('Change connected accounts')
                            : t('Add New Wallet')}
                    </Button>
                    <Button
                        w="full"
                        leftIcon={<LuLogOut />}
                        variant="vechainKitLogout"
                        onClick={() =>
                            setCurrentContent({
                                type: 'disconnect-confirm',
                                props: {
                                    onDisconnect: handleLogout,
                                    onBack: () =>
                                        setCurrentContent({
                                            type: 'select-wallet',
                                            props: {
                                                setCurrentContent,
                                                onClose: () => {},
                                                returnTo: returnTo,
                                                onLogoutSuccess:
                                                    _onLogoutSuccess,
                                            },
                                        }),
                                },
                            })
                        }
                    >
                        {t('Logout')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendNft/SendNftContent.tsx`

````tsx
import React from 'react';
import {
    AspectRatio,
    Box,
    Button,
    FormControl,
    HStack,
    Image,
    Input,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ens_normalize } from '@adraffy/ens-normalize';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useVechainDomain } from '@/hooks';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { OwnedNft } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type SendNftContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    collectionName?: string;
    imageUrl?: string;
    initialToAddressOrDomain?: string;
    onBack?: () => void;
};

type FormValues = {
    toAddressOrDomain: string;
};

export const SendNftContent = ({
    setCurrentContent,
    nft,
    collectionName,
    imageUrl,
    initialToAddressOrDomain = '',
    onBack,
}: SendNftContentProps) => {
    const { t } = useTranslation();
    const { isolatedView } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            toAddressOrDomain: initialToAddressOrDomain,
        },
        mode: 'onChange',
    });

    const { toAddressOrDomain } = watch();
    const { data: resolvedDomainData, isLoading } =
        useVechainDomain(toAddressOrDomain);

    const handleBack = () => {
        if (onBack) onBack();
        else setCurrentContent('assets');
    };

    const onSubmit = (data: FormValues) => {
        const isValidReceiver =
            resolvedDomainData?.isValidAddressOrDomain &&
            (!resolvedDomainData?.domain ||
                (resolvedDomainData?.domain &&
                    resolvedDomainData?.isPrimaryDomain));

        if (!isValidReceiver) {
            setError('toAddressOrDomain', {
                type: 'manual',
                message: t('Invalid address or domain'),
            });
            return;
        }

        setCurrentContent({
            type: 'send-nft-summary',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain: resolvedDomainData?.domain,
                resolvedAddress: resolvedDomainData?.address,
            },
        });
    };

    const displayName = `${collectionName ?? 'NFT'} #${nft.tokenId}`;

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send NFT')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={4} align="stretch" w="full">
                    <HStack spacing={3} bg={cardBg} p={3} borderRadius="xl">
                        <Box w="64px" flexShrink={0}>
                            <AspectRatio ratio={1} w="64px">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={displayName}
                                        objectFit="cover"
                                        borderRadius="md"
                                        fallback={
                                            <Skeleton borderRadius="md" />
                                        }
                                    />
                                ) : (
                                    <Skeleton borderRadius="md" />
                                )}
                            </AspectRatio>
                        </Box>
                        <VStack spacing={0} align="stretch" flex={1}>
                            <Text
                                fontWeight="600"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {displayName}
                            </Text>
                            <Text fontSize="sm" color={textSecondary}>
                                #{nft.tokenId}
                            </Text>
                        </VStack>
                    </HStack>

                    <Text fontSize="md" fontWeight="bold" color={textPrimary}>
                        {t('To')}
                    </Text>
                    <Box borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2} p={4} width="100%">
                            <FormControl
                                isInvalid={!!errors.toAddressOrDomain}
                            >
                                <Input
                                    {...register('toAddressOrDomain', {
                                        required: t('Address is required'),
                                    })}
                                    onChange={(e) => {
                                        const trimmed = e.target.value.trim();
                                        const normalizedValue =
                                            trimmed.includes('.')
                                                ? ens_normalize(trimmed)
                                                : trimmed;
                                        e.target.value = normalizedValue;
                                        setValue(
                                            'toAddressOrDomain',
                                            normalizedValue,
                                            { shouldValidate: true },
                                        );
                                    }}
                                    placeholder={t(
                                        'Type the receiver address or domain',
                                    )}
                                    _placeholder={{
                                        fontSize: 'md',
                                        fontWeight: 'normal',
                                    }}
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={textPrimary}
                                    variant="unstyled"
                                />
                                {errors.toAddressOrDomain && (
                                    <Text color={errorColor} fontSize="sm">
                                        {errors.toAddressOrDomain.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    isDisabled={!isValid}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                >
                    {t('Send')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendNft/SendNftSummaryContent.tsx`

````tsx
import React, { useMemo } from 'react';
import {
    AspectRatio,
    Box,
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Skeleton,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { useTranslation } from 'react-i18next';
import {
    useTransferERC721,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useVeChainKitConfig } from '@/providers';
import { getPicassoImage } from '@/utils';
import { GasTokenType } from '@/types/gasToken';
import { OwnedNft } from '@/hooks/api/nfts';
import { AccountModalContentTypes } from '../../Types';

export type SendNftSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    nft: OwnedNft;
    collectionName?: string;
    imageUrl?: string;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
};

export const SendNftSummaryContent = ({
    setCurrentContent,
    nft,
    collectionName,
    imageUrl,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
}: SendNftSummaryContentProps) => {
    const { t } = useTranslation();
    const { account, connection, connectedWallet } = useWallet();
    const { data: avatar } = useGetAvatarOfAddress(resolvedAddress ?? '');
    const { feeDelegation } = useVeChainKitConfig();
    const { preferences } = useGasTokenSelection();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const toImageSrc = useMemo(() => {
        if (avatar) return avatar;
        return getPicassoImage(resolvedAddress || toAddressOrDomain);
    }, [avatar, resolvedAddress, toAddressOrDomain]);

    const displayName = `${collectionName ?? 'NFT'} #${nft.tokenId}`;

    const handleError = (error: string) => {
        console.error('NFT transfer failed:', error);
    };

    const {
        sendTransaction: transferERC721,
        txReceipt,
        error: transferError,
        isWaitingForWalletConfirmation,
        isTransactionPending,
        clauses,
    } = useTransferERC721({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        collectionAddress: nft.collectionAddress,
        tokenId: nft.tokenId,
        collectionName,
        onError: (e) => handleError(e ?? ''),
    });

    const isTxWaitingConfirmation = isWaitingForWalletConfirmation;
    const isSubmitting = isTxWaitingConfirmation || isTransactionPending;

    const handleSend = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }
        try {
            await transferERC721();
        } catch (error) {
            console.error(t('Transaction failed:'), error);
        }
    };

    const handleSuccess = React.useCallback(
        (txId: string) => {
            const recipientLabel =
                resolvedDomain || resolvedAddress || toAddressOrDomain;
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId,
                    title: t('NFT sent'),
                    description: t(
                        '{{nft}} is now in {{recipient}}’s wallet.',
                        {
                            nft: displayName,
                            recipient: recipientLabel,
                        },
                    ),
                    onDone: () => {
                        if (isolatedView) {
                            closeAccountModal();
                        } else {
                            setCurrentContent('main');
                        }
                    },
                    showSocialButtons: true,
                },
            });
        },
        [
            setCurrentContent,
            t,
            isolatedView,
            closeAccountModal,
            displayName,
            resolvedDomain,
            resolvedAddress,
            toAddressOrDomain,
        ],
    );

    const [hasShownSuccess, setHasShownSuccess] = React.useState(false);
    React.useEffect(() => {
        if (!txReceipt) return;
        if (txReceipt.reverted) return;
        if (hasShownSuccess) return;
        if (isSubmitting) return;
        const txId = txReceipt.meta.txID;
        if (!txId) return;
        setHasShownSuccess(true);
        handleSuccess(txId);
    }, [txReceipt, hasShownSuccess, isSubmitting, handleSuccess]);

    React.useEffect(() => {
        if (isSubmitting) setHasShownSuccess(false);
    }, [isSubmitting]);

    const handleBack = () => {
        setCurrentContent({
            type: 'send-nft',
            props: {
                setCurrentContent,
                nft,
                collectionName,
                imageUrl,
                initialToAddressOrDomain: toAddressOrDomain,
            },
        });
    };

    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens,
        sendingAmount: '0',
        sendingTokenSymbol: 'NFT',
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token);
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send NFT')}</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={handleBack}
                />
                <ModalCloseButton isDisabled={isSubmitting} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch" w="full">
                    <HStack spacing={3} bg={cardBg} p={3} borderRadius="xl">
                        <Box w="64px" flexShrink={0}>
                            <AspectRatio ratio={1} w="64px">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={displayName}
                                        objectFit="cover"
                                        borderRadius="md"
                                        fallback={
                                            <Skeleton borderRadius="md" />
                                        }
                                    />
                                ) : (
                                    <Skeleton borderRadius="md" />
                                )}
                            </AspectRatio>
                        </Box>
                        <VStack spacing={0} align="stretch" flex={1}>
                            <Text
                                fontWeight="600"
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {displayName}
                            </Text>
                            <Text fontSize="sm" color={textSecondary}>
                                #{nft.tokenId}
                            </Text>
                        </VStack>
                    </HStack>

                    <Box w="full">
                        <Text fontSize="sm" mb={2} color={textSecondary}>
                            {t('From')}
                        </Text>
                        <AddressDisplayCard
                            address={account?.address ?? ''}
                            domain={account?.domain}
                            imageSrc={account?.image ?? ''}
                            imageAlt="From account"
                            hideAddress={false}
                        />
                    </Box>

                    <Box w="full">
                        <Text fontSize="sm" mb={2} color={textSecondary}>
                            {t('To')}
                        </Text>
                        <AddressDisplayCard
                            address={resolvedAddress || toAddressOrDomain}
                            domain={resolvedDomain}
                            imageSrc={toImageSrc ?? ''}
                            imageAlt="To account"
                        />
                    </Box>

                    {connection.isConnectedWithPrivy && (
                        <GasFeeSummary
                            estimation={gasEstimation}
                            isLoading={gasEstimationLoading}
                            isLoadingTransaction={isSubmitting}
                            onTokenChange={handleGasTokenChange}
                            clauses={clauses}
                            userSelectedToken={userSelectedGasToken}
                        />
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    transactionError={transferError}
                    isSubmitting={isSubmitting}
                    isTxWaitingConfirmation={isTxWaitingConfirmation}
                    onConfirm={handleSend}
                    transactionPendingText={t('Sending...')}
                    txReceipt={txReceipt}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isSubmitting || disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="send"
                />
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendToken/SelectTokenContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    Text,
    InputGroup,
    InputLeftElement,
    Icon,
    ModalFooter,
    Container,
    useToken,
} from '@chakra-ui/react';
import { LuSearch, LuSlash } from 'react-icons/lu';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes, AssetButton } from '@/components';
import { useWallet, useTokensWithValues, TokenWithValue } from '@/hooks';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useCurrency } from '@/hooks';
import { SupportedCurrency } from '@/utils/currencyUtils';
import { NON_TRANSFERABLE_TOKEN_SYMBOLS } from '@/utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    onSelectToken: (token: TokenWithValue) => void;
    onBack: () => void;
    /**
     * If true, shows all tokens (not just tokens with balance) and sorts owned tokens first
     */
    showAllTokens?: boolean;
    /**
     * Token symbols to exclude from the list (e.g. non-transferable governance tokens)
     */
    excludedTokenSymbols?: readonly string[];
};

export const SelectTokenContent = ({
    onSelectToken,
    onBack,
    showAllTokens = false,
    excludedTokenSymbols = NON_TRANSFERABLE_TOKEN_SYMBOLS,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const { account } = useWallet();
    const { tokensWithBalance, sortedTokens } = useTokensWithValues({
        address: account?.address ?? '',
    });
    const [searchQuery, setSearchQuery] = useState('');

    // Get the appropriate token list based on showAllTokens prop
    const availableTokens = useMemo(() => {
        const exclude = (symbol: string) =>
            excludedTokenSymbols.includes(symbol);

        let tokens: TokenWithValue[];
        if (showAllTokens) {
            // Show all tokens, sorted with owned tokens first (by value), then unowned
            const ownedTokens = sortedTokens.filter(
                (token) =>
                    Number(token.balance) > 0 && !exclude(token.symbol),
            );
            const unownedTokens = sortedTokens.filter(
                (token) =>
                    Number(token.balance) === 0 && !exclude(token.symbol),
            );

            // Owned tokens are already sorted by value (highest first)
            // Unowned tokens are sorted alphabetically
            const sortedUnowned = [...unownedTokens].sort((a, b) =>
                a.symbol.localeCompare(b.symbol),
            );

            tokens = [...ownedTokens, ...sortedUnowned];
        } else {
            tokens = tokensWithBalance.filter(
                (token) => !exclude(token.symbol),
            );
        }
        return tokens;
    }, [
        showAllTokens,
        sortedTokens,
        tokensWithBalance,
        excludedTokenSymbols,
    ]);

    // Filter tokens
    const filteredTokens = availableTokens.filter(({ symbol }) =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Select Token')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <InputGroup size="lg">
                            <Input
                                placeholder="Search token"
                                bg={
                                    isDark
                                        ? 'vechain-kit-overlay'
                                        : 'vechain-kit-card'
                                }
                                borderRadius="xl"
                                height="56px"
                                pl={12}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                data-testid="search-token-input"
                            />
                            <InputLeftElement h="56px" w="56px" pl={4}>
                                <LuSearch color={textTertiary} />
                            </InputLeftElement>
                        </InputGroup>

                        <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            color={textPrimary}
                            mt={4}
                        >
                            {showAllTokens ? t('All tokens') : t('Your tokens')}
                        </Text>

                        {filteredTokens.length === 0 ? (
                            <VStack spacing={2} py={8}>
                                <Icon
                                    as={LuSlash}
                                    boxSize={12}
                                    color={textTertiary}
                                />
                                <Text fontSize="lg" color={textPrimary}>
                                    {t('No tokens found')}
                                </Text>
                                <Text fontSize="md" color={textSecondary}>
                                    {t('Try searching with a different term')}
                                </Text>
                            </VStack>
                        ) : (
                            <VStack spacing={2} align="stretch">
                                {filteredTokens.map((token) => (
                                    <AssetButton
                                        key={token.address}
                                        symbol={token.symbol}
                                        amount={Number(token.balance)}
                                        currencyValue={token.valueInCurrency}
                                        currentCurrency={
                                            currentCurrency as SupportedCurrency
                                        }
                                        onClick={() => onSelectToken(token)}
                                    />
                                ))}
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </Container>
            <ModalFooter pt={0} />
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendToken/SendTokenContent.tsx`

````tsx
import React from 'react';
import {
    ModalBody,
    ModalHeader,
    VStack,
    Input,
    Button,
    Text,
    Box,
    HStack,
    Icon,
    ModalFooter,
    Image,
    FormControl,
    useToken,
    ModalCloseButton,
} from '@chakra-ui/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { ModalBackButton, StickyHeaderContainer } from '@/components';
import { AccountModalContentTypes } from '../../Types';
import { LuChevronDown } from 'react-icons/lu';
import { SelectTokenContent } from './SelectTokenContent';
import { parseEther } from 'ethers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useForm } from 'react-hook-form';
import {
    useVechainDomain,
    TokenWithValue,
    useTokensWithValues,
    useWallet,
} from '@/hooks';
import { useCurrency, useTokenPrices } from '@/hooks';
import {
    formatCompactCurrency,
    SupportedCurrency,
    convertToSelectedCurrency,
} from '@/utils/currencyUtils';
import { NON_TRANSFERABLE_TOKEN_SYMBOLS } from '@/utils';
import { ens_normalize } from '@adraffy/ens-normalize';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type SendTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    preselectedToken?: TokenWithValue;
    initialAmount?: string;
    initialToAddressOrDomain?: string;
    onBack?: () => void;
};

// Add form values type
type FormValues = {
    amount: string;
    toAddressOrDomain: string;
};

export const SendTokenContent = ({
    setCurrentContent,
    preselectedToken,
    initialAmount = '',
    initialToAddressOrDomain = '',
    onBack: parentOnBack = () => setCurrentContent('main'),
}: SendTokenContentProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark, feeDelegation } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const errorColor = useToken('colors', 'vechain-kit-error');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { exchangeRates } = useTokenPrices();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();
    const { tokensWithBalance } = useTokensWithValues({
        address: account?.address ?? '',
    });

    const transferableTokens = useMemo(
        () =>
            tokensWithBalance.filter(
                (t) => !NON_TRANSFERABLE_TOKEN_SYMBOLS.includes(t.symbol),
            ),
        [tokensWithBalance],
    );

    const [selectedToken, setSelectedToken] = useState<TokenWithValue | null>(
        () => {
            const validPreselected =
                preselectedToken &&
                !NON_TRANSFERABLE_TOKEN_SYMBOLS.includes(preselectedToken.symbol);
            return validPreselected ? preselectedToken : transferableTokens[0] ?? null;
        },
    );
    const [isSelectingToken, setIsSelectingToken] = useState(false);

    // Set first transferable token as default when tokens load and we have no selection yet
    useEffect(() => {
        if (!selectedToken && transferableTokens.length > 0) {
            setSelectedToken(transferableTokens[0]);
        }
    }, [transferableTokens, selectedToken]);

    // Form setup with validation rules
    const {
        register,
        watch,
        setValue,
        setError,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormValues>({
        defaultValues: {
            amount: initialAmount,
            toAddressOrDomain: initialToAddressOrDomain,
        },
        mode: 'onChange',
    });

    // Watch form values
    const { toAddressOrDomain, amount } = watch();

    // Track previous token to detect changes
    const prevTokenRef = useRef<TokenWithValue | null>(selectedToken);

    // Reset amount when token changes
    useEffect(() => {
        if (
            prevTokenRef.current &&
            selectedToken &&
            prevTokenRef.current.address !== selectedToken.address
        ) {
            setValue('amount', '');
        }
        prevTokenRef.current = selectedToken;
    }, [selectedToken, setValue]);

    const formattedValue = useMemo(() => {
        if (selectedToken) {
            return formatCompactCurrency(
                convertToSelectedCurrency(
                    Number(amount) * selectedToken.priceUsd,
                    currentCurrency as SupportedCurrency,
                    exchangeRates,
                ),
                { currency: currentCurrency as SupportedCurrency },
            );
        }
        return '';
    }, [amount, selectedToken, currentCurrency, exchangeRates]);

    const { data: resolvedDomainData, isLoading } =
        useVechainDomain(toAddressOrDomain);

    const handleSetMaxAmount = () => {
        if (selectedToken) {
            setValue('amount', selectedToken.balance);
        }
    };

    const handleBack = () => {
        parentOnBack();
    };

    const onSubmit = async (data: FormValues) => {
        if (!selectedToken) return;

        // Validation:
        // - Address is valid
        // - There is no domain attached to the address or (if it is attached) the returned domain is the primary domain
        const isValidReceiver =
            resolvedDomainData?.isValidAddressOrDomain &&
            (!resolvedDomainData?.domain ||
                (resolvedDomainData?.domain &&
                    resolvedDomainData?.isPrimaryDomain));

        if (!isValidReceiver) {
            setError('toAddressOrDomain', {
                type: 'manual',
                message: t('Invalid address or domain'),
            });
            return;
        }

        // Validate amount
        if (selectedToken) {
            const numericAmount = parseEther(data.amount);

            // Enforce minimum for B3TR (precise wei comparison)
            const minB3tr = feeDelegation?.b3trTransfers?.minAmountInEther;
            if (
                selectedToken.symbol === 'B3TR' &&
                typeof minB3tr === 'number' &&
                minB3tr > 0
            ) {
                try {
                    const minWei = parseEther(String(minB3tr));
                    if (numericAmount < minWei) {
                        setError('amount', {
                            type: 'manual',
                            message: t(
                                'Minimum {{symbol}} transfer is {{min}}',
                                {
                                    symbol: selectedToken.symbol,
                                    min: minB3tr,
                                },
                            ),
                        });
                        return;
                    }
                } catch {
                    // ignore parse error and continue
                }
            }

            if (numericAmount > parseEther(selectedToken.balance)) {
                setError('amount', {
                    type: 'manual',
                    message: t(`Insufficient {{symbol}} balance`, {
                        symbol: selectedToken.symbol,
                    }),
                });
                return;
            }
        }
        setCurrentContent({
            type: 'send-token-summary',
            props: {
                toAddressOrDomain: data.toAddressOrDomain,
                resolvedDomain: resolvedDomainData?.domain,
                resolvedAddress: resolvedDomainData?.address,
                amount: data.amount,
                selectedToken,
                formattedTotalAmount: formattedValue,
                setCurrentContent,
            },
        });
    };

    if (isSelectingToken) {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={(token) => {
                    setSelectedToken(token);
                    setIsSelectingToken(false);
                }}
                onBack={() => {
                    setIsSelectingToken(false);
                }}
            />
        );
    }

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Send')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={2} align="stretch" position="relative">
                    <HStack justify="space-between">
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('Amount')}
                        </Text>

                        <Text
                            cursor="pointer"
                            _hover={{
                                color: textSecondary,
                                textDecoration: 'underline',
                            }}
                            onClick={handleSetMaxAmount}
                            noOfLines={1}
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize="sm"
                            fontWeight="medium"
                            color={textSecondary}
                        >
                            {t('Balance')}:{' '}
                            {Number(selectedToken?.balance ?? 0).toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                },
                            )}
                        </Text>
                    </HStack>

                    <Box p={4} borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2}>
                            <FormControl isInvalid={!!errors.amount}>
                                <HStack justify="space-between">
                                    <Input
                                        {...register('amount', {
                                            required: t('Amount is required'),
                                            pattern: {
                                                value: /^\d*\.?\d*$/,
                                                message: t(
                                                    'Please enter a valid number',
                                                ),
                                            },
                                            validate: (value) => {
                                                if (!value) return true;
                                                const numericValue =
                                                    parseFloat(value);
                                                if (isNaN(numericValue)) {
                                                    return t(
                                                        'Please enter a valid number',
                                                    );
                                                }

                                                // Enforce minimum amount for B3TR (in ether units)
                                                const minB3tr =
                                                    feeDelegation?.b3trTransfers
                                                        ?.minAmountInEther;
                                                if (
                                                    selectedToken?.symbol ===
                                                        'B3TR' &&
                                                    typeof minB3tr ===
                                                        'number' &&
                                                    minB3tr > 0 &&
                                                    numericValue < minB3tr
                                                ) {
                                                    return t(
                                                        'Minimum {{symbol}} transfer is {{min}}',
                                                        {
                                                            symbol: selectedToken.symbol,
                                                            min: minB3tr,
                                                        },
                                                    );
                                                }

                                                return true;
                                            },
                                        })}
                                        onChange={(e) => {
                                            const trimmed =
                                                e.target.value.trim();
                                            e.target.value = trimmed;
                                            setValue('amount', trimmed, {
                                                shouldValidate: true,
                                            });
                                        }}
                                        placeholder="0"
                                        variant="unstyled"
                                        fontSize="4xl"
                                        fontWeight="bold"
                                        data-testid="tx-amount-input"
                                        type="number"
                                        inputMode="decimal"
                                        color={textPrimary}
                                    />

                                    {selectedToken ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={textSecondary}
                                            borderColor={textSecondary}
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                            }}
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                            leftIcon={
                                                TOKEN_LOGO_COMPONENTS[
                                                    selectedToken.symbol
                                                ] ? (
                                                    React.cloneElement(
                                                        TOKEN_LOGO_COMPONENTS[
                                                            selectedToken.symbol
                                                        ],
                                                        {
                                                            boxSize: '20px',
                                                            borderRadius:
                                                                'full',
                                                        },
                                                    )
                                                ) : (
                                                    <Image
                                                        src={
                                                            TOKEN_LOGOS[
                                                                selectedToken
                                                                    .symbol
                                                            ]
                                                        }
                                                        alt={`${selectedToken.symbol} logo`}
                                                        boxSize="20px"
                                                        borderRadius="full"
                                                        fallback={
                                                            <Box
                                                                boxSize="20px"
                                                                borderRadius="full"
                                                                bg="whiteAlpha.200"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <Text
                                                                    fontSize="8px"
                                                                    fontWeight="bold"
                                                                    color={
                                                                        textPrimary
                                                                    }
                                                                >
                                                                    {selectedToken.symbol.slice(
                                                                        0,
                                                                        3,
                                                                    )}
                                                                </Text>
                                                            </Box>
                                                        }
                                                    />
                                                )
                                            }
                                        >
                                            {selectedToken.symbol}

                                            <Icon
                                                as={LuChevronDown}
                                                boxSize={5}
                                                color={textSecondary}
                                            />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                            color={textSecondary}
                                            borderColor={textSecondary}
                                            _hover={{
                                                bg: isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                                color: textTertiary,
                                            }}
                                            onClick={() =>
                                                setIsSelectingToken(true)
                                            }
                                        >
                                            {t('Select token')}
                                            <Icon
                                                as={LuChevronDown}
                                                boxSize={5}
                                                color={textSecondary}
                                            />
                                        </Button>
                                    )}
                                </HStack>
                                {selectedToken && (
                                    <HStack
                                        spacing={1}
                                        fontSize="sm"
                                        justifyContent={'space-between'}
                                        color={textSecondary}
                                    >
                                        <Text color={textSecondary}>
                                            ≈ {formattedValue}
                                        </Text>
                                    </HStack>
                                )}
                                {errors.amount && (
                                    <Text
                                        color="#ef4444"
                                        fontSize="sm"
                                        mt={1}
                                        data-testid="amount-error-msg"
                                    >
                                        {errors.amount.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>

                    <HStack justify="space-between" mt={2}>
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('To')}
                        </Text>
                    </HStack>
                    <Box borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2} p={4} width="100%">
                            <FormControl isInvalid={!!errors.toAddressOrDomain}>
                                <Input
                                    {...register('toAddressOrDomain', {
                                        required: t('Address is required'),
                                    })}
                                    onChange={(e) => {
                                        const trimmed = e.target.value.trim();
                                        // If the input contains a dot, treat it as a domain name and normalize it
                                        const normalizedValue =
                                            trimmed.includes('.')
                                                ? ens_normalize(trimmed)
                                                : trimmed;
                                        e.target.value = normalizedValue;
                                        setValue(
                                            'toAddressOrDomain',
                                            normalizedValue,
                                            {
                                                shouldValidate: true,
                                            },
                                        );
                                    }}
                                    placeholder={t(
                                        'Type the receiver address or domain',
                                    )}
                                    _placeholder={{
                                        fontSize: 'md',
                                        fontWeight: 'normal',
                                    }}
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color={textPrimary}
                                    variant="unstyled"
                                    data-testid="tx-address-input"
                                />
                                {errors.toAddressOrDomain && (
                                    <Text
                                        color={errorColor}
                                        fontSize="sm"
                                        data-testid="address-error-msg"
                                    >
                                        {errors.toAddressOrDomain.message}
                                    </Text>
                                )}
                            </FormControl>
                        </VStack>
                    </Box>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    variant="vechainKitPrimary"
                    isDisabled={!selectedToken || !isValid}
                    isLoading={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    data-testid="send-button"
                >
                    {selectedToken ? t('Send') : t('Select Token')}
                </Button>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendToken/SendTokenSummaryContent.tsx`

````tsx
import React, { useMemo } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    HStack,
    ModalFooter,
    useToken,
    Box,
} from '@chakra-ui/react';
import {
    ModalBackButton,
    StickyHeaderContainer,
    AddressDisplayCard,
    TransactionButtonAndStatus,
    GasFeeSummary,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { getPicassoImage } from '@/utils';
import {
    useTransferERC20,
    useTransferVET,
    useUpgradeRequired,
    useUpgradeSmartAccountModal,
    useWallet,
    TokenWithValue,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
    useEstimateAllTokens,
} from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useGetAvatarOfAddress } from '@/hooks/api/vetDomains';
import { GasTokenType } from '@/types/gasToken';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type SendTokenSummaryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    toAddressOrDomain: string;
    resolvedDomain?: string;
    resolvedAddress?: string;
    amount: string;
    selectedToken: TokenWithValue;
    formattedTotalAmount: string;
};

export const SendTokenSummaryContent = ({
    setCurrentContent,
    toAddressOrDomain,
    resolvedDomain,
    resolvedAddress,
    amount,
    selectedToken,
    formattedTotalAmount,
}: SendTokenSummaryContentProps) => {
    const { t } = useTranslation();
    const { account, connection, connectedWallet } = useWallet();
    const { data: avatar } = useGetAvatarOfAddress(resolvedAddress ?? '');
    const { network, feeDelegation } = useVeChainKitConfig();
    const { preferences } = useGasTokenSelection();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const { data: upgradeRequired } = useUpgradeRequired(
        account?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    // VeWorld-style "amount adjusted to pay fee" salvage. Initially null.
    // The auto-adjust useEffect below sets this when the user is trying
    // to send (almost) their entire balance of a token that's also the
    // only viable gas token. The effectiveAmount drives the actual
    // transfer hooks and the gas estimation re-pass, so once we've
    // dropped to maxSpendable the iteration finds the sending token as
    // its winner and the tx goes through.
    const [adjustedAmount, setAdjustedAmount] = React.useState<string | null>(
        null,
    );
    const effectiveAmount = adjustedAmount ?? amount;

    // Get the final image URL
    const toImageSrc = useMemo(() => {
        if (avatar) {
            return avatar;
        }
        return getPicassoImage(resolvedAddress || toAddressOrDomain);
    }, [avatar, network.type, resolvedAddress, toAddressOrDomain]);

    const handleSend = async () => {
        if (upgradeRequired) {
            openUpgradeSmartAccountModal();
            return;
        }

        try {
            if (selectedToken.symbol === 'VET') {
                await transferVET();
            } else {
                await transferERC20();
            }
        } catch (error) {
            console.error(t('Transaction failed:'), error);
        }
    };

    const handleSuccess = React.useCallback(
        (txId: string) => {
            const recipientLabel =
                resolvedDomain || resolvedAddress || toAddressOrDomain;
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId,
                    title: t('Tokens sent'),
                    description: t(
                        '{{amount}} {{symbol}} is on its way to {{recipient}}.',
                        {
                            amount: Number(effectiveAmount).toLocaleString(
                                undefined,
                                {
                                    maximumFractionDigits: 6,
                                },
                            ),
                            symbol: selectedToken.symbol,
                            recipient: recipientLabel,
                        },
                    ),
                    onDone: () => {
                        if (isolatedView) {
                            closeAccountModal();
                        } else {
                            setCurrentContent('main');
                        }
                    },
                    showSocialButtons: true,
                },
            });
        },
        [
            setCurrentContent,
            t,
            isolatedView,
            closeAccountModal,
            effectiveAmount,
            selectedToken.symbol,
            resolvedDomain,
            resolvedAddress,
            toAddressOrDomain,
        ],
    );

    const {
        sendTransaction: transferERC20,
        txReceipt: transferERC20Receipt,
        error: transferERC20Error,
        isWaitingForWalletConfirmation:
            transferERC20WaitingForWalletConfirmation,
        isTransactionPending: transferERC20Pending,
        clauses: erc20Clauses,
        isLoadingTokenInfo,
    } = useTransferERC20({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount: effectiveAmount,
        tokenAddress: selectedToken.address,
        tokenName: selectedToken.symbol,
        onError: (error) => {
            handleError(error ?? '');
        },
    });

    const {
        sendTransaction: transferVET,
        txReceipt: transferVETReceipt,
        error: transferVETError,
        isWaitingForWalletConfirmation: transferVETWaitingForWalletConfirmation,
        isTransactionPending: transferVETPending,
        clauses: vetClauses,
    } = useTransferVET({
        fromAddress: account?.address ?? '',
        receiverAddress: resolvedAddress || toAddressOrDomain,
        amount: effectiveAmount,
        onError: (error) => {
            handleError(error ?? '');
        },
    });

    const getTxReceipt = React.useCallback(() => {
        return selectedToken.symbol === 'VET'
            ? transferVETReceipt
            : transferERC20Receipt;
    }, [selectedToken.symbol, transferVETReceipt, transferERC20Receipt]);

    const isTxWaitingConfirmation =
        transferERC20WaitingForWalletConfirmation ||
        transferVETWaitingForWalletConfirmation;
    const isSubmitting =
        isTxWaitingConfirmation || transferERC20Pending || transferVETPending;
    const isTokenTransferLoading =
        selectedToken.symbol !== 'VET' && isLoadingTokenInfo;

    // Track if we've already shown success to prevent duplicate calls
    const [hasShownSuccess, setHasShownSuccess] = React.useState(false);

    // Handle successful transaction via useEffect to avoid synchronous state updates
    React.useEffect(() => {
        const receipt = getTxReceipt();

        // Guard clauses
        if (!receipt) return;
        if (receipt.reverted) return;
        if (hasShownSuccess) return;
        if (isSubmitting) return;

        const txId = receipt.meta.txID;
        if (!txId) return;

        setHasShownSuccess(true);
        handleSuccess(txId);
    }, [getTxReceipt, hasShownSuccess, isSubmitting, handleSuccess]);

    // Reset the flag when starting a new transaction
    React.useEffect(() => {
        if (isSubmitting) {
            setHasShownSuccess(false);
        }
    }, [isSubmitting]);

    const handleBack = () => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: selectedToken,
                initialAmount: amount,
                initialToAddressOrDomain: toAddressOrDomain,
            },
        });
    };

    const handleError = (error: string) => {
        console.error('Transaction failed:', error);
    };

    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    // Track the user's manual selection to show it during loading (before estimation completes)
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);

    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;
    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: selectedToken.symbol === 'VET' ? vetClauses : erc20Clauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens, // Use selected token or all available
        sendingAmount: effectiveAmount,
        sendingTokenSymbol: selectedToken.symbol,
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });

    // Per-token gas costs (independent of which token the iteration picks),
    // used by the auto-adjust salvage below.
    const { data: allTokenCosts } = useEstimateAllTokens({
        clauses: selectedToken.symbol === 'VET' ? vetClauses : erc20Clauses,
        tokens: preferences.availableGasTokens,
        enabled: shouldEstimateGas && !!feeDelegation?.genericDelegatorUrl,
    });
    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token); // Track user's choice
            // Refetch will be triggered automatically by the query key change
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    // Keep userSelectedGasToken to show during loading, but actual result will show the token that succeeds
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    // VeWorld-style auto-adjust: when the iteration cannot find any gas
    // token whose balance covers gas + the sending amount, AND the
    // sending token is itself one of the available gas tokens with
    // enough balance for the gas alone, drop the amount down to
    // (balance - gas * SAFETY_FACTOR) so the tx goes through. Mirrors
    // veworld-mobile's SummaryScreen.tsx co-spend handling.
    const ADJUST_SAFETY_FACTOR = 1.05;
    React.useEffect(() => {
        // Don't loop: once adjusted, we stop re-evaluating.
        if (adjustedAmount !== null) return;
        if (!gasEstimationError) return;
        if (!allTokenCosts) return;
        const sendingSymbol = selectedToken.symbol as GasTokenType;
        if (
            !preferences.availableGasTokens.includes(sendingSymbol as never)
        ) {
            return;
        }
        const costEntry = allTokenCosts[sendingSymbol];
        if (!costEntry || costEntry.loading || costEntry.cost <= 0) return;
        const balance = Number(selectedToken.balance);
        const gasReserve = costEntry.cost * ADJUST_SAFETY_FACTOR;
        const maxSpendable = balance - gasReserve;
        if (maxSpendable <= 0) return;
        if (Number(amount) <= maxSpendable) return;
        // Floor to 4 decimals so the displayed number doesn't show
        // floating-point noise; the underlying parseUnits handles the
        // rest at full precision.
        const rounded = Math.floor(maxSpendable * 10000) / 10000;
        if (rounded <= 0) return;
        setAdjustedAmount(rounded.toString());
    }, [
        adjustedAmount,
        gasEstimationError,
        allTokenCosts,
        selectedToken,
        preferences.availableGasTokens,
        amount,
    ]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>Send</ModalHeader>
                <ModalBackButton
                    isDisabled={isSubmitting}
                    onClick={handleBack}
                />
                <ModalCloseButton isDisabled={isSubmitting} />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch" w="full">
                    {/* From/To Card */}

                    <VStack spacing={4} w="full">
                        <Box w="full">
                            <Text fontSize="sm" mb={2} color={textSecondary}>
                                {t('From')}
                            </Text>
                            <AddressDisplayCard
                                address={account?.address ?? ''}
                                domain={account?.domain}
                                imageSrc={account?.image ?? ''}
                                imageAlt="From account"
                                balance={Number(selectedToken.balance)}
                                tokenAddress={selectedToken.address}
                            />
                        </Box>

                        <Box w="full">
                            <Text fontSize="sm" mb={2} color={textSecondary}>
                                {t('To')}
                            </Text>
                            <AddressDisplayCard
                                address={resolvedAddress || toAddressOrDomain}
                                domain={resolvedDomain}
                                imageSrc={toImageSrc ?? ''}
                                imageAlt="To account"
                                tokenAddress={selectedToken.address}
                            />
                        </Box>

                        {connection.isConnectedWithPrivy && (
                            <GasFeeSummary
                                estimation={gasEstimation}
                                isLoading={gasEstimationLoading}
                                isLoadingTransaction={isSubmitting}
                                onTokenChange={handleGasTokenChange}
                                clauses={
                                    selectedToken.symbol === 'VET'
                                        ? vetClauses
                                        : erc20Clauses
                                }
                                userSelectedToken={userSelectedGasToken}
                            />
                        )}

                        {adjustedAmount !== null && (
                            <Box
                                w="full"
                                borderRadius="md"
                                p={3}
                                borderWidth="1px"
                                borderColor="vechain-kit-border"
                                bg="vechain-kit-card"
                            >
                                <Text fontSize="sm" color={textPrimary}>
                                    {t(
                                        'Amount adjusted from {{original}} to {{adjusted}} {{symbol}} to cover the transaction fee.',
                                        {
                                            original: Number(
                                                amount,
                                            ).toLocaleString(undefined, {
                                                maximumFractionDigits: 4,
                                            }),
                                            adjusted: Number(
                                                adjustedAmount,
                                            ).toLocaleString(undefined, {
                                                maximumFractionDigits: 4,
                                            }),
                                            symbol: selectedToken.symbol,
                                        },
                                    )}
                                </Text>
                            </Box>
                        )}

                        <VStack
                            spacing={0}
                            w="full"
                            justifyContent="flex-start"
                        >
                            <Text
                                fontSize="sm"
                                fontWeight="light"
                                textAlign="left"
                                w="full"
                                color={textSecondary}
                            >
                                {t('Amount')}
                            </Text>
                            <HStack justifyContent="flex-start" w="full">
                                <Text
                                    fontSize="xl"
                                    fontWeight="semibold"
                                    textAlign="left"
                                    data-testid="send-summary-amount"
                                    color={textPrimary}
                                >
                                    {Number(effectiveAmount).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        },
                                    )}{' '}
                                    {selectedToken.symbol}
                                </Text>
                                <Text color={textSecondary}>
                                    ≈ {formattedTotalAmount}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    transactionError={
                        selectedToken.symbol === 'VET'
                            ? transferVETError
                            : transferERC20Error
                    }
                    isSubmitting={isSubmitting}
                    isTxWaitingConfirmation={isTxWaitingConfirmation}
                    onConfirm={handleSend}
                    transactionPendingText={t('Sending...')}
                    txReceipt={getTxReceipt()}
                    buttonText={t('Confirm')}
                    isDisabled={
                        isSubmitting ||
                        isTokenTransferLoading ||
                        disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="send"
                />
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SuccessfulOperation/SuccessfulOperationContent.tsx`

````tsx
import {
    Button,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { StatusScreen } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { ShareButtons } from '@/components/TransactionModal';

export type SuccessfulOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    txId?: string;
    title: string;
    description?: string;
    onDone: () => void;
    showSocialButtons?: boolean;
};

export const SuccessfulOperationContent = ({
    txId,
    title,
    description,
    onDone,
    showSocialButtons = false,
}: SuccessfulOperationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <StatusScreen
            status={'success'}
            title={title}
            description={description}
            bodyExtras={
                showSocialButtons && txId ? (
                    <VStack spacing={3} pt={1}>
                        <Text
                            fontSize={'12px'}
                            fontWeight={600}
                            color={textSecondary}
                            textTransform={'uppercase'}
                            letterSpacing={'0.06em'}
                        >
                            {t('Share on')}
                        </Text>
                        <ShareButtons description={socialDescription} />
                    </VStack>
                ) : undefined
            }
            actions={
                <Button
                    onClick={onDone}
                    variant={'vechainKitSecondary'}
                    width={'full'}
                >
                    {t('Done')}
                </Button>
            }
            footerExtras={
                txId ? (
                    <Link
                        href={`${explorerUrl}/${txId}`}
                        isExternal
                        opacity={0.6}
                        fontSize={'14px'}
                        textDecoration={'underline'}
                    >
                        <HStack
                            spacing={1}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Text color={textSecondary}>
                                {t('View transaction on the explorer')}
                            </Text>
                            <Icon as={LuExternalLink} boxSize={'14px'} />
                        </HStack>
                    </Link>
                ) : undefined
            }
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Swap/SelectQuoteContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    HStack,
    Text,
    Container,
    Box,
    Badge,
    Collapse,
    Icon,
    Image,
    Tooltip,
    ModalFooter,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { SwapQuote } from '@/types/swap';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { formatEther } from 'viem';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';
import { formatCompactCurrency, SupportedCurrency, convertToSelectedCurrency } from '@/utils/currencyUtils';
import { useCurrency, useTokensWithValues, useWallet } from '@/hooks';
import { useTokenPrices } from '@/hooks';
import { useState, useMemo } from 'react';
import { TOKEN_LOGO_COMPONENTS, TOKEN_LOGOS, compareAddresses } from '@/utils';
import React from 'react';

type Props = {
    quotes: SwapQuote[];
    selectedQuote: SwapQuote | null;
    toTokenAddress: string | null;
    onSelectQuote: (quote: SwapQuote) => void;
    onBack: () => void;
};

export const SelectQuoteContent = ({
    quotes,
    selectedQuote,
    toTokenAddress,
    onSelectQuote,
    onBack,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { currentCurrency } = useCurrency();
    const { account } = useWallet();
    const { exchangeRates, prices } = useTokenPrices();
    const { tokens } = useTokensWithValues({ address: account?.address ?? '' });
    const [showUnavailable, setShowUnavailable] = useState(false);

    // Get toToken symbol from address
    const toToken = useMemo(() => {
        if (!toTokenAddress) return null;
        // Use compareAddresses for proper address comparison
        return tokens.find(t => compareAddresses(t.address, toTokenAddress)) || null;
    }, [toTokenAddress, tokens]);


    // Separate available and unavailable quotes
    const availableQuotes = quotes.filter(q => !q.reverted);
    const unavailableQuotes = quotes.filter(q => q.reverted);

    // Find the best quote (highest output amount among available)
    const bestQuote = useMemo(() => {
        if (availableQuotes.length === 0) return null;
        return availableQuotes.reduce((best, current) => {
            const bestOutput = BigInt(best.outputAmount || '0');
            const currentOutput = BigInt(current.outputAmount || '0');
            return currentOutput > bestOutput ? current : best;
        });
    }, [availableQuotes]);

    // Calculate USD value for each quote
    const quotesWithValues = useMemo(() => {
        const toTokenPriceUsd = toTokenAddress ? (prices[toTokenAddress] || 0) : 0;

        return availableQuotes.map((quote) => {
            const outputAmountFormatted = formatEther(BigInt(quote.outputAmount || '0'));
            const valueUsd = Number(outputAmountFormatted) * toTokenPriceUsd;
            const valueInCurrency = convertToSelectedCurrency(
                valueUsd,
                currentCurrency as SupportedCurrency,
                exchangeRates,
            );
            const isBest = bestQuote && quote.aggregatorName === bestQuote.aggregatorName;

            // Calculate percentage difference from best
            let percentageDiff = 0;
            if (bestQuote && !isBest) {
                const bestOutput = BigInt(bestQuote.outputAmount || '0');
                const currentOutput = BigInt(quote.outputAmount || '0');
                const diff = Number(currentOutput - bestOutput);
                percentageDiff = (diff / Number(bestOutput)) * 100;
            }

            return {
                ...quote,
                outputAmountFormatted,
                valueUsd,
                valueInCurrency,
                isBest,
                percentageDiff,
            };
        }).sort((a, b) => {
            // Sort by output amount (descending)
            const aOutput = BigInt(a.outputAmount || '0');
            const bOutput = BigInt(b.outputAmount || '0');
            return Number(bOutput - aOutput);
        });
    }, [availableQuotes, toTokenAddress, prices, currentCurrency, exchangeRates, bestQuote]);

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Found following rates')}</ModalHeader>
                <ModalBackButton onClick={onBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        {/* Available Quotes */}
                        {quotesWithValues.length > 0 && (
                            <VStack spacing={2} align="stretch">
                                {quotesWithValues.map((quoteWithValue) => {
                                    const isSelected = selectedQuote?.aggregatorName === quoteWithValue.aggregatorName;

                                    return (
                                        <Box
                                            key={quoteWithValue.aggregatorName}
                                            p={2.5}
                                            borderRadius="xl"
                                            bg={isDark ? '#00000038' : 'gray.50'}
                                            borderWidth={1}
                                            borderColor={
                                                isSelected
                                                    ? 'blue.500'
                                                    : isDark
                                                        ? 'whiteAlpha.200'
                                                        : 'gray.200'
                                            }
                                            cursor="pointer"
                                            onClick={() => onSelectQuote(quoteWithValue)}
                                            _hover={{
                                                borderColor: isSelected ? 'blue.500' : (isDark ? 'whiteAlpha.400' : 'gray.300'),
                                            }}
                                            position="relative"
                                        >
                                            {/* Badge tag on top left */}
                                            {(quoteWithValue.isBest || (!quoteWithValue.isBest && quoteWithValue.percentageDiff < 0)) && (
                                                <Box position="absolute" top={-1} left={0} zIndex={1}>
                                                    {quoteWithValue.isBest ? (
                                                        <Badge
                                                            colorScheme="purple"
                                                            borderRadius="sm"
                                                            fontSize="2xs"
                                                            px={1.5}
                                                            py={0.5}
                                                            borderTopLeftRadius="xl"
                                                            borderBottomRightRadius="md"
                                                        >
                                                            {t('Best')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            colorScheme="red"
                                                            borderRadius="xs"
                                                            fontSize="2xs"
                                                            px={1.5}
                                                            py={0.5}
                                                            borderTopLeftRadius="xl"
                                                            borderBottomRightRadius="md"
                                                        >
                                                            {quoteWithValue.percentageDiff.toFixed(2)}%
                                                        </Badge>
                                                    )}
                                                </Box>
                                            )}

                                            <VStack align="stretch" spacing={1.5} marginTop={4}>
                                                {/* Aggregator name/icon and token amount in same line */}
                                                <HStack justify="space-between" align="center">
                                                    <HStack spacing={1.5} align="center">
                                                        {quoteWithValue.aggregator.getIcon('20px')}
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="bold"
                                                        >
                                                            {quoteWithValue.aggregatorName}
                                                        </Text>
                                                    </HStack>
                                                    <HStack align="center" spacing={1.5}>
                                                        {toToken && (
                                                            <>
                                                                {TOKEN_LOGO_COMPONENTS[toToken.symbol] ? (
                                                                    React.cloneElement(
                                                                        TOKEN_LOGO_COMPONENTS[toToken.symbol],
                                                                        {
                                                                            boxSize: '24px',
                                                                            borderRadius: 'full',
                                                                        }
                                                                    )
                                                                ) : TOKEN_LOGOS[toToken.symbol] ? (
                                                                    <Image
                                                                        src={TOKEN_LOGOS[toToken.symbol]}
                                                                        alt={`${toToken.symbol} logo`}
                                                                        boxSize="24px"
                                                                        borderRadius="full"
                                                                    />
                                                                ) : null}
                                                                <Tooltip
                                                                    label={Number(quoteWithValue.outputAmountFormatted).toLocaleString(undefined, { maximumFractionDigits: 18 })}
                                                                    hasArrow
                                                                    placement="top"
                                                                >
                                                                    <Text
                                                                        fontSize="md"
                                                                        fontWeight="bold"
                                                                        textAlign="right"
                                                                        whiteSpace="nowrap"
                                                                    >
                                                                        {Number(quoteWithValue.outputAmountFormatted).toLocaleString(undefined, {
                                                                            minimumFractionDigits: 4,
                                                                        })}
                                                                        {' '}{toToken.symbol}
                                                                    </Text>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                    </HStack>
                                                </HStack>

                                                {/* Gas and fiat value in same line underneath */}
                                                <HStack justify="space-between" align="center">
                                                    <Text
                                                        fontSize="xs"
                                                        color={isDark ? 'whiteAlpha.500' : 'blackAlpha.500'}
                                                    >
                                                        {quoteWithValue.gasCostVTHO && quoteWithValue.gasCostVTHO > 0
                                                            ? `Gas: ${quoteWithValue.gasCostVTHO.toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })} VTHO`
                                                            : ''}
                                                    </Text>
                                                    {quoteWithValue.valueUsd > 0 && (
                                                        <Text
                                                            fontSize="xs"
                                                            color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                                            textAlign="right"
                                                            whiteSpace="nowrap"
                                                        >
                                                            ≈ {formatCompactCurrency(
                                                                quoteWithValue.valueInCurrency,
                                                                { currency: currentCurrency as SupportedCurrency },
                                                            )}
                                                        </Text>
                                                    )}
                                                </HStack>
                                            </VStack>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        )}

                        {/* Unavailable Quotes */}
                        {unavailableQuotes.length > 0 && (
                            <Box>
                                <HStack
                                    justify="space-between"
                                    cursor="pointer"
                                    onClick={() => setShowUnavailable(!showUnavailable)}
                                    py={2}
                                >
                                    <Text
                                        fontSize="sm"
                                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                    >
                                        {unavailableQuotes.length} {t('rate')}{unavailableQuotes.length !== 1 ? 's' : ''} {t('unavailable')}
                                    </Text>
                                    <Icon
                                        as={showUnavailable ? LuChevronUp : LuChevronDown}
                                        boxSize={4}
                                        color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                                    />
                                </HStack>
                                <Collapse in={showUnavailable} animateOpacity>
                                    <VStack spacing={2} align="stretch" pt={2}>
                                        {unavailableQuotes.map((quote) => (
                                            <Box
                                                key={quote.aggregatorName}
                                                p={2}
                                                borderRadius="xl"
                                                bg={isDark ? '#00000038' : 'gray.50'}
                                                opacity={0.6}
                                            >
                                                <HStack justify="space-between">
                                                    <HStack spacing={2} align="center">
                                                        {quote.aggregator.getIcon('20px')}
                                                        <Text
                                                            fontSize="md"
                                                            fontWeight="medium"
                                                        >
                                                            {quote.aggregatorName}
                                                        </Text>
                                                    </HStack>
                                                    <Text
                                                        fontSize="xs"
                                                        color={isDark ? 'whiteAlpha.500' : 'blackAlpha.500'}
                                                    >
                                                        {t('Unable to fetch the price')}
                                                    </Text>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Collapse>
                            </Box>
                        )}

                        {quotesWithValues.length === 0 && unavailableQuotes.length === 0 && (
                            <VStack
                                spacing={2}
                                py={8}
                                color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                            >
                                <Text fontSize="lg">
                                    {t('No quotes available')}
                                </Text>
                            </VStack>
                        )}
                    </VStack>
                </ModalBody>
            </Container>
            <ModalFooter />
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Swap/SwapTokenContent.tsx`

````tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    HStack,
    Text,
    ModalFooter,
    Button,
    Icon,
    Box,
    Input,
    InputGroup,
    InputRightElement,
    Image,
    Collapse,
    useToken,
} from '@chakra-ui/react';
import {
    GasFeeSummary,
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { LuArrowDown, LuArrowUp, LuChevronDown } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    useWallet,
    useTokensWithValues,
    TokenWithValue,
    useSwapQuotes,
    useSwapTransaction,
    useCurrency,
    useGasTokenSelection,
    useGenericDelegatorFeeEstimation,
} from '@/hooks';
import { SelectQuoteContent } from './SelectQuoteContent';
import { SwapQuote } from '@/types/swap';
import { useVeChainKitConfig } from '@/providers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { formatUnits, parseUnits } from 'viem';
import { compareAddresses, NON_TRANSFERABLE_TOKEN_SYMBOLS } from '@/utils';

const SWAP_EXCLUDED_TOKEN_SYMBOLS: readonly string[] = [
    ...NON_TRANSFERABLE_TOKEN_SYMBOLS,
    'veDelegate',
];
import { SelectTokenContent } from '../SendToken/SelectTokenContent';
import { formatCompactCurrency } from '@/utils/currencyUtils';
import {
    convertToSelectedCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { useTokenPrices } from '@/hooks';
import { GasTokenType } from '@/types/gasToken';
import { TransactionClause } from '@vechain/sdk-core';
import { extractSwapAmounts } from '@/utils/swap/extractSwapAmounts';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type SwapTokenContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    fromTokenAddress?: string;
    toTokenAddress?: string;
    onBack?: () => void;
};

type SwapStep =
    | 'main'
    | 'select-from-token'
    | 'select-to-token'
    | 'select-quote';

export const SwapTokenContent = ({
    setCurrentContent,
    fromTokenAddress,
    toTokenAddress,
    onBack,
}: SwapTokenContentProps) => {
    const { t } = useTranslation();
    const { account, connection } = useWallet();
    const { currentCurrency } = useCurrency();
    const { network, feeDelegation, darkMode: isDark, appConfig } = useVeChainKitConfig();
    const { isolatedView, closeAccountModal } = useAccountModalOptions();

    const cardBg = useToken('colors', 'vechain-kit-card');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textTertiary = useToken('colors', 'vechain-kit-text-tertiary');
    const primaryButtonBg = useToken('colors', 'vechain-kit-button-primary-bg');
    const primaryButtonColor = useToken(
        'colors',
        'vechain-kit-button-primary-color',
    );

    const { preferences } = useGasTokenSelection();
    const { sortedTokens } = useTokensWithValues({
        address: account?.address ?? '',
    });

    const [step, setStep] = useState<SwapStep>('main');
    const [fromToken, setFromToken] = useState<TokenWithValue | null>(null);
    const [toToken, setToToken] = useState<TokenWithValue | null>(null);
    const [amount, setAmount] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [slippageTolerance, setSlippageTolerance] = useState(1);
    const [customSlippageValue, setCustomSlippageValue] = useState('1');
    const [selectedQuote, setSelectedQuote] = useState<SwapQuote | null>(null);
    const [selectedGasToken, setSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    const [userSelectedGasToken, setUserSelectedGasToken] =
        React.useState<GasTokenType | null>(null);
    const [swapClauses, setSwapClauses] = React.useState<TransactionClause[]>(
        [],
    );

    // Prices and FX to compute fiat values for entered and output amounts
    const { prices, exchangeRates } = useTokenPrices();

    // Determine if we're in auto mode (1% default) or custom mode
    const isAutoMode = slippageTolerance === 1;

    // Sync customSlippageValue with slippageTolerance
    React.useEffect(() => {
        if (slippageTolerance === 1) {
            setCustomSlippageValue('1');
        } else if (slippageTolerance === 0.5) {
            setCustomSlippageValue('0.5');
        } else if (slippageTolerance === 3) {
            setCustomSlippageValue('3');
        } else {
            setCustomSlippageValue(slippageTolerance.toString());
        }
    }, [slippageTolerance]);

    // Set initial tokens from provided addresses if present, otherwise default VET -> B3TR
    React.useEffect(() => {
        if (sortedTokens.length === 0) return;

        // Prefer provided addresses (exclude non-transferable tokens)
        if ((fromTokenAddress || toTokenAddress) && (!fromToken || !toToken)) {
            if (fromTokenAddress && !fromToken) {
                const match = sortedTokens.find((t) =>
                    compareAddresses(t.address, fromTokenAddress),
                );
                if (
                    match &&
                    !SWAP_EXCLUDED_TOKEN_SYMBOLS.includes(match.symbol)
                ) {
                    setFromToken(match);
                }
            }
            if (toTokenAddress && !toToken) {
                const match = sortedTokens.find((t) =>
                    compareAddresses(t.address, toTokenAddress),
                );
                if (
                    match &&
                    !SWAP_EXCLUDED_TOKEN_SYMBOLS.includes(match.symbol)
                ) {
                    setToToken(match);
                }
            }
            return;
        }

        if (!fromToken && !toToken) {
            // Find VET token
            const vetToken = sortedTokens.find((t) => t.symbol === 'VET');
            if (vetToken) {
                setFromToken(vetToken);
            }

            // Find B3TR token: first try by symbol, then by address from config
            let b3trToken = sortedTokens.find((t) => t.symbol === 'B3TR');

            // If not found by symbol, try finding by address from config
            if (!b3trToken) {
                try {
                    const b3trAddress = appConfig.b3trContractAddress;
                    if (b3trAddress) {
                        b3trToken = sortedTokens.find((t) =>
                            compareAddresses(t.address, b3trAddress),
                        );
                    }
                } catch (error) {
                    console.warn(
                        'Failed to get B3TR address from config:',
                        error,
                    );
                }
            }

            if (b3trToken) {
                setToToken(b3trToken);
            }
        }
    }, [
        sortedTokens,
        fromToken,
        toToken,
        fromTokenAddress,
        toTokenAddress,
        network.type,
    ]);

    // Clear selected quote when quote parameters change
    // This ensures that when amount/token changes, we use the new best quote
    // instead of a stale manually selected quote
    React.useEffect(() => {
        setSelectedQuote(null);
    }, [fromToken?.address, toToken?.address, amount]);

    // Unified quotes: get best and full list
    const {
        bestQuote,
        quotes: allQuotes,
        isLoading: isLoadingQuote,
        from,
        to,
    } = useSwapQuotes(
        fromToken,
        toToken,
        amount,
        account?.address ?? '',
        slippageTolerance,
        !!fromToken && !!toToken && Number(amount) > 0,
    );

    // Convert amount to raw format for quote (now that we know decimals)
    const amountInRaw = useMemo(() => {
        if (!amount || Number(amount) <= 0 || !from) return 0n;
        try {
            return parseUnits(amount, from.decimals);
        } catch {
            return 0n;
        }
    }, [amount, from?.decimals]);

    // Use selected quote if available, otherwise use best quote
    const quote = selectedQuote || bestQuote;

    // Format output amount for display
    const outputAmount = useMemo(() => {
        if (!quote?.outputAmount || !to) return '0';
        try {
            // Convert from raw format to human-readable
            return formatUnits(quote.outputAmount, to.decimals);
        } catch {
            return '0';
        }
    }, [quote, to?.decimals]);

    // Fiat value for the entered input amount (from side)
    const fromAmountFiatValue = useMemo(() => {
        if (!fromToken || !amount) return 0;
        const priceUsd = prices[fromToken.address] || 0;
        const valueUsd = Number(amount) * priceUsd;
        return convertToSelectedCurrency(
            valueUsd,
            currentCurrency as SupportedCurrency,
            exchangeRates,
        );
    }, [fromToken?.address, amount, prices, currentCurrency, exchangeRates]);

    // Fiat value for the quoted output amount (to side)
    const toAmountFiatValue = useMemo(() => {
        if (!toToken || !outputAmount) return 0;
        const priceUsd = prices[toToken.address] || 0;
        const valueUsd = Number(outputAmount) * priceUsd;
        return convertToSelectedCurrency(
            valueUsd,
            currentCurrency as SupportedCurrency,
            exchangeRates,
        );
    }, [
        toToken?.address,
        outputAmount,
        prices,
        currentCurrency,
        exchangeRates,
    ]);

    // Simulate swap to get gas estimate
    const swapParams = useMemo(() => {
        if (!fromToken || !toToken || !account?.address || amountInRaw === 0n) {
            return null;
        }
        return {
            fromTokenAddress: fromToken.address,
            toTokenAddress: toToken.address,
            amountIn: amountInRaw.toString(),
            userAddress: account.address,
            slippageTolerance,
        };
    }, [fromToken, toToken, account?.address, amountInRaw, slippageTolerance]);

    // Use gas cost from quote if available, otherwise from simulation hook
    const gasCostVTHO = quote?.gasCostVTHO ?? 0;

    // Build swap clauses for gas estimation (async operation)
    React.useEffect(() => {
        const buildClauses = async () => {
            if (!quote || !swapParams || !quote.aggregator) {
                setSwapClauses([]);
                return;
            }

            try {
                const clauses = await quote.aggregator.buildSwapTransaction(
                    swapParams,
                    quote,
                );
                setSwapClauses(clauses);
            } catch (error) {
                console.error(
                    'Failed to build swap clauses for gas estimation:',
                    error,
                );
                setSwapClauses([]);
            }
        };

        buildClauses();
    }, [quote, swapParams]);

    // Gas estimation for social login wallets with generic delegator
    const shouldEstimateGas =
        preferences.availableGasTokens.length > 0 &&
        (connection.isConnectedWithPrivy ||
            connection.isConnectedWithVeChain) &&
        !feeDelegation?.delegatorUrl;

    const {
        data: gasEstimation,
        isLoading: gasEstimationLoading,
        error: gasEstimationError,
        refetch: refetchGasEstimation,
    } = useGenericDelegatorFeeEstimation({
        clauses: swapClauses,
        tokens: selectedGasToken
            ? [selectedGasToken]
            : preferences.availableGasTokens,
        sendingAmount: amount,
        sendingTokenSymbol: fromToken?.symbol ?? '',
        enabled:
            shouldEstimateGas &&
            !!feeDelegation?.genericDelegatorUrl &&
            swapClauses.length > 0,
    });

    const usedGasToken = gasEstimation?.usedToken;
    const disableConfirmButtonDuringEstimation =
        (gasEstimationLoading || !gasEstimation) &&
        connection.isConnectedWithPrivy &&
        !feeDelegation?.delegatorUrl;

    const handleGasTokenChange = React.useCallback(
        (token: GasTokenType) => {
            setSelectedGasToken(token);
            setUserSelectedGasToken(token);
            setTimeout(() => refetchGasEstimation(), 100);
        },
        [refetchGasEstimation],
    );

    // hasEnoughBalance is now determined by the hook itself
    const hasEnoughBalance = !!usedGasToken && !gasEstimationError;

    // Auto-fallback: if the selected token cannot cover fees (estimation error),
    // clear selection to re-estimate across all available tokens
    React.useEffect(() => {
        if (gasEstimationError && selectedGasToken) {
            setSelectedGasToken(null);
        }
    }, [gasEstimationError, selectedGasToken]);

    // Swap transaction execution
    const {
        executeSwap,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        txReceipt,
        status,
        error: txError,
    } = useSwapTransaction(swapParams, quote);

    const handleSwapSuccess = useCallback(() => {
        const txId = txReceipt?.meta.txID ?? '';
        // Extract swap amounts from receipt transfer events
        const swapTitle = t('Swap successful', {
            defaultValue: 'Swap successful',
        });
        let swapDescription: string | undefined;

        if (txReceipt && fromToken && toToken && account?.address) {
            const swapAmounts = extractSwapAmounts(
                txReceipt,
                account.address,
                fromToken.address,
                toToken.address,
            );

            if (swapAmounts && from && to) {
                try {
                    // Format amounts using token decimals from useSwapQuotes
                    const fromDecimals = from.decimals;
                    const toDecimals = to.decimals;
                    const fromAmountFormatted = formatUnits(
                        swapAmounts.fromAmount,
                        fromDecimals,
                    );
                    const toAmountFormatted = formatUnits(
                        swapAmounts.toAmount,
                        toDecimals,
                    );

                    // Format numbers for display (remove unnecessary trailing zeros)
                    const formatAmount = (value: string) => {
                        const num = Number(value);
                        if (num >= 1000) {
                            return num.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                            });
                        }
                        return num.toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                            minimumFractionDigits: 0,
                        });
                    };

                    swapDescription = t(
                        'You successfully swapped {fromAmount} {fromSymbol} for {toAmount} {toSymbol}',
                        {
                            fromAmount: formatAmount(fromAmountFormatted),
                            fromSymbol: fromToken.symbol,
                            toAmount: formatAmount(toAmountFormatted),
                            toSymbol: toToken.symbol,
                            defaultValue: `You successfully swapped ${formatAmount(
                                fromAmountFormatted,
                            )} ${fromToken.symbol} for ${formatAmount(
                                toAmountFormatted,
                            )} ${toToken.symbol}`,
                        },
                    );
                } catch (error) {
                    console.warn('Failed to format swap amounts:', error);
                }
            }
        }

        // Fallback to basic description if extraction failed
        if (!swapDescription && fromToken && toToken) {
            swapDescription = t(
                'You successfully swapped {fromToken} for {toToken}',
                {
                    fromToken: fromToken.symbol,
                    toToken: toToken.symbol,
                    defaultValue: `You successfully swapped ${fromToken.symbol} for ${toToken.symbol}`,
                },
            );
        }

        setCurrentContent({
            type: 'successful-operation',
            props: {
                setCurrentContent,
                txId,
                title: swapTitle,
                description: swapDescription,
                onDone: () => {
                    if (isolatedView) {
                        closeAccountModal();
                    } else {
                        setCurrentContent('main');
                    }
                },
                showSocialButtons: true,
            },
        });
    }, [
        fromToken,
        toToken,
        amount,
        quote,
        txReceipt,
        account?.address,
        setCurrentContent,
        t,
        isolatedView,
        closeAccountModal,
    ]);

    const handleSwapError = useCallback(
        (error: Error | string) => {
            const errorMessage =
                typeof error === 'string' ? error : error.message;
            console.error('Swap failed:', errorMessage);
        },
        [fromToken, toToken, amount],
    );

    // Track if we've already shown success/error to prevent duplicate dialogs
    const [hasShownResult, setHasShownResult] = React.useState(false);

    // Handle transaction status changes to show success dialogs
    // Errors are shown inline via TransactionButtonAndStatus component
    React.useEffect(() => {
        // Reset the flag when transaction status changes to ready (new transaction)
        if (status === 'ready') {
            setHasShownResult(false);
            return;
        }

        // Only show dialog once per transaction
        if (hasShownResult) {
            return;
        }

        // Only show success modal, errors are handled inline
        if (status === 'success' && txReceipt && !txReceipt.reverted) {
            setHasShownResult(true);
            handleSwapSuccess();
        } else if (status === 'error' && txError) {
            // Track error for analytics but don't show modal
            const errorMessage =
                (txError as any)?.reason ||
                (txError as any)?.message ||
                String(txError);
            handleSwapError(errorMessage);
        } else if (txReceipt?.reverted) {
            // Track reverted transaction for analytics but don't show modal
            handleSwapError('Transaction reverted');
        }
    }, [
        status,
        txReceipt,
        txError,
        handleSwapSuccess,
        handleSwapError,
        hasShownResult,
    ]);

    // Token selection handlers
    const handleSelectFromToken = useCallback(
        (token: TokenWithValue) => {
            setFromToken(token);

            // Default to B3TR if VET is selected as from token
            if (token.symbol === 'VET' && !toToken) {
                // Try finding B3TR by symbol first
                let b3trToken = sortedTokens.find((t) => t.symbol === 'B3TR');

                // If not found by symbol, try finding by address from config
                if (!b3trToken) {
                    try {
                        const b3trAddress = appConfig.b3trContractAddress;
                        if (b3trAddress) {
                            b3trToken = sortedTokens.find((t) =>
                                compareAddresses(t.address, b3trAddress),
                            );
                        }
                    } catch (error) {
                        console.warn(
                            'Failed to get B3TR address from config:',
                            error,
                        );
                    }
                }

                if (b3trToken) {
                    setToToken(b3trToken);
                }
            }

            setStep('main');
        },
        [toToken, sortedTokens, network.type],
    );

    const handleSelectToToken = useCallback((token: TokenWithValue) => {
        setToToken(token);
        setStep('main');
    }, []);

    // Amount input handlers
    const handleAmountChange = useCallback((value: string) => {
        // Allow only numbers and decimal point
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value) || value === '') {
            setAmount(value);
        }
    }, []);

    const handleSetMaxAmount = useCallback(() => {
        if (fromToken) {
            setAmount(fromToken.balance);
        }
    }, [fromToken]);

    // Get token display info
    const getTokenDisplay = (token: TokenWithValue | null) => {
        if (!token) return null;
        const logoComponent = TOKEN_LOGO_COMPONENTS[token.symbol];
        const logoUrl = TOKEN_LOGOS[token.symbol];
        return {
            symbol: token.symbol,
            logoComponent,
            logoUrl,
            balance: token.balance,
            value: token.valueInCurrency,
        };
    };

    const fromTokenDisplay = getTokenDisplay(fromToken);
    const toTokenDisplay = getTokenDisplay(toToken);

    // Render token selection screen
    if (step === 'select-from-token') {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={handleSelectFromToken}
                onBack={() => setStep('main')}
                showAllTokens={false}
                excludedTokenSymbols={SWAP_EXCLUDED_TOKEN_SYMBOLS}
            />
        );
    }

    if (step === 'select-quote') {
        return (
            <SelectQuoteContent
                quotes={allQuotes}
                selectedQuote={quote}
                toTokenAddress={toToken?.address ?? null}
                onSelectQuote={(selected) => {
                    setSelectedQuote(selected);
                    setStep('main');
                }}
                onBack={() => setStep('main')}
            />
        );
    }

    if (step === 'select-to-token') {
        return (
            <SelectTokenContent
                setCurrentContent={setCurrentContent}
                onSelectToken={handleSelectToToken}
                onBack={() => setStep('main')}
                showAllTokens={true}
                excludedTokenSymbols={SWAP_EXCLUDED_TOKEN_SYMBOLS}
            />
        );
    }

    // Render main swap interface
    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Swap')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={
                            onBack ?? (() => setCurrentContent('main'))
                        }
                        isDisabled={
                            isTransactionPending ||
                            isWaitingForWalletConfirmation
                        }
                    />
                )}
                <ModalCloseButton
                    isDisabled={
                        isTransactionPending || isWaitingForWalletConfirmation
                    }
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={2} align="stretch" w="full">
                    {/* From Section */}
                    <HStack justify="space-between">
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('From')}
                        </Text>

                        {fromTokenDisplay && (
                            <Text
                                cursor="pointer"
                                _hover={{
                                    color: textSecondary,
                                    textDecoration: 'underline',
                                }}
                                onClick={handleSetMaxAmount}
                                noOfLines={1}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                fontSize="sm"
                                fontWeight="medium"
                                color={textSecondary}
                            >
                                {t('Balance')}:{' '}
                                {Number(
                                    fromTokenDisplay.balance ?? 0,
                                ).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </Text>
                        )}
                    </HStack>
                    <Box p={4} borderRadius="2xl" bg={cardBg}>
                        <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                                <Input
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) =>
                                        handleAmountChange(e.target.value)
                                    }
                                    fontSize="4xl"
                                    fontWeight="bold"
                                    variant="unstyled"
                                    data-testid="swap-amount-input"
                                    type="number"
                                    inputMode="decimal"
                                    color={
                                        fromTokenDisplay &&
                                        amount &&
                                        Number(amount) >
                                            Number(fromTokenDisplay.balance)
                                            ? 'red.500'
                                            : textPrimary
                                    }
                                />
                                {fromTokenDisplay ? (
                                    <Button
                                        onClick={() =>
                                            setStep('select-from-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={
                                            fromTokenDisplay.logoComponent ? (
                                                React.cloneElement(
                                                    fromTokenDisplay.logoComponent,
                                                    {
                                                        boxSize: '20px',
                                                        borderRadius: 'full',
                                                    },
                                                )
                                            ) : fromTokenDisplay.logoUrl ? (
                                                <Image
                                                    src={
                                                        fromTokenDisplay.logoUrl
                                                    }
                                                    alt={`${fromTokenDisplay.symbol} logo`}
                                                    boxSize="20px"
                                                    borderRadius="full"
                                                    fallback={
                                                        <Box
                                                            boxSize="20px"
                                                            borderRadius="full"
                                                            bg="whiteAlpha.200"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                fontSize="8px"
                                                                fontWeight="bold"
                                                                color={
                                                                    textPrimary
                                                                }
                                                            >
                                                                {fromTokenDisplay.symbol.slice(
                                                                    0,
                                                                    3,
                                                                )}
                                                            </Text>
                                                        </Box>
                                                    }
                                                />
                                            ) : undefined
                                        }
                                    >
                                        {fromTokenDisplay.symbol}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            setStep('select-from-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                            color: textTertiary,
                                        }}
                                    >
                                        {t('Select token')}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                )}
                            </HStack>

                            <HStack
                                spacing={1}
                                fontSize="sm"
                                justifyContent={'space-between'}
                                color={textSecondary}
                            >
                                <HStack spacing={2} alignItems="center">
                                    <Text color={textSecondary}>
                                        ≈{' '}
                                        {formatCompactCurrency(
                                            fromAmountFiatValue ?? 0,
                                            {
                                                currency: currentCurrency,
                                            },
                                        )}
                                    </Text>
                                </HStack>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* To Section */}
                    <HStack justify="space-between" mt={4}>
                        <Text
                            fontSize="md"
                            fontWeight="bold"
                            color={textPrimary}
                        >
                            {t('To')}
                        </Text>
                    </HStack>
                    <Box borderRadius="2xl" bg={cardBg} p={4}>
                        <VStack align="stretch" spacing={2} width="100%">
                            <HStack justify="space-between" alignItems="center">
                                <Input
                                    value={Number(outputAmount).toLocaleString(
                                        undefined,
                                        {
                                            maximumFractionDigits:
                                                Number(outputAmount) > 10000
                                                    ? 0
                                                    : 2,
                                        },
                                    )}
                                    readOnly
                                    variant="unstyled"
                                    fontSize="4xl"
                                    fontWeight="bold"
                                    data-testid="swap-output-amount"
                                    color={textPrimary}
                                />
                                {toTokenDisplay ? (
                                    <Button
                                        onClick={() =>
                                            setStep('select-to-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={
                                            toTokenDisplay.logoComponent ? (
                                                React.cloneElement(
                                                    toTokenDisplay.logoComponent,
                                                    {
                                                        boxSize: '20px',
                                                        borderRadius: 'full',
                                                    },
                                                )
                                            ) : toTokenDisplay.logoUrl ? (
                                                <Image
                                                    src={toTokenDisplay.logoUrl}
                                                    alt={`${toTokenDisplay.symbol} logo`}
                                                    boxSize="20px"
                                                    borderRadius="full"
                                                    fallback={
                                                        <Box
                                                            boxSize="20px"
                                                            borderRadius="full"
                                                            bg="whiteAlpha.200"
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                        >
                                                            <Text
                                                                fontSize="8px"
                                                                fontWeight="bold"
                                                                color={
                                                                    textPrimary
                                                                }
                                                            >
                                                                {toTokenDisplay.symbol.slice(
                                                                    0,
                                                                    3,
                                                                )}
                                                            </Text>
                                                        </Box>
                                                    }
                                                />
                                            ) : undefined
                                        }
                                    >
                                        {toTokenDisplay.symbol}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            setStep('select-to-token')
                                        }
                                        variant="outline"
                                        size="sm"
                                        borderRadius="full"
                                        px={6}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                            color: textTertiary,
                                        }}
                                    >
                                        {t('Select token')}
                                        <Icon
                                            as={LuChevronDown}
                                            boxSize={5}
                                            color={textSecondary}
                                        />
                                    </Button>
                                )}
                            </HStack>

                            <HStack
                                spacing={1}
                                fontSize="sm"
                                justifyContent={'space-between'}
                                color={textSecondary}
                            >
                                <HStack spacing={2} alignItems="center">
                                    <Text color={textSecondary}>
                                        ≈{' '}
                                        {formatCompactCurrency(
                                            toAmountFiatValue ?? 0,
                                            {
                                                currency: currentCurrency,
                                            },
                                        )}
                                    </Text>
                                </HStack>

                                {toTokenDisplay && (
                                    <Text
                                        noOfLines={1}
                                        overflow="hidden"
                                        textOverflow="ellipsis"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color={textSecondary}
                                    >
                                        {t('Balance')}:{' '}
                                        {Number(
                                            toTokenDisplay.balance ?? 0,
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </Text>
                                )}
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Show More Section */}
                    <Collapse in={showMore && !!quote} animateOpacity>
                        <VStack
                            spacing={1}
                            align="stretch"
                            p={4}
                            borderRadius="2xl"
                            bg={cardBg}
                        >
                            {/* Source */}
                            {quote && (
                                <HStack justify="space-between">
                                    <Text fontSize="xs" color={textSecondary}>
                                        {t('Source')}:
                                    </Text>
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        borderRadius="full"
                                        px={3}
                                        h="auto"
                                        py={1}
                                        cursor="pointer"
                                        onClick={() => setStep('select-quote')}
                                        color={textSecondary}
                                        borderColor={textSecondary}
                                        _hover={{
                                            bg: isDark
                                                ? 'whiteAlpha.300'
                                                : 'blackAlpha.300',
                                        }}
                                        leftIcon={quote.aggregator?.getIcon(
                                            '12px',
                                        )}
                                    >
                                        <Text fontSize="xs" color={textPrimary}>
                                            {quote.aggregatorName}
                                        </Text>
                                    </Button>
                                </HStack>
                            )}

                            {/* Slippage */}
                            <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                    <Text fontSize="xs" color={textSecondary}>
                                        {t('Slippage tolerance')}:
                                    </Text>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="medium"
                                        color={textPrimary}
                                    >
                                        {slippageTolerance}%
                                    </Text>
                                </HStack>

                                {/* Slippage Configuration */}
                                <VStack spacing={3} align="stretch" pt={2}>
                                    <HStack spacing={2}>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(1);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                isAutoMode
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                isAutoMode
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                isAutoMode
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg: isAutoMode
                                                    ? primaryButtonBg
                                                    : isDark
                                                    ? 'whiteAlpha.300'
                                                    : 'blackAlpha.300',
                                                opacity: isAutoMode ? 0.8 : 1,
                                            }}
                                        >
                                            Auto
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(0.5);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                slippageTolerance === 0.5
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg:
                                                    slippageTolerance === 0.5
                                                        ? primaryButtonBg
                                                        : isDark
                                                        ? 'whiteAlpha.300'
                                                        : 'blackAlpha.300',
                                                opacity:
                                                    slippageTolerance === 0.5
                                                        ? 0.8
                                                        : 1,
                                            }}
                                        >
                                            0.5%
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setSlippageTolerance(3);
                                            }}
                                            flex="0 0 auto"
                                            minW="60px"
                                            borderRadius="md"
                                            fontSize="xs"
                                            bg={
                                                slippageTolerance === 3
                                                    ? primaryButtonBg
                                                    : 'transparent'
                                            }
                                            color={
                                                slippageTolerance === 3
                                                    ? primaryButtonColor
                                                    : textSecondary
                                            }
                                            borderColor={
                                                slippageTolerance === 3
                                                    ? primaryButtonBg
                                                    : textSecondary
                                            }
                                            _hover={{
                                                bg:
                                                    slippageTolerance === 3
                                                        ? primaryButtonBg
                                                        : isDark
                                                        ? 'whiteAlpha.300'
                                                        : 'blackAlpha.300',
                                                opacity:
                                                    slippageTolerance === 3
                                                        ? 0.8
                                                        : 1,
                                            }}
                                        >
                                            3%
                                        </Button>
                                        <InputGroup size="sm" flex={1}>
                                            <Input
                                                value={customSlippageValue}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    // Allow numbers and decimal point
                                                    if (
                                                        /^\d*\.?\d*$/.test(
                                                            value,
                                                        ) ||
                                                        value === ''
                                                    ) {
                                                        setCustomSlippageValue(
                                                            value,
                                                        );
                                                        if (value !== '') {
                                                            const numValue =
                                                                parseFloat(
                                                                    value,
                                                                );
                                                            if (
                                                                !isNaN(
                                                                    numValue,
                                                                ) &&
                                                                numValue >= 0 &&
                                                                numValue <= 100
                                                            ) {
                                                                setSlippageTolerance(
                                                                    numValue,
                                                                );
                                                            }
                                                        } else {
                                                            // Reset to default when cleared
                                                            setSlippageTolerance(
                                                                1,
                                                            );
                                                        }
                                                    }
                                                }}
                                                placeholder="1"
                                                borderRadius="md"
                                                textAlign="right"
                                                pr={8}
                                                fontSize="xs"
                                                color={textPrimary}
                                            />
                                            <InputRightElement
                                                width="2rem"
                                                pointerEvents="none"
                                            >
                                                <Text
                                                    fontSize="2xs"
                                                    color={textSecondary}
                                                >
                                                    %
                                                </Text>
                                            </InputRightElement>
                                        </InputGroup>
                                    </HStack>
                                </VStack>
                            </VStack>

                            {/* Gas Fee */}
                            <HStack justify="space-between">
                                <Text fontSize="xs" color={textSecondary}>
                                    {t('Fee')}:
                                </Text>
                                <Text
                                    fontSize="xs"
                                    fontWeight="medium"
                                    color={textPrimary}
                                >
                                    {gasCostVTHO > 0
                                        ? `${gasCostVTHO.toLocaleString(
                                              undefined,
                                              {
                                                  maximumFractionDigits: 2,
                                              },
                                          )} VTHO`
                                        : '-'}
                                </Text>
                            </HStack>
                        </VStack>
                    </Collapse>

                    {/* Show More Toggle - Always reserve space */}
                    {quote && (
                        <Box
                            minH="24px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => setShowMore(!showMore)}
                                rightIcon={
                                    <Icon
                                        color={textTertiary}
                                        _hover={{
                                            color: textSecondary,
                                        }}
                                        as={showMore ? LuArrowUp : LuArrowDown}
                                    />
                                }
                                fontSize="xs"
                                fontWeight="light"
                                color={textTertiary}
                                _hover={{
                                    color: textSecondary,
                                }}
                            >
                                {showMore
                                    ? t('Hide')
                                    : t('Show Advanced Options')}
                            </Button>
                        </Box>
                    )}

                    {swapClauses.length > 0 &&
                        connection.isConnectedWithPrivy && (
                            <GasFeeSummary
                                estimation={gasEstimation}
                                isLoading={gasEstimationLoading}
                                isLoadingTransaction={isTransactionPending}
                                onTokenChange={handleGasTokenChange}
                                clauses={swapClauses}
                                userSelectedToken={userSelectedGasToken}
                            />
                        )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <TransactionButtonAndStatus
                    buttonText={
                        isLoadingQuote ? t('Loading quote...') : t('Swap')
                    }
                    onConfirm={executeSwap}
                    isSubmitting={isTransactionPending}
                    isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                    transactionPendingText={t('Swapping...')}
                    txReceipt={txReceipt}
                    transactionError={txError}
                    onError={(errorMessage) => {
                        // Track error for analytics when displayed inline
                        handleSwapError(errorMessage);
                    }}
                    isDisabled={
                        !fromToken ||
                        !toToken ||
                        !amount ||
                        Number(amount) <= 0 ||
                        isLoadingQuote ||
                        !quote ||
                        quote?.reverted === true ||
                        Boolean(
                            fromTokenDisplay &&
                                amount &&
                                Number(amount) >
                                    Number(fromTokenDisplay.balance),
                        ) ||
                        disableConfirmButtonDuringEstimation
                    }
                    gasEstimationError={gasEstimationError}
                    hasEnoughGasBalance={hasEnoughBalance}
                    isLoadingGasEstimation={gasEstimationLoading}
                    showGasEstimationError={
                        !feeDelegation?.delegatorUrl &&
                        connection.isConnectedWithPrivy
                    }
                    context="transaction"
                />
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TermsAndPrivacy/AcceptedPolicyItem.tsx`

````tsx
import {
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { HStack, Tag, Text, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const AcceptedPolicyItem = ({
    document,
}: {
    document: LegalDocumentAgreement;
}) => {
    const { t } = useTranslation();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const isVechainKitTerms =
        document.documentSource === LegalDocumentSource.VECHAIN_KIT &&
        document.documentType === LegalDocumentType.TERMS;
    return (
        <HStack>
            <Tag size="sm" borderRadius="full" color={textSecondary}>
                v{document.version}
            </Tag>
            <Text
                fontSize="xs"
                cursor="pointer"
                color={textSecondary}
                onClick={() => {
                    window.open(document.url, '_blank');
                }}
                _hover={{
                    textDecoration: 'underline',
                }}
            >
                {isVechainKitTerms
                    ? t("'{{policyName}}' on connect", {
                          policyName:
                              document.displayName ?? t('Vechain Kit Policy'),
                      })
                    : t("'{{policyName}}' on {{date}}", {
                          policyName: document.displayName ?? t('Policy'),
                          date: formatDate(document.timestamp),
                      })}
            </Text>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TermsAndPrivacy/PolicyAccordion.tsx`

````tsx
import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    HStack,
    Icon,
    Text,
    useToken,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuChevronDown, LuChevronUp, LuCheck } from 'react-icons/lu';

import { EnrichedLegalDocument, LegalDocumentAgreement } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { AcceptedPolicyItem } from './AcceptedPolicyItem';

type PolicyAccordionProps = {
    title: string;
    description: string;
    documents: LegalDocumentAgreement[];
    bg: string;
    hoverBg: string;
    currentPolicy?: EnrichedLegalDocument | undefined;
};

export const PolicyAccordion = ({
    title,
    description,
    documents,
    bg,
    hoverBg,
    currentPolicy,
}: PolicyAccordionProps) => {
    const { t } = useTranslation();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const hasDocuments = documents?.length > 0;

    const currentPolicyAgreement = documents?.find(
        (document) => document.id === currentPolicy?.id,
    );

    if (!hasDocuments) return null;

    return (
        <AccordionItem border="none" mb={3}>
            {({ isExpanded }) => (
                <>
                    <AccordionButton
                        bg={bg}
                        borderRadius="xl"
                        _hover={{
                            bg: hoverBg,
                        }}
                    >
                        <VStack w="full" align="flex-start" textAlign="left">
                            <Text fontWeight="700" color={textPrimary}>
                                {title}
                            </Text>
                            <Text fontSize="xs" color={textSecondary}>
                                {description}
                            </Text>
                        </VStack>
                        <Icon
                            as={isExpanded ? LuChevronUp : LuChevronDown}
                            fontSize="20px"
                            color={textSecondary}
                        />
                    </AccordionButton>
                    <AccordionPanel pb={4} pt={3}>
                        <VStack align="stretch" spacing={4}>
                            {currentPolicyAgreement?.id ? (
                                <HStack w="full">
                                    <Icon as={LuCheck} color={textPrimary} />
                                    <Text fontSize="xs" color={textSecondary}>
                                        {t(
                                            'You accepted current policy on {{date}}',
                                            {
                                                date: formatDate(
                                                    currentPolicyAgreement.timestamp,
                                                ),
                                            },
                                        )}
                                    </Text>
                                </HStack>
                            ) : null}

                            <HStack w="full" textAlign="left">
                                <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    color={textSecondary}
                                >
                                    {t('All policies you have accepted')}
                                </Text>
                            </HStack>

                            <HStack w="full" gap={2}>
                                <VStack align="stretch" spacing={2}>
                                    {documents.map((document) => (
                                        <AcceptedPolicyItem
                                            key={document.id}
                                            document={document}
                                        />
                                    ))}
                                </VStack>
                            </HStack>

                            {currentPolicy && (
                                <Button
                                    variant="outline"
                                    size="xs"
                                    alignSelf="flex-end"
                                    onClick={() => {
                                        window.open(
                                            currentPolicy.url,
                                            '_blank',
                                        );
                                    }}
                                >
                                    {t('View Current Policy')}
                                </Button>
                            )}
                        </VStack>
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TermsAndPrivacy/TermsAndPrivacyAccordion.tsx`

````tsx
import { EmptyContent } from '@/components/common/EmptyContent';
import { useWallet } from '@/hooks';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import {
    LegalDocumentAgreement,
    LegalDocumentSource,
    LegalDocumentType,
} from '@/types';
import { compareAddresses, VECHAIN_KIT_TERMS_CONFIG } from '@/utils';
import { Accordion, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LuGavel } from 'react-icons/lu';

import { PolicyAccordion } from './PolicyAccordion';

export const TermsAndPrivacyAccordion = () => {
    const { account } = useWallet();
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { agreements, documents } = useLegalDocuments();

    const agreementsByDocumentType = useMemo(() => {
        const userAgreements = agreements?.filter((agreement) =>
            compareAddresses(agreement.walletAddress, account?.address),
        );
        const vechainKitDefaultTerms: LegalDocumentAgreement = {
            id: 'vechain-kit-terms',
            ...VECHAIN_KIT_TERMS_CONFIG,
            documentType: LegalDocumentType.TERMS,
            documentSource: LegalDocumentSource.VECHAIN_KIT,
            walletAddress: account?.address ?? '',
            timestamp: new Date().getTime(),
        };

        const userAgreementsWithVechainKitTerms = [
            vechainKitDefaultTerms,
            ...userAgreements,
        ];

        return userAgreementsWithVechainKitTerms?.reduce((acc, agreement) => {
            acc[agreement.documentType] = [
                ...(acc[agreement.documentType] || []),
                agreement,
            ];
            return acc;
        }, {} as Record<LegalDocumentType, LegalDocumentAgreement[]>);
    }, [agreements, account?.address]);

    const latestDocumentsByType = useMemo(() => {
        return documents.reduce((acc, document) => {
            const docType = document.documentType;
            if (!acc[docType] || document.version > acc[docType].version) {
                acc[docType] = document;
            }
            return acc;
        }, {} as Record<LegalDocumentType, (typeof documents)[0]>);
    }, [documents]);

    const hasAgreements = useMemo(() => {
        return Object.values(agreementsByDocumentType).some(
            (agreements) => agreements.length > 0,
        );
    }, [agreementsByDocumentType]);

    const accordionBg = isDark ? 'whiteAlpha.50' : 'blackAlpha.50';
    const accordionHoverBg = isDark ? 'whiteAlpha.100' : 'blackAlpha.100';

    const defaultOpenIndices = useMemo(() => {
        const indices: number[] = [];

        if (agreementsByDocumentType[LegalDocumentType.TERMS]?.length > 0) {
            indices.push(0);
        }
        if (agreementsByDocumentType[LegalDocumentType.PRIVACY]?.length > 0) {
            indices.push(1);
        }
        if (agreementsByDocumentType[LegalDocumentType.COOKIES]?.length > 0) {
            indices.push(2);
        }

        return indices;
    }, [agreementsByDocumentType]);

    if (!hasAgreements) {
        return (
            <EmptyContent
                title={t('No policies accepted')}
                description={t(
                    'When you have accepted a policy, it will appear here',
                )}
                icon={LuGavel}
            />
        );
    }

    return (
        <VStack spacing={4} align="stretch">
            <Accordion allowMultiple defaultIndex={defaultOpenIndices}>
                <PolicyAccordion
                    title={t('Terms and Conditions')}
                    description={t(
                        'Legal agreement between you, Vechain Kit and the current app, outlining the rules for using wallet services.',
                    )}
                    documents={
                        agreementsByDocumentType[LegalDocumentType.TERMS]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.TERMS]
                    }
                />

                <PolicyAccordion
                    title={t('Privacy Policy')}
                    description={t(
                        'Privacy policy outlining the data collection and processing practices.',
                    )}
                    documents={
                        agreementsByDocumentType[LegalDocumentType.PRIVACY]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.PRIVACY]
                    }
                />

                <PolicyAccordion
                    title={t('Cookie Policy')}
                    description={t(
                        'Cookie policy outlining the use of cookies and tracking technologies.',
                    )}
                    documents={
                        agreementsByDocumentType[LegalDocumentType.COOKIES]
                    }
                    bg={accordionBg}
                    hoverBg={accordionHoverBg}
                    currentPolicy={
                        latestDocumentsByType[LegalDocumentType.COOKIES]
                    }
                />
            </Accordion>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TermsAndPrivacy/TermsAndPrivacyContent.tsx`

````tsx
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import {
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { TermsAndPrivacyAccordion } from './TermsAndPrivacyAccordion';

export type TermsAndPrivacyContentProps = {
    onGoBack: () => void;
};

export const TermsAndPrivacyContent = ({
    onGoBack,
}: TermsAndPrivacyContentProps) => {
    const { t } = useTranslation();

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Terms and Policies')}</ModalHeader>
                <ModalBackButton onClick={onGoBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody w={'full'}>
                <VStack spacing={6} align="stretch">
                    <TermsAndPrivacyAccordion />
                </VStack>
            </ModalBody>
            <ModalFooter pt={0} />
        </ScrollToTopWrapper>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TokenDetail/Components/TokenHistoryPreview.tsx`

````tsx
import { Box, Button, HStack, Heading, Text, VStack, useToken } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useTokenTransferHistory, TransferHistoryItem, useWallet } from '@/hooks';
import { HistoryItemRow } from '../../TransactionHistory/Components/HistoryItemRow';

type Props = {
    tokenAddress: string;
    onItemClick: (item: TransferHistoryItem) => void;
    onSeeAll: () => void;
};

export const TokenHistoryPreview = ({
    tokenAddress,
    onItemClick,
    onSeeAll,
}: Props) => {
    const { t } = useTranslation();
    const { account } = useWallet();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const { transfers, isLoading, isUnsupportedNetwork } =
        useTokenTransferHistory(account?.address, tokenAddress);

    const preview = transfers.slice(0, 5);

    return (
        <VStack w="full" align="stretch" spacing={3}>
            <HStack w="full" justify="space-between" align="center">
                <Heading size="sm">{t('Token History')}</Heading>
                {transfers.length > 5 && (
                    <Button
                        variant="link"
                        size="sm"
                        fontWeight="500"
                        onClick={onSeeAll}
                    >
                        {t('See all')}
                    </Button>
                )}
            </HStack>

            {isUnsupportedNetwork ? (
                <Box py={4} textAlign="center">
                    <Text fontSize="sm" color={textSecondary}>
                        {t('History is only available on mainnet.')}
                    </Text>
                </Box>
            ) : isLoading ? (
                <Text fontSize="sm" color={textSecondary} textAlign="center">
                    {t('Loading')}…
                </Text>
            ) : preview.length === 0 ? (
                <Text fontSize="sm" color={textSecondary} textAlign="center">
                    {t('No transfers yet.')}
                </Text>
            ) : (
                preview.map((item) => (
                    <HistoryItemRow
                        key={item.id}
                        item={item}
                        onClick={() => onItemClick(item)}
                    />
                ))
            )}
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TokenDetail/TokenDetailContent.tsx`

````tsx
import {
    Container,
    HStack,
    Heading,
    Icon,
    IconButton,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuArrowUpFromLine,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    PriceChangeBadge,
    PriceChart,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    TokenWithValue,
    useCurrency,
    useTokenPriceHistory24h,
} from '@/hooks';
import { SupportedToken } from '@/hooks/api/wallet/useGetTokenUsdPrice';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { NON_TRANSFERABLE_TOKEN_SYMBOLS } from '@/utils';
import { AccountModalContentTypes } from '../../Types';
import { TokenHistoryPreview } from './Components/TokenHistoryPreview';

export type TokenDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    token: TokenWithValue;
};

const VET_SENTINEL = '0x';

const ActionIconButton = ({
    icon,
    label,
    onClick,
    isDisabled,
}: {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
}) => {
    const { t } = useTranslation();
    const translatedLabel = t(label, label);
    return (
        <IconButton
            variant="vechainKitSecondary"
            h="44px"
            flex={1}
            borderRadius="lg"
            aria-label={translatedLabel}
            isDisabled={isDisabled}
            onClick={onClick}
            icon={
                <HStack spacing={1.5}>
                    <Icon as={icon} boxSize={3.5} opacity={0.85} />
                    <Text fontSize="sm" fontWeight="600">
                        {translatedLabel}
                    </Text>
                </HStack>
            }
        />
    );
};

export const TokenDetailContent = ({
    setCurrentContent,
    token,
}: TokenDetailContentProps) => {
    const { isolatedView } = useAccountModalOptions();
    const { currentCurrency } = useCurrency();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const isNonTransferable = NON_TRANSFERABLE_TOKEN_SYMBOLS.includes(
        token.symbol,
    );
    const isNonSwappable = isNonTransferable || token.symbol === 'veDelegate';

    const amountNumber = Number(token.balance);
    const balanceText = amountNumber.toLocaleString(undefined, {
        maximumFractionDigits: 4,
    });

    // Sparkline: VVET / VOT3 / veDelegate piggy-back on VET / B3TR / B3TR.
    const sparklineToken: SupportedToken | undefined = (() => {
        switch (token.symbol) {
            case 'VET':
            case 'VVET':
                return 'VET';
            case 'VTHO':
                return 'VTHO';
            case 'B3TR':
            case 'VOT3':
            case 'veDelegate':
                return 'B3TR';
            default:
                return undefined;
        }
    })();
    const { points: sparklinePoints } = useTokenPriceHistory24h(sparklineToken);
    const sparkTone: 'up' | 'down' | 'neutral' =
        typeof token.priceChange24hPct === 'number'
            ? token.priceChange24hPct > 0
                ? 'up'
                : token.priceChange24hPct < 0
                ? 'down'
                : 'neutral'
            : 'neutral';

    const backToDetail = () =>
        setCurrentContent({
            type: 'token-detail',
            props: { setCurrentContent, token },
        });

    const handleSwap = () => {
        setCurrentContent({
            type: 'swap-token',
            props: {
                setCurrentContent,
                fromTokenAddress:
                    token.address && token.address !== VET_SENTINEL
                        ? token.address
                        : undefined,
                onBack: backToDetail,
            },
        });
    };

    const handleReceive = () => {
        setCurrentContent({
            type: 'receive-token',
            props: { setCurrentContent, onBack: backToDetail },
        });
    };

    const handleSend = () => {
        setCurrentContent({
            type: 'send-token',
            props: {
                setCurrentContent,
                preselectedToken: token,
                onBack: backToDetail,
            },
        });
    };

    const handleHistoryItem = (item: import('@/hooks').TransferHistoryItem) => {
        setCurrentContent({
            type: 'transaction-detail',
            props: {
                setCurrentContent,
                item,
                onBack: backToDetail,
            },
        });
    };

    const handleSeeAll = () => {
        setCurrentContent({
            type: 'transaction-history',
            props: {
                setCurrentContent,
                tokenFilter: {
                    address: token.address || VET_SENTINEL,
                    symbol: token.symbol,
                },
                onBack: backToDetail,
            },
        });
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{token.symbol}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={() => setCurrentContent('assets')}
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        <VStack spacing={1} align="flex-start">
                            <Heading size="2xl" fontWeight="700">
                                {balanceText}
                            </Heading>
                            <HStack spacing={2} align="center">
                                <Text color={textSecondary}>
                                    ={' '}
                                    {formatCompactCurrency(
                                        token.valueInCurrency,
                                        {
                                            currency:
                                                currentCurrency as SupportedCurrency,
                                        },
                                    )}
                                </Text>
                                <PriceChangeBadge
                                    valuePct={token.priceChange24hPct}
                                />
                            </HStack>
                        </VStack>

                        {sparklinePoints.length > 1 && (
                            <PriceChart
                                points={sparklinePoints}
                                tone={sparkTone}
                                chartHeight={72}
                                interactive
                            />
                        )}

                        <HStack spacing={2} w="full">
                            <ActionIconButton
                                icon={LuArrowLeftRight}
                                label="Swap"
                                onClick={handleSwap}
                                isDisabled={isNonSwappable}
                            />
                            <ActionIconButton
                                icon={LuArrowUpFromLine}
                                label="Send"
                                onClick={handleSend}
                                isDisabled={
                                    isNonTransferable || amountNumber <= 0
                                }
                            />
                            <ActionIconButton
                                icon={LuArrowDownToLine}
                                label="Receive"
                                onClick={handleReceive}
                            />
                        </HStack>

                        <TokenHistoryPreview
                            tokenAddress={token.address || VET_SENTINEL}
                            onItemClick={handleHistoryItem}
                            onSeeAll={handleSeeAll}
                        />
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TransactionHistory/Components/HistoryItemRow.tsx`

````tsx
import {
    Box,
    Button,
    HStack,
    Icon,
    Image,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { TransferHistoryItem } from '@/hooks';
import { TOKEN_LOGOS } from '@/utils/constants';
import { AddressOrDomainLabel } from '@/components/common';

type Props = {
    item: TransferHistoryItem;
    onClick?: () => void;
};

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const isZeroAddress = (address: string) =>
    address.toLowerCase() === ZERO_ADDRESS;

export const HistoryItemRow = ({ item, onClick }: Props) => {
    const { t } = useTranslation();
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');

    const sent = item.direction === 'sent';
    const sign = sent ? '-' : '+';
    const amountColor = sent ? error : success;
    const counterparty = sent ? item.to : item.from;
    const formattedAmount = item.amount.toLocaleString(undefined, {
        maximumFractionDigits: 4,
    });
    const fromZero = !sent && isZeroAddress(item.from);
    const logo = TOKEN_LOGOS[item.tokenSymbol];

    return (
        <Button
            variant="ghost"
            h="64px"
            w="full"
            justifyContent="space-between"
            px={2}
            onClick={onClick}
            isDisabled={!onClick}
            _disabled={{ cursor: 'default', opacity: 1 }}
        >
            <HStack spacing={3} flex={1} minW={0}>
                {fromZero ? (
                    <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                    >
                        <Icon
                            as={LuSparkles}
                            boxSize={4}
                            color={textSecondary}
                        />
                    </Box>
                ) : logo ? (
                    <Image
                        src={logo}
                        alt={item.tokenSymbol}
                        boxSize="32px"
                        borderRadius="full"
                        flexShrink={0}
                        fallback={
                            <Box boxSize="32px" borderRadius="full" bg="whiteAlpha.300" />
                        }
                    />
                ) : (
                    <Box
                        boxSize="32px"
                        borderRadius="full"
                        bg="whiteAlpha.300"
                        flexShrink={0}
                    />
                )}
                <VStack spacing={0} align="flex-start" minW={0}>
                    <Text fontWeight="600" color={textPrimary}>
                        {sent ? t('Sent') : t('Received')}
                    </Text>
                    <HStack spacing={1} align="baseline" maxW="full">
                        <Text fontSize="xs" color={textSecondary}>
                            {sent ? t('To') : t('From')}
                        </Text>
                        <AddressOrDomainLabel
                            address={counterparty}
                            fontSize="xs"
                            color={textSecondary}
                        />
                    </HStack>
                </VStack>
            </HStack>
            <VStack
                spacing={0}
                align="flex-end"
                maxW="45%"
                flexShrink={0}
            >
                <Text
                    fontWeight="600"
                    color={amountColor}
                    lineHeight="short"
                >
                    {sign}
                    {formattedAmount}
                </Text>
                <Text
                    fontSize="xs"
                    color={textSecondary}
                    lineHeight="short"
                    maxW="full"
                    isTruncated
                >
                    {item.tokenSymbol}
                </Text>
            </VStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TransactionHistory/TransactionDetailContent.tsx`

````tsx
import {
    Box,
    Button,
    Container,
    HStack,
    Heading,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink, LuSparkles } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import {
    AddressOrDomainLabel,
    CopyIconButton,
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import { useCurrency, TransferHistoryItem } from '@/hooks';
import { useAppConfig } from '@/providers';
import { TOKEN_LOGOS } from '@/utils/constants';
import { humanAddress } from '@/utils/formattingUtils';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { useTokenPrices } from '@/hooks';
import { AccountModalContentTypes } from '../../Types';

export type TransactionDetailContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    item: TransferHistoryItem;
    onBack?: () => void;
};

const formatFullDate = (timestamp: number, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(timestamp * 1000));

const Row = ({
    label,
    value,
    copyValue,
}: {
    label: string;
    value: React.ReactNode;
    copyValue?: string;
}) => {
    const { t } = useTranslation();
    const labelColor = useToken('colors', 'vechain-kit-text-secondary');
    const valueColor = useToken('colors', 'vechain-kit-text-primary');
    return (
        <HStack w="full" justify="space-between" align="center">
            <Text fontSize="sm" color={labelColor}>
                {label}
            </Text>
            <HStack spacing={1} align="center">
                {typeof value === 'string' ? (
                    <Text fontSize="sm" color={valueColor} fontWeight="500">
                        {value}
                    </Text>
                ) : (
                    value
                )}
                {copyValue && (
                    <CopyIconButton
                        value={copyValue}
                        ariaLabel={`${t('Copy')} ${label}`}
                    />
                )}
            </HStack>
        </HStack>
    );
};

export const TransactionDetailContent = ({
    setCurrentContent,
    item,
    onBack,
}: TransactionDetailContentProps) => {
    const { t, i18n } = useTranslation();
    const { isolatedView } = useAccountModalOptions();
    const config = useAppConfig();
    const { currentCurrency } = useCurrency();
    const { prices, exchangeRates } = useTokenPrices();
    const successColor = useToken('colors', 'vechain-kit-success');
    const errorColor = useToken('colors', 'vechain-kit-error');

    const sent = item.direction === 'sent';
    const sign = sent ? '-' : '+';
    const amountColor = sent ? errorColor : successColor;
    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const fromZero =
        !sent && item.from.toLowerCase() === ZERO_ADDRESS;
    const placeholderColor = useToken('colors', 'vechain-kit-text-secondary');

    const priceKey = (item.tokenAddress ?? '0x').toLowerCase();
    const priceUsd = prices[priceKey] ?? 0;
    const usdValue = item.amount * priceUsd;
    const valueInCurrency = (() => {
        if (currentCurrency === 'eur') {
            return usdValue * (exchangeRates?.eurUsdPrice ?? 1);
        }
        if (currentCurrency === 'gbp') {
            return usdValue * (exchangeRates?.gbpUsdPrice ?? 1);
        }
        return usdValue;
    })();

    const explorerUrl = `${config.explorerUrl}/${item.txId}`;

    const handleBack =
        onBack ??
        (() =>
            setCurrentContent({
                type: 'transaction-history',
                props: { setCurrentContent },
            }));

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{sent ? t('Sent') : t('Received')}</ModalHeader>
                {!isolatedView && <ModalBackButton onClick={handleBack} />}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    <VStack spacing={6} align="stretch" w="full">
                        <HStack spacing={3}>
                            {fromZero ? (
                                <Box
                                    boxSize="40px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Icon
                                        as={LuSparkles}
                                        boxSize={5}
                                        color={placeholderColor}
                                    />
                                </Box>
                            ) : TOKEN_LOGOS[item.tokenSymbol] ? (
                                <Image
                                    src={TOKEN_LOGOS[item.tokenSymbol]}
                                    alt={item.tokenSymbol}
                                    boxSize="40px"
                                    borderRadius="full"
                                    fallback={
                                        <Box
                                            boxSize="40px"
                                            borderRadius="full"
                                            bg="whiteAlpha.300"
                                        />
                                    }
                                />
                            ) : (
                                <Box
                                    boxSize="40px"
                                    borderRadius="full"
                                    bg="whiteAlpha.300"
                                />
                            )}
                            <VStack spacing={0} align="flex-start">
                                <Heading
                                    size="md"
                                    color={amountColor}
                                    fontWeight="700"
                                >
                                    {sign}
                                    {item.amount.toLocaleString(undefined, {
                                        maximumFractionDigits: 4,
                                    })}{' '}
                                    {item.tokenSymbol}
                                </Heading>
                                <Text fontSize="sm" opacity={0.7}>
                                    ={' '}
                                    {formatCompactCurrency(valueInCurrency, {
                                        currency:
                                            currentCurrency as SupportedCurrency,
                                    })}
                                </Text>
                            </VStack>
                        </HStack>

                        <VStack
                            w="full"
                            align="stretch"
                            spacing={3}
                            p={4}
                            borderRadius="xl"
                            bg="vechain-kit-card"
                        >
                            <Row
                                label={t('Date')}
                                value={formatFullDate(
                                    item.timestamp,
                                    i18n.language || 'en-US',
                                )}
                            />
                            <Row
                                label={t('Status')}
                                value={
                                    <Text
                                        color={successColor}
                                        fontWeight="600"
                                    >
                                        {t('Succeeded')}
                                    </Text>
                                }
                            />
                            <Row
                                label={t('From')}
                                value={
                                    <AddressOrDomainLabel
                                        address={item.from}
                                        headLen={6}
                                        tailLen={6}
                                        fontSize="sm"
                                        fontWeight="500"
                                    />
                                }
                                copyValue={item.from}
                            />
                            <Row
                                label={t('To')}
                                value={
                                    <AddressOrDomainLabel
                                        address={item.to}
                                        headLen={6}
                                        tailLen={6}
                                        fontSize="sm"
                                        fontWeight="500"
                                    />
                                }
                                copyValue={item.to}
                            />
                            <Row
                                label={t('Hash')}
                                value={humanAddress(item.txId, 6, 6)}
                                copyValue={item.txId}
                            />
                        </VStack>

                        <Button
                            as="a"
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="vechainKitSecondary"
                            leftIcon={<LuExternalLink />}
                        >
                            {t('View on explorer')}
                        </Button>
                    </VStack>
                </ModalBody>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TransactionHistory/TransactionHistoryContent.tsx`

````tsx
import {
    Box,
    Button,
    Container,
    Heading,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
    ModalBackButton,
    StickyHeaderContainer,
} from '@/components/common';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';
import {
    TransferHistoryItem,
    useTransferHistory,
    useWallet,
} from '@/hooks';
import { AccountModalContentTypes } from '../../Types';
import { HistoryItemRow } from './Components/HistoryItemRow';

export type TransactionHistoryContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    tokenFilter?: { address: string; symbol: string };
    onBack?: () => void;
};

const formatDayLabel = (timestamp: number, locale: string) =>
    new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(timestamp * 1000));

const groupByDay = (items: TransferHistoryItem[], locale: string) => {
    // Dedupe (same item can re-appear across pages if the indexer shifts
    // between calls) and aggregate by day with a Map so non-contiguous
    // same-day items still collapse into one group.
    const seen = new Set<string>();
    const map = new Map<string, TransferHistoryItem[]>();
    for (const item of items) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        const label = formatDayLabel(item.timestamp, locale);
        const list = map.get(label);
        if (list) list.push(item);
        else map.set(label, [item]);
    }
    return Array.from(map, ([label, groupItems]) => ({
        label,
        items: groupItems,
    }));
};

export const TransactionHistoryContent = ({
    setCurrentContent,
    tokenFilter,
    onBack,
}: TransactionHistoryContentProps) => {
    const { t, i18n } = useTranslation();
    const { account } = useWallet();
    const { isolatedView } = useAccountModalOptions();
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    const {
        transfers,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isUnsupportedNetwork,
    } = useTransferHistory(account?.address, {
        tokenAddress: tokenFilter?.address,
    });

    const groups = useMemo(
        () => groupByDay(transfers, i18n.language || 'en-US'),
        [transfers, i18n.language],
    );

    const goBackToHistory = () =>
        setCurrentContent({
            type: 'transaction-history',
            props: { setCurrentContent, tokenFilter, onBack },
        });

    const handleItemClick = (item: TransferHistoryItem) => {
        setCurrentContent({
            type: 'transaction-detail',
            props: {
                setCurrentContent,
                item,
                onBack: goBackToHistory,
            },
        });
    };

    const headerTitle = tokenFilter
        ? t('{{symbol}} history', { symbol: tokenFilter.symbol })
        : t('History');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{headerTitle}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton
                        onClick={
                            onBack ?? (() => setCurrentContent('assets'))
                        }
                    />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container h={['540px', 'auto']} p={0}>
                <ModalBody>
                    {isUnsupportedNetwork ? (
                        <Box py={6} textAlign="center">
                            <Text color={textSecondary}>
                                {t('History is only available on mainnet.')}
                            </Text>
                        </Box>
                    ) : isLoading ? (
                        <Text textAlign="center" color={textSecondary}>
                            {t('Loading')}…
                        </Text>
                    ) : groups.length === 0 ? (
                        <Box py={6} textAlign="center">
                            <Text color={textSecondary}>
                                {t('No transfers yet.')}
                            </Text>
                        </Box>
                    ) : (
                        <VStack spacing={4} align="stretch" w="full">
                            {groups.map((group) => (
                                <VStack
                                    key={group.label}
                                    spacing={1}
                                    align="stretch"
                                >
                                    <Heading
                                        size="xs"
                                        color={textSecondary}
                                        textTransform="uppercase"
                                    >
                                        {group.label}
                                    </Heading>
                                    {group.items.map((item) => (
                                        <HistoryItemRow
                                            key={item.id}
                                            item={item}
                                            onClick={() =>
                                                handleItemClick(item)
                                            }
                                        />
                                    ))}
                                </VStack>
                            ))}
                            {hasNextPage && (
                                <Button
                                    variant="vechainKitSecondary"
                                    size="sm"
                                    isLoading={isFetchingNextPage}
                                    onClick={() => fetchNextPage()}
                                >
                                    {t('Load more')}
                                </Button>
                            )}
                        </VStack>
                    )}
                </ModalBody>
            </Container>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/UpgradeSmartAccount/UpgradeSmartAccountContent.tsx`

````tsx
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    ModalCloseButton,
    Button,
    HStack,
    Circle,
    Image,
    Heading,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    ModalBackButton,
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useUpgradeRequired, useUpgradeSmartAccount, useWallet } from '@/hooks';
import { LuArrowRight } from 'react-icons/lu';

export type UpgradeSmartAccountContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    handleClose?: () => void;
    initialContent?: AccountModalContentTypes;
};

export const UpgradeSmartAccountContent = ({
    setCurrentContent,
    handleClose,
    initialContent = 'settings',
}: UpgradeSmartAccountContentProps) => {
    const { t } = useTranslation();
    const { smartAccount, connectedWallet } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    // Set up the upgrade transaction
    const {
        sendTransaction: upgradeSmartAccount,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        error: upgradeError,
        txReceipt,
    } = useUpgradeSmartAccount({
        smartAccountAddress: smartAccount?.address ?? '',
        targetVersion: 3,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Upgrade Successful!'),
                    description: t(
                        'Your account has been successfully upgraded to the latest version. You can now enjoy a better user experience, lower gas costs, and enhanced security.',
                    ),
                    onDone: () => {
                        if (handleClose) {
                            handleClose();
                        } else {
                            setCurrentContent(initialContent);
                        }
                    },
                    showSocialButtons: false,
                },
            });
        },
        onError: () => {
            console.error('Error upgrading Smart Account');
        },
    });

    // Handle the upgrade process
    const handleUpgrade = async () => {
        try {
            await upgradeSmartAccount();
        } catch (err) {
            console.error('Failed to upgrade Smart Account:', err);
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Account upgrade required')}</ModalHeader>
                <ModalBackButton
                    onClick={() => {
                        setCurrentContent(initialContent);
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={10} align="stretch">
                    <Text fontSize="sm" textAlign="center">
                        {upgradeRequired
                            ? t(
                                  'Your smart account needs to be upgraded to the latest version (v3).',
                              )
                            : t(
                                  'Your smart account is already upgraded to this version.',
                              )}
                    </Text>

                    <HStack
                        align="center"
                        justifyContent="space-evenly"
                        rounded="md"
                    >
                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    borderRadius="full"
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Circle>

                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#D23F63"
                                fontSize="28px"
                            >
                                {`v1`}
                            </Heading>
                        </Box>

                        <Icon as={LuArrowRight} color="#3DBA67" />

                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    borderRadius="full"
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Circle>
                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#3DBA67"
                                fontSize="28px"
                            >
                                {`v3`}
                            </Heading>
                        </Box>
                    </HStack>

                    <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                            <AlertTitle fontSize="sm">
                                {t('Benefits of this upgrade:')}
                            </AlertTitle>
                            <AlertDescription fontSize="xs">
                                <VStack align="start" spacing={0} mt={1}>
                                    <Text fontSize="xs" lineHeight="1.2">
                                        • {t('Improved security features')}
                                    </Text>
                                    <Text fontSize="xs">
                                        • {t('Better transaction handling')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Enhanced compatibility with dApps')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Reduced gas costs for operations')}
                                    </Text>
                                </VStack>
                            </AlertDescription>
                        </Box>
                    </Alert>
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <VStack spacing={3} w="full">
                    <TransactionButtonAndStatus
                        buttonText={
                            upgradeRequired
                                ? t('Upgrade account')
                                : t('Account already upgraded')
                        }
                        onConfirm={handleUpgrade}
                        isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                        isSubmitting={isTransactionPending}
                        transactionPendingText={t('Upgrading...')}
                        txReceipt={txReceipt}
                        transactionError={upgradeError}
                        isDisabled={!upgradeRequired}
                    />

                    <Button
                        mt={2}
                        variant={'link'}
                        onClick={() => {
                            if (handleClose) {
                                handleClose();
                            } else {
                                setCurrentContent(initialContent);
                            }
                        }}
                        isDisabled={isTransactionPending}
                    >
                        {upgradeRequired
                            ? t('Close and do this later')
                            : t('Close')}
                    </Button>
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/AccountModal/Types/Types.ts`

````typescript
import {
    AccountCustomizationContentProps,
    ChooseNameContentProps,
    ChooseNameSearchContentProps,
    ChooseNameSummaryContentProps,
    CustomizationSummaryContentProps,
    UpgradeSmartAccountContentProps,
} from '../Contents';
import { DisconnectConfirmContentProps } from '../Contents/DisconnectConfirmation/DisconnectConfirmContent';
import { RemoveWalletConfirmContentProps } from '../Contents/SelectWallet/RemoveWalletConfirmContent';
import { AppOverviewContentProps } from '../Contents/Ecosystem/AppOverviewContent';
import { CategoryFilter } from '../Contents/Ecosystem/Components/CategoryFilterSection';
import { FAQContentProps } from '../Contents/FAQ/FAQContent';
import { SendTokenContentProps } from '../Contents/SendToken/SendTokenContent';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';
import { SendNftContentProps } from '../Contents/SendNft/SendNftContent';
import { SendNftSummaryContentProps } from '../Contents/SendNft/SendNftSummaryContent';
import { ReceiveTokenContentProps } from '../Contents/Receive/ReceiveTokenContent';
import { TokenDetailContentProps } from '../Contents/TokenDetail/TokenDetailContent';
import { NftDetailContentProps } from '../Contents/NftDetail/NftDetailContent';
import { NftCollectionContentProps } from '../Contents/NftCollection/NftCollectionContent';
import { TransactionHistoryContentProps } from '../Contents/TransactionHistory/TransactionHistoryContent';
import { TransactionDetailContentProps } from '../Contents/TransactionHistory/TransactionDetailContent';
import { SuccessfulOperationContentProps } from '../Contents/SuccessfulOperation/SuccessfulOperationContent';
import { FailedOperationContentProps } from '../Contents/FailedOperation/FailedOperationContent';
import { TermsAndPrivacyContentProps } from '../Contents/TermsAndPrivacy/TermsAndPrivacyContent';

export type SwitchFeedback = {
    showFeedback: boolean;
};

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'profile'
    | {
          type: 'main';
          props?: {
              switchFeedback?: SwitchFeedback;
          };
      }
    | {
          type: 'profile';
          props?: {
              switchFeedback?: SwitchFeedback;
          };
      }
    | 'manage-mfa'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'ecosystem'
    | 'notifications'
    | 'privy-linked-accounts'
    | 'add-custom-token'
    | 'assets'
    | 'change-currency'
    | 'account-customization'
    | 'change-language'
    | 'gas-token-settings'
    | {
          type: 'select-wallet';
          props: {
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              onClose: () => void;
              returnTo?: 'main' | 'profile';
              onLogoutSuccess?: () => void;
          };
      }
    | {
          type: 'swap-token';
          props: {
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              fromTokenAddress?: string;
              toTokenAddress?: string;
              onBack?: () => void;
          };
      }
    | {
          type: 'receive-token';
          props: ReceiveTokenContentProps;
      }
    | {
          type: 'account-customization';
          props: AccountCustomizationContentProps;
      }
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      }
    | {
          type: 'failed-operation';
          props: FailedOperationContentProps;
      }
    | {
          type: 'account-customization-summary';
          props: CustomizationSummaryContentProps;
      }
    | {
          type: 'app-overview';
          props: AppOverviewContentProps;
      }
    | {
          type: 'ecosystem-with-category';
          props: {
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              selectedCategory: CategoryFilter;
          };
      }
    | { type: 'send-token'; props: SendTokenContentProps }
    | {
          type: 'send-token-summary';
          props: SendTokenSummaryContentProps;
      }
    | { type: 'send-nft'; props: SendNftContentProps }
    | {
          type: 'send-nft-summary';
          props: SendNftSummaryContentProps;
      }
    | { type: 'token-detail'; props: TokenDetailContentProps }
    | { type: 'nft-detail'; props: NftDetailContentProps }
    | { type: 'nft-collection'; props: NftCollectionContentProps }
    | {
          type: 'transaction-history';
          props: TransactionHistoryContentProps;
      }
    | {
          type: 'transaction-detail';
          props: TransactionDetailContentProps;
      }
    | { type: 'choose-name'; props: ChooseNameContentProps }
    | {
          type: 'choose-name-search';
          props: ChooseNameSearchContentProps;
      }
    | {
          type: 'choose-name-summary';
          props: ChooseNameSummaryContentProps;
      }
    | {
          type: 'disconnect-confirm';
          props: DisconnectConfirmContentProps;
      }
    | {
          type: 'remove-wallet-confirm';
          props: RemoveWalletConfirmContentProps;
      }
    | {
          type: 'upgrade-smart-account';
          props: UpgradeSmartAccountContentProps;
      }
    | {
          type: 'faq';
          props: FAQContentProps;
      }
    | {
          type: 'terms-and-privacy';
          props: TermsAndPrivacyContentProps;
      };
````

## Source: `packages/vechain-kit/src/components/EmailCodeVerificationModal/EmailCodeVerificationModal.tsx`

````tsx
import {
    Button,
    VStack,
    Text,
    HStack,
    PinInput,
    PinInputField,
    Icon,
    ModalFooter,
    ModalBody,
    ModalHeader,
    ModalCloseButton,
    Container,
    useToken,
} from '@chakra-ui/react';
import { LuMail } from 'react-icons/lu';
import { BaseModal, StickyHeaderContainer } from '../common';
import { useEffect, useState } from 'react';
import { useCreateWallet, useLoginWithEmail } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';

type Props = {
    email: string;
    onResend: () => void;
    isLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
};

export const EmailCodeVerificationModal = ({
    email,
    onResend,
    isLoading,
    isOpen,
    onClose,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { createWallet } = useCreateWallet();
    const { loginWithCode } = useLoginWithEmail({
        onComplete: async ({ isNewUser }) => {
            // When using initOAuth Privy does not create an embedded wallet automatically.
            // So we need to create a wallet manually.
            if (isNewUser) {
                await createWallet();
            }
        },
    });

    useEffect(() => {
        if (code.length === 6) {
            loginWithCode({ code })
                .then(() => {
                    onClose();
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    }, [code]);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} trapFocus={false}>
            <StickyHeaderContainer>
                <ModalHeader alignItems={'center'} display={'flex'} gap={2}>
                    {t('Enter confirmation code')}
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <Container maxW={'container.lg'}>
                <ModalBody>
                    <VStack spacing={2}>
                        <Icon
                            as={LuMail}
                            w="48px"
                            h="48px"
                            color={textSecondary}
                        />

                        <Text
                            fontSize="xs"
                            color={textSecondary}
                            textAlign="center"
                        >
                            {t(
                                'Please check {{email}} for an email from privy.io and enter your code below.',
                                {
                                    email,
                                },
                            )}
                        </Text>
                        <HStack spacing={2} justify="center" mt={4}>
                            <PinInput
                                value={code}
                                onChange={setCode}
                                otp
                                size="lg"
                                isInvalid={!!error}
                                errorBorderColor="#ef4444"
                            >
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                                <PinInputField
                                    borderRadius="12px"
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
                                    backgroundColor={
                                        isDark ? 'transparent' : '#ffffff'
                                    }
                                />
                            </PinInput>
                        </HStack>
                        {error && (
                            <Text color="#ef4444" fontSize="xs">
                                {error}
                            </Text>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Text
                        w="100%"
                        textAlign="center"
                        fontSize="14px"
                        color={isDark ? 'whiteAlpha.700' : 'gray.600'}
                    >
                        {t("Didn't get an email?")}{' '}
                        <Button
                            variant="link"
                            color="blue.500"
                            fontSize="14px"
                            onClick={onResend}
                            isLoading={isLoading}
                        >
                            {t('Resend code')}
                        </Button>
                    </Text>
                </ModalFooter>
            </Container>
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/LegalDocumentsModal/Components/LegalDocumentItem.tsx`

````tsx
import { useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument } from '@/types';
import { Checkbox, HStack, Icon, Input, Link, Text } from '@chakra-ui/react';
import { UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LuExternalLink } from 'react-icons/lu';

type Props = {
    document: EnrichedLegalDocument;
    register: UseFormRegister<any>;
    isText?: boolean;
};

export const LegalDocumentItem = ({
    document,
    register,
    isText = false,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const documentName = document.displayName ?? t('Policy');

    const borderColor = isDark ? 'whiteAlpha.400' : 'blackAlpha.400';

    const linkColor = isDark ? 'blue.300' : 'blue.500';
    const linkHoverColor = isDark ? 'blue.200' : 'blue.700';

    // Get document type display text
    const getDocumentTypeDisplay = (): string => {
        if (!document.documentType) return documentName;

        switch (document.documentType) {
            case 'terms':
                return document.displayName || 'Terms of Service';
            case 'privacy':
                return document.displayName || 'Privacy Policy';
            case 'cookies':
                return document.displayName || 'Cookie Policy';
            default:
                return document.displayName || 'Legal Document';
        }
    };

    const displayName = getDocumentTypeDisplay();

    if (isText) {
        return (
            <Link
                key={document.id}
                href={document.url}
                isExternal
                color={'blue.500'}
                textDecoration="underline"
                _hover={{
                    color: 'blue.300',
                    textDecoration: 'underline',
                }}
                fontWeight="medium"
                display="contents"
                alignItems="center"
            >
                <Input
                    {...register(document.id, {
                        required: document.required,
                    })}
                    type="checkbox"
                    hidden
                />
                {displayName}
                <Icon as={LuExternalLink} ml={1} boxSize={3} />
            </Link>
        );
    }

    return (
        <HStack
            width="full"
            borderRadius="md"
            transition="all 0.2s"
            key={document.id}
        >
            <HStack align="flex-start" spacing={3} width="full">
                <Checkbox
                    mt="2px"
                    size="md"
                    colorScheme="blue"
                    borderColor={borderColor}
                    {...register(document.id, {
                        required: document.required,
                    })}
                    data-testid="tnc-checkbox"
                />

                <Text fontSize="xs">
                    {t('I have read and agree to ')}
                    <Link
                        href={document.url}
                        isExternal
                        color={linkColor}
                        textDecoration="underline"
                        _hover={{
                            color: linkHoverColor,
                            textDecoration: 'underline',
                        }}
                        fontWeight="medium"
                        display="contents"
                        alignItems="center"
                    >
                        {displayName}
                        <Icon as={LuExternalLink} ml={1} />
                    </Link>
                    {document.required && (
                        <Text as="span" color="red.500" fontWeight="bold">
                            *
                        </Text>
                    )}
                </Text>
            </HStack>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/LegalDocumentsModal/LegalDocumentsContent.tsx`

````tsx
import { StickyHeaderContainer } from '@/components/common';
import { useLegalDocuments, useVeChainKitConfig } from '@/providers';
import { EnrichedLegalDocument } from '@/types';
import {
    Button,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react';
import { Fragment, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';

import { LegalDocumentItem } from './Components';

type Props = {
    onAgree: (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
    ) => void;
    onReject: () => void;
    onlyOptionalDocuments?: boolean;
};

export const LegalDocumentsContent = ({
    onAgree,
    onReject,
    onlyOptionalDocuments = false,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { documentsNotAgreed } = useLegalDocuments();

    const { requiredDocuments, optionalDocuments } = useMemo(() => {
        return documentsNotAgreed.reduce<{
            requiredDocuments: EnrichedLegalDocument[];
            optionalDocuments: EnrichedLegalDocument[];
        }>(
            (acc, document) => {
                if (document.required) {
                    acc.requiredDocuments.push(document);
                } else {
                    acc.optionalDocuments.push(document);
                }
                return acc;
            },
            { requiredDocuments: [], optionalDocuments: [] },
        );
    }, [documentsNotAgreed]);

    const defaultFormValues = useMemo(() => {
        return documentsNotAgreed.reduce<Record<string, boolean>>(
            (acc, document) => {
                acc[document.id] = document.required;
                return acc;
            },
            {},
        );
    }, [documentsNotAgreed]);

    const {
        handleSubmit,
        register,
        formState: { isValid },
        watch,
    } = useForm<Record<string, boolean>>({
        defaultValues: defaultFormValues,
    });

    const formValues = watch();

    // Calculate if any optional documents are selected
    const selectedDocuments = useMemo(() => {
        return documentsNotAgreed.filter((document) => formValues[document.id]);
    }, [documentsNotAgreed, formValues]);

    // Calculate if all optional documents are selected
    const allSelected = documentsNotAgreed?.length === selectedDocuments.length;

    const onSubmit = useCallback(
        (data: Record<string, boolean>) => {
            const agreedDocumentIds = new Set(
                Object.entries(data)
                    .filter(([_, checked]) => checked)
                    .map(([docId]) => docId),
            );

            const agreedDocuments = documentsNotAgreed.filter((document) =>
                agreedDocumentIds.has(document.id),
            );
            return onAgree(agreedDocuments);
        },
        [documentsNotAgreed, onAgree],
    );

    const borderColor = isDark ? '#3a3a3a' : '#eaeaea';
    const sectionBgColor = isDark ? '#2a2a2a' : '#f5f5f5';
    const headingColor = isDark ? 'gray.300' : 'gray.600';
    const sectionBoxShadow = isDark
        ? '0 2px 8px rgba(0, 0, 0, 0.2)'
        : '0 2px 8px rgba(0, 0, 0, 0.05)';

    const hasRequiredDocuments = requiredDocuments.length > 0;
    const hasOptionalDocuments = optionalDocuments.length > 0;

    // Determine the text for the accept button based on selection state
    const acceptButtonText = useMemo(() => {
        const selectedOptionalCount = optionalDocuments.filter(
            (doc) => formValues[doc.id],
        ).length;

        if (allSelected) {
            return t('Accept all');
        }
        if (onlyOptionalDocuments && selectedOptionalCount === 0) {
            return t('Ignore and continue');
        }
        if (
            (hasRequiredDocuments && !hasOptionalDocuments) ||
            (hasRequiredDocuments && selectedOptionalCount === 0)
        ) {
            return t('Accept');
        }
        return t('Accept selected');
    }, [onlyOptionalDocuments, allSelected, optionalDocuments, formValues]);

    const requiredTextDivider = (index: number) => {
        //If the last two documents, and there are more than 1 document, return ' and '
        if (
            index === requiredDocuments.length - 2 &&
            requiredDocuments.length > 1
        ) {
            return t(' and ');
        }
        return ', ';
    };

    return (
        <Stack width="full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <StickyHeaderContainer>
                    <ModalHeader>{t('Terms and Policies')}</ModalHeader>
                </StickyHeaderContainer>

                <ModalBody>
                    <VStack align="stretch" spacing={5} width="full">
                        {hasRequiredDocuments && (
                            <Text as="span" fontSize="sm">
                                {t('By continuing, you agree to')}{' '}
                                {requiredDocuments.map((document, index) => (
                                    <Fragment key={document.id}>
                                        <LegalDocumentItem
                                            key={document.id}
                                            document={document}
                                            register={register}
                                            isText={true}
                                        />
                                        {index < requiredDocuments.length - 1
                                            ? requiredTextDivider(index)
                                            : null}
                                    </Fragment>
                                ))}
                                .{' '}
                                {t(
                                    'Please take a moment to review all the policies, with acceptance being mandatory to continue.',
                                )}
                            </Text>
                        )}
                        {onlyOptionalDocuments && (
                            <Text fontSize="sm" color={headingColor} mb={3}>
                                <Trans
                                    i18nKey="<bold>Your privacy matters.</bold> You’re in control, accept to enable optional features like cookies that help us enhance your experience."
                                    components={{
                                        bold: (
                                            <Text
                                                as="span"
                                                fontWeight="semibold"
                                                color={headingColor}
                                            />
                                        ),
                                    }}
                                />
                            </Text>
                        )}

                        {hasOptionalDocuments && (
                            <Stack
                                p={4}
                                borderRadius="xl"
                                bg={sectionBgColor}
                                borderWidth="1px"
                                borderColor={borderColor}
                                boxShadow={sectionBoxShadow}
                                spacing={5}
                            >
                                <Text
                                    fontSize="md"
                                    fontWeight="bold"
                                    color={headingColor}
                                >
                                    {t('Optional')}
                                </Text>
                                <VStack align="stretch" spacing={4}>
                                    {optionalDocuments.map((document) => (
                                        <LegalDocumentItem
                                            key={document.id}
                                            document={document}
                                            register={register}
                                        />
                                    ))}
                                </VStack>
                            </Stack>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <VStack width="full" spacing={3}>
                        <Button
                            variant="vechainKitPrimary"
                            width="full"
                            type="submit"
                            isDisabled={!isValid}
                            data-testid={'accept-tnc-button'}
                        >
                            {acceptButtonText}
                        </Button>
                        {!onlyOptionalDocuments && (
                            <Button
                                variant="ghost"
                                width="full"
                                onClick={onReject}
                                data-testid={'reject-tnc-button'}
                                colorScheme="red"
                            >
                                {t('Reject and logout')}
                            </Button>
                        )}
                    </VStack>
                </ModalFooter>
            </form>
        </Stack>
    );
};
````

## Source: `packages/vechain-kit/src/components/LegalDocumentsModal/LegalDocumentsModal.tsx`

````tsx
'use client';

import { EnrichedLegalDocument } from '@/types';
import { Step, StepModal } from '../StepModal/StepModal';
import { useSteps } from '@chakra-ui/react';
import { DisconnectConfirmContent } from '../AccountModal/Contents/DisconnectConfirmation/DisconnectConfirmContent';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LegalDocumentsContent } from './LegalDocumentsContent';

type Props = {
    isOpen: boolean;
    onAgree: (
        documents: EnrichedLegalDocument | EnrichedLegalDocument[],
    ) => void;
    handleLogout: () => void;
    onlyOptionalDocuments?: boolean;
};

export type LegalDocumentsModalContentsTypes = 'legal-documents';

enum LegalDocumentsSteps {
    REVIEW_DOCUMENTS = 'REVIEW_DOCUMENTS',
    REJECT_DOCUMENTS = 'REJECT_DOCUMENTS',
}
export const LegalDocumentsModal = ({
    isOpen,
    onAgree,
    handleLogout,
    onlyOptionalDocuments,
}: Props) => {
    const { t } = useTranslation();
    const { activeStep, goToPrevious, setActiveStep, goToNext } = useSteps({
        index: 0,
        count: Object.keys(LegalDocumentsSteps).length,
    });

    const goToFirstStep = () => {
        setActiveStep(0);
    };

    const goToLogoutScreen = () => {
        goToNext();
    };

    const logout = () => {
        handleLogout();
        goToFirstStep();
    };

    const steps = useMemo<Step<LegalDocumentsSteps>[]>(
        () => [
            {
                key: LegalDocumentsSteps.REVIEW_DOCUMENTS,
                content: (
                    <LegalDocumentsContent
                        onAgree={onAgree}
                        onReject={goToLogoutScreen}
                        onlyOptionalDocuments={onlyOptionalDocuments}
                    />
                ),
            },
            {
                key: LegalDocumentsSteps.REJECT_DOCUMENTS,
                content: (
                    <DisconnectConfirmContent
                        onDisconnect={logout}
                        onBack={goToPrevious}
                        onClose={goToPrevious}
                        text={t(
                            'Are you sure you want to reject the policies and disconnect?',
                        )}
                        showCloseButton={false}
                    />
                ),
            },
        ],
        [LegalDocumentsContent, DisconnectConfirmContent, onAgree, logout],
    );

    return (
        <StepModal
            isOpen={isOpen}
            onClose={() => {}}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
            setActiveStep={setActiveStep}
            steps={steps}
            disableCloseButton={true}
            disableBackButton={true}
            isCloseable={false}
            closeOnOverlayClick={false}
            activeStep={activeStep}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/StepModal/StepModal.tsx`

````tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import {
    Card,
    CardBody,
    Text,
    useMediaQuery,
    ModalCloseButton,
    ModalHeader,
} from '@chakra-ui/react';
import { BaseModal, StickyHeaderContainer, ModalBackButton } from '../common';

export type Step<T extends string> = {
    key: T;
    content: ReactNode;
    title?: string;
    description?: string;
};

export type StepModalProps<T extends string> = {
    isOpen: boolean;
    onClose: () => void;
    steps: Step<T>[];
    goToPrevious: () => void;
    goToNext?: () => void;
    setActiveStep: (step: number) => void;
    activeStep: number;
    disableBackButton?: boolean;
    disableCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    isCloseable?: boolean;
};

export const StepModal = <T extends string>({
    isOpen,
    onClose,
    steps,
    activeStep,
    goToPrevious,
    setActiveStep,
    disableBackButton,
    disableCloseButton,
    closeOnOverlayClick = true,
    isCloseable = true,
}: StepModalProps<T>) => {
    const handleClose = () => {
        // reset the active step to 0
        setActiveStep(0);
        // close the modal
        onClose();
    };
    const [isDesktop] = useMediaQuery('(min-width: 1060px)');

    const currentStepContent = steps[activeStep];

    const isFirstStep = activeStep === 0;

    const showHeader =
        (!isFirstStep && !disableBackButton) ||
        currentStepContent?.title ||
        (isDesktop && !disableCloseButton);

    if (!currentStepContent) {
        return null;
    }

    return (
        <BaseModal
            closeOnOverlayClick={closeOnOverlayClick}
            isOpen={isOpen}
            onClose={handleClose}
            isCloseable={isCloseable}
            blockScrollOnMount={true}
        >
            <Card p={0} bg="none">
                <CardBody p={0}>
                    {showHeader ? (
                        <StickyHeaderContainer>
                            {currentStepContent?.title ? (
                                <ModalHeader>
                                    {currentStepContent.title}
                                </ModalHeader>
                            ) : null}

                            {!isFirstStep && !disableBackButton ? (
                                <ModalBackButton onClick={goToPrevious} />
                            ) : null}

                            {isDesktop && !disableCloseButton ? (
                                <ModalCloseButton onClick={onClose} />
                            ) : null}
                        </StickyHeaderContainer>
                    ) : null}
                    {currentStepContent?.description ? (
                        <Text
                            fontSize={{ base: 14, md: 16 }}
                            fontWeight={400}
                            px={4}
                        >
                            {currentStepContent?.description}
                        </Text>
                    ) : null}

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        key={currentStepContent.key}
                        style={{ width: '100%' }}
                    >
                        {currentStepContent.content}
                    </motion.div>
                </CardBody>
            </Card>
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/TransactionModal/Components/ShareButtons.tsx`

````tsx
import { Box, HStack, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import React from 'react';
import { useVeChainKitConfig } from '@/providers';
import { TELEGRAM_BASE_URL, TWITTER_BASE_URL, WHATSAPP_BASE_URL } from '@/constants';

// bouncing circle button animation provider
const BouncingAnimation = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay:
                (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * 5,
        }}
        animate={{
            y: [0, -2, 0],
            rotate: [0, 10, -10, 0],
        }}
    >
        {children}
    </motion.div>
);

type Props = {
    description: string;
    url?: string;
    facebookHashtag?: string;
};

export const ShareButtons = ({ description }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    // `description` is treated as raw text; use URLSearchParams so values are encoded.
    const twitterUrl = new URL('intent/tweet', TWITTER_BASE_URL);
    twitterUrl.searchParams.set('text', description);

    const telegramUrl = new URL('share/url', TELEGRAM_BASE_URL);
    telegramUrl.searchParams.set('url', description);

    const whatsappUrl = new URL('', WHATSAPP_BASE_URL);
    whatsappUrl.searchParams.set('text', description);

    return (
        <HStack gap={2}>
            <BouncingAnimation>
                <Link href={twitterUrl.toString()} isExternal>
                    <Box
                        bg={isDark ? 'blackAlpha.700' : 'lightgrey'}
                        p={2}
                        borderRadius={'full'}
                    >
                        <FaXTwitter size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link href={telegramUrl.toString()} isExternal>
                    <Box bg={'#30abec'} p={2} borderRadius={'full'}>
                        <FaTelegramPlane color="white" size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link href={whatsappUrl.toString()} isExternal>
                    <Box bg={'#01cb37'} p={2} borderRadius={'full'}>
                        <FaWhatsapp size={22} color="white" />
                    </Box>
                </Link>
            </BouncingAnimation>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/TransactionModal/TransactionModal.tsx`

````tsx
import { ReactNode } from 'react';
import { BaseModal } from '../common/BaseModal';
import { TransactionModalContent } from './TransactionModalContent';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { TransactionReceipt } from '@vechain/sdk-network';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
export type TransactionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onTryAgain: () => void;
    status: TransactionStatus;
    txReceipt: TransactionReceipt | null;
    txError?: Error | TransactionStatusErrorType;
    uiConfig?: {
        isClosable?: boolean;
        showShareOnSocials?: boolean;
        showExplorerButton?: boolean;
        loadingIcon?: ReactNode;
        successIcon?: ReactNode;
        errorIcon?: ReactNode;
        title?: ReactNode;
        description?: string;
        showSocialButtons?: boolean;
    };
};

export const TransactionModal = ({
    isOpen,
    onClose,
    status,
    uiConfig,
    txReceipt,
    txError,
    onTryAgain,
}: TransactionModalProps) => {
    const { darkMode, theme } = useVeChainKitConfig();

    // avoid deep nesting and unnecessary rendering
    if (!isOpen) return null;

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                allowExternalFocus={true}
                blockScrollOnMount={true}
                closeOnOverlayClick={
                    status !== 'pending' && uiConfig?.isClosable
                }
            >
                <TransactionModalContent
                    status={status}
                    onTryAgain={onTryAgain}
                    uiConfig={uiConfig}
                    txReceipt={txReceipt}
                    onClose={onClose}
                    txError={txError}
                />
            </BaseModal>
        </VechainKitThemeProvider>
    );
};
````

## Source: `packages/vechain-kit/src/components/TransactionModal/TransactionModalContent.tsx`

````tsx
import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Text,
    Button,
    ModalFooter,
    Icon,
    Link,
    HStack,
    Spinner,
    useToken,
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { LuExternalLink, LuRefreshCw } from 'react-icons/lu';
import { ShareButtons } from './Components/ShareButtons';
import { StatusScreen, StickyHeaderContainer } from '../common';
import { TransactionModalProps } from './TransactionModal';

export const TransactionModalContent = ({
    status,
    uiConfig,
    onTryAgain,
    txReceipt,
    txError,
    onClose,
}: Omit<TransactionModalProps, 'isOpen'>) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    const errorMessage = useMemo(() => {
        if (!txError) return null;
        return (
            (txError as unknown as { reason?: string }).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [txError, t]);

    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txReceipt?.meta.txID}`;

    const explorerLink = uiConfig?.showExplorerButton &&
        txReceipt?.meta.txID && (
            <Link
                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                isExternal
                opacity={0.6}
                fontSize={'14px'}
                textDecoration={'underline'}
            >
                <HStack
                    spacing={1}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Text color={textSecondary}>
                        {t('View transaction on the explorer')}
                    </Text>
                    <Icon as={LuExternalLink} boxSize={'14px'} />
                </HStack>
            </Link>
        );

    const closeButton = (
        <Button onClick={onClose} variant={'ghost'} width={'full'}>
            {t('Close')}
        </Button>
    );

    // Treat the in-flight wallet step as `pending` visually so the spinner
    // doesn't disappear and reappear between "waiting for user signature"
    // and "waiting for chain confirmation".
    const isSendingTransaction = status === 'waitingConfirmation';
    const effectiveStatus = isSendingTransaction ? 'pending' : status;

    if (effectiveStatus === 'success') {
        return (
            <StatusScreen
                status={'success'}
                title={t('Operation successful')}
                description={
                    uiConfig?.description ??
                    t('Your action has been completed and recorded on-chain.')
                }
                bodyExtras={
                    uiConfig?.showShareOnSocials && txReceipt?.meta.txID ? (
                        <VStack spacing={3} pt={1}>
                            <Text
                                fontSize={'12px'}
                                fontWeight={600}
                                color={textSecondary}
                                textTransform={'uppercase'}
                                letterSpacing={'0.06em'}
                            >
                                {t('Share on')}
                            </Text>
                            <ShareButtons description={socialDescription} />
                        </VStack>
                    ) : undefined
                }
                actions={closeButton}
                footerExtras={explorerLink || undefined}
            />
        );
    }

    if (effectiveStatus === 'error') {
        return (
            <StatusScreen
                status={'error'}
                title={t('Something went wrong')}
                description={
                    errorMessage ??
                    t("We couldn't complete this action. Please try again.")
                }
                actions={
                    <VStack spacing={3} width={'full'}>
                        {onTryAgain && (
                            <Button
                                variant={'vechainKitPrimary'}
                                onClick={onTryAgain}
                                width={'full'}
                            >
                                <Icon mr={2} as={LuRefreshCw} />
                                {t('Try again')}
                            </Button>
                        )}
                        {closeButton}
                    </VStack>
                }
                footerExtras={explorerLink || undefined}
            />
        );
    }

    // Pending and ready states keep the legacy layout — they're transient
    // and don't benefit from the badge treatment. Pending in particular
    // needs the spinner front-and-centre, not an icon-in-disc.
    const titleNode =
        effectiveStatus === 'pending'
            ? uiConfig?.title ??
              (isSendingTransaction
                  ? t('Sending Transaction...')
                  : t('Waiting for confirmation'))
            : uiConfig?.title ?? t('Confirm transaction');

    const descriptionNode =
        effectiveStatus === 'pending'
            ? isSendingTransaction
                ? t(
                      'Transaction is being processed, it can take up to 15 seconds.',
                  )
                : uiConfig?.description ??
                  t('Please confirm the transaction in your wallet.')
            : uiConfig?.description ??
              t('Confirm the transaction in your wallet to complete it.');

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader textAlign={'center'}>{titleNode}</ModalHeader>
                <ModalCloseButton
                    isDisabled={
                        effectiveStatus === 'pending' && !uiConfig?.isClosable
                    }
                />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} px={6} py={4} spacing={5}>
                    {effectiveStatus === 'pending' &&
                        (uiConfig?.loadingIcon ?? (
                            <Spinner
                                size={'xl'}
                                data-testid={'pending-spinner-modal'}
                            />
                        ))}

                    {descriptionNode && (
                        <Text
                            fontSize={'14px'}
                            lineHeight={'1.5'}
                            textAlign={'center'}
                            color={textPrimary}
                            maxW={'36ch'}
                        >
                            {descriptionNode}
                        </Text>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack width={'full'} spacing={3}>
                    {effectiveStatus === 'ready' && onTryAgain && (
                        <Button
                            onClick={onTryAgain}
                            variant={'vechainKitPrimary'}
                            width={'full'}
                        >
                            {t('Confirm')}
                        </Button>
                    )}
                    {effectiveStatus === 'ready' && closeButton}
                    {explorerLink}
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/TransactionToast/TransactionToast.tsx`

````tsx
import { Box } from '@chakra-ui/react';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import { useVeChainKitConfig } from '@/providers';
import { TransactionToastContent } from './TransactionToastContent';
import { TransactionReceipt } from '@vechain/sdk-network';

export type TransactionToastProps = {
    isOpen: boolean;
    onClose: () => void;
    status: TransactionStatus;
    txReceipt: TransactionReceipt | null;
    onTryAgain: () => void;
    txError?: Error | TransactionStatusErrorType;
    description?: string;
};

export const TransactionToast = ({
    isOpen,
    onClose,
    status,
    txReceipt,
    txError,
    onTryAgain,
    description,
}: TransactionToastProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    if (!isOpen) return null;

    return (
        <Box
            position="fixed"
            bottom="5"
            left="5"
            zIndex="11111"
            bg={isDark ? '#1f1f1e' : 'white'}
            borderRadius={'md'}
            p={5}
            boxShadow="lg"
            maxW="sm"
            minW="300px"
        >
            <TransactionToastContent
                status={status}
                txReceipt={txReceipt}
                txError={txError}
                onTryAgain={onTryAgain}
                description={description}
                onClose={onClose}
            />
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/TransactionToast/TransactionToastContent.tsx`

````tsx
import {
    VStack,
    Text,
    Link,
    Icon,
    HStack,
    Heading,
    Spinner,
    Button,
    IconButton,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { TransactionStatus, TransactionStatusErrorType } from '@/types';
import {
    LuX,
    LuExternalLink,
    LuCircleAlert,
    LuCircleCheck,
    LuRefreshCw,
} from 'react-icons/lu';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { useTranslation } from 'react-i18next';
import { TransactionReceipt } from '@vechain/sdk-network';

type TransactionToastContentProps = {
    status: TransactionStatus;
    txReceipt: TransactionReceipt | null;
    onTryAgain: () => void;
    txError?: Error | TransactionStatusErrorType;
    description?: string;
    onClose: () => void;
};

type StatusConfig = {
    icon: React.ReactElement | null;
    title: string;
    closeDisabled: boolean;
    description?: string;
};

export const TransactionToastContent = ({
    status,
    txReceipt,
    txError,
    onTryAgain,
    description,
    onClose,
}: TransactionToastContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;

    const errorMessage = useMemo(() => {
        if (!txError) return null;
        return (
            (txError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [txError, t]);

    const getStatusConfig = (): StatusConfig => {
        // overwrite status to avoid flickering
        const isSendingTransaction = status === 'waitingConfirmation';
        if (isSendingTransaction) {
            status = 'pending';
        }

        switch (status) {
            case 'pending':
                return {
                    icon: (
                        <Spinner
                            size="md"
                            data-testid="pending-spinner-toast"
                        />
                    ),
                    title: isSendingTransaction
                        ? t('Processing transaction...')
                        : t('Waiting for confirmation...'),
                    closeDisabled: true,
                    description: isSendingTransaction
                        ? t(
                              'Transaction is being processed, it can take up to 15 seconds.',
                          )
                        : description ??
                          t('Please confirm the transaction in your wallet.'),
                };
            case 'error':
                return {
                    icon: (
                        <Icon
                            as={LuCircleAlert}
                            color={'red.500'}
                            fontSize={'40px'}
                            data-testid="error-icon-toast"
                        />
                    ),
                    title: t('Transaction failed'),
                    closeDisabled: false,
                    description: errorMessage,
                };
            case 'success':
                return {
                    icon: (
                        <Icon
                            as={LuCircleCheck}
                            color={'green.500'}
                            fontSize={'40px'}
                            data-testid="success-icon-toast"
                        />
                    ),
                    title: t('Operation successful'),
                    closeDisabled: false,
                    description: undefined,
                };
            case 'ready':
                return {
                    icon: null,
                    title: t('Confirm transaction'),
                    closeDisabled: false,
                    description:
                        description ??
                        t(
                            'Confirm the transaction in your wallet to complete it.',
                        ),
                };
            default:
                return {
                    icon: null,
                    title: '',
                    closeDisabled: false,
                    description: '',
                };
        }
    };

    const config = getStatusConfig();
    if (!config) return null;

    return (
        <HStack justify="space-between" alignItems={'flex-start'} w="full">
            <VStack spacing={4}>
                <HStack
                    spacing={4}
                    w={'full'}
                    justifyContent={'flex-start'}
                    alignItems={'flex-start'}
                >
                    {config.icon}

                    <VStack w={'full'} align={'flex-start'} spacing={2}>
                        <VStack spacing={1} w={'full'}>
                            <Heading w={'full'} size={'xs'}>
                                {config.title}
                            </Heading>
                            {config.description && (
                                <Text fontSize={'xs'}>
                                    {config.description}
                                </Text>
                            )}
                        </VStack>

                        {(status === 'error' || status === 'ready') && (
                            <Button size="xs" onClick={onTryAgain}>
                                {status === 'error' ? (
                                    <>
                                        <Icon mr={2} as={LuRefreshCw} />
                                        {t('Try again')}
                                    </>
                                ) : (
                                    t('Confirm')
                                )}
                            </Button>
                        )}

                        {txReceipt && status !== 'pending' && (
                            <Link
                                fontSize={'xs'}
                                isExternal
                                href={`${explorerUrl}/${txReceipt.meta.txID}`}
                            >
                                {t('View on explorer')}{' '}
                                <Icon as={LuExternalLink} />
                            </Link>
                        )}
                    </VStack>
                </HStack>
            </VStack>

            {!config.closeDisabled && (
                <IconButton
                    onClick={onClose}
                    size="sm"
                    borderRadius={'full'}
                    aria-label="Close"
                    icon={<Icon as={LuX} boxSize={4} />}
                />
            )}
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/UpgradeSmartAccountModal/Contents/SuccessfulOperationContent.tsx`

````tsx
import {
    Button,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { LuExternalLink } from 'react-icons/lu';
import { StatusScreen } from '@/components/common';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { getConfig } from '@/config';
import { ShareButtons } from '@/components/TransactionModal';
import { UpgradeSmartAccountModalContentsTypes } from '../UpgradeSmartAccountModal';

export type SuccessfulOperationContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<UpgradeSmartAccountModalContentsTypes>
    >;
    txId?: string;
    title: string;
    description?: string;
    onDone: () => void;
    showSocialButtons?: boolean;
};

export const SuccessfulOperationContent = ({
    txId,
    title,
    description,
    onDone,
    showSocialButtons = false,
}: SuccessfulOperationContentProps) => {
    const { t } = useTranslation();
    const { network } = useVeChainKitConfig();
    const explorerUrl = getConfig(network.type).explorerUrl;
    const socialDescription = `${explorerUrl}/${txId}`;

    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    return (
        <StatusScreen
            status={'success'}
            title={title}
            description={description}
            bodyExtras={
                showSocialButtons && txId ? (
                    <VStack spacing={3} pt={1}>
                        <Text
                            fontSize={'12px'}
                            fontWeight={600}
                            color={textSecondary}
                            textTransform={'uppercase'}
                            letterSpacing={'0.06em'}
                        >
                            {t('Share on')}
                        </Text>
                        <ShareButtons description={socialDescription} />
                    </VStack>
                ) : undefined
            }
            actions={
                <Button
                    onClick={onDone}
                    variant={'vechainKitSecondary'}
                    width={'full'}
                >
                    {t('Done')}
                </Button>
            }
            footerExtras={
                txId ? (
                    <Link
                        href={`${explorerUrl}/${txId}`}
                        isExternal
                        opacity={0.6}
                        fontSize={'14px'}
                        textDecoration={'underline'}
                    >
                        <HStack
                            spacing={1}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <Text color={textSecondary}>
                                {t('View transaction on the explorer')}
                            </Text>
                            <Icon as={LuExternalLink} boxSize={'14px'} />
                        </HStack>
                    </Link>
                ) : undefined
            }
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/UpgradeSmartAccountModal/Contents/UpgradeSmartAccountContent.tsx`

````tsx
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Text,
    VStack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    ModalCloseButton,
    HStack,
    Circle,
    Image,
    Heading,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
    StickyHeaderContainer,
    TransactionButtonAndStatus,
} from '@/components/common';
import { useUpgradeRequired, useUpgradeSmartAccount, useWallet } from '@/hooks';
import {
    UpgradeSmartAccountModalContentsTypes,
    UpgradeSmartAccountModalStyle,
} from '../UpgradeSmartAccountModal';
import { LuArrowRight } from 'react-icons/lu';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<UpgradeSmartAccountModalContentsTypes>
    >;
    handleClose: () => void;
    style?: UpgradeSmartAccountModalStyle;
};

export const UpgradeSmartAccountContent = ({
    setCurrentContent,
    handleClose,
    style,
}: Props) => {
    const { t } = useTranslation();
    const { smartAccount, connectedWallet } = useWallet();
    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );

    // Set up the upgrade transaction
    const {
        sendTransaction: upgradeSmartAccount,
        isTransactionPending,
        isWaitingForWalletConfirmation,
        error: upgradeError,
        txReceipt,
    } = useUpgradeSmartAccount({
        smartAccountAddress: smartAccount?.address ?? '',
        targetVersion: 3,
        onSuccess: () => {
            setCurrentContent({
                type: 'successful-operation',
                props: {
                    setCurrentContent,
                    txId: txReceipt?.meta.txID,
                    title: t('Upgrade Successful!'),
                    description: t(
                        'Your account has been successfully upgraded to the latest version. You can now enjoy a better user experience, lower gas costs, and enhanced security.',
                    ),
                    onDone: () => {
                        handleClose();
                    },
                    showSocialButtons: false,
                },
            });
        },
        onError: () => {
            console.error('Error upgrading Smart Account');
        },
    });

    // Handle the upgrade process
    const handleUpgrade = async () => {
        try {
            await upgradeSmartAccount();
        } catch (err) {
            console.error('Failed to upgrade Smart Account:', err);
        }
    };

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader>{t('Account upgrade required')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={10} align="stretch" justifyContent="center">
                    <Text fontSize="sm" textAlign="center">
                        {t(
                            'To continue interacting with VeChain blockchain and complete your operation, your smart account needs to be upgraded to the latest version (v3).',
                        )}
                    </Text>

                    <HStack
                        align="center"
                        justifyContent="space-evenly"
                        rounded="md"
                    >
                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    borderRadius="full"
                                    objectFit="cover"
                                />
                            </Circle>

                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#D23F63"
                                fontSize="28px"
                            >
                                {`v1`}
                            </Heading>
                        </Box>

                        <Icon as={LuArrowRight} color="#3DBA67" />

                        <Box position="relative" display="inline-block">
                            <Circle size="60px" bg="gray.200">
                                <Image
                                    src={smartAccount?.image}
                                    alt={t('Profile Picture')}
                                    w="100%"
                                    h="100%"
                                    borderRadius="full"
                                    objectFit="cover"
                                />
                            </Circle>
                            <Heading
                                position="absolute"
                                top="-5"
                                right="-5"
                                color="#3DBA67"
                                fontSize="28px"
                            >
                                {`v3`}
                            </Heading>
                        </Box>
                    </HStack>

                    <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                            <AlertTitle fontSize="sm">
                                {t('Benefits of this upgrade:')}
                            </AlertTitle>
                            <AlertDescription fontSize="xs">
                                <VStack align="start" spacing={0} mt={1}>
                                    <Text fontSize="xs" lineHeight="1.2">
                                        • {t('Improved security features')}
                                    </Text>
                                    <Text fontSize="xs">
                                        • {t('Better transaction handling')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Enhanced compatibility with dApps')}
                                    </Text>
                                    <Text fontSize="xs">
                                        •{' '}
                                        {t('Reduced gas costs for operations')}
                                    </Text>
                                </VStack>
                            </AlertDescription>
                        </Box>
                    </Alert>
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <VStack spacing={3} w="full">
                    <TransactionButtonAndStatus
                        style={style}
                        buttonText={
                            upgradeRequired
                                ? t('Upgrade account')
                                : t('Account already upgraded')
                        }
                        onConfirm={handleUpgrade}
                        isTxWaitingConfirmation={isWaitingForWalletConfirmation}
                        isSubmitting={isTransactionPending}
                        transactionPendingText={t('Upgrading...')}
                        txReceipt={txReceipt}
                        transactionError={upgradeError}
                        isDisabled={!upgradeRequired}
                    />
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/UpgradeSmartAccountModal/UpgradeSmartAccountModal.tsx`

````tsx
'use client';

import { useState, useEffect } from 'react';
import { BaseModal } from '@/components/common';
import {
    SuccessfulOperationContent,
    SuccessfulOperationContentProps,
} from './Contents/SuccessfulOperationContent';
import { UpgradeSmartAccountContent } from './Contents/UpgradeSmartAccountContent';
import { ThemeTypings } from '@chakra-ui/react';

export type UpgradeSmartAccountModalStyle = {
    accentColor?: string;
    modalSize?: ThemeTypings['components']['Modal']['sizes'];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    style?: UpgradeSmartAccountModalStyle;
};

export type UpgradeSmartAccountModalContentsTypes =
    | 'upgrade-smart-account'
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      };

export const UpgradeSmartAccountModal = ({ isOpen, onClose, style }: Props) => {
    const [currentContent, setCurrentContent] =
        useState<UpgradeSmartAccountModalContentsTypes>(
            'upgrade-smart-account',
        );

    useEffect(() => {
        if (isOpen) {
            setCurrentContent('upgrade-smart-account');
        }
    }, [isOpen]);

    const renderContent = () => {
        if (typeof currentContent === 'object') {
            switch (currentContent.type) {
                case 'successful-operation':
                    return (
                        <SuccessfulOperationContent {...currentContent.props} />
                    );
            }
        } else if (currentContent === 'upgrade-smart-account') {
            return (
                <UpgradeSmartAccountContent
                    setCurrentContent={setCurrentContent}
                    handleClose={onClose}
                    style={style}
                />
            );
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            allowExternalFocus={true}
            blockScrollOnMount={true}
            size={style?.modalSize}
        >
            {renderContent()}
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/AssetIcons.tsx`

````tsx
import {
    HStack,
    Text,
    Circle,
    Image,
    StackProps,
    useToken,
} from '@chakra-ui/react';
import { useTokensWithValues } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils';
import { useTranslation } from 'react-i18next';
import React from 'react';

type AssetIconsProps = {
    address: string;
    maxIcons?: number;
    iconSize?: number;
    ml?: number;
    style?: StackProps;
    iconsGap?: number;
    rightIcon?: React.ReactNode;
    showNoAssetsWarning?: boolean;
    onClick?: () => void;
};

export const AssetIcons = ({
    address,
    maxIcons = 3,
    iconSize = 20,
    ml = 0,
    style,
    iconsGap = 0,
    rightIcon,
    showNoAssetsWarning = false,
    onClick,
}: AssetIconsProps) => {
    const { t } = useTranslation();
    const { tokensWithBalance } = useTokensWithValues({ address });
    const { darkMode } = useVeChainKitConfig();
    const secondaryTextColor = useToken('colors', 'vechain-kit-text-secondary');
    const marginLeft = iconsGap < 1 ? `-${iconSize / 2}px` : `${iconsGap}px`;

    const tokensToShow = tokensWithBalance.slice(0, maxIcons);
    const remainingTokens = tokensWithBalance.length - maxIcons;

    if (!address) return null;
    if (tokensWithBalance.length === 0 && !showNoAssetsWarning) return null;

    return (
        <HStack spacing={0} ml={ml} {...style} onClick={onClick}>
            <HStack spacing={0}>
                {tokensToShow.map((token, index) => (
                    <Circle
                        key={token.symbol}
                        ml={index > 0 ? marginLeft : '0'}
                        zIndex={index}
                        size={`${iconSize}px`}
                        borderRadius="full"
                        bg={darkMode ? 'gray.100' : 'gray.600'}
                        border="2px solid #00000024"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {TOKEN_LOGO_COMPONENTS[token.symbol] ? (
                            React.cloneElement(
                                TOKEN_LOGO_COMPONENTS[token.symbol],
                                {
                                    width: `${iconSize * 0.8}px`,
                                    height: `${iconSize * 0.8}px`,
                                    rounded: 'full',
                                },
                            )
                        ) : TOKEN_LOGOS[token.symbol] ? (
                            <Image
                                src={TOKEN_LOGOS[token.symbol]}
                                alt={`${token.symbol} logo`}
                                width={`${iconSize * 0.8}px`}
                                height={`${iconSize * 0.8}px`}
                                rounded="full"
                            />
                        ) : (
                            <Text
                                fontSize={`${iconSize * 0.4}px`}
                                fontWeight="bold"
                                color={darkMode ? 'black' : 'white'}
                            >
                                {token.symbol.slice(0, 3)}
                            </Text>
                        )}
                    </Circle>
                ))}
                {remainingTokens > 0 && (
                    <Circle
                        ml={marginLeft}
                        zIndex={tokensToShow.length}
                        size={`${iconSize}px`}
                        borderRadius="full"
                        bg={darkMode ? 'gray.100' : 'gray.700'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        border="2px solid"
                    >
                        <Text
                            fontSize={`${iconSize * 0.4}px`}
                            fontWeight="bold"
                            color={darkMode ? 'black' : 'white'}
                        >
                            +{remainingTokens}
                        </Text>
                    </Circle>
                )}

                {tokensWithBalance.length === 0 && showNoAssetsWarning && (
                    <Text
                        fontSize={'sm'}
                        color={secondaryTextColor}
                        fontWeight="700"
                    >
                        {t('No assets')}
                    </Text>
                )}
            </HStack>

            {rightIcon}
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/ConnectedWallet.tsx`

````tsx
import { useWallet } from '@/hooks';
import { Button, HStack, useMediaQuery } from '@chakra-ui/react';

import { AccountAvatar } from '../common';
import { WalletButtonProps } from './WalletButton';
import { WalletDisplay } from './WalletDisplay';

type ConnectedWalletProps = WalletButtonProps & {
    onOpen: () => void;
};

export const ConnectedWallet = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconAndDomain',
    onOpen,
    buttonStyle = {},
}: ConnectedWalletProps) => {
    const { account } = useWallet();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    return (
        <Button
            {...buttonStyle}
            onClick={onOpen}
            w="full"
            minH={'45px'}
            maxW="fit-content"
            data-testid='wallet-button'
        >
            <HStack w="full" minW="fit-content">
                <AccountAvatar
                    wallet={account}
                    props={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                    }}
                />

                <WalletDisplay
                    variant={isDesktop ? desktopVariant : mobileVariant}
                />
            </HStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/SocialIcons.tsx`

````tsx
import { HStack, Circle, Icon, useMediaQuery } from '@chakra-ui/react';
import { useVeChainKitConfig } from '@/providers';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { LuPlus } from 'react-icons/lu';

export const SocialIcons = () => {
    const iconSize = 25;
    const { darkMode } = useVeChainKitConfig();
    const marginLeft = iconSize / 2;
    const [isSmallScreen] = useMediaQuery('(max-width: 280px)');
    const [isMediumScreen] = useMediaQuery('(max-width: 380px)');

    return (
        <HStack spacing={0} ml={0}>
            <Circle
                size={`${iconSize}px`}
                borderRadius="full"
                bg={'#F8F8F8'}
                p={2}
                alignItems="center"
                justifyContent="center"
                zIndex={3}
            >
                <Icon as={FcGoogle} fontSize={'20px'} />
            </Circle>
            {!isSmallScreen && (
                <Circle
                    ml={`-${marginLeft}px`}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={'black'}
                    p={2}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                >
                    <Icon as={FaXTwitter} color={'white'} fontSize={'20px'} />
                </Circle>
            )}
            {!isSmallScreen && !isMediumScreen && (
                <Circle
                    ml={`-${marginLeft}px`}
                    zIndex={1}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={'#5865F2'}
                    p={2}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={FaDiscord} color={'white'} fontSize={'20px'} />
                </Circle>
            )}
            <Icon
                zIndex={1}
                as={LuPlus}
                color={darkMode ? 'black' : 'white'}
                fontSize={'15px'}
            />
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/WalletButton.tsx`

````tsx
import {
    Button,
    ButtonProps,
    useDisclosure,
    useMediaQuery,
} from '@chakra-ui/react';
import { useWallet, useDAppKitWallet, useDAppKitWalletModal } from '@/hooks';
import { ConnectModal, AccountModal } from '@/components';
import { ConnectedWallet } from './ConnectedWallet';
import { WalletDisplayVariant } from './types';
import { useVeChainKitConfig, VechainKitThemeProvider } from '@/providers';
import { ConnectPopover } from '../ConnectModal';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
    buttonStyle?: ButtonProps;
    connectionVariant?: 'modal' | 'popover';
    label?: string;
};

export const WalletButton = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconDomainAndAddress',
    buttonStyle,
    connectionVariant = 'modal',
    label = 'Login',
}: WalletButtonProps) => {
    const { darkMode, loginMethods, theme } = useVeChainKitConfig();

    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { connection, account } = useWallet();
    const { setSource, connectV2 } = useDAppKitWallet();

    const [isMobile] = useMediaQuery('(max-width: 768px)');

    const connectModal = useDisclosure();
    const accountModal = useDisclosure();
    const { open: openDappKit } = useDAppKitWalletModal();

    const handleConnect = () => {
        if (connection.isInAppBrowser) {
            setSource('veworld');
            connectV2(null);
        } else if (hasOnlyDappKit) {
            openDappKit();
        } else {
            connectModal.onOpen();
        }
    };

    return (
        <VechainKitThemeProvider darkMode={darkMode} theme={theme}>
            {connection.isConnected && !!account ? (
                <ConnectedWallet
                    mobileVariant={mobileVariant}
                    desktopVariant={desktopVariant}
                    onOpen={accountModal.onOpen}
                    buttonStyle={buttonStyle}
                />
            ) : connectionVariant === 'popover' && !isMobile ? (
                <ConnectPopover
                    isLoading={connection.isLoading}
                    buttonStyle={buttonStyle}
                />
            ) : (
                <Button
                    isLoading={connection.isLoading}
                    onClick={handleConnect}
                    {...buttonStyle}
                >
                    {label}
                </Button>
            )}

            <ConnectModal
                isOpen={connectModal.isOpen}
                onClose={connectModal.onClose}
            />
            <AccountModal
                isOpen={accountModal.isOpen}
                onClose={accountModal.onClose}
            />
        </VechainKitThemeProvider>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/WalletDisplay.tsx`

````tsx
import { useWallet } from '@/hooks';
import { humanAddress, humanDomain } from '@/utils';
import { HStack, Spinner, Text, VStack } from '@chakra-ui/react';

import { AssetIcons } from './AssetIcons';
import { WalletDisplayVariant } from './types';

type WalletDisplayProps = {
    variant: WalletDisplayVariant;
};

export const WalletDisplay = ({ variant }: WalletDisplayProps) => {
    const { account } = useWallet();

    if (!account) return <Spinner />;

    if (variant === 'icon') {
        return null;
    }

    if (variant === 'iconAndDomain') {
        return account.domain ? (
            <Text fontSize="sm">
                {humanDomain(account?.domain ?? '', 16, 0)}
            </Text>
        ) : (
            <Text fontSize="sm">
                {humanAddress(account.address ?? '', 6, 4)}
            </Text>
        );
    }

    if (variant === 'iconDomainAndAssets') {
        return (
            <HStack spacing={4}>
                <VStack spacing={0} alignItems="flex-start">
                    {account.domain && (
                        <Text fontSize="sm" fontWeight="bold">
                            {humanDomain(account?.domain ?? '', 16, 0)}
                        </Text>
                    )}
                    <Text
                        fontSize={account.domain ? 'xs' : 'sm'}
                        opacity={account.domain ? 0.5 : 1}
                        data-testid="trimmed-address"
                    >
                        {humanAddress(account.address ?? '', 4, 4)}
                    </Text>
                </VStack>
                <AssetIcons address={account.address ?? ''} maxIcons={3} />
            </HStack>
        );
    }

    return (
        <VStack spacing={0} alignItems="flex-start">
            {account.domain && (
                <Text fontSize="sm" fontWeight="bold">
                    {humanDomain(account?.domain ?? '', 16, 0)}
                </Text>
            )}
            <Text
                fontSize={account.domain ? 'xs' : 'sm'}
                opacity={account.domain ? 0.5 : 1}
            >
                {humanAddress(account.address ?? '', 4, 4)}
            </Text>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/WalletButton/types.ts`

````typescript
export type WalletDisplayVariant =
    | 'icon'
    | 'iconAndDomain'
    | 'iconDomainAndAddress'
    | 'iconDomainAndAssets';
````

## Source: `packages/vechain-kit/src/components/common/AccountAvatar.tsx`

````tsx
import { Wallet } from '@/types';
import { getPicassoImage } from '@/utils';
import { Image, ImageProps, Skeleton } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    // Store the previous image URL to maintain during loading
    // Use wallet address as key to ensure ref is reset when wallet changes
    const previousImageRef = useRef<string | undefined>(wallet?.image);
    const walletAddressRef = useRef<string | undefined>(wallet?.address);

    // Reset ref when wallet address changes
    useEffect(() => {
        if (walletAddressRef.current !== wallet?.address) {
            previousImageRef.current = wallet?.image;
            walletAddressRef.current = wallet?.address;
        }
    }, [wallet?.address]);

    // Update the ref when we have a valid image and it's not loading
    useEffect(() => {
        if (wallet?.image && !wallet.isLoadingMetadata) {
            previousImageRef.current = wallet.image;
        }
    }, [wallet?.image, wallet?.isLoadingMetadata]);

    // Deterministic Picasso fallback so the avatar never stays on the skeleton.
    const picassoFallback = wallet?.address
        ? getPicassoImage(wallet.address)
        : undefined;

    const resolvedSrc =
        props?.src || wallet?.image || previousImageRef.current;

    if (wallet?.isLoadingMetadata && !resolvedSrc && !picassoFallback) {
        return (
            <Skeleton
                rounded="full"
                width={props?.width}
                height={props?.height}
            />
        );
    }

    return (
        <Image
            src={resolvedSrc || picassoFallback}
            alt={props?.alt || wallet?.domain}
            objectFit="cover"
            rounded="full"
            fallbackSrc={picassoFallback}
            {...props}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/AddressDisplay.tsx`

````tsx
'use client';

import {
    Text,
    VStack,
    Icon,
    PropsOf,
    useToken,
    IconButton,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
    LuCopy,
    LuCheck,
    LuWallet,
    LuSquareUser,
    LuPencil,
} from 'react-icons/lu';
import { humanAddress } from '@/utils';
import { copyToClipboard as safeCopyToClipboard } from '@/utils/ssrUtils';
import { Wallet } from '@/types';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { useTranslation } from 'react-i18next';

type Props = {
    wallet: Wallet;
    label?: string;
    style?: PropsOf<typeof VStack>;
    showHumanAddress?: boolean;
    setCurrentContent?: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AddressDisplay = ({
    wallet,
    label,
    style,
    showHumanAddress = true,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [copiedDomain, setCopiedDomain] = useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const borderColor = useColorModeValue('#ebebeb', '#ffffff0a');
    const bgColor = useColorModeValue('#ffffff', 'transparent');

    const copyToClipboard = async (
        textToCopy: string,
        setCopied: (value: boolean) => void,
    ) => {
        const success = await safeCopyToClipboard(textToCopy);
        if (success) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const handleDomainEdit = () => {
        if (!setCurrentContent) return;

        if (wallet?.domain) {
            setCurrentContent({
                type: 'choose-name-search',
                props: {
                    name: '',
                    setCurrentContent,
                    initialContentSource: 'profile',
                },
            });
        } else {
            setCurrentContent({
                type: 'choose-name',
                props: {
                    setCurrentContent,
                    initialContentSource: 'profile',
                    onBack: () => setCurrentContent('profile'),
                },
            });
        }
    };

    return (
        <VStack w={'full'} justifyContent={'center'} {...style}>
            <VStack w={'full'} spacing={4}>
                {label && (
                    <Text fontSize={'sm'} color={textSecondary}>
                        {label}
                    </Text>
                )}

                <VStack spacing={2} w={'full'}>
                    {wallet?.domain && (
                        <HStack
                            w={'full'}
                            spacing={3}
                            px={4}
                            py={2}
                            borderWidth={1}
                            borderColor={borderColor}
                            borderRadius="md"
                            bg={bgColor}
                        >
                            <Icon as={LuSquareUser} color={textSecondary} />
                            <Text
                                flex={1}
                                fontSize={'sm'}
                                fontWeight={'700'}
                                color={textPrimary}
                                noOfLines={1}
                            >
                                {copiedDomain ? t('Copied!') : wallet.domain}
                            </Text>
                            <HStack spacing={2}>
                                {setCurrentContent && (
                                    <IconButton
                                        icon={<LuPencil />}
                                        height="30px"
                                        borderRadius="5px"
                                        variant="vechainKitSecondary"
                                        onClick={handleDomainEdit}
                                        aria-label="Edit domain"
                                    />
                                )}
                                <IconButton
                                    icon={
                                        copiedDomain ? <LuCheck /> : <LuCopy />
                                    }
                                    height="30px"
                                    borderRadius="5px"
                                    variant="vechainKitSecondary"
                                    onClick={() =>
                                        copyToClipboard(
                                            wallet.domain || '',
                                            setCopiedDomain,
                                        )
                                    }
                                    aria-label="Copy domain"
                                />
                            </HStack>
                        </HStack>
                    )}

                    <HStack
                        w={'full'}
                        spacing={3}
                        px={4}
                        py={2}
                        borderWidth={1}
                        borderColor={borderColor}
                        borderRadius="md"
                        bg={bgColor}
                    >
                        <Icon as={LuWallet} color={textSecondary} />
                        <Text
                            flex={1}
                            fontSize={'sm'}
                            fontWeight={'700'}
                            color={textPrimary}
                            noOfLines={1}
                        >
                            {copied
                                ? t('Copied!')
                                : showHumanAddress
                                ? humanAddress(wallet?.address ?? '', 8, 7)
                                : wallet?.address}
                        </Text>
                        <IconButton
                            icon={copied ? <LuCheck /> : <LuCopy />}
                            onClick={() =>
                                copyToClipboard(
                                    wallet?.address ?? '',
                                    setCopied,
                                )
                            }
                            variant="vechainKitSecondary"
                            height="30px"
                            w="30px"
                            borderRadius="5px"
                            aria-label="Copy address"
                        />
                    </HStack>
                </VStack>
            </VStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/AddressDisplayCard.tsx`

````tsx
import {
    Text,
    HStack,
    VStack,
    Image,
    Skeleton,
    useToken,
} from '@chakra-ui/react';
import { humanAddress } from '@/utils';
import { useTotalBalance, useTokensWithValues } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

type AddressDisplayCardProps = {
    address: string;
    domain?: string;
    imageSrc: string;
    imageAlt?: string;
    hideAddress?: boolean;
    balance?: number;
    tokenAddress?: string;
};

export const AddressDisplayCard = ({
    address,
    domain,
    imageSrc,
    imageAlt = 'Account',
    hideAddress = false,
    balance,
    tokenAddress,
}: AddressDisplayCardProps) => {
    const { t } = useTranslation();

    const textColor = useToken('colors', 'vechain-kit-text-primary');
    const secondaryTextColor = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const { isLoading: totalBalanceLoading } = useTotalBalance({ address });
    const { tokens, isLoading: tokensLoading } = useTokensWithValues({
        address,
    });

    // Find token by address if specified
    const tokenData = useMemo(() => {
        if (!tokenAddress) return null;
        return tokens.find((token) => token.address === tokenAddress);
    }, [tokens, tokenAddress]);

    // Determine what balance to display
    const displayBalance = useMemo(() => {
        // If balance is explicitly provided, always use that
        if (balance !== undefined) return balance;

        // Otherwise, find the actual token balance, not its currency value
        if (tokenData) {
            return Number(tokenData.balance);
        }
        return 0;
    }, [balance, tokenData]);

    const displaySymbol = tokenData?.symbol || '';
    const isLoading = totalBalanceLoading || tokensLoading;

    if (isLoading) {
        return (
            <HStack
                minH={'50px'}
                justify="space-between"
                p={4}
                borderRadius="2xl"
                bg={cardBg}
            >
                <HStack>
                    <Skeleton boxSize="40px" borderRadius="full" />
                    <VStack align="start" spacing={0}>
                        <Skeleton
                            height="16px"
                            width="120px"
                            borderRadius="md"
                        />
                        {!hideAddress && (
                            <Skeleton
                                mt={2}
                                height="12px"
                                width="100px"
                                borderRadius="md"
                            />
                        )}
                    </VStack>
                </HStack>

                <VStack
                    justify="flex-start"
                    align="flex-end"
                    spacing={0}
                    mr={2}
                >
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {t('Balance')}
                    </Text>
                    <Skeleton height="12px" width="80px" borderRadius="md" />
                </VStack>
            </HStack>
        );
    }

    return (
        <HStack
            minH={'50px'}
            justify="space-between"
            p={4}
            borderRadius="2xl"
            bg={cardBg}
        >
            <HStack>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                />
                <VStack align="start" spacing={0}>
                    {domain ? (
                        <>
                            <Text
                                fontWeight="medium"
                                fontSize="sm"
                                color={textColor}
                            >
                                {domain}
                            </Text>
                            {!hideAddress && (
                                <Text fontSize="xs" color={secondaryTextColor}>
                                    {humanAddress(address, 6, 4)}
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text
                            fontWeight="medium"
                            fontSize="sm"
                            color={textColor}
                        >
                            {humanAddress(address, 6, 4)}
                        </Text>
                    )}
                </VStack>
            </HStack>

            <VStack justify="flex-start" align="flex-end" spacing={0} mr={2}>
                <Text fontSize="sm" fontWeight="medium" color={textColor}>
                    {t('Balance')}
                </Text>
                <Text fontSize="xs" color={secondaryTextColor}>
                    {displayBalance.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                    })}
                    {displaySymbol && ` ${displaySymbol}`}
                </Text>
            </VStack>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/AddressOrDomainLabel.tsx`

````tsx
import { Text, TextProps } from '@chakra-ui/react';
import { useVechainDomain } from '@/hooks';
import { humanAddress } from '@/utils/formattingUtils';

type Props = TextProps & {
    address: string;
    /**
     * Characters to keep on each side of the address when it has no domain.
     * Defaults to 4/4 (e.g. `0xab12...cd34`).
     */
    headLen?: number;
    tailLen?: number;
};

export const AddressOrDomainLabel = ({
    address,
    headLen = 4,
    tailLen = 4,
    ...textProps
}: Props) => {
    const { data } = useVechainDomain(address);
    const label = data?.domain || humanAddress(address, headLen, tailLen);
    return <Text {...textProps}>{label}</Text>;
};
````

## Source: `packages/vechain-kit/src/components/common/AssetButton.tsx`

````tsx
import {
    Button,
    HStack,
    Image,
    Text,
    Box,
    VStack,
    ButtonProps,
    useToken,
} from '@chakra-ui/react';
import { TOKEN_LOGOS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import React from 'react';
import { CURRENCY } from '@/types';
import { LocalStorageKey, useLocalStorage } from '@/hooks';
import {
    formatCompactCurrency,
    SupportedCurrency,
} from '@/utils/currencyUtils';
import { PriceChangeBadge } from './PriceChangeBadge';

type AssetButtonProps = ButtonProps & {
    symbol: string;
    amount: number;
    currencyValue: number;
    currentCurrency: CURRENCY;
    isDisabled?: boolean;
    onClick?: () => void;
    priceChange24hPct?: number;
};

export const AssetButton = ({
    symbol,
    amount,
    currencyValue,
    currentCurrency,
    isDisabled,
    onClick,
    priceChange24hPct,
    ...buttonProps
}: AssetButtonProps) => {
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');
    const [showAssets] = useLocalStorage(LocalStorageKey.SHOW_ASSETS, true);

    const formattedAmount = showAssets
        ? amount.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : '*'.repeat(4);
    const formattedCurrency = showAssets
        ? formatCompactCurrency(currencyValue, {
              currency: currentCurrency as SupportedCurrency,
          })
        : '*'.repeat(4);

    return (
        <Button
            height="64px"
            variant="ghost"
            bg={cardBg}
            borderRadius="xl"
            justifyContent="space-between"
            isDisabled={isDisabled}
            px={4}
            py={3}
            w="100%"
            _hover={{ bg: cardBg, opacity: 0.85 }}
            _active={{ bg: cardBg, opacity: 0.7 }}
            _disabled={{
                cursor: 'not-allowed',
                opacity: 0.5,
            }}
            onClick={onClick}
            data-testid={`asset-${symbol}`}
            {...buttonProps}
        >
            <HStack spacing={3} flex={1} minW={0}>
                {TOKEN_LOGO_COMPONENTS[symbol] ? (
                    React.cloneElement(TOKEN_LOGO_COMPONENTS[symbol], {
                        boxSize: '36px',
                        borderRadius: 'full',
                    })
                ) : (
                    <Image
                        src={TOKEN_LOGOS[symbol]}
                        alt={`${symbol} logo`}
                        boxSize="36px"
                        borderRadius="full"
                        fallback={
                            <Box
                                boxSize="36px"
                                borderRadius="full"
                                bg="whiteAlpha.300"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text
                                    fontSize="11px"
                                    fontWeight="bold"
                                    color={textPrimary}
                                >
                                    {symbol.slice(0, 3)}
                                </Text>
                            </Box>
                        }
                    />
                )}
                <VStack align="flex-start" spacing={0} minW={0}>
                    <Text
                        fontWeight="700"
                        fontSize="md"
                        color={textPrimary}
                        lineHeight="short"
                    >
                        {symbol}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={textSecondary}
                        lineHeight="short"
                        noOfLines={1}
                    >
                        {formattedAmount} {symbol}
                    </Text>
                </VStack>
            </HStack>
            <VStack align="flex-end" spacing={0}>
                <Text
                    fontWeight="700"
                    fontSize="md"
                    color={textPrimary}
                    lineHeight="short"
                    data-testid={`${symbol}-balance`}
                >
                    {formattedCurrency}
                </Text>
                {showAssets && (
                    <PriceChangeBadge
                        valuePct={priceChange24hPct}
                        lineHeight="short"
                    />
                )}
            </VStack>
        </Button>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/BaseBottomSheet.tsx`

````tsx
import { Box, useToken } from '@chakra-ui/react';
import { Drawer } from 'vaul';
import { useEffect, useState, useRef } from 'react';
import { useVechainKitThemeConfig } from '@/providers';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    height?: string;
    children: React.ReactNode;
    ariaTitle: string;
    ariaDescription: string;
    isDismissable?: boolean;
    minHeight?: string;
    maxHeight?: string;
    closeThreshold?: number;
};

/**
 * HandleArea component for the bottom sheet drag indicator
 *
 * PROBLEM: When content scrolls in the bottom sheet, the sticky header (from StickyHeaderContainer)
 * gets a backdrop filter effect, but the drawer handle (drag indicator) above it doesn't,
 * creating a visual inconsistency where part of the top area has the effect and part doesn't.
 *
 * SOLUTION: This component makes the handle area also sticky and applies the same backdrop filter
 * effect when content scrolls below it. It uses an IntersectionObserver to detect when content
 * has scrolled past a sentinel element, similar to how StickyHeaderContainer works.
 *
 * IMPORTANT: The handle must be rendered INSIDE the scrollable container (not as a sibling)
 * so that the IntersectionObserver can properly detect scrolling within that container's viewport.
 * If the handle were outside the scrollable container, the observer wouldn't detect scroll events.
 */
const HandleArea = ({
    scrollableContainerRef,
    observerRef,
}: {
    scrollableContainerRef: React.RefObject<HTMLDivElement>;
    observerRef: React.RefObject<HTMLDivElement>;
}) => {
    const handleBg = useToken('colors', 'vechain-kit-border');
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    useEffect(() => {
        /**
         * IntersectionObserver callback that detects when the sentinel element
         * (observerRef) scrolls out of view. When it's not intersecting, it means
         * content has scrolled past the handle area, so we apply the backdrop filter.
         */
        const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Debounce state updates to prevent rapid changes during animations
            timeoutRef.current = setTimeout(() => {
                // On initial mount, always start with false to prevent visual glitch
                if (isInitialMountRef.current) {
                    isInitialMountRef.current = false;
                    setHasContentBelow(false);
                    return;
                }
                // When sentinel is not intersecting, content has scrolled below
                setHasContentBelow(!entry.isIntersecting);
            }, 50);
        };

        const observerOptions: IntersectionObserverInit = {
            threshold: 0,
        };

        // Use the scrollable container as the root for the observer
        // This ensures we detect intersections relative to the scrollable viewport,
        // not the document viewport
        if (scrollableContainerRef.current) {
            observerOptions.root = scrollableContainerRef.current;
            observerOptions.rootMargin = '0px';
        }

        const observer = new IntersectionObserver(
            handleIntersection,
            observerOptions,
        );

        // Delay observation to avoid initial glitch when content is animating in
        const observeTimeout = setTimeout(() => {
            if (observerRef.current) {
                observer.observe(observerRef.current);
            }
        }, 200);

        return () => {
            clearTimeout(observeTimeout);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            observer.disconnect();
        };
    }, [scrollableContainerRef, observerRef]);

    return (
        <Box
            position="sticky"
            top="0"
            w="full"
            // Apply backdrop filter when content has scrolled below the handle
            // This matches the effect applied to StickyHeaderContainer for visual consistency
            backdropFilter={hasContentBelow ? backdropFilter : 'none'}
            style={{
                WebkitBackdropFilter: hasContentBelow ? backdropFilter : 'none',
            }}
            zIndex={999}
            transition="backdrop-filter 0.2s ease-in-out"
        >
            {/* Drawer handle / drag indicator */}
            <Box
                mx={'auto'}
                w={'34px'}
                h={'5px'}
                bg={handleBg}
                mt={4}
                rounded={'full'}
            />
        </Box>
    );
};

export const BaseBottomSheet = ({
    isOpen,
    onClose,
    children,
    ariaTitle,
    ariaDescription,
    isDismissable = true,
    minHeight,
    maxHeight = '68vh',
    closeThreshold = 0.5,
}: Props) => {
    // Use semantic tokens for bottom sheet and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const handleObserverRef = useRef<HTMLDivElement>(null);

    // Get backdrop filter from tokens context
    const { tokens } = useVechainKitThemeConfig();
    const overlayBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBorder = tokens?.colors?.border?.modal || 'none';

    return (
        <Drawer.Root
            dismissible={isDismissable}
            shouldScaleBackground
            repositionInputs={false}
            open={isOpen}
            closeThreshold={closeThreshold}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <Drawer.Portal>
                <Drawer.Overlay
                    style={{
                        zIndex: 100,
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        backgroundColor: overlayBg,
                        backdropFilter: overlayBackdropFilter,
                        WebkitBackdropFilter: overlayBackdropFilter,
                    }}
                />
                <Drawer.Content
                    aria-description={ariaDescription}
                    style={{
                        zIndex: 101,
                        backgroundColor: modalBg,
                        borderRadius: '24px 24px 0 0',
                        border: modalBorder,
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        ...(minHeight && { minHeight }),
                        maxHeight,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Drawer.Title
                        style={{
                            position: 'absolute',
                            width: '1px',
                            height: '1px',
                            padding: 0,
                            margin: '-1px',
                            overflow: 'hidden',
                            clip: 'rect(0, 0, 0, 0)',
                            whiteSpace: 'nowrap',
                            borderWidth: 0,
                        }}
                    >
                        {ariaTitle}
                    </Drawer.Title>

                    {/*
                        Scrollable container that wraps all content.
                        The handle must be INSIDE this container (not as a sibling) so that:
                        1. The IntersectionObserver can detect scrolling within this container's viewport
                        2. The handle can be sticky relative to this scrollable container
                        3. The backdrop filter effect works consistently with StickyHeaderContainer
                    */}
                    <Box
                        ref={scrollableContainerRef}
                        flex="1"
                        overflowY="auto"
                        // Keep interactive content (the bottom-most CTA in
                        // particular) above iOS's home-indicator zone, where
                        // an edge swipe would otherwise invoke the system
                        // gesture (Siri / app switcher) instead of hitting
                        // our button. `max(...)` keeps the baseline padding
                        // on devices that report 0 for the inset (Android,
                        // older iOS, desktop).
                        sx={{
                            paddingBottom:
                                'max(env(safe-area-inset-bottom), 16px)',
                        }}
                    >
                        {/*
                            Sticky handle area that gets backdrop filter when content scrolls.
                            Positioned first so it stays at the top when scrolling.
                        */}
                        <HandleArea
                            scrollableContainerRef={scrollableContainerRef}
                            observerRef={handleObserverRef}
                        />
                        {/*
                            Sentinel element for IntersectionObserver.
                            When this invisible 1px element scrolls out of view, it means content
                            has scrolled past the handle area, triggering the backdrop filter effect.
                            Positioned right after the handle so it's at the boundary between
                            handle and content.
                        */}
                        <div
                            ref={handleObserverRef}
                            style={{
                                height: '1px',
                                width: '100%',
                                // pointerEvents: 'none',
                                visibility: 'hidden',
                                marginTop: '-1px',
                            }}
                        />
                        {children}
                    </Box>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/BaseModal.tsx`

````tsx
import {
    Modal,
    ModalContent,
    ModalContentProps,
    ModalOverlay,
    useMediaQuery,
    useToken,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { useVechainKitThemeConfig } from '@/providers';
import { BaseBottomSheet } from './BaseBottomSheet';

type BaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    size?: string;
    isCentered?: boolean;
    motionPreset?: 'slideInBottom' | 'none';
    trapFocus?: boolean;
    closeOnOverlayClick?: boolean;
    blockScrollOnMount?: boolean;
    autoFocus?: boolean;
    initialFocusRef?: React.RefObject<HTMLElement>;
    allowExternalFocus?: boolean;
    backdropFilter?: string;
    isCloseable?: boolean;
    /**
     * Whether to use bottom sheet on mobile devices.
     * When false (default), uses regular modal on all screen sizes.
     * When true, uses bottom sheet on mobile (< 768px) and regular modal on desktop.
     */
    useBottomSheetOnMobile?: boolean;
    /**
     * Minimum and maximum height for the modal on mobile devices.
     */
    mobileMinHeight?: string;
    mobileMaxHeight?: string;
    desktopMinHeight?: string;
    desktopMaxHeight?: string;
};

export const BaseModal = ({
    isOpen,
    onClose,
    children,
    size = 'sm',
    isCentered = true,
    motionPreset = 'slideInBottom',
    closeOnOverlayClick = true,
    blockScrollOnMount = false,
    allowExternalFocus = false,
    backdropFilter,
    isCloseable = true,
    useBottomSheetOnMobile,
    mobileMinHeight,
    mobileMaxHeight = '57vh',
    desktopMinHeight,
    desktopMaxHeight,
}: BaseModalProps) => {
    const [isDesktop] = useMediaQuery('(min-width: 768px)');
    const { portalRootRef, themeConfig, tokens } = useVechainKitThemeConfig();

    // Get useBottomSheetOnMobile from theme config if not provided as prop
    // Prop takes precedence over theme config
    const shouldUseBottomSheetOnMobile =
        useBottomSheetOnMobile ??
        themeConfig?.modal?.useBottomSheetOnMobile ??
        false;

    // Use semantic tokens for modal and overlay colors
    const modalBg = useToken('colors', 'vechain-kit-modal');
    const overlayBg = useToken('colors', 'vechain-kit-overlay');

    // Get backdrop filter from tokens context
    const defaultBackdropFilter = tokens?.effects?.backdropFilter?.overlay;
    const modalBackdropFilter = tokens?.effects?.backdropFilter?.modal;
    const effectiveBackdropFilter =
        backdropFilter ?? defaultBackdropFilter ?? 'blur(3px)';

    const modalContentProps: ModalContentProps = isDesktop
        ? {
              minHeight: desktopMinHeight,
              maxHeight: desktopMaxHeight,
          }
        : {
              position: 'fixed',
              bottom: '0',
              mb: '0',
              maxW: '2xl',
              borderRadius: '24px 24px 0px 0px !important',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollBehavior: 'smooth',
              minHeight: mobileMinHeight,
              maxHeight: mobileMaxHeight,
          };

    const modalContent = (
        <Modal
            motionPreset={motionPreset}
            isOpen={isOpen}
            onClose={onClose}
            isCentered={isCentered}
            size={size}
            returnFocusOnClose={false}
            blockScrollOnMount={blockScrollOnMount}
            closeOnOverlayClick={closeOnOverlayClick && isCloseable}
            preserveScrollBarGap={true}
            portalProps={{ containerRef: portalRootRef }}
            trapFocus={!allowExternalFocus}
            autoFocus={!allowExternalFocus}
            variant="vechainKitBase"
        >
            <ModalOverlay
                bg={overlayBg}
                backdropFilter={effectiveBackdropFilter}
            />
            <ModalContent
                role="dialog"
                aria-modal={!allowExternalFocus}
                bg={modalBg}
                sx={{
                    backdropFilter: modalBackdropFilter,
                    WebkitBackdropFilter: modalBackdropFilter,
                }}
                {...modalContentProps}
            >
                {children}
            </ModalContent>
        </Modal>
    );

    // We still wrap the bottomsheet within the modal,
    // because we need access to the modal context (eg: setCurrentContent())
    const bottomSheetContent = (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            blockScrollOnMount={false}
            trapFocus={false}
        >
            <BaseBottomSheet
                isOpen={isOpen}
                onClose={onClose}
                ariaTitle={'Dialog'}
                ariaDescription={'Dialog content area'}
                isDismissable={isCloseable}
                minHeight={mobileMinHeight}
                maxHeight={mobileMaxHeight}
            >
                {children}
            </BaseBottomSheet>
        </Modal>
    );

    // Use bottom sheet only on mobile when explicitly enabled
    // By default, use regular modal on all screen sizes
    const shouldUseBottomSheet = !isDesktop && shouldUseBottomSheetOnMobile;

    return <>{shouldUseBottomSheet ? bottomSheetContent : modalContent}</>;
};
````

## Source: `packages/vechain-kit/src/components/common/CopyIconButton.tsx`

````tsx
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '@/utils/ssrUtils';

type Props = Omit<IconButtonProps, 'aria-label' | 'icon' | 'onClick'> & {
    value: string;
    ariaLabel?: string;
};

export const CopyIconButton = ({
    value,
    ariaLabel = 'Copy',
    size = 'xs',
    variant = 'ghost',
    ...rest
}: Props) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        },
        [],
    );

    const handleClick = async () => {
        const ok = await copyToClipboard(value);
        if (!ok) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setCopied(true);
        timeoutRef.current = setTimeout(() => setCopied(false), 1500);
    };

    return (
        <IconButton
            aria-label={ariaLabel}
            icon={copied ? <LuCheck size={12} /> : <LuCopy size={12} />}
            onClick={handleClick}
            size={size}
            variant={variant}
            minW="20px"
            height="20px"
            opacity={0.7}
            _hover={{ opacity: 1 }}
            {...rest}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/EmptyContent.tsx`

````tsx
import { VStack, Icon, Text, useToken } from '@chakra-ui/react';
import { ElementType } from 'react';

type Props = {
    title: string;
    description?: string;
    icon: ElementType;
};

export const EmptyContent = ({ title, description, icon }: Props) => {
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');

    return (
        <VStack spacing={6} align="center" py={8}>
            <Icon as={icon} boxSize={16} color={textSecondary} />
            <VStack spacing={2}>
                <Text
                    fontSize="lg"
                    fontWeight="500"
                    textAlign="center"
                    color={textPrimary}
                >
                    {title}
                </Text>
                <Text
                    fontSize="md"
                    color={textSecondary}
                    textAlign="center"
                    px={4}
                >
                    {description}
                </Text>
            </VStack>
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/GasFeeSummary.tsx`

````tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
    HStack,
    Text,
    Skeleton,
    Icon,
    useDisclosure,
    VStack,
    Button,
    Divider,
    useToken,
} from '@chakra-ui/react';
import { LuChevronDown } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import {
    useWallet,
    useGasTokenSelection,
    useEstimateAllTokens,
    useTokenBalances,
} from '@/hooks';
import { EstimationResponse } from '@/types/gasEstimation';
import { GasFeeTokenSelector } from './GasFeeTokenSelector';
import { TransactionClause } from '@vechain/sdk-core';

interface GasFeeSummaryProps {
    estimation: (EstimationResponse & { usedToken: string }) | undefined;
    isLoading: boolean | undefined;
    isLoadingTransaction?: boolean;
    onTokenChange?: (token: GasTokenType) => void;
    clauses?: TransactionClause[];
    userSelectedToken?: GasTokenType | null; // Track user's manual selection
}

export const GasFeeSummary: React.FC<GasFeeSummaryProps> = ({
    estimation,
    isLoading,
    isLoadingTransaction,
    onTokenChange,
    clauses = [],
    userSelectedToken,
}: GasFeeSummaryProps) => {
    const { t } = useTranslation();
    const { feeDelegation, darkMode: isDark } = useVeChainKitConfig();
    const { connection, account } = useWallet();
    const { preferences, reorderTokenPriority } = useGasTokenSelection();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');

    // Subtle hover surface — lighten in dark mode, darken in light mode.
    // Previously this used `textSecondary` as the hover bg, which matches
    // the button's text color and made the label disappear on hover.
    const hoverBg = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)';

    const [tokenEstimations, setTokenEstimations] = useState<
        Record<GasTokenType, { cost: number; loading: boolean }>
    >(() => {
        // Initialize with loading states for all available tokens
        const initialStates: Record<
            string,
            { cost: number; loading: boolean }
        > = {};
        preferences.availableGasTokens.forEach((token) => {
            initialStates[token] = { cost: 0, loading: true };
        });
        return initialStates as Record<
            GasTokenType,
            { cost: number; loading: boolean }
        >;
    });

    // Fetch estimates for all available tokens when modal opens
    const { data: allTokenEstimates, isLoading: isLoadingAllEstimates } =
        useEstimateAllTokens({
            clauses: clauses,
            tokens: preferences.availableGasTokens,
            enabled: clauses.length > 0,
        });
    // Preload all token estimates to avoid re-fetching per token switch and to enable
    // fallback display when single-token estimation is undefined.
    // Initialize token estimations from prefetch results as soon as they are ready
    useEffect(() => {
        if (!isLoadingAllEstimates && allTokenEstimates) {
            setTokenEstimations(allTokenEstimates);
        }
    }, [allTokenEstimates, isLoadingAllEstimates]);

    // Update current token estimation
    useEffect(() => {
        if (estimation) {
            setTokenEstimations((prev) => ({
                ...prev,
                [estimation.usedToken as GasTokenType]: {
                    cost: estimation.transactionCost || 0,
                    loading: false,
                },
            }));
        }
    }, [estimation]);

    // Initialize loading states while prefetch is loading
    useEffect(() => {
        if (isLoadingAllEstimates) {
            const loadingStates = preferences.availableGasTokens.reduce(
                (acc, token) => {
                    acc[token] = { cost: 0, loading: true };
                    return acc;
                },
                {} as Record<GasTokenType, { cost: number; loading: boolean }>,
            );
            setTokenEstimations(loadingStates);
        }
    }, [isLoadingAllEstimates, preferences.availableGasTokens]);

    const handleTokenSelect = useCallback(
        (token: GasTokenType, rememberChoice: boolean) => {
            if (rememberChoice) {
                // Move selected token to the top of priority order
                // This has the same effect as dragging it to the top in settings
                const newTokenPriority = [
                    token,
                    ...preferences.tokenPriority.filter((t) => t !== token),
                ];
                reorderTokenPriority(newTokenPriority);
            }

            // Trigger re-estimation
            if (onTokenChange && token !== estimation?.usedToken) {
                onTokenChange(token);
            }
        },
        [
            estimation,
            onTokenChange,
            reorderTokenPriority,
            preferences.tokenPriority,
        ],
    );

    if (feeDelegation?.delegatorUrl) {
        return null;
    }

    if (connection.isConnectedWithDappKit) {
        return null;
    }

    // If no tokens are available, don't render anything
    if (preferences.availableGasTokens.length === 0) {
        return null;
    }

    const { balances } = useTokenBalances(account?.address ?? '');

    const hasInsufficientBalanceForToken = (token: GasTokenType) => {
        const balance = balances.find((b) => b.symbol === token);
        const est = tokenEstimations[token];
        if (!balance || !est || est.loading) return true;
        return Number(balance.balance) < est.cost;
    };

    // Determine display token and cost:
    // Priority order:
    // 1. Successfully used token from estimation (shows what will actually be used)
    // 2. User's manual selection while loading (shows what they picked during estimation)
    // 3. First available token with sufficient balance
    // 4. First available token with loaded estimate
    // 5. First available token
    const preferredToken = estimation?.usedToken as GasTokenType | undefined;
    const availableTokens = preferences.availableGasTokens as GasTokenType[];

    let displayToken: GasTokenType | undefined;

    // Priority 1: Successfully used token from estimation (always show what will actually be used)
    if (preferredToken) {
        displayToken = preferredToken;
    }
    // Priority 2: User's manual selection while loading (keeps UI stable during estimation)
    else if (userSelectedToken && availableTokens.includes(userSelectedToken)) {
        displayToken = userSelectedToken;
    }
    // Priority 3 & 4: Auto-select based on availability
    else {
        displayToken = availableTokens.find(
            (t) =>
                tokenEstimations[t] &&
                !tokenEstimations[t].loading &&
                !hasInsufficientBalanceForToken(t),
        );
        if (!displayToken) {
            displayToken = availableTokens.find(
                (t) => tokenEstimations[t] && !tokenEstimations[t].loading,
            );
        }
        if (!displayToken) {
            displayToken = availableTokens[0];
        }
    }

    const displayEstimation = displayToken
        ? tokenEstimations[displayToken]
        : undefined;

    // Show cost for the displayed token
    // If we have a successful estimation, use its cost; otherwise use the display token's estimation
    const totalCost =
        preferredToken && estimation?.transactionCost
            ? estimation.transactionCost
            : displayEstimation?.cost || 0;

    const tokenInfo = displayToken
        ? SUPPORTED_GAS_TOKENS[displayToken]
        : undefined;

    return (
        <>
            <Divider mt={3} />

            <HStack mt={3} w="full" justifyContent="start" alignItems="center">
                <VStack align="start" spacing={0} w="full">
                    <Text
                        fontSize="sm"
                        fontWeight="light"
                        textAlign="left"
                        w="full"
                        color={textSecondary}
                    >
                        {t('Fee')}
                    </Text>

                    <HStack
                        align="start"
                        justifyContent="space-between"
                        spacing={0}
                        w="full"
                    >
                        <HStack justifyContent="flex-start" w="full">
                            {isLoading ||
                            (!preferredToken &&
                                (!displayEstimation ||
                                    displayEstimation.loading)) ||
                            !tokenInfo ? (
                                <>
                                    <Skeleton
                                        height="16px"
                                        width="120px"
                                        borderRadius="md"
                                    />
                                    <Skeleton
                                        height="16px"
                                        width="60px"
                                        borderRadius="md"
                                    />
                                </>
                            ) : (
                                <>
                                    <Text
                                        color={textPrimary}
                                        fontSize="sm"
                                        fontWeight="semibold"
                                    >
                                        {formatGasCost(totalCost, 2)}{' '}
                                        {tokenInfo.symbol}
                                    </Text>
                                    <Text color={textSecondary} fontSize="xs">
                                        {'≈'} ${(totalCost * 0.01).toFixed(2)}
                                    </Text>
                                </>
                            )}
                        </HStack>
                    </HStack>
                </VStack>

                <Button
                    onClick={onOpen}
                    variant="outline"
                    size="sm"
                    borderRadius="full"
                    px={6}
                    disabled={isLoadingTransaction}
                    color={textSecondary}
                    borderColor={textSecondary}
                    _hover={{
                        bg: hoverBg,
                        color: textPrimary,
                        borderColor: textPrimary,
                    }}
                    leftIcon={React.cloneElement(
                        TOKEN_LOGO_COMPONENTS[
                            (displayToken as GasTokenType) ||
                                preferences.availableGasTokens[0]
                        ],
                        {
                            boxSize: '20px',
                            borderRadius: 'full',
                        },
                    )}
                >
                    <Text fontSize="sm" fontWeight="semibold">
                        {displayToken || preferences.availableGasTokens[0]}
                    </Text>
                    <Icon
                        as={LuChevronDown}
                        boxSize={5}
                        color={textSecondary}
                    />
                </Button>
            </HStack>

            <GasFeeTokenSelector
                isOpen={isOpen}
                onClose={onClose}
                selectedToken={
                    (displayToken as GasTokenType) ||
                    preferences.availableGasTokens[0]
                }
                onTokenSelect={handleTokenSelect}
                availableTokens={preferences.availableGasTokens}
                tokenEstimations={tokenEstimations}
                walletAddress={account?.address ?? ''}
            />
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/GasFeeTokenSelector.tsx`

````tsx
import React from 'react';
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    HStack,
    Text,
    Box,
    Skeleton,
    Switch,
    FormControl,
    FormLabel,
    useToken,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GasTokenType } from '@/types/gasToken';
import { SUPPORTED_GAS_TOKENS, TOKEN_LOGO_COMPONENTS } from '@/utils/constants';
import { formatGasCost } from '@/types/gasEstimation';
import { useTokenBalances } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { BaseModal } from './BaseModal';

interface GasFeeTokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    selectedToken: GasTokenType;
    onTokenSelect: (token: GasTokenType, rememberChoice: boolean) => void;
    availableTokens: GasTokenType[];
    tokenEstimations: Record<GasTokenType, { cost: number; loading: boolean }>;
    walletAddress: string;
}

export const GasFeeTokenSelector = ({
    isOpen,
    onClose,
    selectedToken,
    onTokenSelect,
    availableTokens,
    tokenEstimations,
    walletAddress,
}: GasFeeTokenSelectorProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { balances } = useTokenBalances(walletAddress);
    const [tempSelectedToken, setTempSelectedToken] =
        React.useState(selectedToken);
    const [rememberChoice, setRememberChoice] = React.useState(false);

    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const errorColor = useToken('colors', 'vechain-kit-error');

    // Hover / selected surfaces — alpha overlays on the modal bg.
    // Chakra's whiteAlpha/blackAlpha tokens aren't wired to the kit's
    // custom darkMode flag (we don't use Chakra color mode), so we pick
    // the alpha overlay manually. Selected sits a notch above hover so
    // the active row reads as picked without yelling — previously this
    // row used `textTertiary` (a text colour: a near-white at 50% in
    // dark mode, mid-grey #718096 in light mode), which was way too
    // strong as a background.
    const hoverBg = isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)';
    const hoverBorder = isDark
        ? 'rgba(255, 255, 255, 0.16)'
        : 'rgba(0, 0, 0, 0.12)';
    const selectedBg = isDark
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.06)';

    const itemBg = (selected: boolean) =>
        selected ? selectedBg : 'transparent';
    const itemBorderColor = (selected: boolean) =>
        selected ? textPrimary : 'transparent';

    React.useEffect(() => {
        if (isOpen) {
            setTempSelectedToken(selectedToken);
            setRememberChoice(false);
        }
    }, [isOpen, selectedToken]);

    const handleApply = () => {
        onTokenSelect(tempSelectedToken, rememberChoice);
        onClose();
    };

    const getTokenBalance = (tokenSymbol: string) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        return balance
            ? Number(balance.balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : '0.00';
    };

    const hasInsufficientBalance = (tokenSymbol: GasTokenType) => {
        const balance = balances.find((b) => b.symbol === tokenSymbol);
        const estimation = tokenEstimations[tokenSymbol];
        if (!balance || !estimation) return false;
        return Number(balance.balance) < estimation.cost;
    };

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} size="sm">
            <ModalHeader>
                <Text fontSize="lg" fontWeight="semibold" color={textPrimary}>
                    {t('Fee token')}
                </Text>
                <Text
                    fontSize="sm"
                    fontWeight="normal"
                    color={textSecondary}
                    mt={1}
                >
                    {t('Select the token to pay the fee with')}
                </Text>
            </ModalHeader>

            <ModalBody>
                <VStack spacing={2} align="stretch">
                    {availableTokens.map((token) => {
                        const tokenInfo = SUPPORTED_GAS_TOKENS[token];
                        const isSelected = tempSelectedToken === token;
                        const estimation = tokenEstimations[token] || {
                            cost: 0,
                            loading: true,
                        };
                        const insufficient = hasInsufficientBalance(token);

                        return (
                            <Box
                                key={token}
                                cursor={
                                    insufficient ? 'not-allowed' : 'pointer'
                                }
                                bg={itemBg(isSelected)}
                                border="1px"
                                borderColor={itemBorderColor(isSelected)}
                                borderRadius="md"
                                p={3}
                                transition="all 0.2s ease"
                                _hover={{
                                    backgroundColor: insufficient
                                        ? itemBg(isSelected)
                                        : isSelected
                                        ? itemBg(isSelected)
                                        : hoverBg,
                                    borderColor: insufficient
                                        ? itemBorderColor(isSelected)
                                        : isSelected
                                        ? itemBorderColor(isSelected)
                                        : hoverBorder,
                                }}
                                opacity={insufficient ? 0.5 : 1}
                                onClick={() =>
                                    !insufficient && setTempSelectedToken(token)
                                }
                            >
                                <HStack spacing={3} justify="space-between">
                                    <HStack spacing={3} flex={1}>
                                        {React.cloneElement(
                                            TOKEN_LOGO_COMPONENTS[token],
                                            {
                                                boxSize: '36px',
                                                borderRadius: 'full',
                                            },
                                        )}
                                        <VStack align="start" spacing={0}>
                                            <Text
                                                fontWeight="medium"
                                                color={textPrimary}
                                            >
                                                {tokenInfo.symbol}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                color={textSecondary}
                                            >
                                                {t('Balance')}:{' '}
                                                {getTokenBalance(token)}
                                            </Text>
                                            {insufficient && (
                                                <Text
                                                    fontSize="xs"
                                                    color={errorColor}
                                                >
                                                    {t('Insufficient balance')}
                                                </Text>
                                            )}
                                        </VStack>
                                    </HStack>
                                    <VStack align="end" spacing={0}>
                                        {estimation.loading ? (
                                            <Skeleton
                                                height="16px"
                                                width="60px"
                                            />
                                        ) : (
                                            <>
                                                <Text
                                                    fontSize="sm"
                                                    fontWeight="semibold"
                                                    color={textPrimary}
                                                >
                                                    {formatGasCost(
                                                        estimation.cost,
                                                        2,
                                                    )}
                                                </Text>
                                                <Text
                                                    fontSize="xs"
                                                    color={textSecondary}
                                                >
                                                    {tokenInfo.symbol}
                                                </Text>
                                            </>
                                        )}
                                    </VStack>
                                </HStack>
                            </Box>
                        );
                    })}

                    {tempSelectedToken !== selectedToken && (
                        <FormControl
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <FormLabel
                                htmlFor="remember-choice"
                                mb="0"
                                fontSize="sm"
                                color={textPrimary}
                            >
                                {t('Use this token for future transactions')}
                            </FormLabel>
                            <Switch
                                id="remember-choice"
                                isChecked={rememberChoice}
                                onChange={(e) =>
                                    setRememberChoice(e.target.checked)
                                }
                                color={textPrimary}
                            />
                        </FormControl>
                    )}
                </VStack>
            </ModalBody>

            <ModalFooter>
                <VStack spacing={3} w="full">
                    <Button
                        variant="vechainKitPrimary"
                        onClick={handleApply}
                        isDisabled={hasInsufficientBalance(tempSelectedToken)}
                    >
                        {t('Apply')}
                    </Button>
                    <Button variant="ghost" width="full" onClick={onClose}>
                        {t('Cancel')}
                    </Button>
                </VStack>
            </ModalFooter>
        </BaseModal>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/InlineFeedback.tsx`

````tsx
import {
    Box,
    HStack,
    Icon,
    Text,
    useToken,
    useColorModeValue,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { LuCheck } from 'react-icons/lu';
import { useEffect, useState } from 'react';

type Props = {
    message: string;
    duration?: number;
    onClose?: () => void;
};

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

export const InlineFeedback = ({
    message,
    duration = 2000,
    onClose,
}: Props) => {
    const [isVisible, setIsVisible] = useState(true);
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const bgColor = useColorModeValue('#f0f9ff', '#0000009e');
    const borderColor = useColorModeValue('#bfdbfe', '#3b3b3b');
    const iconColor = useToken('colors', 'vechain-kit-primary');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => {
                onClose?.();
            }, 300); // Wait for animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <Box
            position="absolute"
            w="fit-content"
            margin="auto"
            animation={`${isVisible ? slideIn : slideOut} 0.3s ease-in-out`}
            zIndex={10}
        >
            <Box
                bg={bgColor}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius="md"
                px={4}
                py={3}
                mx={4}
                mt={2}
            >
                <HStack spacing={3} align="center">
                    <Icon
                        as={LuCheck}
                        boxSize={5}
                        color={iconColor}
                        flexShrink={0}
                    />
                    <Text
                        fontSize="sm"
                        fontWeight="500"
                        color={textPrimary}
                        flex={1}
                    >
                        {message}
                    </Text>
                </HStack>
            </Box>
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/ModalBackButton.tsx`

````tsx
import { IconButton, IconButtonProps, Icon } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';

type BackButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalBackButton = ({ onClick, ...props }: BackButtonProps) => {
    return (
        <IconButton
            aria-label="Back"
            icon={<Icon as={LuChevronLeft} fontSize={'20px'} />}
            size="sm"
            variant="vechainKitHeaderIconButtons"
            position="absolute"
            left="10px"
            top="8px"
            onClick={onClick}
            lineHeight={'0'}
            {...props}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/ModalFAQButton.tsx`

````tsx
import { IconButton, IconButtonProps, Icon } from '@chakra-ui/react';
import { LuCircleHelp } from 'react-icons/lu';

type FAQButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalFAQButton = ({ onClick, ...props }: FAQButtonProps) => {
    return (
        <IconButton
            aria-label="FAQ"
            icon={<Icon as={LuCircleHelp} fontSize={'17px'} />}
            size="sm"
            variant="vechainKitHeaderIconButtons"
            position="absolute"
            lineHeight={'normal'}
            left="10px"
            top="8px"
            onClick={onClick}
            {...props}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/ModalNotificationButton.tsx`

````tsx
import { IconButton, IconButtonProps, Box } from '@chakra-ui/react';
import { LuBell } from 'react-icons/lu';

type NotificationButtonProps = {
    onClick: () => void;
    hasUnreadNotifications?: boolean;
} & Partial<IconButtonProps>;

export const ModalNotificationButton = ({
    onClick,
    hasUnreadNotifications,
    ...props
}: NotificationButtonProps) => {
    return (
        <IconButton
            aria-label="Notifications"
            size="sm"
            variant="ghost"
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            icon={
                <Box position="relative">
                    <LuBell fontSize={'20px'} />
                    {hasUnreadNotifications && (
                        <Box
                            position="absolute"
                            top="-1px"
                            right="-1px"
                            minWidth="8px"
                            height="8px"
                            bg="red.500"
                            borderRadius="full"
                        />
                    )}
                </Box>
            }
            {...props}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/ModalSettingsButton.tsx`

````tsx
import { useUpgradeRequired, useWallet } from '@/hooks';
import { IconButton, IconButtonProps, Box, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';

type ModalSettingsButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalSettingsButton = ({
    onClick,
    ...props
}: ModalSettingsButtonProps) => {
    const { smartAccount, connectedWallet, connection } = useWallet();
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('app-first-visit');
        setIsFirstVisit(!hasVisited);
    }, []);

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const showRedDot = connection.isConnectedWithPrivy && upgradeRequired;

    const handleOnClick = () => {
        if (isFirstVisit) {
            localStorage.setItem('app-first-visit', 'true');
            setIsFirstVisit(false);
        }

        onClick();
    };

    return (
        <IconButton
            aria-label="Settings"
            size="sm"
            variant="vechainKitHeaderIconButtons"
            position="absolute"
            left="10px"
            top="8px"
            lineHeight={'0'}
            onClick={handleOnClick}
            icon={
                <Box position="relative">
                    <Icon as={LuSettings2} fontSize={'18px'} />
                    {showRedDot && (
                        <Box
                            position="absolute"
                            top="-1px"
                            right="-1px"
                            minWidth="8px"
                            height="8px"
                            bg="red.500"
                            borderRadius="full"
                        />
                    )}
                </Box>
            }
            {...props}
        />
    );
};
````

## Source: `packages/vechain-kit/src/components/common/PriceChangeBadge.tsx`

````tsx
import { HStack, Text, TextProps, useToken } from '@chakra-ui/react';

type Props = TextProps & {
    valuePct?: number;
    showSuffix?: boolean;
};

export const PriceChangeBadge = ({
    valuePct,
    showSuffix,
    ...textProps
}: Props) => {
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');
    const muted = useToken('colors', 'vechain-kit-text-tertiary');

    if (valuePct === undefined || !Number.isFinite(valuePct)) {
        return null;
    }

    const sign = valuePct > 0 ? '+' : '';
    const color =
        valuePct === 0 ? muted : valuePct > 0 ? success : error;

    return (
        <HStack spacing={1} align="baseline">
            <Text fontSize="xs" fontWeight="600" color={color} {...textProps}>
                {sign}
                {valuePct.toFixed(2)}%
            </Text>
            {showSuffix && (
                <Text fontSize="xs" fontWeight="500" color={muted}>
                    24h
                </Text>
            )}
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/PriceChart.tsx`

````tsx
import { Box, BoxProps, Text, useToken } from '@chakra-ui/react';
import { useMemo, useRef, useState } from 'react';
import type { PricePoint } from '@/hooks';

type Props = BoxProps & {
    points: PricePoint[];
    /** 'up' = green, 'down' = red, 'neutral' = muted. Defaults to 'neutral'. */
    tone?: 'up' | 'down' | 'neutral';
    /** Chart height in px. */
    chartHeight?: number;
    /** Overall opacity (useful as background underlay). Defaults to 1. */
    chartOpacity?: number;
    /** Stroke thickness in px. Defaults to 1.75. */
    strokeWidth?: number;
    /** Show a hover/touch tooltip with the value at the cursor. */
    interactive?: boolean;
    /** Format the numeric value shown in the tooltip. */
    formatValue?: (value: number) => string;
};

const PADDING_X = 2;
const PADDING_Y = 2;
const SVG_WIDTH = 100; // viewBox width; height matches chartHeight via preserveAspectRatio

const defaultFormatValue = (v: number) =>
    `$${v.toLocaleString(undefined, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
    })}`;

const formatTimestamp = (unixSeconds: number) =>
    new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(unixSeconds * 1000));

export const PriceChart = ({
    points,
    tone = 'neutral',
    chartHeight = 56,
    chartOpacity = 1,
    strokeWidth = 1.75,
    interactive = false,
    formatValue = defaultFormatValue,
    ...boxProps
}: Props) => {
    const success = useToken('colors', 'vechain-kit-success');
    const error = useToken('colors', 'vechain-kit-error');
    const muted = useToken('colors', 'vechain-kit-text-tertiary');
    const textPrimary = useToken('colors', 'vechain-kit-text-primary');
    const textSecondary = useToken('colors', 'vechain-kit-text-secondary');
    const cardBg = useToken('colors', 'vechain-kit-card');

    const stroke =
        tone === 'up' ? success : tone === 'down' ? error : muted;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    const path = useMemo(() => {
        if (points.length < 2) return null;
        const xs = points.map((p) => p.timestamp);
        const ys = points.map((p) => p.value);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const rangeX = Math.max(1, maxX - minX);
        const rangeY = Math.max(1e-12, maxY - minY);
        const innerW = SVG_WIDTH - PADDING_X * 2;
        const innerH = chartHeight - PADDING_Y * 2;

        const coords = points.map((p) => {
            const x = PADDING_X + ((p.timestamp - minX) / rangeX) * innerW;
            // Flip Y: SVG origin is top-left.
            const y =
                PADDING_Y +
                innerH -
                ((p.value - minY) / rangeY) * innerH;
            return [x, y] as const;
        });

        // Fritsch–Carlson monotone cubic interpolation. Produces a smooth
        // curve that passes through every point and is guaranteed not to
        // overshoot or backtrack between adjacent observations.
        const fmt = (n: number) => n.toFixed(2);
        const xs2 = coords.map((c) => c[0]);
        const ys2 = coords.map((c) => c[1]);
        const n = coords.length;
        const dxs: number[] = new Array(n - 1);
        const slopes: number[] = new Array(n - 1);
        for (let i = 0; i < n - 1; i++) {
            dxs[i] = xs2[i + 1] - xs2[i];
            slopes[i] = dxs[i] === 0 ? 0 : (ys2[i + 1] - ys2[i]) / dxs[i];
        }
        const tan: number[] = new Array(n).fill(0);
        tan[0] = slopes[0];
        tan[n - 1] = slopes[n - 2];
        for (let i = 1; i < n - 1; i++) {
            tan[i] =
                slopes[i - 1] * slopes[i] <= 0
                    ? 0
                    : (slopes[i - 1] + slopes[i]) / 2;
        }
        for (let i = 0; i < n - 1; i++) {
            if (slopes[i] === 0) {
                tan[i] = 0;
                tan[i + 1] = 0;
                continue;
            }
            const a = tan[i] / slopes[i];
            const b = tan[i + 1] / slopes[i];
            const h = Math.hypot(a, b);
            if (h > 3) {
                const tau = 3 / h;
                tan[i] = tau * a * slopes[i];
                tan[i + 1] = tau * b * slopes[i];
            }
        }
        const segments: string[] = [`M${fmt(xs2[0])} ${fmt(ys2[0])}`];
        for (let i = 0; i < n - 1; i++) {
            const h = dxs[i];
            const c1x = xs2[i] + h / 3;
            const c1y = ys2[i] + (h * tan[i]) / 3;
            const c2x = xs2[i + 1] - h / 3;
            const c2y = ys2[i + 1] - (h * tan[i + 1]) / 3;
            segments.push(
                `C${fmt(c1x)} ${fmt(c1y)}, ${fmt(c2x)} ${fmt(c2y)}, ${fmt(
                    xs2[i + 1],
                )} ${fmt(ys2[i + 1])}`,
            );
        }
        const line = segments.join(' ');
        const fill = `${line} L${fmt(coords[coords.length - 1][0])} ${chartHeight} L${fmt(
            coords[0][0],
        )} ${chartHeight} Z`;
        return { line, fill, coords };
    }, [points, chartHeight]);

    if (!path) return null;

    const gradientId = `pricechart-gradient-${tone}`;

    const handlePointer = (clientX: number) => {
        if (!wrapperRef.current || !path) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const relX = clientX - rect.left;
        if (relX < 0 || relX > rect.width) {
            setActiveIdx(null);
            return;
        }
        // Map pixel x to viewBox x.
        const vbX = (relX / rect.width) * SVG_WIDTH;
        let closest = 0;
        let closestDist = Infinity;
        for (let i = 0; i < path.coords.length; i++) {
            const d = Math.abs(path.coords[i][0] - vbX);
            if (d < closestDist) {
                closestDist = d;
                closest = i;
            }
        }
        setActiveIdx(closest);
    };

    const interactiveHandlers = interactive
        ? {
              onMouseMove: (e: React.MouseEvent) => handlePointer(e.clientX),
              onMouseLeave: () => setActiveIdx(null),
              onTouchStart: (e: React.TouchEvent) =>
                  e.touches[0] && handlePointer(e.touches[0].clientX),
              onTouchMove: (e: React.TouchEvent) =>
                  e.touches[0] && handlePointer(e.touches[0].clientX),
              onTouchEnd: () => setActiveIdx(null),
          }
        : {};

    const activePoint =
        activeIdx != null ? points[activeIdx] : null;
    const activeCoord =
        activeIdx != null ? path.coords[activeIdx] : null;
    const activeXPct = activeCoord ? (activeCoord[0] / SVG_WIDTH) * 100 : 0;
    const activeYPct = activeCoord ? (activeCoord[1] / chartHeight) * 100 : 0;

    return (
        <Box
            ref={wrapperRef}
            position="relative"
            opacity={chartOpacity}
            pointerEvents={interactive ? 'auto' : 'none'}
            cursor={interactive ? 'crosshair' : undefined}
            {...interactiveHandlers}
            {...boxProps}
        >
            <svg
                viewBox={`0 0 ${SVG_WIDTH} ${chartHeight}`}
                width="100%"
                height={chartHeight}
                preserveAspectRatio="none"
                style={{ display: 'block' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <path d={path.fill} fill={`url(#${gradientId})`} stroke="none" />
                <path
                    d={path.line}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {interactive && activePoint && activeCoord && (
                <>
                    {/* Vertical guide. */}
                    <Box
                        position="absolute"
                        top={0}
                        bottom={0}
                        left={`${activeXPct}%`}
                        w="1px"
                        bg={textSecondary}
                        opacity={0.4}
                        pointerEvents="none"
                    />
                    {/* Active marker. */}
                    <Box
                        position="absolute"
                        left={`${activeXPct}%`}
                        top={`${activeYPct}%`}
                        w="10px"
                        h="10px"
                        ml="-5px"
                        mt="-5px"
                        borderRadius="full"
                        bg={stroke}
                        border="2px solid"
                        borderColor={cardBg}
                        pointerEvents="none"
                    />
                    {/* Tooltip. */}
                    <Box
                        position="absolute"
                        left={`${activeXPct}%`}
                        top="0"
                        transform={`translateX(${
                            activeXPct > 70
                                ? '-100%'
                                : activeXPct < 30
                                ? '0%'
                                : '-50%'
                        })`}
                        px={2}
                        py={1}
                        borderRadius="md"
                        bg={cardBg}
                        boxShadow="0 2px 8px rgba(0,0,0,0.3)"
                        pointerEvents="none"
                        whiteSpace="nowrap"
                        zIndex={1}
                    >
                        <Text
                            fontSize="xs"
                            fontWeight="600"
                            color={textPrimary}
                            lineHeight="short"
                        >
                            {formatValue(activePoint.value)}
                        </Text>
                        <Text
                            fontSize="xs"
                            color={textSecondary}
                            lineHeight="short"
                        >
                            {formatTimestamp(activePoint.timestamp)}
                        </Text>
                    </Box>
                </>
            )}
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/ScrollToTopWrapper.tsx`

````tsx
import { VStack, StackProps } from '@chakra-ui/react';
import { useScrollToTop } from '@/hooks/utils/useScrollToTop';

export const ScrollToTopWrapper = ({ children, ...props }: StackProps) => {
    useScrollToTop();

    return <VStack {...props}>{children}</VStack>;
};
````

## Source: `packages/vechain-kit/src/components/common/StatusScreen.tsx`

````tsx
import {
    Box,
    Icon,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    useToken,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { LuCircleCheckBig, LuTriangleAlert } from 'react-icons/lu';
import { StickyHeaderContainer } from './StickyHeaderContainer';

type Status = 'success' | 'error';

export type StatusScreenProps = {
    status: Status;
    /** Heading rendered in the modal header. */
    title: string;
    /** Optional supporting copy under the badge. */
    description?: string;
    /** Override the default icon (`LuCircleCheckBig` for success,
     *  `LuTriangleAlert` for error). */
    icon?: IconType | ReactNode;
    /** Slot for primary CTAs (Done / Try again, …). */
    actions: ReactNode;
    /** Optional extra slot under the body — e.g. a "Share on socials" row. */
    bodyExtras?: ReactNode;
    /** Optional explorer link rendered below the actions. */
    footerExtras?: ReactNode;
    /** Hide the close button (used while a tx is still pending). */
    hideCloseButton?: boolean;
};

/**
 * Shared visual scaffold for end-of-flow status screens — success after a
 * transaction confirms, error after one fails. Replaces the four
 * almost-duplicate "100px LuCircleCheck" / "100px LuCircleAlert" surfaces
 * that used to live in AccountModal, TransactionModal and
 * UpgradeSmartAccountModal.
 *
 * Visual: a soft tinted disc (~88px) holds the status icon (~44px solid),
 * with a one-shot framer-motion entrance — the disc fades + scales from
 * 0.92, the icon springs in. No looping animation: the screen should feel
 * polished, not chatty.
 */
export const StatusScreen = ({
    status,
    title,
    description,
    icon,
    actions,
    bodyExtras,
    footerExtras,
    hideCloseButton,
}: StatusScreenProps) => {
    const [successColor, successBg, errorColor, errorBg, textSecondary] =
        useToken('colors', [
            'vechain-kit-success',
            'vechain-kit-success-bg',
            'vechain-kit-error',
            'vechain-kit-error-bg',
            'vechain-kit-text-secondary',
        ]);

    const color = status === 'success' ? successColor : errorColor;
    const bg = status === 'success' ? successBg : errorBg;
    const DefaultIcon: IconType =
        status === 'success' ? LuCircleCheckBig : LuTriangleAlert;

    const renderedIcon =
        // If a custom node was passed, drop it in as-is. Otherwise render
        // either the override IconType or the default at 44px in the
        // status color.
        icon && typeof icon !== 'function' ? (
            icon
        ) : (
            <Icon
                as={(icon as IconType | undefined) ?? DefaultIcon}
                boxSize={'44px'}
                color={color}
                data-testid={`${status}-icon`}
            />
        );

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader textAlign={'center'}>{title}</ModalHeader>
                {!hideCloseButton && <ModalCloseButton />}
            </StickyHeaderContainer>

            <ModalBody>
                <VStack align={'center'} px={6} py={4} spacing={5}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.22,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <Box
                            w={'88px'}
                            h={'88px'}
                            borderRadius={'full'}
                            bg={bg}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <motion.div
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 340,
                                    damping: 18,
                                    delay: 0.08,
                                }}
                                style={{ display: 'flex' }}
                            >
                                {renderedIcon}
                            </motion.div>
                        </Box>
                    </motion.div>

                    {description && (
                        <Text
                            fontSize={'14px'}
                            lineHeight={'1.5'}
                            textAlign={'center'}
                            color={textSecondary}
                            maxW={'36ch'}
                            style={{ lineBreak: 'anywhere' }}
                        >
                            {description}
                        </Text>
                    )}

                    {bodyExtras}
                </VStack>
            </ModalBody>

            <ModalFooter justifyContent={'center'}>
                <VStack width={'full'} spacing={3}>
                    {actions}
                    {footerExtras}
                </VStack>
            </ModalFooter>
        </>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/StickyFooterContainer.tsx`

````tsx
import { Box, useToken } from '@chakra-ui/react';

type Props = {
    children: React.ReactNode;
};

export const StickyFooterContainer = ({ children }: Props) => {
    // Use semantic token for sticky footer background (same as modal)
    const footerBg = useToken('colors', 'vechain-kit-modal');

    return (
        <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg={footerBg}
            zIndex="1000"
            p={4}
            w="full"
        >
            {children}
        </Box>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/StickyHeaderContainer.tsx`

````tsx
import { Box } from '@chakra-ui/react';
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { useVechainKitThemeConfig } from '@/providers';

type Props = {
    children: React.ReactNode;
};

// Context to share hasContentBelow state with bottom sheet handle
const StickyHeaderContext = createContext<{
    hasContentBelow: boolean;
}>({ hasContentBelow: false });

export const useStickyHeaderContext = () => useContext(StickyHeaderContext);

export const StickyHeaderContainer = ({ children }: Props) => {
    const [hasContentBelow, setHasContentBelow] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitialMountRef = useRef(true);

    // Use semantic tokens for sticky header
    const { tokens } = useVechainKitThemeConfig();
    const backdropFilter =
        tokens?.effects?.backdropFilter?.stickyHeader ?? 'blur(20px)';

    useEffect(() => {
        // Find the scrollable container (parent with overflow-y: auto)
        const findScrollableContainer = (
            element: HTMLElement | null,
        ): HTMLElement | null => {
            if (!element) return null;
            let current: HTMLElement | null = element.parentElement;
            while (current) {
                const style = window.getComputedStyle(current);
                if (
                    style.overflowY === 'auto' ||
                    style.overflowY === 'scroll' ||
                    style.overflow === 'auto' ||
                    style.overflow === 'scroll'
                ) {
                    return current;
                }
                current = current.parentElement;
            }
            return null;
        };

        // Ignore intersection changes during initial mount and transitions
        // This prevents the glitch when content is animating in
        const handleIntersection = ([entry]: IntersectionObserverEntry[]) => {
            // Clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Debounce the state update to prevent rapid changes during animations
            timeoutRef.current = setTimeout(() => {
                // On initial mount, always start with false to prevent glitch
                if (isInitialMountRef.current) {
                    isInitialMountRef.current = false;
                    setHasContentBelow(false);
                    return;
                }
                setHasContentBelow(!entry.isIntersecting);
            }, 50); // Small debounce to let animations settle
        };

        const scrollableContainer = findScrollableContainer(headerRef.current);

        const observerOptions: IntersectionObserverInit = {
            threshold: 0,
        };

        // If we found a scrollable container, use it as the root
        if (scrollableContainer) {
            observerOptions.root = scrollableContainer;
            observerOptions.rootMargin = '0px';
        }

        const observer = new IntersectionObserver(
            handleIntersection,
            observerOptions,
        );

        // Delay observation slightly to avoid initial glitch
        const observeTimeout = setTimeout(() => {
            if (observerRef.current) {
                observer.observe(observerRef.current);
            }
        }, 200); // Wait for animation to complete (0.17s + small buffer)

        return () => {
            clearTimeout(observeTimeout);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            observer.disconnect();
        };
    }, []);

    return (
        <StickyHeaderContext.Provider value={{ hasContentBelow }}>
            <Box
                ref={headerRef}
                position={'sticky'}
                top={'0'}
                left={'0'}
                w={'full'}
                borderRadius={'24px 24px 0px 0px'}
                backdropFilter={hasContentBelow ? backdropFilter : 'none'}
                style={{
                    WebkitBackdropFilter: hasContentBelow
                        ? backdropFilter
                        : 'none',
                }}
                zIndex={1000}
                boxShadow={
                    hasContentBelow
                        ? '0px 2px 4px 1px rgb(0 0 0 / 10%)'
                        : 'none'
                }
                transition="box-shadow 0.2s ease-in-out"
            >
                {children}
            </Box>
            <div
                ref={observerRef}
                style={{
                    height: '1px',
                    width: '100%',
                    pointerEvents: 'none',
                    visibility: 'hidden',
                    marginTop: '-1px',
                }}
            />
        </StickyHeaderContext.Provider>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/TransactionButtonAndStatus.tsx`

````tsx
import { useVeChainKitConfig } from '@/providers';
import { Button, Link, Text, VStack, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { TransactionStatusErrorType } from '@/types';
import { getConfig } from '@/config';
import { TransactionReceipt } from '@vechain/sdk-network';

export type TransactionButtonAndStatusProps = {
    isSubmitting: boolean;
    isTxWaitingConfirmation: boolean;
    onConfirm: () => void;
    onRetry?: () => void;
    transactionPendingText: string;
    txReceipt: TransactionReceipt | null;
    transactionError?: Error | TransactionStatusErrorType | null;
    isSubmitForm?: boolean;
    buttonText: string;
    isDisabled?: boolean;
    style?: {
        accentColor?: string;
    };
    onError?: (error: string) => void;
    // Gas estimation error props
    gasEstimationError?: Error | null;
    hasEnoughGasBalance?: boolean;
    isLoadingGasEstimation?: boolean;
    showGasEstimationError?: boolean;
    context?: 'send' | 'customization' | 'domain' | 'transaction';
};

export const TransactionButtonAndStatus = ({
    transactionError,
    isSubmitting,
    isTxWaitingConfirmation,
    onConfirm,
    onRetry,
    transactionPendingText,
    txReceipt,
    isSubmitForm = false,
    buttonText,
    isDisabled = false,
    style,
    onError,
    gasEstimationError,
    hasEnoughGasBalance = true,
    isLoadingGasEstimation = false,
    showGasEstimationError = false,
    context = 'transaction',
}: TransactionButtonAndStatusProps) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();
    const { network } = useVeChainKitConfig();

    const errorMessage = useMemo(() => {
        if (!transactionError) return null;
        return (
            (transactionError as any).reason ||
            t('Something went wrong. Please try again.')
        );
    }, [transactionError, t]);

    useEffect(() => {
        if (errorMessage) {
            onError?.(errorMessage);
        }
    }, [errorMessage, onError]);

    const buttonBg = useMemo(() => {
        if (style?.accentColor) return `${style.accentColor} !important`;
        return undefined;
    }, [style?.accentColor]);

    // Gas estimation error details - simplified
    const gasEstimationErrorDetails = useMemo(() => {
        // Don't show errors while loading or if we shouldn't show them
        if (!showGasEstimationError || isLoadingGasEstimation) {
            return null;
        }

        // Only show errors if we have an actual error OR if we've completed estimation
        // This prevents showing errors on initial render before estimation starts
        const hasAttemptedEstimation =
            gasEstimationError || hasEnoughGasBalance;
        if (!hasAttemptedEstimation) {
            return null;
        }

        // No gas tokens enabled (only if we have an error but no specific balance issue)
        if (!hasEnoughGasBalance && !gasEstimationError) {
            return {
                message: t(
                    "You don't have any gas tokens enabled. Please enable at least one gas token in Gas Token Preferences.",
                ),
            };
        }

        // Has estimation error - show simple contextual message
        if (gasEstimationError) {
            let message = '';
            switch (context) {
                case 'send':
                    message = t(
                        'Insufficient balance to complete this transfer and cover gas fees.' as any,
                    );
                    break;
                case 'customization':
                    message = t(
                        'Insufficient balance to update your profile and cover gas fees.' as any,
                    );
                    break;
                case 'domain':
                    message = t(
                        'Insufficient balance to claim this domain and cover gas fees.' as any,
                    );
                    break;
                default:
                    message = t(
                        'Insufficient balance to complete this transaction and cover gas fees.' as any,
                    );
            }

            return { message };
        }

        return null;
    }, [
        gasEstimationError,
        hasEnoughGasBalance,
        isLoadingGasEstimation,
        showGasEstimationError,
        context,
        t,
    ]);

    return (
        <VStack width="full" spacing={4}>
            {errorMessage && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg={
                        isDark
                            ? 'rgba(218, 90, 90, 0.1)'
                            : 'rgba(218, 90, 90, 0.05)'
                    }
                    borderWidth="1px"
                    borderColor={
                        isDark
                            ? 'rgba(218, 90, 90, 0.3)'
                            : 'rgba(218, 90, 90, 0.2)'
                    }
                    w="full"
                >
                    <Text
                        color="#da5a5a"
                        fontSize="sm"
                        fontWeight="medium"
                        data-testid="tx-send-error-msg"
                    >
                        {errorMessage}
                    </Text>
                </Box>
            )}

            {gasEstimationErrorDetails && !errorMessage && (
                <Box
                    p={3}
                    borderRadius="md"
                    bg={
                        isDark
                            ? 'rgba(218, 90, 90, 0.1)'
                            : 'rgba(218, 90, 90, 0.05)'
                    }
                    borderWidth="1px"
                    borderColor={
                        isDark
                            ? 'rgba(218, 90, 90, 0.3)'
                            : 'rgba(218, 90, 90, 0.2)'
                    }
                    w="full"
                >
                    <Text
                        color="#da5a5a"
                        fontSize="sm"
                        fontWeight="medium"
                        data-testid="gas-estimation-error"
                    >
                        {gasEstimationErrorDetails.message}
                    </Text>
                </Box>
            )}

            <Button
                px={4}
                variant={
                    errorMessage ? 'vechainKitSecondary' : 'vechainKitPrimary'
                }
                bg={buttonBg}
                onClick={() =>
                    errorMessage && onRetry ? onRetry() : onConfirm()
                }
                type={isSubmitForm ? 'submit' : 'button'}
                isLoading={isSubmitting}
                isDisabled={isDisabled}
                loadingText={
                    isTxWaitingConfirmation
                        ? t('Waiting wallet confirmation...')
                        : transactionPendingText
                }
                data-testid="confirm-button"
            >
                {errorMessage
                    ? t('Retry')
                    : buttonText
                    ? buttonText
                    : t('Confirm')}
            </Button>
            {errorMessage && txReceipt?.meta.txID && (
                <Link
                    isExternal
                    fontSize="sm"
                    color={isDark ? 'whiteAlpha.600' : 'blackAlpha.600'}
                    textAlign="center"
                    width="full"
                    href={`${getConfig(network.type).explorerUrl}/${
                        txReceipt?.meta.txID
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('View transaction on the explorer')}
                </Link>
            )}
        </VStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/VersionFooter.tsx`

````tsx
import { HStack, Link, StackProps } from '@chakra-ui/react';
import { VechainLogo } from '../../assets';
import packageJson from '../../../package.json';
import { useVeChainKitConfig } from '@/providers';

type Props = {} & Omit<StackProps, 'dangerouslySetInnerHTML'>;

export const VersionFooter = ({ ...props }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <HStack
            w={'full'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={0}
            {...props}
        >
            <VechainLogo
                isDark={isDark}
                w={'70px'}
                h={'auto'}
                opacity={0.4}
                mr={1}
                ml={'-16px'}
            />
            <Link
                fontSize={'11px'}
                fontWeight={'500'}
                opacity={0.4}
                textAlign={'left'}
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
                isExternal
                pt={'1px'}
            >
                v{packageJson.version}
            </Link>
        </HStack>
    );
};
````

## Source: `packages/vechain-kit/src/components/common/WalletSwitchFeedback.tsx`

````tsx
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineFeedback } from './InlineFeedback';

type Props = {
    /**
     * Show feedback flag passed via content props (desktop)
     * If true, shows the feedback message
     */
    showFeedback?: boolean;
};

/**
 * Component that displays inline feedback when a wallet switch occurs.
 * Handles both desktop (via props) and VeWorld in-app browser (via address change detection).
 * Simply add this component where you want the feedback to appear.
 */
export const WalletSwitchFeedback = ({ showFeedback = false }: Props) => {
    const { t } = useTranslation();
    const [showSwitchFeedback, setShowSwitchFeedback] = useState(false);

    // Handle prop-based feedback (desktop)
    useEffect(() => {
        if (showFeedback) {
            setShowSwitchFeedback(true);
        } else {
            // Reset feedback when prop becomes false/undefined (e.g., modal closed and reopened)
            setShowSwitchFeedback(false);
        }
    }, [showFeedback]);

    if (!showSwitchFeedback) {
        return null;
    }

    return (
        <InlineFeedback
            message={t('Account Changed')}
            duration={2000}
            onClose={() => {
                setShowSwitchFeedback(false);
            }}
        />
    );
};
````

## Source: `packages/vechain-kit/src/hooks/modals/useAccountCustomizationModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountCustomizationModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('account-customization', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const AccountCustomizationModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useAccountModal.tsx`

````tsx
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useAccountModal = () => {
    const {
        openAccountModal: open,
        closeAccountModal: close,
        isAccountModalOpen: isOpen,
    } = useModal();
    return { open: () => open(), close, isOpen };
};

export const AccountModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/modals/useAccountModalOptions.tsx`

````tsx
import { useModal } from '@/providers/ModalProvider';

export const useAccountModalOptions = () => {
    const { isolatedView, closeAccountModal } = useModal();

    return {
        isolatedView,
        closeAccountModal,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/modals/useChooseNameModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useChooseNameModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal(
            {
                type: 'choose-name',
                props: {
                    setCurrentContent: setAccountModalContent,
                    onBack: () => setAccountModalContent('main'),
                    initialContentSource: 'main',
                },
            },
            options,
        );
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const ChooseNameModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useConnectModal.tsx`

````tsx
import { useVeChainKitConfig } from '@/providers';
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';
import { useDAppKitWalletModal } from '..';
import { ConnectModalContentsTypes } from '@/components';

export const useConnectModal = () => {
    const { loginMethods } = useVeChainKitConfig();
    // Only the legacy `'dappkit'` method delegates to dapp-kit's native modal.
    // Granular methods ('veworld' | 'sync2' | 'wallet-connect') keep using
    // vechain-kit's modal so the custom loading/error UI is shown.
    const hasOnlyDappKit =
        loginMethods?.length === 1 && loginMethods[0].method === 'dappkit';

    const { openConnectModal, closeConnectModal, isConnectModalOpen } =
        useModal();

    const { open: openDappKit, close: closeDappKit } = useDAppKitWalletModal();

    return {
        open: hasOnlyDappKit
            ? openDappKit
            : (initialContent?: ConnectModalContentsTypes) =>
                  openConnectModal(initialContent),
        close: hasOnlyDappKit ? closeDappKit : closeConnectModal,
        isOpen: hasOnlyDappKit ? false : isConnectModalOpen,
    };
};

export const ConnectModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/modals/useExploreEcosystemModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useExploreEcosystemModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('ecosystem', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const ExploreEcosystemModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useFAQModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useFAQModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal(
            {
                type: 'faq',
                props: {
                    onGoBack: () => setAccountModalContent('main'),
                    showLanguageSelector: false,
                },
            },
            options,
        );
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const FAQModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/modals/useLoginModalContent.ts`

````typescript
import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_PRIVY_APP_ID } from '@/utils';
import { useMemo } from 'react';

type LoginModalContentConfig = {
    showGoogleLogin: boolean;
    showAppleLogin: boolean;
    showEmailLogin: boolean;
    showPasskey: boolean;
    showVeChainLogin: boolean;
    showDappKit: boolean;
    showVeWorld: boolean;
    showSync2: boolean;
    showWalletConnect: boolean;
    showEcosystem: boolean;
    showMoreLogin: boolean;
    showGithubLogin: boolean;
    isOfficialVeChainApp: boolean;
};

export const useLoginModalContent = (): LoginModalContentConfig => {
    const { privy, loginMethods, dappKit } = useVeChainKitConfig();
    const isVeChainApp = privy?.appId === VECHAIN_PRIVY_APP_ID;
    const allowedWallets = dappKit?.allowedWallets;

    // Helper function to check if a login method is enabled
    const isLoginMethodEnabled = (method: string | string[]) => {
        if (!loginMethods) return true;

        if (Array.isArray(method)) {
            return method.some((m) =>
                loginMethods.some((lm) => lm.method === m),
            );
        }
        return loginMethods.some((lm) => lm.method === method);
    };

    // Memoized login method states
    const showEcosystemLogin = useMemo(() => {
        if (!loginMethods) return true;
        return loginMethods.length === 0 || isLoginMethodEnabled('ecosystem');
    }, [loginMethods]);

    const showLoginWithVeChain = useMemo(
        () => isLoginMethodEnabled('vechain'),
        [loginMethods],
    );
    const showLoginWithDappKit = useMemo(
        () => isLoginMethodEnabled('dappkit'),
        [loginMethods],
    );
    const showLoginWithPasskey = useMemo(
        () => isLoginMethodEnabled('passkey'),
        [loginMethods],
    );
    const showLoginWithEmail = useMemo(
        () => isLoginMethodEnabled('email'),
        [loginMethods],
    );
    const showLoginWithGoogle = useMemo(
        () => isLoginMethodEnabled('google'),
        [loginMethods],
    );
    const showLoginWithApple = useMemo(
        () => isLoginMethodEnabled('apple'),
        [loginMethods],
    );
    const showMoreLogin = useMemo(
        () => isLoginMethodEnabled('more'),
        [loginMethods],
    );
    const showLoginWithGithub = useMemo(
        () => isLoginMethodEnabled('github'),
        [loginMethods],
    );

    // Granular wallet methods. When the dev configured `dappKit.allowedWallets`,
    // also honor that gate so a method can never bypass it via `loginMethods`.
    const showLoginWithVeWorld = useMemo(() => {
        if (!isLoginMethodEnabled('veworld')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('veworld');
    }, [loginMethods, allowedWallets]);

    const showLoginWithSync2 = useMemo(() => {
        if (!isLoginMethodEnabled('sync2')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('sync2');
    }, [loginMethods, allowedWallets]);

    const showLoginWithWalletConnect = useMemo(() => {
        if (!isLoginMethodEnabled('wallet-connect')) return false;
        if (!allowedWallets) return true;
        return allowedWallets.includes('wallet-connect');
    }, [loginMethods, allowedWallets]);

    // Base configuration that's common across all cases
    const baseConfig: LoginModalContentConfig = {
        showGoogleLogin: showLoginWithGoogle,
        showAppleLogin: showLoginWithApple,
        showEmailLogin: showLoginWithEmail,
        showPasskey: showLoginWithPasskey,
        showVeChainLogin: showLoginWithVeChain,
        showDappKit: showLoginWithDappKit,
        showVeWorld: showLoginWithVeWorld,
        showSync2: showLoginWithSync2,
        showWalletConnect: showLoginWithWalletConnect,
        showEcosystem: showEcosystemLogin,
        showMoreLogin: showMoreLogin,
        showGithubLogin: showLoginWithGithub,
        isOfficialVeChainApp: false,
    };

    if (!privy) {
        // External apps (no self hosted privy). Most OAuth methods fall
        // back to the VeChain whitelabel cross-app flow via
        // useLoginWithVeChain({ intent }). Email and passkey have no
        // fallback (VeChain has email disabled in its Privy app), so they
        // stay hidden. `more` still renders -- the sub-view gracefully
        // degrades to whatever's available (dapp-kit wallet overflow +
        // the "Continue with VeChain" cross-app picker entry).
        return {
            ...baseConfig,
            showEmailLogin: false,
            showPasskey: false,
        };
    }

    if (isVeChainApp) {
        // VeChain app (using self hosted privy)
        return {
            ...baseConfig,
            isOfficialVeChainApp: true,
        };
    }

    // Self hosted privy app
    return {
        ...baseConfig,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/modals/useNotificationsModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useNotificationsModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('notifications', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const NotificationsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useProfileModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useProfileModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('profile', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const ProfileModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/modals/useReceiveModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useReceiveModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('receive-token', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const ReceiveModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/modals/useSendTokenModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useSendTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal(
            {
                type: 'send-token',
                props: {
                    setCurrentContent: setAccountModalContent,
                },
            },
            options,
        );
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const SendTokenModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useSettingsModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useSettingsModal = () => {
    const { openAccountModal, closeAccountModal, isAccountModalOpen } =
        useModal();

    const open = (options?: AccountModalOptions) => {
        openAccountModal('settings', options);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const SettingsModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useSwapTokenModal.tsx`

````tsx
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import type { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { ReactNode } from 'react';

type SwapTokenModalOptions = {
    fromTokenAddress?: string;
    toTokenAddress?: string;
    isolatedView?: boolean;
};

export const useSwapTokenModal = () => {
    const {
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
        setAccountModalContent,
    } = useModal();

    const open = (options?: SwapTokenModalOptions) => {
        const props: any = {
            setCurrentContent: setAccountModalContent,
            fromTokenAddress: options?.fromTokenAddress,
            toTokenAddress: options?.toTokenAddress,
        };
        const content: AccountModalContentTypes = {
            type: 'swap-token',
            props,
        };
        const accountOptions: AccountModalOptions = {
            isolatedView: options?.isolatedView,
        };
        openAccountModal(content, accountOptions);
    };

    const close = () => {
        closeAccountModal();
    };

    return {
        open,
        close,
        isOpen: isAccountModalOpen,
    };
};

export const SwapTokenModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useTransactionModal.tsx`

````tsx
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useTransactionModal = () => {
    const {
        openTransactionModal: open,
        closeTransactionModal: close,
        isTransactionModalOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const TransactionModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useTransactionToast.tsx`

````tsx
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useTransactionToast = () => {
    const {
        openTransactionToast: open,
        closeTransactionToast: close,
        isTransactionToastOpen: isOpen,
    } = useModal();
    return { open, close, isOpen };
};

export const TransactionToastProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useUpgradeSmartAccountModal.tsx`

````tsx
import { UpgradeSmartAccountModalStyle } from '@/components';
import { useModal } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useUpgradeSmartAccountModal = (
    style?: UpgradeSmartAccountModalStyle,
) => {
    const {
        openUpgradeSmartAccountModal: open,
        closeUpgradeSmartAccountModal: close,
        isUpgradeSmartAccountModalOpen: isOpen,
    } = useModal();
    return { open: () => open(style), close, isOpen };
};

export const UpgradeSmartAccountModalProvider = ({
    children,
}: {
    children: ReactNode;
}) => <>{children}</>;
````

## Source: `packages/vechain-kit/src/hooks/modals/useWalletModal.tsx`

````tsx
import { useWallet } from '@/hooks';
import { useModal, AccountModalOptions } from '@/providers/ModalProvider';
import { ReactNode } from 'react';

export const useWalletModal = () => {
    const { connection } = useWallet();
    const {
        openConnectModal,
        closeConnectModal,
        isConnectModalOpen,
        openAccountModal,
        closeAccountModal,
        isAccountModalOpen,
    } = useModal();

    const open = (options?: AccountModalOptions) => {
        if (connection.isConnected) {
            openAccountModal(undefined, options);
        } else {
            openConnectModal();
        }
    };

    const close = () => {
        if (isAccountModalOpen) {
            closeAccountModal();
        }
        if (isConnectModalOpen) {
            closeConnectModal();
        }
    };

    const isOpen = isConnectModalOpen || isAccountModalOpen;

    return { open, close, isOpen };
};

export const WalletModalProvider = ({ children }: { children: ReactNode }) => (
    <>{children}</>
);
````

## Source: `packages/vechain-kit/src/hooks/notifications/types.ts`

````typescript
import { AccountModalContentTypes } from '@/components';

export type NotificationAction = {
    label: string;
    content: AccountModalContentTypes;
};

export type Notification = {
    id: string;
    title: string;
    description: string;
    timestamp: number;
    status: 'success' | 'info' | 'warning' | 'error';
    isRead: boolean;
    action?: NotificationAction;
};
````

## Source: `packages/vechain-kit/src/hooks/notifications/useNotificationAlerts.ts`

````typescript
import { useEffect } from 'react';
import {
    useWallet,
    useNotifications,
    useUpgradeRequiredForAccount,
} from '@/hooks';
import { useTranslation } from 'react-i18next';

export const DEFAULT_NOTIFICATIONS = [
    {
        id: 'welcome',
        title: 'Welcome to the VeChain',
        description:
            'Welcome! Here you can manage your wallet, send tokens, and interact with the VeChain blockchain and its applications.',
        timestamp: Date.now(),
        status: 'success' as const,
        isRead: false,
    },
];

export const useNotificationAlerts = () => {
    const { t } = useTranslation();
    const { account, connection, smartAccount } = useWallet();
    const { addNotification, getNotifications } = useNotifications();

    // Check if smart account needs upgrade to version 3 (only for deployed smart accounts)
    const { data: upgradeRequired } = useUpgradeRequiredForAccount(
        smartAccount?.address ?? '',
        3, // Target version
    );

    // Smart Account Upgrade Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        const upgradeNotificationId = `smart_account_upgrade_${account.address.toLowerCase()}`;
        const hasUpgradeNotification = notifications.some(
            (n) => n.id === upgradeNotificationId,
        );

        // Show notification if upgrade is required and not already shown
        if (!hasUpgradeNotification && upgradeRequired) {
            addNotification({
                id: upgradeNotificationId,
                title: t('Account Upgrade Required'),
                description: t(
                    "A new upgrade is available for your smart account. Please head over to the 'Access and Security' section to upgrade it.",
                ),
                status: 'warning',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address, upgradeRequired]);

    // Smart Account Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        const hasSmartAccountNotification = notifications.some(
            (n) => n.id === `smart_account_${account.address.toLowerCase()}`,
        );

        if (!hasSmartAccountNotification) {
            addNotification({
                id: `smart_account_${account.address.toLowerCase()}`,
                title: t('Smart Account detected'),
                description: t(
                    'You have an active smart account associated to this wallet. It has been set as your main identity.',
                ),
                status: 'info',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address]);

    // Multiclause Support Alert
    useEffect(() => {
        if (!connection.isConnectedWithPrivy || !account?.address) return;

        const notifications = getNotifications();
        // Only shows the new "now supported" notification to users who have seen the warning
        const hasMulticlauseWarning = notifications.some(
            (n) =>
                n.id === `multiclause_warning_${account.address.toLowerCase()}`,
        );
        const hasMulticlauseSupport = notifications.some(
            (n) =>
                n.id === `multiclause_support_${account.address.toLowerCase()}`,
        );

        // Only show the support notification if they had the warning before
        // and don't already have the support notification
        if (hasMulticlauseWarning && !hasMulticlauseSupport) {
            addNotification({
                id: `multiclause_support_${account.address.toLowerCase()}`,
                title: t('Multiclause Transactions Are Now Supported'),
                description: t(
                    'Good news! Multiclause transactions are now fully supported for smart accounts. You can now enjoy a better user experience, lower gas costs, and enchanced security.',
                ),
                status: 'info',
            });
        }
    }, [connection.isConnectedWithPrivy, account?.address]);

    // Add more notification alerts here
    // Example:
    // useEffect(() => {
    //     if (!someCondition) return;
    //     const notifications = getNotifications();
    //     if (!notifications.some(n => n.id === 'some_notification_id')) {
    //         addNotification({
    //             id: 'some_notification_id',
    //             title: t('Some Title'),
    //             description: t('Some Description'),
    //             status: 'info'
    //         });
    //     }
    // }, [someCondition]);
};
````

## Source: `packages/vechain-kit/src/hooks/notifications/useNotifications.ts`

````typescript
import { useCallback, useEffect } from 'react';
import { useWallet } from '@/hooks';
import { Notification } from './types';
import { DEFAULT_NOTIFICATIONS } from './useNotificationAlerts';
import { getLocalStorageItem, setLocalStorageItem, isBrowser } from '@/utils/ssrUtils';

export const useNotifications = () => {
    const { account } = useWallet();

    const getStorageKeys = useCallback((address?: string) => {
        const normalizedAddress = address?.toLowerCase();
        return {
            notifications: `vechain_kit_notifications_${normalizedAddress}`,
            archived: `vechain_kit_archived_notifications_${normalizedAddress}`,
            initialized: `vechain_kit_notifications_initialized_${normalizedAddress}`,
        };
    }, []);

    const initializeNotifications = useCallback(() => {
        if (!account?.address || !isBrowser()) return;

        const keys = getStorageKeys(account.address);
        const isInitialized = getLocalStorageItem(keys.initialized);

        if (!isInitialized) {
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify(DEFAULT_NOTIFICATIONS),
            );
            setLocalStorageItem(keys.initialized, 'true');
        }
    }, [account?.address, getStorageKeys]);

    useEffect(() => {
        initializeNotifications();
    }, [initializeNotifications]);

    const getNotifications = useCallback((): Notification[] => {
        if (!account?.address || !isBrowser()) return [];

        const keys = getStorageKeys(account.address);
        const cached = getLocalStorageItem(keys.notifications);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const getArchivedNotifications = useCallback((): Notification[] => {
        if (!account?.address || !isBrowser()) return [];

        const keys = getStorageKeys(account.address);
        const cached = getLocalStorageItem(keys.archived);
        if (!cached) return [];
        return JSON.parse(cached) as Notification[];
    }, [account?.address, getStorageKeys]);

    const addNotification = useCallback(
        (notification: Omit<Notification, 'timestamp' | 'isRead'>) => {
            if (!account?.address || !isBrowser()) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const archivedCache = getLocalStorageItem(keys.archived);
            const archivedNotifications = archivedCache ? JSON.parse(archivedCache) : [];

            // Check if notification exists in either active or archived notifications
            const isDuplicate = [
                ...notifications,
                ...archivedNotifications,
            ].some((n) => n.title === notification.title);
            if (isDuplicate) return;

            const newNotification: Notification = {
                ...notification,
                id: notification.id || Math.random().toString(36).substring(7),
                timestamp: Date.now(),
                isRead: false,
            };
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify([newNotification, ...notifications]),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    const deleteNotification = useCallback(
        (notificationId: string) => {
            if (!account?.address || !isBrowser()) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId,
            );
            setLocalStorageItem(
                keys.notifications,
                JSON.stringify(updatedNotifications),
            );
        },
        [account?.address, getNotifications, getStorageKeys],
    );

    const clearAllNotifications = useCallback(() => {
        if (!account?.address || !isBrowser()) return;

        const keys = getStorageKeys(account.address);
        const notifications = getNotifications();
        setLocalStorageItem(
            keys.archived,
            JSON.stringify([...getArchivedNotifications(), ...notifications]),
        );
        setLocalStorageItem(keys.notifications, JSON.stringify([]));
    }, [
        account?.address,
        getNotifications,
        getArchivedNotifications,
        getStorageKeys,
    ]);

    const markAsRead = useCallback(
        (notificationId: string) => {
            if (!account?.address || !isBrowser()) return;

            const keys = getStorageKeys(account.address);
            const notifications = getNotifications();
            const archivedNotifications = getArchivedNotifications();

            // Find the notification to archive
            const notificationToArchive = notifications.find(
                (n) => n.id === notificationId,
            );

            // Update notifications list - remove the archived one
            const updatedNotifications = notifications.filter(
                (n) => n.id !== notificationId,
            );

            // Add to archived list if found
            if (notificationToArchive) {
                const updatedArchivedNotifications = [
                    { ...notificationToArchive, isRead: true },
                    ...archivedNotifications,
                ];

                // Update both lists in localStorage
                setLocalStorageItem(
                    keys.notifications,
                    JSON.stringify(updatedNotifications),
                );
                setLocalStorageItem(
                    keys.archived,
                    JSON.stringify(updatedArchivedNotifications),
                );
            }
        },
        [
            account?.address,
            getNotifications,
            getArchivedNotifications,
            getStorageKeys,
        ],
    );

    return {
        getNotifications,
        getArchivedNotifications,
        addNotification,
        clearAllNotifications,
        markAsRead,
        deleteNotification,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useCurrency.ts`

````typescript
import { useEffect } from 'react';
import { useVeChainKitConfig } from '@/providers';
import { CURRENCY } from '@/types';
import { setLocalStorageItem } from '@/utils/ssrUtils';

const STORAGE_KEY = 'vechain_kit_currency';
const allCurrencies: CURRENCY[] = ['usd', 'eur', 'gbp'];

/**
 * Hook for managing currency preferences
 *
 * Note: This hook now uses the currency from VeChainKit context.
 * For setting currency, use the setCurrency function from useCurrentCurrency() hook instead.
 */
export const useCurrency = () => {
    const { currentCurrency, setCurrency } = useVeChainKitConfig();

    // Sync currency changes to localStorage
    useEffect(() => {
        setLocalStorageItem(STORAGE_KEY, currentCurrency);
    }, [currentCurrency]);

    const changeCurrency = (newCurrency: CURRENCY) => {
        if (!allCurrencies.includes(newCurrency)) {
            console.error(`Invalid currency: ${newCurrency}`);
            return;
        }
        setCurrency(newCurrency);
    };

    return {
        currentCurrency,
        allCurrencies,
        changeCurrency,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useCurrentCurrency.ts`

````typescript
import { useVeChainKitConfig } from '@/providers';

/**
 * Hook to get and set the current currency in VeChainKit
 *
 * This hook provides the current runtime currency value and a function to change it.
 * Changes made via this hook will sync to VeChainKit settings and trigger callbacks.
 *
 * @returns Object with:
 * - `currentCurrency`: Current currency code ('usd', 'eur', or 'gbp')
 * - `setCurrency`: Function to change the currency
 *
 * @example
 * ```tsx
 * const { currentCurrency, setCurrency } = useCurrentCurrency();
 *
 * return (
 *   <select value={currentCurrency} onChange={(e) => setCurrency(e.target.value as CURRENCY)}>
 *     <option value="usd">USD ($)</option>
 *     <option value="eur">EUR (€)</option>
 *     <option value="gbp">GBP (£)</option>
 *   </select>
 * );
 * ```
 */
export const useCurrentCurrency = () => {
    const { currentCurrency, setCurrency } = useVeChainKitConfig();
    return {
        currentCurrency,
        setCurrency,
    };
};
````

## Source: `packages/vechain-kit/src/hooks/utils/useCurrentLanguage.ts`

````typescript
import { useVeChainKitConfig } from '@/providers';

/**
 * Hook to get and set the current language in VeChainKit
 *
 * This hook provides the current runtime language value and a function to change it.
 * Changes made via this hook will sync to VeChainKit settings and trigger callbacks.
 *
 * @returns Object with:
 * - `currentLanguage`: Current language code (e.g., 'en', 'fr', 'de')
 * - `setLanguage`: Function to change the language
 *
 * @example
 * ```tsx
 * const { currentLanguage, setLanguage } = useCurrentLanguage();
 *
 * return (
 *   <select value={currentLanguage} onChange={(e) => setLanguage(e.target.value)}>
 *     <option value="en">English</option>
 *     <option value="fr">Français</option>
 *   </select>
 * );
 * ```
 */
export const useCurrentLanguage = () => {
    const { currentLanguage, setLanguage } = useVeChainKitConfig();
    return {
        currentLanguage,
        setLanguage,
    };
};
````

## Source: `packages/vechain-kit/src/utils/i18n.ts`

````typescript
import { resources } from '../../i18n';

export const initializeI18n = (i18nInstance: any) => {
    const languages = Object.keys(resources);

    languages.forEach((lang) => {
        const hasNamespace = i18nInstance.hasResourceBundle(
            lang,
            'translation',
        );

        if (!hasNamespace) {
            i18nInstance.addResourceBundle(
                lang,
                'translation',
                resources[lang as keyof typeof resources].translation,
                true,
                true,
            );
        } else {
            i18nInstance.addResourceBundle(
                lang,
                'translation',
                resources[lang as keyof typeof resources].translation,
                true,
                true,
            );
        }
    });
};
````
