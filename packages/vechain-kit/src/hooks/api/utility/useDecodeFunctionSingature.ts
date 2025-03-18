import { useQuery } from '@tanstack/react-query';
import { abi } from 'thor-devkit';

type FunctionDefinition = Omit<abi.Function.Definition, 'stateMutability'>;

/**
 * Interface representing the decoded function signature or calldata.
 */
export interface DecodedFunction {
    /** The function definition without state mutability. */
    definition: FunctionDefinition;
    /** A human-readable name of the function with parameter values. */
    humanName: string;
    /** An array of decoded parameters with their names, types, and values. */
    decodedParams: { name: string; type: string; value: unknown }[];
}

/**
 * Interface representing the signature data from Vechain Energy.
 */
interface VechainEnergySignatureData {
    /** The text representation of the signature. */
    text: string;
    /** The ABI details of the function. */
    abi: {
        name: string;
        constant: boolean;
        inputs: { internalType: string; name: string; type: string }[];
        outputs: { internalType: string; name: string; type: string }[];
        type: string;
        payable: boolean;
    };
    /** The source of the signature data. */
    source: string;
}

/**
 * Interface representing the signature data from OpenChain.
 */
interface OpenChainSignatureData {
    ok: boolean;
    result: {
        event: Record<string, unknown>;
        function: Record<string, Array<{ name: string; filtered: boolean }>>;
    };
}

/**
 * Parses a function signature from OpenChain format to ABI definition.
 * @param signature - The function signature (e.g. "claimReward(uint256)").
 * @returns A partial ABI function definition.
 */
const parseSignatureToAbi = (
    signature: string,
): Partial<FunctionDefinition> => {
    // Extract function name and parameters
    const match = signature.match(/^([^(]+)\(([^)]*)\)$/);
    if (!match) return { name: signature, inputs: [] };

    const [, name, paramsStr] = match;

    // Parse parameters
    const inputs = paramsStr
        ? paramsStr.split(',').map((param, index) => ({
              name: `param${index}`,
              type: param.trim(),
          }))
        : [];

    return {
        name,
        inputs,
    };
};

/**
 * Fetches the function signature data from external sources based on the signature.
 * @param signature - The function signature (first 10 bytes of calldata).
 * @returns A promise that resolves to the function signature data.
 * @throws An error if the signature cannot be fetched.
 */
const fetchFunctionSignature = async (
    signature: string,
): Promise<FunctionDefinition> => {
    const urls = [
        `https://b32.vecha.in/q/${signature}.json`,
        `https://sig.api.vechain.energy/${signature}`,
        `https://api.openchain.xyz/signature-database/v1/lookup?function=${signature}`,
    ];

    for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(
                `Failed to fetch from ${url}: ${response.statusText}`,
            );
            continue;
        }

        if (url.includes('b32.vecha.in')) {
            const data: FunctionDefinition[] = await response.json();
            if (data?.length > 0) {
                return data[0];
            }
        } else if (url.includes('sig.api.vechain.energy')) {
            const data: VechainEnergySignatureData = await response.json();
            if (data?.abi) {
                return data.abi as abi.Function.Definition;
            }
        } else if (url.includes('openchain.xyz')) {
            const data: OpenChainSignatureData = await response.json();
            if (data?.ok && data.result?.function?.[signature]?.length > 0) {
                const funcName = data.result.function[signature][0].name;
                const parsedAbi = parseSignatureToAbi(funcName);
                // Add required properties to make it compatible with FunctionDefinition
                return {
                    ...parsedAbi,
                    name: parsedAbi.name || 'unknown',
                    inputs: parsedAbi.inputs || [],
                    outputs: [],
                    type: 'function',
                    payable: false,
                    constant: false,
                } as FunctionDefinition;
            }
        }
    }

    // If we can't find the signature, return a placeholder
    return {
        name: 'unknown',
        inputs: [],
        outputs: [],
        type: 'function',
        payable: false,
        constant: false,
    };
};

/**
 * Decodes the parameters from the calldata using the ABI definition.
 * @param calldata - The calldata string to decode.
 * @param abiDefinition - The ABI function definition to use for decoding.
 * @returns An array of decoded parameters with their names, types, and values.
 */
const decodeParams = (
    calldata: string,
    abiDefinition: abi.Function.Definition,
): DecodedFunction['decodedParams'] => {
    try {
        if (
            !abiDefinition ||
            !abiDefinition.inputs ||
            abiDefinition.inputs.length === 0
        ) {
            return [];
        }

        const paramData =
            calldata.length > 10 ? `0x${calldata.slice(10)}` : '0x';
        const decoded = abi.decodeParameters(abiDefinition.inputs, paramData);

        return abiDefinition.inputs.map((param) => ({
            name: param.name || 'unnamed',
            type: param.type,
            value: decoded ? decoded[param.name] : 'Unknown',
        }));
    } catch (e) {
        console.error('Error decoding call data', e);
        return abiDefinition.inputs.map((param) => ({
            name: param.name || 'unnamed',
            type: param.type,
            value: 'Error decoding',
        }));
    }
};

/**
 * Decodes a function signature or complete calldata without using react-query.
 * @param input - The function signature (0x + 8 bytes) or complete calldata string.
 * @returns A Promise that resolves to the decoded function information.
 * @example
 * // Decode a token transfer calldata
 * const result = await decodeFunction("0xa9059cbb000000000000000000000000ab5801a7d398351b8be11c439e05c5b3259aec9b0000000000000000000000000000000000000000000000000de0b6b3a7640000");
 * // Result: { definition: {...}, humanName: "transfer(to: 0xab5801a7d398351b8be11c439e05c5b3259aec9b, value: 1000000000000000000)", decodedParams: [...] }
 */
export const decodeFunctionSignature = async (
    input: string,
): Promise<DecodedFunction> => {
    // Handle empty input
    if (!input || input === '0x') {
        return {
            definition: {
                name: 'empty',
                inputs: [],
                outputs: [],
                type: 'function',
                payable: false,
                constant: false,
            },
            humanName: 'empty()',
            decodedParams: [],
        };
    }

    // Extract the signature (first 10 bytes)
    const signature = input.slice(0, 10);

    // Fetch the function signature definition
    const functionDefinition = await fetchFunctionSignature(signature);

    // Create ABI definition
    const abiDefinition = new abi.Function(
        functionDefinition as abi.Function.Definition,
    );

    // Decode the parameters if we have a complete calldata
    const decodedParams =
        input.length > 10 ? decodeParams(input, abiDefinition.definition) : [];

    // Format human-readable method name with parameters
    const humanName =
        decodedParams.length > 0
            ? `${functionDefinition.name}(${decodedParams
                  .map((param) => `${param.name}: ${String(param.value)}`)
                  .join(', ')})`
            : `${functionDefinition.name}(${functionDefinition.inputs
                  .map((input) => `${input.name || 'unnamed'}: ${input.type}`)
                  .join(', ')})`;

    return {
        definition: abiDefinition.definition,
        humanName,
        decodedParams,
    };
};

/**
 * Generates a query key for decoding function signatures and calldata.
 * @param input - The function signature or calldata string to generate the key for.
 * @returns An array representing the query key.
 */
const getDecodeFunctionSignatureQueryKey = (input: string) => [
    'decodeFunctionSignature',
    input,
];

/**
 * Custom hook to decode function signatures and calldata using react-query.
 * @param input - The function signature (0x + 8 bytes) or complete calldata string to decode.
 * @returns The query result containing the decoded function information.
 *
 * @example
 * ```tsx
 * // Decode a function signature only
 * const { data, isLoading } = useDecodeFunctionSignature("0x23b872dd");
 *
 * // Decode a complete calldata
 * const { data, isLoading } = useDecodeFunctionSignature("0x23b872dd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
 *
 * if (isLoading) return <div>Loading...</div>;
 *
 * return (
 *   <div>
 *     <h2>{data?.humanName}</h2>
 *     <pre>{JSON.stringify(data?.decodedParams, null, 2)}</pre>
 *   </div>
 * );
 * ```
 */
export const useDecodeFunctionSignature = (input: string) => {
    return useQuery<DecodedFunction>({
        queryKey: getDecodeFunctionSignatureQueryKey(input),
        queryFn: async () => await decodeFunctionSignature(input),
        enabled: !!input,
        staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
        retry: 2, // Retry failed queries twice
    });
};
