export const JuicyPoolAbi = [
    {
        inputs: [],
        name: 'getReservesList',
        outputs: [{ name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'user', type: 'address' }],
        name: 'getUserAccountData',
        outputs: [
            { name: 'totalCollateralBase', type: 'uint256' },
            { name: 'totalDebtBase', type: 'uint256' },
            { name: 'availableBorrowsBase', type: 'uint256' },
            { name: 'currentLiquidationThreshold', type: 'uint256' },
            { name: 'ltv', type: 'uint256' },
            { name: 'healthFactor', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ name: 'asset', type: 'address' }],
        name: 'getReserveData',
        outputs: [
            {
                components: [
                    {
                        components: [
                            { name: 'data', type: 'uint256' },
                        ],
                        name: 'configuration',
                        type: 'tuple',
                    },
                    { name: 'liquidityIndex', type: 'uint128' },
                    { name: 'currentLiquidityRate', type: 'uint128' },
                    { name: 'variableBorrowIndex', type: 'uint128' },
                    { name: 'currentVariableBorrowRate', type: 'uint128' },
                    { name: 'currentStableBorrowRate', type: 'uint128' },
                    { name: 'lastUpdateTimestamp', type: 'uint40' },
                    { name: 'id', type: 'uint16' },
                    { name: 'aTokenAddress', type: 'address' },
                    { name: 'stableDebtTokenAddress', type: 'address' },
                    { name: 'variableDebtTokenAddress', type: 'address' },
                    { name: 'interestRateStrategyAddress', type: 'address' },
                    { name: 'accruedToTreasury', type: 'uint128' },
                    { name: 'unbacked', type: 'uint128' },
                    { name: 'isolationModeTotalDebt', type: 'uint128' },
                ],
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

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
