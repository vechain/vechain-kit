export const NavigatorRegistryAbi = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'isNavigator',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'navigator', type: 'address' }],
        name: 'getStake',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'isDelegated',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'getDelegatedAmount',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'citizen', type: 'address' }],
        name: 'getNavigator',
        outputs: [{ name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
