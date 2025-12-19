import {
    HStack,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    useToken,
} from '@chakra-ui/react';
import { useVeChainKitConfig } from '@/providers';
import { ModalFAQButton, StickyHeaderContainer } from '@/components/common';
import { ConnectModalContentsTypes } from '../ConnectModal';
import React from 'react';
import { useFetchAppInfo } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { ConnectionOptionsStack } from '../Components/ConnectionOptionsStack';
import { EcosystemButton } from '../Components/EcosystemButton';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
    onClose: () => void;
};

export const MainContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();

    const { loginModalUI, darkMode: isDark } = useVeChainKitConfig();
    const { loginMethods, privyEcosystemAppIDS } = useVeChainKitConfig();
    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    const textColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleFAQClick = () => {
        setCurrentContent('faq');
    };

    const showEcosystemButton = loginMethods?.some(
        ({ method }) => method === 'ecosystem',
    );

    return (
        <>
            <StickyHeaderContainer>
                <ModalFAQButton onClick={handleFAQClick} />
                <ModalHeader>{t('Log in or sign up')}</ModalHeader>
                <ModalCloseButton />
            </StickyHeaderContainer>

            {loginModalUI?.logo && (
                <HStack justify={'center'}>
                    <Image
                        src={loginModalUI.logo || '/images/favicon.png'}
                        maxW={'180px'}
                        maxH={'90px'}
                        m={8}
                        alt="logo"
                    />
                </HStack>
            )}

            <ModalBody>
                {loginModalUI?.description && (
                    <HStack
                        spacing={4}
                        w={'full'}
                        justify={'center'}
                        mb={'24px'}
                        px={4}
                    >
                        <Text
                            color={textColor}
                            fontSize={'sm'}
                            textAlign={'center'}
                        >
                            {loginModalUI?.description}
                        </Text>
                    </HStack>
                )}
                <ConnectionOptionsStack setCurrentContent={setCurrentContent} />
            </ModalBody>

            {showEcosystemButton ? (
                <ModalFooter>
                    <HStack justify={'center'} w={'full'}>
                        <EcosystemButton
                            isDark={isDark}
                            appsInfo={Object.values(appsInfo || {})}
                            isLoading={isEcosystemAppsLoading}
                            setCurrentContent={setCurrentContent}
                        />
                    </HStack>
                </ModalFooter>
            ) : (
                <ModalFooter pt={0} pb={'5px'} />
            )}
        </>
    );
};
