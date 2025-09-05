import { ApiClient } from './api-client';
import { EstimationResponse } from '@/types/gasEstimation';
import { EnhancedClause } from '@/types';
import { GasTokenType, TransactionSpeed } from '@/types/gasToken';

export interface ClauseBuilderDependencies {
    buildClausesWithAuth: (clauses: Connex.VM.Clause[]) => Promise<EnhancedClause[]>;
}

export interface GasEstimationService {
    estimateGas(token: GasTokenType, clauses: EnhancedClause[], speed: TransactionSpeed): Promise<EstimationResponse>;
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
    private clauseBuilder: ClauseBuilderDependencies;

    constructor(delegatorUrl: string, clauseBuilder: ClauseBuilderDependencies) {
        this.client = new ApiClient({
            baseUrl: delegatorUrl,
        });
        this.clauseBuilder = clauseBuilder;
    }

    async estimateGas(token: GasTokenType, clauses: EnhancedClause[], speed: TransactionSpeed): Promise<EstimationResponse> {
        // need to convert clauses either into single clause or into batch execute with authorization clauses
        const convertedClauses = await this.clauseBuilder.buildClausesWithAuth(clauses as unknown as Connex.VM.Clause[]);
        // convert EnhancedClause to the format expected by the API
        const apiClauses = convertedClauses.map((clause) => ({
            to: clause.to,
            value: clause.value || '0x0',
            data: clause.data || '0x',
            comment: clause.comment,
            abi: clause.abi,
        }));
        
        return this.client.post<EstimationResponse>(`/estimate/clauses/${token.toLowerCase()}?type=smartaccount&speed=${speed}`, {
            clauses: apiClauses,
        });
    }

    async getDepositAccount(): Promise<{ depositAccount: string }> {
        return this.client.get<{ depositAccount: string }>(
            '/deposit/account',
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
        }>(`/sign/transaction/${token}`, payload);
    }
}

// factory to create the appropriate service
export function createGasEstimationService(
    delegatorUrl: string,
    clauseBuilder: ClauseBuilderDependencies,
): GasEstimationService {
    return new GenericDelegatorGasEstimation(delegatorUrl, clauseBuilder);
}
