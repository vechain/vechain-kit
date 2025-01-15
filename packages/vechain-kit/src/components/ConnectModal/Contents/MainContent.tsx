import {
    Divider,
    Grid,
    GridItem,
    HStack,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import {
    useCrossAppAccounts,
    usePrivy,
    useLoginWithOAuth,
    useLoginWithPasskey,
} from '@privy-io/react-auth';
import { useVeChainKitConfig } from '@/providers';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
    VersionFooter,
} from '@/components/common';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FcGoogle } from 'react-icons/fc';
import { VechainLogo } from '@/assets';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectModalContents } from '../ConnectModal';
import { IoIosFingerPrint } from 'react-icons/io';
import { IoPlanet } from 'react-icons/io5';
import { useWalletModal } from '@vechain/dapp-kit-react';
import { VECHAIN_PRIVY_APP_ID } from '../../../utils';
import React, { useEffect } from 'react';
import { useWallet, useEcosystemModal } from '@/hooks';
// import { EmailLoginButton } from '../Components/EmailLoginButton';
import { ConnectionButton, EmailLoginButton } from '@/components';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContents>
    >;
    onClose: () => void;
};

export const MainContent = ({ onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    const { connection } = useWallet();
    const { loginModalUI } = useVeChainKitConfig();
    const { open: openEcosystemModal } = useEcosystemModal();
    // View more login
    const { login: viewMoreLogin } = usePrivy();

    // Open DappKit modal
    const { open: openDappKitModal } = useWalletModal();

    // Login with Vechain - Cross app account login
    const { loginWithCrossAppAccount } = useCrossAppAccounts();

    // Passkey login
    const { loginWithPasskey } = useLoginWithPasskey();
    const handleLoginWithPasskey = async () => {
        try {
            await loginWithPasskey();
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Login with Google
     * Logic for loggin in with OAuth with whitelabel privy
     */
    const {
        // When the OAuth provider redirects back to your app, the `loading`
        // value can be used to show an intermediate state while login completes.
        initOAuth,
    } = useLoginWithOAuth();

    useEffect(() => {
        if (connection.isConnected) {
            onClose();
        }
    }, [connection.isConnected]);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {'Log in or sign up'}
                </ModalHeader>
                <ModalCloseButton mt={'5px'} />
            </StickyHeaderContainer>

            {loginModalUI?.logo && (
                <FadeInViewFromBottom>
                    <HStack justify={'center'}>
                        <Image
                            src={loginModalUI.logo || '/images/favicon.png'}
                            maxW={'180px'}
                            maxH={'90px'}
                            m={10}
                            alt="logo"
                        />
                    </HStack>
                </FadeInViewFromBottom>
            )}

            <FadeInViewFromBottom>
                <ModalBody>
                    {loginModalUI?.description && (
                        <HStack
                            spacing={4}
                            w={'full'}
                            justify={'center'}
                            mb={'24px'}
                        >
                            <Text
                                color={isDark ? '#dfdfdd' : '#4d4d4d'}
                                fontSize={'sm'}
                                fontWeight={'200'}
                            >
                                {loginModalUI?.description}
                            </Text>
                        </HStack>
                    )}

                    <Stack spacing={4} w={'full'} align={'center'}>
                        <Grid
                            templateColumns="repeat(4, 1fr)"
                            gap={2}
                            w={'full'}
                        >
                            {loginModalUI?.preferredLoginMethods?.map(
                                (method, index) => (
                                    <React.Fragment key={method}>
                                        {method === 'email' && (
                                            <GridItem colSpan={4} w={'full'}>
                                                <EmailLoginButton />
                                            </GridItem>
                                        )}
                                        {method === 'google' && (
                                            <GridItem colSpan={4} w={'full'}>
                                                <ConnectionButton
                                                    isDark={isDark}
                                                    onClick={() =>
                                                        initOAuth({
                                                            provider: 'google',
                                                        })
                                                    }
                                                    leftIcon={
                                                        <Icon
                                                            as={FcGoogle}
                                                            w={'25px'}
                                                            h={'25px'}
                                                        />
                                                    }
                                                    text="Continue with Google"
                                                />
                                            </GridItem>
                                        )}

                                        {index !==
                                            (loginModalUI?.preferredLoginMethods
                                                ?.length ?? 0) -
                                                1 && (
                                            <GridItem colSpan={4} w={'full'}>
                                                <HStack>
                                                    <Divider />
                                                    <Text fontSize={'xs'}>
                                                        or
                                                    </Text>
                                                    <Divider />
                                                </HStack>
                                            </GridItem>
                                        )}
                                    </React.Fragment>
                                ),
                            )}

                            <GridItem colSpan={4} w={'full'}>
                                <ConnectionButton
                                    isDark={isDark}
                                    onClick={async () => {
                                        await loginWithCrossAppAccount({
                                            appId: VECHAIN_PRIVY_APP_ID,
                                        });
                                        onClose();
                                    }}
                                    leftIcon={
                                        <VechainLogo
                                            boxSize={'20px'}
                                            isDark={isDark}
                                        />
                                    }
                                    text="Login with VeChain"
                                />
                            </GridItem>

                            <ConnectionButton
                                isDark={isDark}
                                onClick={handleLoginWithPasskey}
                                icon={IoIosFingerPrint}
                            />

                            <ConnectionButton
                                isDark={isDark}
                                onClick={openDappKitModal}
                                icon={HiOutlineWallet}
                            />

                            <ConnectionButton
                                isDark={isDark}
                                onClick={openEcosystemModal}
                                icon={IoPlanet}
                            />

                            <ConnectionButton
                                isDark={isDark}
                                onClick={viewMoreLogin}
                                icon={CiCircleMore}
                            />
                        </Grid>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <VersionFooter />
                </ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
