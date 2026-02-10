export const b3trMainnetAddress = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
export const b3trTestnetAddress = '0x95761346d18244bb91664181bf91193376197088';
export const b3trAbi = [
    // Replace this with your actual transfer function ABI
    {
        inputs: [
            {
                name: 'recipient',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

export const ENV = {
    isDevelopment: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'test',
    isProduction: process.env.NEXT_PUBLIC_NETWORK_TYPE === 'main',
};
