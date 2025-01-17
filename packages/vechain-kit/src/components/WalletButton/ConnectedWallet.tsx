import { Button, HStack, Image, useMediaQuery } from '@chakra-ui/react';
import { useWallet } from '@/hooks';
import { WalletDisplay } from './WalletDisplay';
import { WalletButtonProps } from './types';

type ConnectedWalletProps = WalletButtonProps & {
    onOpen: () => void;
};

export const ConnectedWallet = ({
    mobileVariant = 'iconAndDomain',
    desktopVariant = 'iconAndDomain',
    onOpen,
}: ConnectedWalletProps) => {
    const { account } = useWallet();
    const [isDesktop] = useMediaQuery('(min-width: 768px)');

    return (
        <Button onClick={onOpen} p={'0px 10px'} minH={'45px'}>
            <HStack>
                <Image
                    className="address-icon mobile"
                    src={account.image ?? ''}
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
