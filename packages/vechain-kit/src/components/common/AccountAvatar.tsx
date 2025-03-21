import { Wallet } from '@/types';
import { getPicassoImage } from '@/utils';
import { Image, ImageProps, Spinner } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    // Store the previous image URL to maintain during loading
    const previousImageRef = useRef<string | undefined>(wallet?.image);

    // Update the ref when we have a valid image and it's not loading
    useEffect(() => {
        if (wallet?.image && !wallet.isLoadingMetadata) {
            previousImageRef.current = wallet.image;
        }
    }, [wallet?.image, wallet?.isLoadingMetadata]);

    if (wallet?.isLoadingMetadata && !previousImageRef.current) {
        return <Spinner size="sm" />;
    }

    return (
        <Image
            src={props?.src || wallet?.image || previousImageRef.current}
            alt={props?.alt || wallet?.domain}
            objectFit="cover"
            rounded="full"
            fallbackSrc={getPicassoImage(wallet?.address ?? '')}
            {...props}
        />
    );
};
