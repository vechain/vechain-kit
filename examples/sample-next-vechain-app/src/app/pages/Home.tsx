'use client';

import { type ReactElement, useMemo, useCallback } from 'react';
import {
    Button,
    Container,
    Heading,
    HStack,
    Text,
    useColorMode,
    VStack,
    Box,
    Spinner,
    Select,
} from '@chakra-ui/react';
import {
    useWallet,
    useSendTransaction,
    useTransactionModal,
    useTransactionToast,
    useAccountModal,
    useGetB3trBalance,
    useCurrentAllocationsRoundId,
    useSelectedGmNft,
    useParticipatedInGovernance,
    useIsPerson,
    WalletButton,
    TransactionToast,
    TransactionModal,
} from '@vechain/vechain-kit';
import { humanAddress } from '@vechain/vechain-kit/utils';
import { b3trAbi, b3trMainnetAddress } from '../constants';
import { Interface } from 'ethers';
import { SigningExample } from '@/app/components/SigningExample';
import { useTranslation } from 'react-i18next';
import { languageNames, supportedLanguages } from '../../../i18n';

export default function Home(): ReactElement {
    const { t, i18n } = useTranslation();
    const { toggleColorMode, colorMode } = useColorMode();

    const { connection, account, connectedWallet, smartAccount } = useWallet();

    const { data: currentAllocationsRoundId } = useCurrentAllocationsRoundId();
    const { gmId } = useSelectedGmNft(account?.address ?? '');
    const { data: participatedInGovernance } = useParticipatedInGovernance(
        account?.address ?? '',
    );
    const { data: isValidPassport } = useIsPerson(account?.address);

    const { open: openAccountModal } = useAccountModal();

    const { data: b3trBalance, isLoading: b3trBalanceLoading } =
        useGetB3trBalance(smartAccount.address ?? undefined);

    const {
        sendTransaction,
        status,
        txReceipt,
        resetStatus,
        isTransactionPending,
        error,
        progress,
    } = useSendTransaction({
        signerAccountAddress: account?.address ?? '',
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

    // A dummy tx sending 0 b3tr tokens
    const clauses = useMemo(() => {
        if (!connectedWallet?.address) return [];

        const clausesArray: any[] = [];
        const abi = new Interface(b3trAbi);
        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: abi.encodeFunctionData('transfer', [
                connectedWallet?.address,
                '0', // 1 B3TR (in wei)
            ]),
            comment: `This is a dummy transaction to test the transaction modal. Confirm to transfer ${0} B3TR to ${humanAddress(
                connectedWallet?.address,
            )}`,
            abi: abi.getFunction('transfer'),
        });

        clausesArray.push({
            to: b3trMainnetAddress,
            value: '0x0',
            data: abi.encodeFunctionData('transfer', [
                connectedWallet?.address,
                '10000000000000000000', // 10 B3TR (in wei)
            ]),
            comment: `This is a second close demonstrating multiclause with privy-corssapp. Transfer ${0.000001} B3TR to ${humanAddress(
                connectedWallet?.address,
            )}`,
            abi: abi.getFunction('transfer'),
        });

        return clausesArray;
    }, [connectedWallet?.address]);

    const handleTransactionWithToast = useCallback(async () => {
        openTransactionToast();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    const handleTransactionWithModal = useCallback(async () => {
        openTransactionModal();
        await sendTransaction(clauses);
    }, [sendTransaction, clauses]);

    if (connection.isLoading) {
        return (
            <Container justifyContent={'center'}>
                <VStack>
                    <Spinner />
                </VStack>
            </Container>
        );
    }

    if (!connection.isConnected) {
        return (
            <Container justifyContent={'center'}>
                <VStack>
                    <WalletButton />
                </VStack>
            </Container>
        );
    }

    return (
        <Container
            height={'full'}
            maxW="container.md"
            justifyContent={'center'}
            wordBreak={'break-word'}
        >
            <VStack spacing={10} mt={10} pb={10} alignItems="flex-start">
                <WalletButton
                    mobileVariant="iconDomainAndAssets"
                    desktopVariant="iconDomainAndAssets"
                />
                {smartAccount.address && (
                    <Box>
                        <Heading size={'md'}>
                            <b>Smart Account</b>
                        </Heading>
                        <Text>Smart Account: {smartAccount.address}</Text>
                        <Text>
                            Deployed: {smartAccount.isDeployed.toString()}
                        </Text>
                        {b3trBalanceLoading ? (
                            <Spinner />
                        ) : (
                            <Text>B3TR Balance: {b3trBalance?.formatted}</Text>
                        )}
                    </Box>
                )}

                <Box>
                    <Heading size={'md'}>
                        <b>Wallet</b>
                    </Heading>
                    <Text>Address: {connectedWallet?.address}</Text>
                </Box>

                <Box>
                    <Heading size={'md'}>
                        <b>Connection</b>
                    </Heading>
                    <Text>Type: {connection.source.type}</Text>
                    <Text>Network: {connection.network}</Text>
                </Box>

                <Box>
                    <Heading size={'md'}>VeBetterDAO</Heading>
                    <Text>
                        Current Allocations Round ID:{' '}
                        {currentAllocationsRoundId}
                    </Text>
                    <Text>Selected GM NFT: {gmId === '0' ? 'None' : gmId}</Text>
                    <Text>
                        Participated in Governance:{' '}
                        {participatedInGovernance?.toString()}
                    </Text>
                    <Text>
                        Is Passport Valid: {isValidPassport?.toString()}
                    </Text>
                </Box>

                <Box>
                    <Heading size={'md'}>
                        <b>UI</b>
                    </Heading>
                    <HStack mt={4} spacing={4}>
                        <Button
                            colorScheme="primary"
                            onClick={() => {
                                toggleColorMode();
                            }}
                        >
                            {colorMode === 'dark' ? 'Light mode' : 'Dark mode'}
                        </Button>
                        <Button onClick={openAccountModal}>
                            Account Modal
                        </Button>
                    </HStack>
                </Box>

                <Box>
                    <Heading size={'md'}>
                        <b>Multilanguage</b>
                    </Heading>
                    <VStack mt={4} spacing={4} alignItems="flex-start">
                        <Text>
                            {t('Demo text to be translated')} - (language should
                            change also in modal and toast)
                        </Text>

                        <Select
                            borderRadius={'md'}
                            size="sm"
                            width="auto"
                            value={i18n.language}
                            onChange={(e) =>
                                i18n.changeLanguage(e.target.value)
                            }
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {
                                        languageNames[
                                            lang as keyof typeof languageNames
                                        ]
                                    }
                                </option>
                            ))}
                        </Select>
                    </VStack>
                </Box>

                <Box>
                    <Heading size={'md'}>
                        <b>Test Transactions</b>
                    </Heading>
                    <HStack mt={4} spacing={4}>
                        <Button
                            onClick={handleTransactionWithToast}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                        >
                            Tx with toast
                        </Button>
                        <Button
                            onClick={handleTransactionWithModal}
                            isLoading={isTransactionPending}
                            isDisabled={isTransactionPending}
                        >
                            Tx with modal
                        </Button>
                    </HStack>
                </Box>

                <SigningExample />
            </VStack>

            <TransactionToast
                isOpen={isTransactionToastOpen}
                onClose={closeTransactionToast}
                status={status}
                error={error}
                txReceipt={txReceipt}
                resetStatus={resetStatus}
                progress={progress}
            />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={closeTransactionModal}
                status={status}
                progress={progress}
                txId={txReceipt?.meta.txID}
                errorDescription={error?.reason ?? 'Unknown error'}
                showSocialButtons={true}
                showExplorerButton={true}
                onTryAgain={handleTransactionWithModal}
                showTryAgainButton={true}
            />
        </Container>
    );
}
