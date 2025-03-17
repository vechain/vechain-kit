import { TooltipProps } from '@chakra-ui/react';

export type WalletDisplayVariant =
    | 'icon'
    | 'iconAndDomain'
    | 'iconDomainAndAddress'
    | 'iconDomainAndAssets';

export type WalletButtonTooltipProps = {
    isVisible?: boolean;
    title?: string;
    description?: string;
    placement?: TooltipProps['placement'];
};
