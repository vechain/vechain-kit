import { Wallet } from '@/types';
import { Image, ImageProps, Spinner } from '@chakra-ui/react';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    if (wallet?.isLoadingAvatar) {
        return <Spinner size="sm" />;
    }

    return (
        <Image
            src={props?.src ?? wallet?.image}
            alt={props?.alt ?? wallet?.domain}
            objectFit="cover"
            rounded="full"
            {...props}
        />
    );
};
