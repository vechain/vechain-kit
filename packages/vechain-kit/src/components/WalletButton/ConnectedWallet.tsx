import { Button, HStack, Image, useMediaQuery } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { WalletDisplay } from './WalletDisplay';
import { notFoundImage } from '@/utils';
import { WalletButtonProps } from '@components';

type ConnectedWalletProps = WalletButtonProps & {
    onOpen: () => void;
};

export const ConnectedWallet = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconAndDomain',
    onOpen,
    buttonStyle,
}: ConnectedWalletProps) => {
    const { account } = useWallet();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    return (
        <Button {...buttonStyle} onClick={onOpen} p={'0px 13px'} minH={'45px'}>
            <HStack>
                <Image
                    src={account?.image ?? notFoundImage}
                    alt="wallet"
                    width={30}
                    height={30}
                    borderRadius="50%"
                />
                {!isDesktop && <WalletDisplay variant={mobileVariant} />}
                {isDesktop && <WalletDisplay variant={desktopVariant} />}
            </HStack>
        </Button>
    );
};
