import { executeCallClause, ViewFunctionResult } from '@/utils';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useThor } from '@vechain/dapp-kit-react';
import {
    ExtractAbiFunctionNames,
    AbiParametersToPrimitiveTypes,
} from 'abitype';
import { Abi } from 'viem';

export * from '@/utils/thorUtils';

type ExtractViewFunction<
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = Extract<
    TAbi[number],
    { type: 'function'; stateMutability: 'pure' | 'view'; name: TMethod }
>;

export const getCallClauseQueryKey = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abi,
    address,
    method,
}: {
    abi: TAbi;
    address: string;
    method: TMethod;
}) => ['callClause', address, method];

export const getCallClauseQueryKeyWithArgs = <
    TAbi extends Abi,
    TMethod extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abi,
    address,
    method,
    args,
}: {
    abi: TAbi;
    address: string;
    method: TMethod;
    args?: AbiParametersToPrimitiveTypes<
        ExtractViewFunction<TAbi, TMethod>['inputs'],
        'inputs'
    >;
}) => [
    'callClause',
    address,
    method,
    ...(args?.length ? [args as unknown[]] : []),
];

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
        'inputs'
    >;
    queryOptions?: Omit<
        UseQueryOptions<
            ViewFunctionResult<TAbi, TMethod>,
            unknown,
            TData,
            ReturnType<typeof getCallClauseQueryKeyWithArgs<TAbi, TMethod>>
        >,
        'queryKey' | 'queryFn'
    >;
}) => {
    const thor = useThor();

    return useQuery({
        queryKey: getCallClauseQueryKeyWithArgs({
            abi,
            address,
            method,
            args,
        }),
        queryFn: async () =>
            executeCallClause({
                thor,
                contractAddress: address,
                abi,
                method,
                args,
            }),
        ...queryOptions,
    });
};
