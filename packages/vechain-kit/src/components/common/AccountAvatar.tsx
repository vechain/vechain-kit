import { Wallet } from '@/types';
import { getPicassoImage } from '@/utils';
import { Image, ImageProps, Spinner } from '@chakra-ui/react';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    if (wallet?.isLoadingMetadata) {
        return <Spinner size="sm" />;
    }

    return (
        <Image
            src={props?.src || wallet?.image}
            alt={props?.alt || wallet?.domain}
            objectFit="cover"
            rounded="full"
            fallbackSrc={getPicassoImage(wallet?.address ?? '')}
            {...props}
        />
    );
};
