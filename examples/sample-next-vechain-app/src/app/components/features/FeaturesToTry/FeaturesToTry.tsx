'use client';

import {
    Box,
    VStack,
    Text,
    SimpleGrid,
    Icon,
    Link,
    useColorMode,
} from '@chakra-ui/react';
import { FaRegAddressCard } from 'react-icons/fa';
import {
    RiExchangeLine,
    RiShieldKeyholeLine,
    RiUserSettingsLine,
} from 'react-icons/ri';
import { IoMdNotifications } from 'react-icons/io';
import { BsGithub, BsQuestionCircle, BsGlobe } from 'react-icons/bs';
import { useWallet } from '@vechain/vechain-kit';
import {
    useChooseNameModal,
    useSendTokenModal,
    useEmbeddedWalletSettingsModal,
    useExploreEcosystemModal,
    useNotificationsModal,
    useFAQModal,
} from '@vechain/vechain-kit';

export function FeaturesToTry() {
    const { colorMode } = useColorMode();
    const { account } = useWallet();

    // Use the new modal hooks
    const { open: openChooseNameModal } = useChooseNameModal();
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
                'Secure your embedded wallet with proper backup procedures',
            icon: RiShieldKeyholeLine,
            link: '#',
            content: openEmbeddedWalletSettingsModal,
        },
        {
            title: 'Explore Ecosystem',
            description:
                'Leverage ecosystem accounts for unified identity across VeChain apps',
            icon: RiUserSettingsLine,
            link: 'https://vechain.github.io/smart-accounts-factory/',
            content: openExploreEcosystemModal,
        },
        {
            title: 'Notifications',
            description: 'Stay updated with transaction and account alerts',
            icon: IoMdNotifications,
            link: '#',
            content: openNotificationsModal,
        },
        {
            title: 'FAQ',
            description: 'Find answers to common questions about VeChain Kit',
            icon: BsQuestionCircle,
            link: '#',
            content: openFAQModal,
        },
        {
            title: 'Multilanguage support',
            description:
                'Customize the language of the login and account modal, creating a unique experience for your users',
            icon: BsGlobe,
            link: '#',
            content: openFAQModal,
        },
        {
            title: 'Feature Request',
            description:
                'Would you like to see something that is still missing? Requet the feature by opening an issue on our GitHub!',
            icon: BsGithub,
            link: 'https://github.com/vechain/vechain-kit/issues/new',
            content: () =>
                window.open(
                    'https://github.com/vechain/vechain-kit/issues/new',
                    '_blank',
                ),
        },
    ];

    return (
        <VStack spacing={6} align="stretch">
            <Text fontSize="xl" fontWeight="bold">
                Features to Try
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {features.map((feature) => (
                    <Link
                        key={feature.title}
                        href={feature.link}
                        isExternal={feature.link.startsWith('http')}
                        _hover={{ textDecoration: 'none' }}
                        onClick={(e) => {
                            e.preventDefault();
                            feature.content();
                        }}
                    >
                        <Box
                            p={4}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={
                                feature.highlight ? 'blue.500' : 'transparent'
                            }
                            bg={
                                feature.title === 'Feature Request'
                                    ? colorMode === 'light'
                                        ? 'green.50'
                                        : 'green.900'
                                    : colorMode === 'light'
                                    ? 'gray.50'
                                    : 'whiteAlpha.50'
                            }
                            _hover={{
                                transform: 'translateY(-2px)',
                                transition: 'transform 0.2s',
                                bg:
                                    feature.title === 'Feature Request'
                                        ? colorMode === 'light'
                                            ? 'green.100'
                                            : 'green.800'
                                        : colorMode === 'light'
                                        ? 'gray.100'
                                        : 'whiteAlpha.100',
                            }}
                            cursor="pointer"
                            height="full"
                        >
                            <VStack spacing={3} align="start">
                                <Icon
                                    as={feature.icon}
                                    boxSize={6}
                                    color={
                                        feature.title === 'Feature Request'
                                            ? colorMode === 'light'
                                                ? 'green.500'
                                                : 'green.300'
                                            : colorMode === 'light'
                                            ? 'blue.500'
                                            : 'blue.300'
                                    }
                                />
                                <Text fontWeight="bold">{feature.title}</Text>
                                <Text
                                    fontSize="sm"
                                    color={
                                        colorMode === 'light'
                                            ? 'gray.600'
                                            : 'gray.400'
                                    }
                                >
                                    {feature.description}
                                </Text>
                            </VStack>
                        </Box>
                    </Link>
                ))}
            </SimpleGrid>
        </VStack>
    );
}
