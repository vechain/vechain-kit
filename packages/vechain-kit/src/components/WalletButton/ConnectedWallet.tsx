import { useWallet } from '../../hooks';
import { Button, HStack, useMediaQuery } from '@chakra-ui/react';

import { AccountAvatar } from '../common';
// Import from types.ts to avoid circular dependency with WalletButton
import type { WalletButtonProps } from './types';
import { WalletDisplay } from './WalletDisplay';

type ConnectedWalletProps = WalletButtonProps & {
    onOpen: () => void;
};

export const ConnectedWallet = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconAndDomain',
    onOpen,
    buttonStyle = {},
}: ConnectedWalletProps) => {
    const { account } = useWallet();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    return (
        <Button
            {...buttonStyle}
            onClick={onOpen}
            w="full"
            minH={'45px'}
            maxW="fit-content"
            data-testid='wallet-button'
        >
            <HStack w="full" minW="fit-content">
                <AccountAvatar
                    wallet={account}
                    props={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                    }}
                />

                <WalletDisplay
                    variant={isDesktop ? desktopVariant : mobileVariant}
                />
            </HStack>
        </Button>
    );
};
