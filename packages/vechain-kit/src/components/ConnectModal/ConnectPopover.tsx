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
import { useVeChainKitConfig } from '../../providers';
import { useFetchAppInfo, useConnectModal } from '../../hooks';
import { ConnectModalContentsTypes } from './ConnectModal';
import { useCallback } from 'react';
import { SetStateAction } from 'react';

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
    const { open: openConnectModal } = useConnectModal();

    const { data: appsInfo, isLoading: isEcosystemAppsLoading } =
        useFetchAppInfo(privyEcosystemAppIDS);

    // Function to handle content changes from popover - opens ConnectModal
    // When opened from popover, we don't show back button
    const handleSetContent = useCallback(
        (
            content:
                | ConnectModalContentsTypes
                | SetStateAction<ConnectModalContentsTypes>,
        ) => {
            // Handle function form of SetStateAction
            const resolvedContent =
                typeof content === 'function'
                    ? content('main') // Use 'main' as previous state (won't be used anyway)
                    : content;

            // If content is ecosystem or loading, set showBackButton to false
            if (
                typeof resolvedContent === 'object' &&
                'type' in resolvedContent
            ) {
                if (resolvedContent.type === 'ecosystem') {
                    openConnectModal({
                        type: 'ecosystem',
                        props: {
                            ...resolvedContent.props,
                            showBackButton: false,
                        },
                    });
                } else if (resolvedContent.type === 'loading') {
                    openConnectModal({
                        type: 'loading',
                        props: {
                            ...resolvedContent.props,
                            showBackButton: false,
                        },
                    });
                } else {
                    // Error type or other - don't modify props
                    openConnectModal(resolvedContent);
                }
            } else {
                // String type (main, faq, etc.)
                openConnectModal(resolvedContent);
            }
        },
        [openConnectModal],
    );

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
                            <ConnectionOptionsStack
                                setCurrentContent={handleSetContent}
                            />
                        </PopoverBody>
                        <PopoverFooter borderTop={'none'} pb={'15px'}>
                            {showEcosystemButton && (
                                <HStack justify={'center'} w={'full'}>
                                    <EcosystemButton
                                        isDark={isDark}
                                        appsInfo={Object.values(appsInfo || {})}
                                        isLoading={isEcosystemAppsLoading}
                                        setCurrentContent={handleSetContent}
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
