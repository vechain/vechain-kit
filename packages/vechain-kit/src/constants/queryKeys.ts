export const VECHAIN_KIT_QUERY_KEYS = {
    balance: {
        all: ['VECHAIN_KIT', 'BALANCE'],
        native: (address?: string) => [
            'VECHAIN_KIT',
            'BALANCE',
            'NATIVE',
            address,
        ],
        b3tr: (address?: string) => ['VECHAIN_KIT', 'BALANCE', 'B3TR', address],
        vot3: (address?: string) => ['VECHAIN_KIT', 'BALANCE', 'VOT3', address],
        erc20: (tokenAddress: string, address?: string) => [
            'VECHAIN_KIT',
            'BALANCE',
            'ERC20',
            tokenAddress,
            address,
        ],
        customToken: (
            tokenAddress?: string,
            address?: string,
            decimals: number = 18,
        ) => [
            'VECHAIN_KIT',
            'BALANCE',
            'CUSTOM_TOKEN',
            tokenAddress,
            address,
            decimals,
        ],
    },
    price: {
        all: ['VECHAIN_KIT', 'PRICE'],
        token: (token: string) => ['VECHAIN_KIT', 'PRICE', token],
    },
};
