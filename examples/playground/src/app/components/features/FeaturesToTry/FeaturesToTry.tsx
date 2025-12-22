'use client';

import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import {
    LuSquareUser,
    LuArrowLeftRight,
    LuUserCog,
    LuBell,
    LuCircleHelp,
} from 'react-icons/lu';
import {
    useUpgradeSmartAccountModal,
    useWallet,
    useSwapTokenModal,
} from '@vechain/vechain-kit';
import {
    useChooseNameModal,
    useSendTokenModal,
    useExploreEcosystemModal,
    useNotificationsModal,
    useProfileModal,
    useFAQModal,
    useReceiveModal,
    useWalletModal,
    useSettingsModal,
} from '@vechain/vechain-kit';
import { FeatureCard } from './FeatureCard';
import { GithubCard } from './GithubCard';
import { LanguageCard } from './LanguageCard';
import { ThemeCard } from './ThemeCard';
import {
    LuUser,
    LuArrowDownToLine,
    LuRefreshCw,
    LuSettings,
    LuWallet,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export function FeaturesToTry() {
    const { account } = useWallet();
    const { t } = useTranslation();

    // Use the modal hooks
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openProfileModal } = useProfileModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();
    const { open: openReceiveModal } = useReceiveModal();
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();
    const { open: openSwapTokenModal } = useSwapTokenModal();
    const { open: openWalletModal } = useWalletModal();
    const { open: openSettingsModal } = useSettingsModal();

    const features = [
        {
            title: t('Wallet'),
            description: t('Manage your wallet and your assets'),
            icon: LuWallet,
            content: () => openWalletModal({ isolatedView: true }),
        },
        {
            title: t('Profile'),
            description: t('Manage your profile and customize it'),
            icon: LuUser,
            content: () => openProfileModal({ isolatedView: true }),
        },
        {
            title: t('Settings'),
            description: t('Manage your settings and your preferences'),
            icon: LuSettings,
            content: () => openSettingsModal({ isolatedView: true }),
        },
        {
            title: t('Set VET Domain'),
            description: t(
                'Replace your complex address with a memorable .vet domain name',
            ),
            icon: LuSquareUser,
            highlight: !account?.domain,
            content: () => openChooseNameModal({ isolatedView: true }),
        },
        {
            title: t('Customize Profile'),
            description: t(
                'Show the user his profile and allow them to customize it with a profile image, display name, bio and more to enhance their identity across VeChain applications.',
            ),
            icon: LuUser,
            content: () => openProfileModal({ isolatedView: true }),
        },
        {
            title: t('Transfer Assets'),
            description: t(
                'Send and receive VET, VTHO, and other tokens seamlessly',
            ),
            icon: LuArrowLeftRight,
            content: () => openSendTokenModal({ isolatedView: true }),
        },
        {
            title: t('Swap Tokens'),
            description: t('Swap between tokens with best available rates'),
            icon: LuArrowLeftRight,
            content: () => openSwapTokenModal({ isolatedView: true }),
        },
        {
            title: t('Receive Assets'),
            description: t('Receive VET, VTHO, and other tokens from anyone'),
            icon: LuArrowDownToLine,
            content: () => openReceiveModal({ isolatedView: true }),
        },
        {
            title: t('Explore Ecosystem'),
            description: t(
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            ),
            icon: LuUserCog,
            content: () => openExploreEcosystemModal({ isolatedView: true }),
        },
        {
            title: t('Notifications'),
            description: t(
                'Stay updated with the kit or ecosystem updates, and account alerts',
            ),
            icon: LuBell,
            content: () => openNotificationsModal({ isolatedView: true }),
        },
        {
            title: t('FAQ'),
            description: t('Find answers to common questions about VeChain'),
            icon: LuCircleHelp,
            content: () => openFAQModal({ isolatedView: true }),
        },
        {
            title: t('Upgrade Smart Account'),
            description: t('Upgrade your smart account to the latest version'),
            icon: LuRefreshCw,
            content: openUpgradeSmartAccountModal,
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
                {t('Features')}
            </Text>
            <Text fontSize="sm" opacity={0.5}>
                {t(
                    'The following features are available for your users and for you both accessible by using the VeChain Kit main modal or by adding custom call to action buttons to your app and opening the content you need on demand. Try them out by clicking on the cards below.',
                )}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {features.map((feature, index) => (
                    <FeatureCard
                        key={feature.title}
                        {...feature}
                        showHint={index === 0}
                    />
                ))}
                <LanguageCard />
                <ThemeCard />
                <GithubCard />
            </SimpleGrid>
        </VStack>
    );
}
