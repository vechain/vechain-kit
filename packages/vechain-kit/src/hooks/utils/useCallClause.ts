import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react2';
import {
    ExtractAbiFunctionNames,
    AbiParametersToPrimitiveTypes,
    AbiParameterKind,
} from 'abitype';
import { Abi } from 'viem';

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

// TODO: migration ask why can't we use wagmi useReadContract?
export const useCallClause = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    TData = ViewFunctionResult<TAbi, TMethod>,
>({
    address,
    abi,
    method,
    args,
    queryOptions,
}: {
    address: string;
    abi: TAbi;
    method: TMethod;
    args: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        AbiParameterKind
    >;
    queryOptions?: Omit<
        UseQueryOptions<
            ViewFunctionResult<TAbi, TMethod>,
            unknown,
            TData,
            ReturnType<typeof getCallClauseQueryKey<TAbi, TMethod>>
        >,
        'queryKey' | 'queryFn'
    >;
}) => {
    const thor = useThor();

    return useQuery({
        queryKey: getCallClauseQueryKey({ address, abi, method, args }),
        queryFn: async () => {
            const contract = thor.contracts.load(address, abi);
            const res = await contract.read[method](...args);
            return res as ViewFunctionResult<TAbi, TMethod>;
        },
        ...queryOptions,
    });
};
