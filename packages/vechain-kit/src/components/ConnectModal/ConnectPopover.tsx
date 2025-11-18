import {
    Button,
    ButtonProps,
    HStack,
    Icon,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverTrigger,
} from '@chakra-ui/react';
import { ConnectionOptionsStack } from './Components/ConnectionOptionsStack';
import { useTranslation } from 'react-i18next';
import { LuChevronDown } from 'react-icons/lu';
import { EcosystemButton } from './Components';
import { useVeChainKitConfig } from '@/providers';
import { useFetchAppInfo } from '@/hooks';

type ConnectPopoverProps = {
    isLoading: boolean;
    buttonStyle?: ButtonProps;
};

export const ConnectPopover = ({
    isLoading,
    buttonStyle,
}: ConnectPopoverProps) => {
    const { t } = useTranslation();
    const {
        loginMethods,
        darkMode: isDark,
        privyEcosystemAppIDS,
    } = useVeChainKitConfig();
    const showEcosystemButton = loginMethods?.some(
        ({ method }) => method === 'ecosystem',
    );

    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    return (
        <Popover
            placement="bottom-start"
            size={'xl'}
            closeOnBlur={false}
            variant="vechainKitBase"
        >
            {({ isOpen }) => (
                <>
                    <PopoverTrigger>
                        <Button
                            isLoading={isLoading}
                            {...buttonStyle}
                            isActive={isOpen}
                        >
                            {t('Login')}
                            <Icon
                                ml={2}
                                as={LuChevronDown}
                                transform={
                                    isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }
                                transition="transform 0.2s"
                            />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverBody>
                            <ConnectionOptionsStack />
                        </PopoverBody>
                        <PopoverFooter borderTop={'none'} pb={'15px'}>
                            {showEcosystemButton && (
                                <HStack justify={'center'} w={'full'}>
                                    <EcosystemButton
                                        isDark={isDark}
                                        appsInfo={Object.values(appsInfo || {})}
                                        isLoading={isEcosystemAppsLoading}
                                    />
                                </HStack>
                            )}
                        </PopoverFooter>
                    </PopoverContent>
                </>
            )}
        </Popover>
    );
};
