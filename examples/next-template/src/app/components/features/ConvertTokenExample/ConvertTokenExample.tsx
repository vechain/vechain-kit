'use client';

import { Box, Button, Heading, HStack } from '@chakra-ui/react';
import {
    useWallet,
    useThor,
    useBuildTransaction,
    useTransactionModal,
    useTransactionToast,
    TransactionModal,
    TransactionToast,
    useRefreshBalances,
} from '@vechain/vechain-kit';
import { VOT3__factory } from '@vechain/vebetterdao-contracts';
import { getConfig, useVeChainKitConfig } from '@vechain/vechain-kit';
import { useCallback, useState } from 'react';
import { TransactionClause } from '@vechain/sdk-core';
import { ERC20__factory } from '@vechain/vechain-contract-types';
/**
 * ConvertTokenExample Component
 * 
 * Demonstrates how to interact with the VOT3 contract to convert between B3TR and VOT3 tokens.
 * The VOT3 contract provides two main functions:
 * - convertToVOT3: Locks B3TR tokens and mints equivalent VOT3 tokens for voting
 * - convertToB3TR: Burns VOT3 tokens and releases the equivalent B3TR tokens
 */
export function ConvertTokenExample() {
    const { account } = useWallet();
    const { network } = useVeChainKitConfig();
    const thor = useThor();
    const [convertAmount] = useState<string>('1000000000000000000'); // 1 token (18 decimals)
    const { refresh } = useRefreshBalances();
    const vot3MainnetAddress = getConfig(network.type).vot3ContractAddress;
    const ERC20Interface = ERC20__factory.createInterface();

    const {
        sendTransaction: sendConvertToVOT3,
        status: convertToVOT3Status,
        txReceipt: convertToVOT3Receipt,
        isTransactionPending: isConvertToVOT3Pending,
        error: convertToVOT3Error,
        resetStatus: resetConvertToVOT3Status,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            // First clause: Approve VOT3 contract to transfer B3TR
            const approveClause = {
                to: getConfig(network.type).b3trContractAddress,
                value: '0x0',
                data: ERC20Interface.encodeFunctionData('approve', [
                    vot3MainnetAddress,
                    convertAmount,
                ]),
                comment: `Approve VOT3 contract to transfer ${convertAmount} B3TR`,
                abi: ERC20Interface.getFunction('approve'),
            };

            // Second clause: Convert B3TR to VOT3
            const convertClause = {
                ...thor.contracts
                    .load(vot3MainnetAddress, VOT3__factory.abi)
                    .clause.convertToVOT3(convertAmount).clause,
                comment: `Convert ${convertAmount} B3TR to VOT3`,
            };

            return [approveClause, convertClause] as TransactionClause[];
        },
        refetchQueryKeys: [],
        onSuccess: async () => {
            refresh();
        },
        onFailure: () => {},
        suggestedMaxGas: undefined,
    });

    const {
        sendTransaction: sendConvertToB3TR,
        status: convertToB3TRStatus,
        txReceipt: convertToB3TRReceipt,
        isTransactionPending: isConvertToB3TRPending,
        error: convertToB3TRError,
        resetStatus: resetConvertToB3TRStatus,
    } = useBuildTransaction({
        clauseBuilder: () => {
            if (!account?.address) return [];

            const convertClause = {
                ...thor.contracts
                    .load(vot3MainnetAddress, VOT3__factory.abi)
                    .clause.convertToB3TR(convertAmount).clause,
                comment: `Convert ${convertAmount} VOT3 to B3TR`,
            };

            return [convertClause] as TransactionClause[];
        },
        refetchQueryKeys: [],
        onSuccess: async () => {
            refresh();
        },
        onFailure: () => {},
        suggestedMaxGas: undefined,
    });

    const {
        open: openTransactionModal,
        close: closeTransactionModal,
        isOpen: isTransactionModalOpen,
    } = useTransactionModal();

    const {
        open: openTransactionToast,
        close: closeTransactionToast,
        isOpen: isTransactionToastOpen,
    } = useTransactionToast();

    const handleConvertToVOT3WithToast = useCallback(async () => {
        openTransactionToast();
        await sendConvertToVOT3({});
    }, [sendConvertToVOT3, openTransactionToast]);

    const handleConvertToVOT3WithModal = useCallback(async () => {
        openTransactionModal();
        await sendConvertToVOT3({});
    }, [sendConvertToVOT3, openTransactionModal]);

    const handleConvertToB3TRWithToast = useCallback(async () => {
        openTransactionToast();
        await sendConvertToB3TR({});
    }, [sendConvertToB3TR, openTransactionToast]);

    const handleConvertToB3TRWithModal = useCallback(async () => {
        openTransactionModal();
        await sendConvertToB3TR({});
    }, [sendConvertToB3TR, openTransactionModal]);

    const handleTryAgainConvertToVOT3 = useCallback(async () => {
        resetConvertToVOT3Status();
        await sendConvertToVOT3({});
    }, [sendConvertToVOT3, resetConvertToVOT3Status]);

    const handleTryAgainConvertToB3TR = useCallback(async () => {
        resetConvertToB3TRStatus();
        await sendConvertToB3TR({});
    }, [sendConvertToB3TR, resetConvertToB3TRStatus]);

    return (
        <>
            <Box>
                <Heading size="md">
                    <b>Convert B3TR to VOT3</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleConvertToVOT3WithToast}
                        isLoading={isConvertToVOT3Pending}
                        isDisabled={isConvertToVOT3Pending}
                        colorScheme="blue"
                        data-testid="convert-to-vot3-toast-button"
                    >
                        Convert to VOT3 (Toast)
                    </Button>
                    <Button
                        onClick={handleConvertToVOT3WithModal}
                        isLoading={isConvertToVOT3Pending}
                        isDisabled={isConvertToVOT3Pending}
                        colorScheme="blue"
                        data-testid="convert-to-vot3-modal-button"
                    >
                        Convert to VOT3 (Modal)
                    </Button>
                </HStack>
            </Box>

            <Box mt={8}>
                <Heading size="md">
                    <b>Convert VOT3 to B3TR</b>
                </Heading>
                <HStack mt={4} spacing={4}>
                    <Button
                        onClick={handleConvertToB3TRWithToast}
                        isLoading={isConvertToB3TRPending}
                        isDisabled={isConvertToB3TRPending}
                        colorScheme="green"
                        data-testid="convert-to-b3tr-toast-button"
                    >
                        Convert to B3TR (Toast)
                    </Button>
                    <Button
                        onClick={handleConvertToB3TRWithModal}
                        isLoading={isConvertToB3TRPending}
                        isDisabled={isConvertToB3TRPending}
                        colorScheme="green"
                        data-testid="convert-to-b3tr-modal-button"
                    >
                        Convert to B3TR (Modal)
                    </Button>
                </HStack>
            </Box>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={
                    isConvertToVOT3Pending
                        ? convertToVOT3Status
                        : convertToB3TRStatus
                }
                txError={convertToVOT3Error || convertToB3TRError}
                txReceipt={convertToVOT3Receipt || convertToB3TRReceipt}
                onTryAgain={
                    isConvertToVOT3Pending
                        ? handleTryAgainConvertToVOT3
                        : handleTryAgainConvertToB3TR
                }
                description={
                    isConvertToVOT3Pending
                        ? `Convert ${convertAmount} B3TR to VOT3`
                        : `Convert ${convertAmount} VOT3 to B3TR`
                }
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={
                    isConvertToVOT3Pending
                        ? convertToVOT3Status
                        : convertToB3TRStatus
                }
                txReceipt={convertToVOT3Receipt || convertToB3TRReceipt}
                txError={convertToVOT3Error || convertToB3TRError}
                onTryAgain={
                    isConvertToVOT3Pending
                        ? handleTryAgainConvertToVOT3
                        : handleTryAgainConvertToB3TR
                }
                uiConfig={{
                    title: isConvertToVOT3Pending
                        ? 'Convert to VOT3'
                        : 'Convert to B3TR',
                    description: isConvertToVOT3Pending
                        ? `Convert ${convertAmount} B3TR to VOT3`
                        : `Convert ${convertAmount} VOT3 to B3TR`,
                    showShareOnSocials: true,
                    showExplorerButton: true,
                    isClosable: true,
                }}
            />
        </>
    );
}
