'use client';

import { SimpleGrid } from '@chakra-ui/react';
import {
    useChooseNameModal,
    useExploreEcosystemModal,
    useFAQModal,
    useNotificationsModal,
    useProfileModal,
    useReceiveModal,
    useSendTokenModal,
    useSettingsModal,
    useSwapTokenModal,
    useUpgradeSmartAccountModal,
    useWallet,
    useWalletModal,
} from '@vechain/vechain-kit';
import {
    LuArrowDownToLine,
    LuArrowLeftRight,
    LuBell,
    LuCircleHelp,
    LuRefreshCw,
    LuSettings,
    LuSquareUser,
    LuUser,
    LuUserCog,
    LuWallet,
} from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { ModalCard } from './ModalCard';

export function ModalCatalog() {
    const { account } = useWallet();
    const { t } = useTranslation();

    const { open: openWalletModal } = useWalletModal();
    const { open: openProfileModal } = useProfileModal();
    const { open: openSettingsModal } = useSettingsModal();
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openSwapTokenModal } = useSwapTokenModal();
    const { open: openReceiveModal } = useReceiveModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const cards = [
        {
            title: t('Wallet'),
            description: t('Manage your wallet and your assets'),
            icon: LuWallet,
            hook: 'useWalletModal',
            onClick: () => openWalletModal({ isolatedView: true }),
        },
        {
            title: t('Profile'),
            description: t(
                'Show and customize the user profile: avatar, display name, bio and more.',
            ),
            icon: LuUser,
            hook: 'useProfileModal',
            onClick: () => openProfileModal({ isolatedView: true }),
        },
        {
            title: t('Settings'),
            description: t('Manage your settings and your preferences'),
            icon: LuSettings,
            hook: 'useSettingsModal',
            onClick: () => openSettingsModal({ isolatedView: true }),
        },
        {
            title: t('Set VET Domain'),
            description: t(
                'Replace your complex address with a memorable .vet domain name',
            ),
            icon: LuSquareUser,
            hook: 'useChooseNameModal',
            highlight: !!account && !account.domain,
            onClick: () => openChooseNameModal({ isolatedView: true }),
        },
        {
            title: t('Transfer Assets'),
            description: t(
                'Send and receive VET, VTHO, and other tokens seamlessly',
            ),
            icon: LuArrowLeftRight,
            hook: 'useSendTokenModal',
            onClick: () => openSendTokenModal({ isolatedView: true }),
        },
        {
            title: t('Swap Tokens'),
            description: t('Swap between tokens with best available rates'),
            icon: LuArrowLeftRight,
            hook: 'useSwapTokenModal',
            onClick: () => openSwapTokenModal({ isolatedView: true }),
        },
        {
            title: t('Receive Assets'),
            description: t('Receive VET, VTHO, and other tokens from anyone'),
            icon: LuArrowDownToLine,
            hook: 'useReceiveModal',
            onClick: () => openReceiveModal({ isolatedView: true }),
        },
        {
            title: t('Explore Ecosystem'),
            description: t(
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            ),
            icon: LuUserCog,
            hook: 'useExploreEcosystemModal',
            onClick: () => openExploreEcosystemModal({ isolatedView: true }),
        },
        {
            title: t('Notifications'),
            description: t(
                'Stay updated with the kit or ecosystem updates, and account alerts',
            ),
            icon: LuBell,
            hook: 'useNotificationsModal',
            onClick: () => openNotificationsModal({ isolatedView: true }),
        },
        {
            title: t('FAQ'),
            description: t('Find answers to common questions about VeChain'),
            icon: LuCircleHelp,
            hook: 'useFAQModal',
            onClick: () => openFAQModal({ isolatedView: true }),
        },
        {
            title: t('Upgrade Smart Account'),
            description: t(
                'Upgrade your smart account to the latest version',
            ),
            icon: LuRefreshCw,
            hook: 'useUpgradeSmartAccountModal',
            onClick: openUpgradeSmartAccountModal,
        },
    ];

    return (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {cards.map((c) => (
                <ModalCard key={c.title} {...c} />
            ))}
        </SimpleGrid>
    );
}
