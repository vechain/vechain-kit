import { useQuery } from '@tanstack/react-query';
import { useConnex } from '@vechain/dapp-kit-react';
import { Interface } from 'ethers';
import { useCallback, useMemo } from 'react';

// Define a type to infer method names from the function definition
type MethodName<T> = T extends (nameOrSignature: infer U) => any ? U : never;

/**
 * Parameters for the useCall hook.
 */
export type UseCallParams<T extends Interface> = {
    contractInterface: T; // The contract interface
    contractAddress: string; // The contract address
    method: MethodName<T['getFunction']>; // The mehod name
    args?: unknown[]; // Optional arguments for the method
    keyArgs?: unknown[]; // Optional key arguments for the query key
    enabled?: boolean; // Whether the query should be enabled
    mapResponse?: (
        _res: Connex.VM.Output & Connex.Thor.Account.WithDecoded,
    ) => any; // Optional functon to map the response
};

/**
 * Custom hook for making contract calls.
 * @param contractInterface - The cotract interface.
 * @param contractAddress - The contract address.
 * @param method - The method name.
 * @param rgs - Optional arguments for the method.
 *@param keyArgs - Optional key arguments for the query key.
 * @param enabled - Whether the query should be enabled.
 * @param mapResponse - Optional function to map the response.
 * @returns The query result.
 */
export const useCall = <T extends Interface>({
    contractInterface,
    contractAddress,
    method,
    args = [],
    keyArgs,
    enabled = true,
    mapResponse,
}: UseCallParams<T>) => {
    const { thor } = useConnex();

    const queryFn = useCallback(async () => {
        try {
            const functionFragment = contractInterface
                ?.getFunction(method)
                ?.format('json');
            if (!functionFragment)
                throw new Error(`Method ${method} not found`);

            const res = await thor
                .account(contractAddress)
                .method(JSON.parse(functionFragment))
                .call(...args);

            if (res.vmError)
                return Promise.reject(
                    new Error(`Method ${method} reverted: ${res.vmError}`),
                );

            if (mapResponse) return mapResponse(res);

            return res.decoded[0];
        } catch (error) {
            console.error(
                `Error calling ${method}: ${
                    (error as Error)?.message
                } with args: ${JSON.stringify(args)}`,
                (error as Error)?.stack,
            );
            throw error;
        }
    }, [args, contractAddress, contractInterface, mapResponse, method, thor]);

    const queryKey = useMemo(
        () => getCallKey({ method, keyArgs: keyArgs || args }),
        [method, keyArgs, args],
    );

    const enableQuery = useMemo(() => enabled, [enabled]);

    return useQuery({
        queryFn,
        queryKey,
        enabled: enableQuery,
    });
};

export type GetCallKeyParams = {
    method: string;
    keyArgs?: any[];
};

export const getCallKey = ({ method, keyArgs = [] }: GetCallKeyParams) => {
    return ['VECHAIN_KIT_', method, ...keyArgs];
};
