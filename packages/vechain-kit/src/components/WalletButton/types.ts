import type { ButtonProps } from '@chakra-ui/react';

export type WalletDisplayVariant =
    | 'icon'
    | 'iconAndDomain'
    | 'iconDomainAndAddress'
    | 'iconDomainAndAssets';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
    buttonStyle?: ButtonProps;
    connectionVariant?: 'modal' | 'popover';
    label?: string;
};
