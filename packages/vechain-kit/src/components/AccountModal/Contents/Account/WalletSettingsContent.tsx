import {
    Image,
    ModalBody,
    ModalCloseButton,
    VStack,
    ModalFooter,
    ModalHeader,
    useColorMode,
    Text,
    Divider,
    Link,
    Icon,
    Button,
    HStack,
} from '@chakra-ui/react';
import { usePrivy, useWallet } from '@/hooks';
import { GiHouseKeys } from 'react-icons/gi';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { IoIosFingerPrint } from 'react-icons/io';
import { ActionButton } from '@/components';
import {
    AddressDisplay,
    ModalBackButton,
    StickyHeaderContainer,
    FadeInViewFromBottom,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers/VeChainKit';
import { AccountModalContentTypes } from '../../Types';
import { FaRegAddressCard } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { IoOpenOutline } from 'react-icons/io5';
import { useState } from 'react';
import { PrivyLogo, VechainLogoHorizontal } from '@/assets';
import { TbAmpersand } from 'react-icons/tb';

type Props = {
    setCurrentContent: (content: AccountModalContentTypes) => void;
    onLogoutSuccess: () => void;
};

export const WalletSettingsContent = ({
    setCurrentContent,
    onLogoutSuccess,
}: Props) => {
    const { exportWallet, linkPasskey } = usePrivy();
    const { privy } = useVeChainKitConfig();

    const { connectedWallet, connection, disconnect } = useWallet();

    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isExpanded, setIsExpanded] = useState(false);

    const hasExistingDomain = !!connectedWallet.domain;

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Wallet'}
                </ModalHeader>

                <ModalBackButton
                    onClick={() => {
                        if (
                            connection.isConnectedWithSocialLogin ||
                            connection.isConnectedWithCrossApp
                        ) {
                            setCurrentContent('accounts');
                        } else {
                            setCurrentContent('main');
                        }
                    }}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody w={'full'}>
                    <VStack justify={'center'}>
                        <Image
                            src={connectedWallet.image}
                            maxW={'70px'}
                            borderRadius="50%"
                        />
                        <AddressDisplay wallet={connectedWallet} />
                    </VStack>

                    <VStack align="stretch" textAlign={'center'} mt={5}>
                        {connection.isConnectedWithCrossApp && (
                            <Text
                                fontSize={'sm'}
                                opacity={0.5}
                                textAlign={'center'}
                            >
                                This is your main wallet and identity. Please be
                                sure to keep it safe and backed up. Go to
                                VeChain to manage your wallet and security
                                settings.
                            </Text>
                        )}

                        {connection.isConnectedWithPrivy && (
                            <VStack mt={2} opacity={0.5}>
                                <Text fontSize={'sm'} textAlign={'center'}>
                                    Secured by
                                </Text>
                                <HStack justify={'center'}>
                                    <PrivyLogo
                                        onClick={() => {
                                            window.open(
                                                'https://www.privy.io/',
                                                '_blank',
                                            );
                                        }}
                                        _hover={{
                                            cursor: 'pointer',
                                        }}
                                        isDark={isDark}
                                        w={'50px'}
                                    />
                                    <Icon as={TbAmpersand} ml={2} />
                                    <VechainLogoHorizontal
                                        _hover={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                            window.open(
                                                'https://www.vechain.org/',
                                                '_blank',
                                            );
                                        }}
                                        isDark={isDark}
                                        w={'69px'}
                                    />
                                </HStack>
                            </VStack>
                        )}

                        {connection.isConnectedWithSocialLogin && (
                            <>
                                {isExpanded && (
                                    <FadeInViewFromBottom>
                                        {connection.isConnectedWithSocialLogin && (
                                            <>
                                                <Text
                                                    fontSize={'sm'}
                                                    opacity={0.5}
                                                >
                                                    You're using an Embedded
                                                    Wallet created and secured
                                                    by Privy, accessable though
                                                    your preffered login
                                                    methods, ensuring a seamless
                                                    VeChain experience.
                                                </Text>

                                                <Text
                                                    fontSize={'sm'}
                                                    opacity={0.5}
                                                >
                                                    We highly recommend
                                                    exporting your private key
                                                    to back up your wallet. This
                                                    ensures you can restore it
                                                    if needed or transfer it to
                                                    self-custody using{' '}
                                                    <Link
                                                        href="https://www.veworld.net/"
                                                        isExternal
                                                        color="gray.500"
                                                        fontSize={'14px'}
                                                        textDecoration={
                                                            'underline'
                                                        }
                                                    >
                                                        VeWorld Wallet{' '}
                                                        <Icon
                                                            ml={1}
                                                            as={IoOpenOutline}
                                                        />
                                                    </Link>
                                                    .
                                                </Text>
                                            </>
                                        )}
                                    </FadeInViewFromBottom>
                                )}
                                <Link
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    color="gray.500"
                                    fontSize={'sm'}
                                    transition={'all 0.2s'}
                                    _hover={{ textDecoration: 'none' }}
                                >
                                    {isExpanded ? 'Read less' : 'Read more'}
                                </Link>
                            </>
                        )}
                    </VStack>

                    <VStack mt={5} w={'full'} spacing={5}>
                        {connection.isConnectedWithSocialLogin && (
                            <>
                                <ActionButton
                                    title="Backup your wallet"
                                    description="Upgrade wallet in Self-Custody by storing your Recovery Phrase and seamlessly importing it into a wallet provider."
                                    onClick={() => {
                                        exportWallet();
                                    }}
                                    hide={connection.isConnectedWithCrossApp}
                                    leftIcon={GiHouseKeys}
                                    rightIcon={MdOutlineNavigateNext}
                                />

                                {privy?.allowPasskeyLinking && (
                                    <ActionButton
                                        title="Add passkey"
                                        description="Add a passkey to your account for future logins. If enabled, passkeys will always be available as a login method."
                                        onClick={() => {
                                            linkPasskey();
                                        }}
                                        hide={
                                            connection.isConnectedWithCrossApp
                                        }
                                        leftIcon={IoIosFingerPrint}
                                        rightIcon={MdOutlineNavigateNext}
                                    />
                                )}
                            </>
                        )}
                        {connection.isConnectedWithDappKit && (
                            <ActionButton
                                title="Choose account name"
                                description="Give a nickname to your wallet to easily identify it."
                                onClick={() => {
                                    if (hasExistingDomain) {
                                        setCurrentContent({
                                            type: 'choose-name-search',
                                            props: {
                                                name: '',
                                                setCurrentContent,
                                            },
                                        });
                                    } else {
                                        setCurrentContent('choose-name');
                                    }
                                }}
                                leftIcon={FaRegAddressCard}
                                rightIcon={MdOutlineNavigateNext}
                            />
                        )}

                        <Divider />

                        {/* <ActionButton
                            title="Disconnect"
                            description="Disconnect and sign out from your wallet and smart account"
                            onClick={() => {
                                disconnect();
                                onLogoutSuccess();
                            }}
                            leftIcon={RxExit}
                            backgroundColor={'#ff00000f'}
                            _hover={{
                                bg: '#ff00001a',
                            }}
                        /> */}
                        <Button
                            onClick={() => {
                                disconnect();
                                onLogoutSuccess();
                            }}
                            fontSize={'sm'}
                            fontWeight={'400'}
                            px={4}
                            width="full"
                            height="60px"
                            variant="solid"
                            borderRadius="xl"
                            leftIcon={<RxExit color="#888888" />}
                        >
                            Logout
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
