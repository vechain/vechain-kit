import { Wallet } from '@/types';
import { Image, ImageProps, Skeleton } from '@chakra-ui/react';
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

    if (
        (!props?.src && !wallet?.image && !previousImageRef.current) ||
        wallet?.isLoadingMetadata
    ) {
        return (
            <Skeleton
                rounded="full"
                width={props?.width}
                height={props?.height}
            />
        );
    }
    return (
        <Image
            src={props?.src || wallet?.image || previousImageRef.current}
            alt={props?.alt || wallet?.domain}
            objectFit="cover"
            rounded="full"
            // fallbackSrc={getPicassoImage(wallet?.address ?? '')}
            {...props}
        />
    );
};
