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
import { useUpgradeSmartAccountModal, useWallet } from '@vechain/vechain-kit';
import {
    useChooseNameModal,
    useSendTokenModal,
    useAccessAndSecurityModal,
    useExploreEcosystemModal,
    useNotificationsModal,
    useProfileModal,
    useFAQModal,
    useReceiveModal,
} from '@vechain/vechain-kit';
import { FeatureCard } from './FeatureCard';
import { GithubCard } from './GithubCard';
import { LanguageCard } from './LanguageCard';
import { ThemeCard } from './ThemeCard';
import { CgProfile } from 'react-icons/cg';
import { FaRegArrowAltCircleDown } from 'react-icons/fa';
import { MdOutlineBrowserUpdated } from 'react-icons/md';

export function FeaturesToTry() {
    const { account, connection } = useWallet();

    // Use the modal hooks
    const { open: openChooseNameModal } = useChooseNameModal();
    const { open: openProfileModal } = useProfileModal();
    const { open: openSendTokenModal } = useSendTokenModal();
    const { open: openAccessAndSecurityModal } = useAccessAndSecurityModal();
    const { open: openExploreEcosystemModal } = useExploreEcosystemModal();
    const { open: openNotificationsModal } = useNotificationsModal();
    const { open: openFAQModal } = useFAQModal();
    const { open: openReceiveModal } = useReceiveModal();
    const { open: openUpgradeSmartAccountModal } =
        useUpgradeSmartAccountModal();

    const features = [
        {
            title: 'Set VET Domain',
            description:
                'Replace your complex address with a memorable .vet domain name',
            icon: FaRegAddressCard,
            highlight: !account?.domain,
            content: openChooseNameModal,
        },
        {
            title: 'Customize Profile',
            description:
                'Show the user his profile and allow them to customize it with a profile image, display name, bio and more to enhance their identity across VeChain applications.',
            icon: CgProfile,
            content: openProfileModal,
        },
        {
            title: 'Transfer Assets',
            description:
                'Send and receive VET, VTHO, and other tokens seamlessly',
            icon: RiExchangeLine,
            content: openSendTokenModal,
        },
        {
            title: 'Receive Assets',
            description: 'Receive VET, VTHO, and other tokens from anyone',
            icon: FaRegArrowAltCircleDown,
            content: openReceiveModal,
        },
        {
            title: 'Access & Security',
            description:
                'Allow the user to secure his embedded wallet with proper backup procedures, update his login methods, add MFA and more.',
            icon: RiShieldKeyholeLine,
            content: openAccessAndSecurityModal,
            disabled: !connection.isConnectedWithPrivy,
        },
        {
            title: 'Explore Ecosystem',
            description:
                'Explore other apps built on VeChain, and add shortcuts for faster access.',
            icon: RiUserSettingsLine,
            content: openExploreEcosystemModal,
        },
        {
            title: 'Notifications',
            description:
                'Stay updated with the kit or ecosystem updates, and account alerts',
            icon: IoMdNotifications,
            content: openNotificationsModal,
        },
        {
            title: 'FAQ',
            description: 'Find answers to common questions about VeChain',
            icon: BsQuestionCircle,
            content: openFAQModal,
        },
        {
            title: 'Upgrade Smart Account',
            description: 'Upgrade your smart account to the latest version',
            icon: MdOutlineBrowserUpdated,
            content: openUpgradeSmartAccountModal,
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
                Features
            </Text>
            <Text fontSize="sm" opacity={0.5}>
                The following features are available for your users and for you
                both accessible by using the VeChain Kit main modal or by adding
                custom call to action buttons to your app and opening the
                content you need on demand. Try them out by clicking on the
                cards below.
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
