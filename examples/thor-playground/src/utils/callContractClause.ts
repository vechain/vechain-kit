import type {
    ExtractAbiFunctionNames,
    AbiParametersToPrimitiveTypes,
    AbiParameterKind,
} from 'abitype';
import type { Abi } from 'viem';
import { Thor } from '../utils/thorClient';

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

export const getCallClauseQueryKey = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    address,
    abi,
    method,
    args,
}: {
    address: string;
    abi: TAbi;
    method: TMethod;
    args: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        AbiParameterKind
    >;
}) => {
    return ['callClause', address, abi, method, args] as const;
};

export const callContractClause = async <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    address,
    abi,
    method,
    args,
}: {
    address: string;
    abi: TAbi;
    method: TMethod;
    args: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        'inputs'
    >;
}) => {
    const contract = Thor.Mainnet.contracts.load(address, abi);
    try {
        const res = await contract.read[method](...args);
        return res as ViewFunctionResult<TAbi, TMethod>;
    } catch (error) {
        console.error('Error calling contract:', error);
        return null;
    }
};
