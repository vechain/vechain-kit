import { network } from 'hardhat';

import { mine } from '@nomicfoundation/hardhat-network-helpers';
import { Address, Clause, VET, ZERO_ADDRESS } from '@vechain/sdk-core';
import {
    type TransactionClause,
    type TransactionBody,
} from '@vechain/sdk-core';
import { buildTxBody, signAndSendTx } from './txHelper';
import { getTestKeys } from './seedAccounts';

export const waitForNextBlock = async () => {
    if (network.name === 'hardhat') {
        await mine(1);
        return;
    }

    // since we do not support ethers' evm_mine yet, do a vet transaction to force a block
    const clauses: TransactionClause[] = [
        Clause.transferVET(
            Address.of(ZERO_ADDRESS),
            VET.of(10000),
        ) as TransactionClause,
    ];

    const accounts = getTestKeys(3);
    const signer = accounts[2];

    const body: TransactionBody = await buildTxBody(
        clauses,
        signer.address,
        32,
        10_000_000,
    );

    if (!signer.pk) throw new Error('No private key');

    return await signAndSendTx(body, signer.pk);
};

export const moveBlocks = async (blocks: number) => {
    for (let i = 0; i < blocks; i++) {
        await waitForNextBlock();
    }
};
