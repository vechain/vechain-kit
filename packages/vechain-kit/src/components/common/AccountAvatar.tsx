import { Wallet } from '@/types';
import { getPicassoImage } from '@/utils';
import { Image, ImageProps, Skeleton } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';

type AccountAvatarProps = {
    wallet?: Wallet;
    props?: ImageProps;
};

export const AccountAvatar = ({ wallet, props }: AccountAvatarProps) => {
    // Store the previous image URL to maintain during loading
    // Use wallet address as key to ensure ref is reset when wallet changes
    const previousImageRef = useRef<string | undefined>(wallet?.image);
    const walletAddressRef = useRef<string | undefined>(wallet?.address);

    // Reset ref when wallet address changes
    useEffect(() => {
        if (walletAddressRef.current !== wallet?.address) {
            previousImageRef.current = wallet?.image;
            walletAddressRef.current = wallet?.address;
        }
    }, [wallet?.address]);

    // Update the ref when we have a valid image and it's not loading
    useEffect(() => {
        if (wallet?.image && !wallet.isLoadingMetadata) {
            previousImageRef.current = wallet.image;
        }
    }, [wallet?.image, wallet?.isLoadingMetadata]);

    // Deterministic Picasso fallback so the avatar never stays on the skeleton.
    const picassoFallback = wallet?.address
        ? getPicassoImage(wallet.address)
        : undefined;

    const resolvedSrc =
        props?.src || wallet?.image || previousImageRef.current;

    if (wallet?.isLoadingMetadata && !resolvedSrc && !picassoFallback) {
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
            src={resolvedSrc || picassoFallback}
            alt={props?.alt || wallet?.domain}
            objectFit="cover"
            rounded="full"
            fallbackSrc={picassoFallback}
            {...props}
        />
    );
};
