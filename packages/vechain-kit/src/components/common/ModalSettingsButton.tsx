import { useUpgradeRequired, useWallet } from '@/hooks';
import { IconButton, IconButtonProps, Box, Icon } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';

type ModalSettingsButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalSettingsButton = ({
    onClick,
    ...props
}: ModalSettingsButtonProps) => {
    const { smartAccount, connectedWallet, connection } = useWallet();
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('app-first-visit');
        setIsFirstVisit(!hasVisited);
    }, []);

    const { data: upgradeRequired } = useUpgradeRequired(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
        3,
    );
    const showRedDot = connection.isConnectedWithPrivy && upgradeRequired;

    const handleOnClick = () => {
        if (isFirstVisit) {
            localStorage.setItem('app-first-visit', 'true');
            setIsFirstVisit(false);
        }

        onClick();
    };

    return (
        <IconButton
            aria-label="Notifications"
            size="sm"
            variant="ghost"
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={handleOnClick}
            icon={
                <Box position="relative">
                    <Icon as={LuSettings2} fontSize={'18px'} />
                    {showRedDot && (
                        <Box
                            position="absolute"
                            top="-1px"
                            right="-1px"
                            minWidth="8px"
                            height="8px"
                            bg="red.500"
                            borderRadius="full"
                        />
                    )}
                </Box>
            }
            {...props}
        />
    );
};
