import { Button, HStack, useMediaQuery } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { WalletDisplay } from './WalletDisplay';
import { WalletButtonProps } from './WalletButton';
import { AccountAvatar } from '../common';

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
        <Button {...buttonStyle} onClick={onOpen} p={'0px 13px'} minH={'45px'}>
            <HStack>
                <AccountAvatar
                    wallet={account}
                    props={{
                        width: 30,
                        height: 30,
                        minWidth: 30,
                        minHeight: 30,
                    }}
                />
                {!isDesktop && <WalletDisplay variant={mobileVariant} />}
                {isDesktop && <WalletDisplay variant={desktopVariant} />}
            </HStack>
        </Button>
    );
};
