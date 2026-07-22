import { BetterSwapLogo } from '@/assets/icons';
import { NETWORK_TYPE } from '@/config/network';
import { BETTERSWAP_BASE_URL } from '@/constants';
import {
    SwapAggregator,
    SwapParams,
    SwapQuote,
    SwapSimulation,
} from '@/types/swap';
import { IERC20__factory } from '@vechain/vechain-contract-types';
import {
    ABIContract,
    Address as VeChainAddress,
    Clause,
    TransactionClause,
    Units,
    VET,
} from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';
import {
    decodeAbiParameters,
    decodeFunctionData,
    parseAbi,
    zeroAddress,
    type Hex,
} from 'viem';
import { simulateSwapWithClauses } from './simulateSwap';

const BETTERSWAP_TARGETS = {
    aggregator: '0xda5a60c8559a37eab5950a4ace9b77c25f6fde80',
    sor: '0x07cf4ef7044f5f290e0fe066ee1067c75d5bc478',
} as const;
const SOR_EXACT_INPUT_SELECTOR = '0x2ccd2459';
const MAX_QUOTE_LIFETIME_SECONDS = 30 * 60;
const AGGREGATOR_ABI = parseAbi([
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)',
]);
const SOR_EXACT_INPUT_BATCH = {
    name: 'batch',
    type: 'tuple',
    components: [
        { name: 'tokenIn', type: 'address' },
        { name: 'tokenOut', type: 'address' },
        {
            name: 'plans',
            type: 'tuple[]',
            components: [
                {
                    name: 'legs',
                    type: 'tuple[]',
                    components: [
                        { name: 'adapter', type: 'uint8' },
                        { name: 'router', type: 'address' },
                        { name: 'pool', type: 'address' },
                        { name: 'tokenIn', type: 'address' },
                        { name: 'tokenOut', type: 'address' },
                        { name: 'amountIn', type: 'uint256' },
                    ],
                },
                { name: 'amountIn', type: 'uint256' },
            ],
        },
        { name: 'amountOutMinimum', type: 'uint256' },
        { name: 'recipient', type: 'address' },
        { name: 'deadline', type: 'uint256' },
    ],
} as const;

interface BetterSwapApiClause {
    to: string;
    value: string;
    data: string;
    comment?: string;
}

interface BetterSwapQuoteResponse {
    success: boolean;
    error?: string;
    quote?: {
        amountIn: string;
        amountOut: string;
        minAmountOut: string;
        priceImpactPercent: number | null;
        direction: 'in' | 'out';
        deadline: number;
        source: 'aggregator' | 'sor';
        target: string;
        clauses: BetterSwapApiClause[];
    };
}

type SorExactInputBatch = {
    tokenIn: string;
    tokenOut: string;
    plans: readonly { amountIn: bigint }[];
    amountOutMinimum: bigint;
    recipient: string;
    deadline: bigint;
};

interface ValidatedBetterSwapQuote {
    outputAmount: bigint;
    minimumOutputAmount: bigint;
    priceImpact?: number;
    clauses: BetterSwapApiClause[];
    source: 'aggregator' | 'sor';
    target: string;
    deadline: number;
}

const isVET = (address: string) => address === '0x' || address === zeroAddress;
const sameAddress = (left: string, right: string) =>
    left.toLowerCase() === right.toLowerCase();
const toApiAddress = (address: string) => (isVET(address) ? '' : address);
const toSorAddress = (address: string) =>
    isVET(address) ? zeroAddress : address;

const validateApprovalClause = (
    clause: BetterSwapApiClause,
    params: SwapParams,
    target: string,
) => {
    if (
        !sameAddress(clause.to, params.fromTokenAddress) ||
        BigInt(clause.value) !== 0n
    ) {
        throw new Error('Invalid BetterSwap approval clause');
    }
    const decoded = decodeFunctionData({
        abi: IERC20__factory.abi,
        data: clause.data as Hex,
    });
    if (decoded.functionName !== 'approve' || !decoded.args)
        throw new Error('Invalid BetterSwap approval call');
    const [spender, amount] = decoded.args as readonly [string, bigint];
    if (!sameAddress(spender, target) || amount !== BigInt(params.amountIn)) {
        throw new Error('Invalid BetterSwap approval parameters');
    }
};

const validateAggregatorClause = (
    data: Hex,
    params: SwapParams,
    minimumOutputAmount: bigint,
    deadline: number,
) => {
    const decoded = decodeFunctionData({ abi: AGGREGATOR_ABI, data });
    const expectedFunction = isVET(params.fromTokenAddress)
        ? 'swapExactETHForTokens'
        : isVET(params.toTokenAddress)
        ? 'swapExactTokensForETH'
        : 'swapExactTokensForTokens';
    if (decoded.functionName !== expectedFunction || !decoded.args)
        throw new Error('Invalid BetterSwap aggregator function');

    const args = decoded.args as readonly unknown[];
    const offset = expectedFunction === 'swapExactETHForTokens' ? 0 : 1;
    if (offset === 1 && BigInt(args[0] as bigint) !== BigInt(params.amountIn))
        throw new Error('Invalid BetterSwap input amount');
    if (BigInt(args[offset] as bigint) !== minimumOutputAmount)
        throw new Error('Invalid BetterSwap minimum output');
    if (!sameAddress(args[offset + 2] as string, params.userAddress))
        throw new Error('Invalid BetterSwap recipient');
    if (BigInt(args[offset + 3] as bigint) !== BigInt(deadline))
        throw new Error('Invalid BetterSwap deadline');
};

const validateSorClause = (
    data: Hex,
    params: SwapParams,
    minimumOutputAmount: bigint,
    deadline: number,
) => {
    if (data.slice(0, 10).toLowerCase() !== SOR_EXACT_INPUT_SELECTOR)
        throw new Error('Invalid BetterSwap SOR function');
    const [decoded] = decodeAbiParameters(
        [SOR_EXACT_INPUT_BATCH],
        `0x${data.slice(10)}` as Hex,
    ) as unknown as readonly [SorExactInputBatch];
    const totalAmountIn = decoded.plans.reduce(
        (total, plan) => total + plan.amountIn,
        0n,
    );
    if (!sameAddress(decoded.tokenIn, toSorAddress(params.fromTokenAddress)))
        throw new Error('Invalid BetterSwap SOR input token');
    if (!sameAddress(decoded.tokenOut, toSorAddress(params.toTokenAddress)))
        throw new Error('Invalid BetterSwap SOR output token');
    if (totalAmountIn !== BigInt(params.amountIn))
        throw new Error('Invalid BetterSwap SOR input amount');
    if (decoded.amountOutMinimum !== minimumOutputAmount)
        throw new Error('Invalid BetterSwap SOR minimum output');
    if (!sameAddress(decoded.recipient, params.userAddress))
        throw new Error('Invalid BetterSwap SOR recipient');
    if (decoded.deadline !== BigInt(deadline))
        throw new Error('Invalid BetterSwap SOR deadline');
};

const validateQuote = (
    response: BetterSwapQuoteResponse,
    params: SwapParams,
): ValidatedBetterSwapQuote => {
    if (!response.success || !response.quote)
        throw new Error(response.error || 'BetterSwap quote failed');
    const quote = response.quote;
    const target = BETTERSWAP_TARGETS[quote.source];
    if (!target || !sameAddress(quote.target, target))
        throw new Error('Unknown BetterSwap execution target');
    if (
        quote.direction !== 'in' ||
        BigInt(quote.amountIn) !== BigInt(params.amountIn)
    )
        throw new Error('Invalid BetterSwap quote direction or input');

    const outputAmount = BigInt(quote.amountOut);
    const minimumOutputAmount = BigInt(quote.minAmountOut);
    if (
        outputAmount <= 0n ||
        minimumOutputAmount <= 0n ||
        minimumOutputAmount > outputAmount
    )
        throw new Error('Invalid BetterSwap quote amounts');
    const now = Math.floor(Date.now() / 1000);
    if (
        quote.deadline <= now ||
        quote.deadline > now + MAX_QUOTE_LIFETIME_SECONDS
    )
        throw new Error('Invalid BetterSwap quote deadline');

    const expectedClauseCount = isVET(params.fromTokenAddress) ? 1 : 2;
    if (quote.clauses.length !== expectedClauseCount)
        throw new Error('Unexpected BetterSwap clause count');
    if (!isVET(params.fromTokenAddress))
        validateApprovalClause(quote.clauses[0], params, target);

    const executionClause = quote.clauses[quote.clauses.length - 1];
    if (!sameAddress(executionClause.to, target))
        throw new Error('Invalid BetterSwap execution clause target');
    const expectedValue = isVET(params.fromTokenAddress)
        ? BigInt(params.amountIn)
        : 0n;
    if (BigInt(executionClause.value) !== expectedValue)
        throw new Error('Invalid BetterSwap execution value');

    if (quote.source === 'aggregator') {
        validateAggregatorClause(
            executionClause.data as Hex,
            params,
            minimumOutputAmount,
            quote.deadline,
        );
    } else {
        validateSorClause(
            executionClause.data as Hex,
            params,
            minimumOutputAmount,
            quote.deadline,
        );
    }

    return {
        outputAmount,
        minimumOutputAmount,
        priceImpact: quote.priceImpactPercent ?? undefined,
        clauses: [executionClause],
        source: quote.source,
        target,
        deadline: quote.deadline,
    };
};

export const createBetterSwapAggregator = (
    networkType: NETWORK_TYPE,
): SwapAggregator => {
    const aggregator: SwapAggregator = {
        name: 'BetterSwap.io',
        getIcon: (boxSize = '20px') =>
            React.createElement(BetterSwapLogo, { boxSize }),

        async getQuote(params: SwapParams): Promise<SwapQuote> {
            try {
                if (networkType !== 'main')
                    throw new Error('BetterSwap API only supports mainnet');
                const response = await fetch(
                    new URL('api/quote', BETTERSWAP_BASE_URL),
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tokenIn: {
                                address: toApiAddress(params.fromTokenAddress),
                                symbol: params.fromTokenSymbol,
                                decimals: params.fromTokenDecimals,
                            },
                            tokenOut: {
                                address: toApiAddress(params.toTokenAddress),
                                symbol: params.toTokenSymbol,
                                decimals: params.toTokenDecimals,
                            },
                            amount: params.amountIn,
                            direction: 'in',
                            account: params.userAddress,
                            slippage: params.slippageTolerance ?? 1,
                        }),
                    },
                );
                if (!response.ok)
                    throw new Error(
                        `BetterSwap API request failed: ${response.status}`,
                    );

                const validated = validateQuote(
                    (await response.json()) as BetterSwapQuoteResponse,
                    params,
                );
                return {
                    aggregatorName: aggregator.name,
                    aggregator,
                    outputAmount: validated.outputAmount,
                    minimumOutputAmount: validated.minimumOutputAmount,
                    priceImpact: validated.priceImpact,
                    data: validated,
                };
            } catch (error) {
                console.error('BetterSwap.io getQuote failed:', error);
                return {
                    aggregatorName: aggregator.name,
                    aggregator,
                    outputAmount: 0n,
                    minimumOutputAmount: 0n,
                    data: { clauses: [] },
                };
            }
        },

        async simulateSwap(
            params: SwapParams,
            quote: SwapQuote,
            thor: ThorClient,
        ): Promise<SwapSimulation> {
            try {
                return simulateSwapWithClauses(
                    params,
                    quote,
                    await this.buildSwapTransaction(params, quote),
                    thor,
                );
            } catch (error) {
                return {
                    gasCostVTHO: 0,
                    success: false,
                    error:
                        error instanceof Error
                            ? error.message
                            : 'BetterSwap simulation failed',
                };
            }
        },

        async buildSwapTransaction(
            params: SwapParams,
            quote: SwapQuote,
        ): Promise<TransactionClause[]> {
            if (
                !quote.data ||
                typeof quote.data !== 'object' ||
                !('clauses' in quote.data) ||
                !('source' in quote.data) ||
                !('target' in quote.data) ||
                !('deadline' in quote.data)
            )
                throw new Error('Invalid BetterSwap quote data');
            const executionClauses = quote.data.clauses as TransactionClause[];
            if (executionClauses.length !== 1)
                throw new Error('Invalid BetterSwap execution clauses');
            const source = quote.data.source as 'aggregator' | 'sor';
            const target = quote.data.target as string;
            const deadline = quote.data.deadline as number;
            if (
                BETTERSWAP_TARGETS[source] !== target ||
                deadline <= Math.floor(Date.now() / 1000)
            )
                throw new Error('Expired or invalid BetterSwap quote');
            const executionClause = executionClauses[0];
            if (!executionClause.to || !sameAddress(executionClause.to, target))
                throw new Error('Invalid BetterSwap execution target');
            const expectedValue = isVET(params.fromTokenAddress)
                ? BigInt(params.amountIn)
                : 0n;
            if (BigInt(executionClause.value) !== expectedValue)
                throw new Error('Invalid BetterSwap execution value');
            const minimumOutputAmount = quote.minimumOutputAmount ?? 0n;
            if (source === 'aggregator') {
                validateAggregatorClause(
                    executionClause.data as Hex,
                    params,
                    minimumOutputAmount,
                    deadline,
                );
            } else {
                validateSorClause(
                    executionClause.data as Hex,
                    params,
                    minimumOutputAmount,
                    deadline,
                );
            }
            if (isVET(params.fromTokenAddress)) return executionClauses;

            const tokenABI = ABIContract.ofAbi(IERC20__factory.abi);
            const approval = Clause.callFunction(
                VeChainAddress.of(params.fromTokenAddress),
                tokenABI.getFunction('approve'),
                [target, params.amountIn],
                VET.of(0n, Units.wei),
                {
                    comment: `Approve ${quote.aggregatorName} to access ${params.fromTokenAddress}`,
                },
            );
            return [approval, ...executionClauses];
        },
    };

    return aggregator;
};
