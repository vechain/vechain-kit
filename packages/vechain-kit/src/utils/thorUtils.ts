import { ThorClient } from '@vechain/sdk-network';
import {
    ExtractAbiFunctionNames,
    AbiParametersToPrimitiveTypes,
    AbiParameterKind,
} from 'abitype';
import { Abi, ContractFunctionParameters } from 'viem';
import type {
    MulticallParameters as viem_MulticallParameters,
    MulticallReturnType as viem_MulticallReturnType,
} from 'viem';

type ExtractViewFunction<
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = Extract<
    TAbi[number],
    { type: 'function'; stateMutability: 'pure' | 'view'; name: TMethod }
>;

export type ViewFunctionResult<
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = AbiParametersToPrimitiveTypes<
    ExtractViewFunction<TAbi, TMethod>['outputs'],
    AbiParameterKind
>;

export type MultipleClausesCallParameters<
    contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
    allowFailure extends boolean = true,
> = viem_MulticallParameters<contracts, allowFailure>['contracts'];

export type MultipleClausesCallReturnType<
    contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
    allowFailure extends boolean = true,
> = viem_MulticallReturnType<contracts, allowFailure>;

export const executeCallClause = async <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    thor,
    contractAddress,
    abi,
    method,
    args,
}: {
    thor: ThorClient;
    contractAddress: string;
    abi: TAbi;
    method: TMethod;
    args: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        'inputs'
    >;
}) => {
    const contract = thor.contracts.load(contractAddress, abi);
    const res = await contract.read[method](...args);
    return res as ViewFunctionResult<TAbi, TMethod>;
};

export const executeMultipleClausesCall = async <
    contracts extends readonly ContractFunctionParameters[],
    allowFailure extends boolean = false,
>({
    thor,
    calls,
}: {
    thor: ThorClient;
    calls: MultipleClausesCallParameters<contracts, allowFailure>;
}) => {
    if (!Array.isArray(calls)) throw new Error('calls must be an array');

    const clauses = calls.map((call) =>
        thor.contracts
            .load(call.contractAddress, call.abi)
            .clause[call.method](...call.args),
    );
    const res = await thor.transactions.executeMultipleClausesCall(clauses);

    if (!res.every((r) => r.success))
        throw new Error('Failed to execute multiple clauses call');

    return res.map((r) => r.result.plain) as MultipleClausesCallReturnType<
        contracts,
        allowFailure
    >;
};
