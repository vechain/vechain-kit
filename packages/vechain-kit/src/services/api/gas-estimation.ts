import { ApiClient } from './api-client';
import { EstimationResponse } from '@/types/GasEstimation';
import { EnhancedClause } from '@/types';
import { GasTokenType } from '@/types/GasToken';

export interface GasEstimationService {
    estimateGas(clauses: EnhancedClause[]): Promise<EstimationResponse>;
    getDepositAccount(): Promise<{ depositAccount: string }>;
    signTransaction(
        token: GasTokenType,
        payload: { raw: string; origin: string },
    ): Promise<{
        signature: string;
        address: string;
        raw: string;
        origin: string;
    }>;
}

export class GenericDelegatorGasEstimation implements GasEstimationService {
    private client: ApiClient;

    constructor(delegatorUrl: string) {
        this.client = new ApiClient({
            baseUrl: delegatorUrl,
        });
    }

    async estimateGas(clauses: EnhancedClause[]): Promise<EstimationResponse> {
        // convert EnhancedClause to the format expected by the API
        const apiClauses = clauses.map((clause) => ({
            to: clause.to,
            value: clause.value || '0x0',
            data: clause.data || '0x',
        }));

        return this.client.post<EstimationResponse>('/estimate', {
            clauses: apiClauses,
        });
    }

    async getDepositAccount(): Promise<{ depositAccount: string }> {
        return this.client.get<{ depositAccount: string }>(
            '/api/v1/deposit/account',
        );
    }

    async signTransaction(
        token: GasTokenType,
        payload: { raw: string; origin: string },
    ): Promise<{
        signature: string;
        address: string;
        raw: string;
        origin: string;
    }> {
        return this.client.post<{
            signature: string;
            address: string;
            raw: string;
            origin: string;
        }>(`/api/v1/sign/transaction/${token}`, payload);
    }
}

export class MockGasEstimation implements GasEstimationService {
    async estimateGas(_clauses: EnhancedClause[]): Promise<EstimationResponse> {
        await new Promise((resolve) => setTimeout(resolve, 500)); // delay for mock

        return {
            vthoPerGasAtSpeed: {
                regular: 0.00001046,
                medium: 0.000012,
                high: 0.000014,
                legacy: 0.00001,
            },
            estimatedGas: {
                vtho: 56507,
                vet: 76507,
                b3tr: 78000,
                smartAccount: 57507,
            },
            rate: {
                vtho: 1,
                vet: 0.1,
                b3tr: 0.0346,
            },
            transactionCost: {
                regular: {
                    vtho: 0.59106322,
                    vet: 0.075,
                    b3tr: 0.027,
                    vetWithSmartAccount: 0.028,
                    b3trWithSmartAccount: 0.028,
                },
                medium: {
                    vtho: 0.678,
                    vet: 0.086,
                    b3tr: 0.031,
                    vetWithSmartAccount: 0.032,
                    b3trWithSmartAccount: 0.032,
                },
                high: {
                    vtho: 0.791,
                    vet: 0.1,
                    b3tr: 0.036,
                    vetWithSmartAccount: 0.037,
                    b3trWithSmartAccount: 0.037,
                },
                legacy: {
                    vtho: 0.565,
                    vet: 0.072,
                    b3tr: 0.026,
                    vetWithSmartAccount: 0.027,
                    b3trWithSmartAccount: 0.027,
                },
            },
            serviceFee: 0.1,
        };
    }

    async getDepositAccount(): Promise<{ depositAccount: string }> {
        await new Promise((resolve) => setTimeout(resolve, 200)); // mock delay
        return {
            depositAccount: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
        };
    }

    async signTransaction(
        token: GasTokenType,
        payload: { raw: string; origin: string },
    ): Promise<{
        signature: string;
        address: string;
        raw: string;
        origin: string;
    }> {
        await new Promise((resolve) => setTimeout(resolve, 800)); // mock delay for signing

        // mock signature response for the delegated tx
        return {
            signature:
                '9e111c68d74804c68d00a2c00ee0640e5baaeee136c97f970c87b3d82ab35cb96fd0e71c1e285fabdd5903f25f9a64bd58e3de838333a6bc03bf380e8692311701',
            address: '0x435933c8064b4Ae76bE665428e0307eF2cCFBD68',
            raw: '0xf9015b81f685ccdc39a3a320f8bcf85c94fb9d93d5c544e27adaa169eeb0c55d459a858a1880b844e49f3761000000000000000000000000bf133dbb679e7bef3adacae04600b1d8c0e2b80c000000000000000000000000000000000000000000000000000000000000000af85c94bf64cf86894ee0877c4e7d03936e35ee8d8b864f80b844a9059cbb000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa00000000000000000000000000000000000000000000000006f6aa9d0cd100008082b230808879efa9ac897e57e6c101b8829e111c68d74804c68d00a2c00ee0640e5baaeee136c97f970c87b3d82ab35cb96fd0e71c1e285fabdd5903f25f9a64bd58e3de838333a6bc03bf380e86923117010049f483e42078902b8e97f2218eb58b89fa4221b4e08020a9479672246f303a6f7d0f1e794d0a8e30fc579cbf40803c7ce5a9cc6071b4ebb34dcfb54d84b88800',
            origin: payload.origin,
        };
    }
}

// factory to create the appropriate service - mock or real
export function createGasEstimationService(
    delegatorUrl?: string,
    useMock: boolean = false,
): GasEstimationService {
    if (useMock || !delegatorUrl) {
        return new MockGasEstimation();
    }

    return new GenericDelegatorGasEstimation(delegatorUrl);
}
