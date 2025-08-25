import { useGetChainId, useHasV1SmartAccount, useSmartAccountVersion, useWallet } from '@/hooks';
import { useSmartAccount } from '@/hooks';
import { buildClauses } from '@/utils/clauseBuilder';
import { ClauseBuilderDependencies, useBuildExecWithAuthClauses } from './useBuildExecWithAuthClauses';
import { TransactionClause } from '@vechain/sdk-core';

export interface BuildClausesParams {
    clauses: TransactionClause[];
    chainId: number;
    verifyingContract: string;
    version: number;
    isEstimation?: boolean;
    dependencies: ClauseBuilderDependencies;
}

export const useClauseBuilder = () => {
    const { connectedWallet, } = useWallet();
    const { data: smartAccount } = useSmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: hasV1SmartAccount } = useHasV1SmartAccount(
        connectedWallet?.address ?? '',
    );
    const { data: chainId } = useGetChainId();
    const { data: smartAccountVersion } = useSmartAccountVersion(
        smartAccount?.address ?? '',
        connectedWallet?.address ?? '',
    );
    const clauseBuilderDeps = useBuildExecWithAuthClauses();
    const params = {
        chainId: chainId as unknown as number,
        verifyingContract: smartAccount?.address ?? '',
        version: !hasV1SmartAccount ? smartAccountVersion : 1,
        dependencies: clauseBuilderDeps,
    };

    // Return a function that can be used to build clauses
    const buildClausesWithAuth = async (clauses: TransactionClause[]) => {
        if (!chainId) {
            throw new Error('Required data not available');
        }

        const buildWithExecClauses = await buildClauses({
            clauses,
            ...params,
            dependencies: clauseBuilderDeps,
        });
        return {
            clauses: buildWithExecClauses,
            ...params,
            dependencies: clauseBuilderDeps,
        };
    };

    return {
        buildClausesWithAuth,
    };
};