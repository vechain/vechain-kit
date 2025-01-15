import {
    Button,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Spinner,
    Text,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import { useCrossAppAccounts } from '@privy-io/react-auth';
import {
    FadeInViewFromBottom,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { useFetchAppInfo } from '@/hooks';
import { IoPlanet } from 'react-icons/io5';

type Props = {
    onClose: () => void;
};

export const EcosystemContent = ({ onClose }: Props) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const { loginWithCrossAppAccount } = useCrossAppAccounts();

    const connectWithVebetterDaoApps = async (appId: string) => {
        await loginWithCrossAppAccount({ appId });
        onClose();
    };

    const { privy } = useVeChainKitConfig();
    const { data: appsInfo, isLoading } = useFetchAppInfo(
        privy.ecosystemAppsID || [],
    );

    // useEffect(() => {
    //     if (
    //         connection.source.type === 'privy-cross-app' &&
    //         crossAppLogin &&
    //         authenticated
    //     ) {
    //         linkCrossAppAccount({
    //             appId: `${privy?.ecosystemAppsID?.[0]}`,
    //         });
    //     }
    // }, [connection.source.type, crossAppLogin, authenticated]);

    return (
        <FadeInViewFromBottom>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={'flex'}
                    gap={2}
                >
                    <Icon as={IoPlanet} size={'20px'} />
                    Login with Ecosystem
                </ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            <FadeInViewFromBottom>
                <ModalBody>
                    <Text
                        fontSize={'12px'}
                        fontWeight={'400'}
                        opacity={0.5}
                        mb={4}
                        textAlign={'center'}
                    >
                        By logging in with Ecosystem, you can login with your
                        wallet created on other apps in the VeChain ecosystem.
                    </Text>
                    {isLoading && (
                        <VStack
                            minH={'200px'}
                            w={'full'}
                            justifyContent={'center'}
                        >
                            <Spinner />
                        </VStack>
                    )}

                    {!isLoading && appsInfo && (
                        <VStack spacing={4} w={'full'} pb={6}>
                            {Object.entries(appsInfo).map(
                                ([appId, appInfo]) => (
                                    <Button
                                        key={appId}
                                        fontSize={'14px'}
                                        fontWeight={'400'}
                                        backgroundColor={
                                            isDark ? 'transparent' : '#ffffff'
                                        }
                                        border={`1px solid ${
                                            isDark ? '#ffffff29' : '#ebebeb'
                                        }`}
                                        p={6}
                                        borderRadius={16}
                                        w={'full'}
                                        onClick={() =>
                                            connectWithVebetterDaoApps(appId)
                                        }
                                    >
                                        <Image
                                            src={appInfo.logo_url}
                                            alt={appInfo.name}
                                            w={'30px'}
                                        />
                                        <Text ml={5}>{appInfo.name}</Text>
                                    </Button>
                                ),
                            )}
                        </VStack>
                    )}

                    {!isLoading && !appsInfo && (
                        <Text>
                            No application from VeChain ecosystem is available
                            to login.
                        </Text>
                    )}
                </ModalBody>
                <ModalFooter></ModalFooter>
            </FadeInViewFromBottom>
        </FadeInViewFromBottom>
    );
};
