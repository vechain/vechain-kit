import { Wallet } from '@/types';
import { Image, ImageProps, Spinner } from '@chakra-ui/react';
import { getPicassoImage } from '@/utils';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    if (wallet?.isLoadingMetadata) {
        return <Spinner size="sm" />;
    }

    const fallbackImage = wallet?.address
        ? getPicassoImage(wallet.address)
        : undefined;

    return (
        <Image
            src={props?.src ?? wallet?.image}
            fallbackSrc={fallbackImage}
            alt={props?.alt ?? wallet?.domain}
            objectFit="cover"
            rounded="full"
            {...props}
        />
    );
};
