export type WalletDisplayVariant =
    | 'icon'
    | 'iconAndDomain'
    | 'iconDomainAndAddress'
    | 'iconDomainAndAssets';

export type WalletButtonProps = {
    mobileVariant?: WalletDisplayVariant;
    desktopVariant?: WalletDisplayVariant;
};
