'use client';

import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { FaRegAddressCard } from 'react-icons/fa';
import {
    RiExchangeLine,
    RiShieldKeyholeLine,
    RiUserSettingsLine,
} from 'react-icons/ri';
import { IoMdNotifications } from 'react-icons/io';
import { BsQuestionCircle } from 'react-icons/bs';
import { useWallet } from '@vechain/vechain-kit';
import {
    useChooseNameModal,
    useSendTokenModal,
    useEmbeddedWalletSettingsModal,
    useExploreEcosystemModal,
    useNotificationsModal,
    useAccountCustomizationModal,
    useFAQModal,
} from '@vechain/vechain-kit';
import { FeatureCard } from './FeatureCard';
import { GithubCard } from './GithubCard';
import { LanguageCard } from './LanguageCard';
import { ThemeCard } from './ThemeCard';
import { CgProfile } from 'react-icons/cg';

export function FeaturesToTry() {
    const { account } = useWallet();

    // Use the modal hooks
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openAccountCustomizationModal } =
        useAccountCustomizationModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openEmbeddedWalletSettingsModal } =
        useEmbeddedWalletSettingsModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();

    const features = [
        {
            title: 'Set VET Domain',
            description:
                'Replace your complex address with a memorable .vet domain name',
            icon: FaRegAddressCard,
            highlight: !account?.domain,
            link: '#',
            content: openChooseNameModal,
        },
        {
            title: 'Set Profile Image',
            description:
                'Customize your account with a profile image to enhance your identity across VeChain applications.',
            icon: CgProfile,
            highlight: !account?.domain,
            link: '#',
            content: openAccountCustomizationModal,
        },
        {
            title: 'Transfer Assets',
            description:
                'Send and receive VET, VTHO, and other tokens seamlessly',
            icon: RiExchangeLine,
            link: '#',
            content: openSendTokenModal,
        },
        {
            title: 'Backup & Secure',
            description:
                'Secure your embedded wallet with proper backup procedures and update your login methods.',
            icon: RiShieldKeyholeLine,
            link: '#',
            content: openEmbeddedWalletSettingsModal,
        },
        {
            title: 'Explore Ecosystem',
            description:
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            icon: RiUserSettingsLine,
            link: 'https://vechain.github.io/smart-accounts-factory/',
            content: openExploreEcosystemModal,
        },
        {
            title: 'Notifications',
            description:
                'Stay updated with the kit or ecosystem updates, and account alerts',
            icon: IoMdNotifications,
            link: '#',
            content: openNotificationsModal,
        },
        {
            title: 'FAQ',
            description: 'Find answers to common questions about VeChain',
            icon: BsQuestionCircle,
            link: '#',
            content: openFAQModal,
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
                Features
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {features.map((feature) => (
                    <FeatureCard key={feature.title} {...feature} />
                ))}
                <LanguageCard />
                <ThemeCard />
                <GithubCard />
            </SimpleGrid>
        </VStack>
    );
}
