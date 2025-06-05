import { Mnemonic, Hex, Address, VET } from '@vechain/sdk-core';

const VECHAIN_DEFAULT_MNEMONIC =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';

export type TestPk = {
    pk: Uint8Array;
    pkHex: string;
    address: string;
};

export type SeedAccount = {
    key: TestPk;
    amount: bigint;
};

export enum SeedStrategy {
    RANDOM,
    FIXED,
    LINEAR,
}

const isStagingEnv = process.env.NEXT_PUBLIC_APP_ENV === 'testnet-staging';

const PHRASE = (
    isStagingEnv
        ? process.env.TESTNET_STAGING_MNEMONIC
        : process.env.MNEMONIC || VECHAIN_DEFAULT_MNEMONIC
)?.split(' ');

export const TEST_DERIVATION_PATH = 'm';

export const getTestKey = (
    index: number,
    derivationPath: string = TEST_DERIVATION_PATH,
): TestPk => {
    if (!PHRASE) {
        throw new Error('Mnemonic not found');
    }
    const pk = Mnemonic.toPrivateKey(PHRASE, `${derivationPath}/${index}`);
    const pkHex = Hex.of(pk).toString();
    return {
        pk,
        pkHex,
        address: Address.ofMnemonic(PHRASE).toString(),
    };
};

export const getTestKeys = (count: number): TestPk[] => {
    const accounts = [];
    for (let i = 0; i < count; i++) {
        accounts.push(getTestKey(i));
    }

    return accounts;
};

/**
 * Generates a random starting balance for an account
 * Lower balances are favoured based on a log scale
 * @param min
 * @param max
 * @returns
 */
const getRandomStartingBalance = (min: number, max: number): bigint => {
    const scale = Math.log(max) - Math.log(min);
    const random = Math.random() ** 6; // Raise to a power to skew towards smaller values.
    const result = Math.exp(Math.log(min) + scale * random);
    return VET.of(Math.floor(result)).wei;
};

/**
 * Get seed accounts based on the strategy
 * @param strategy the strategy to use
 * @param numAccounts the number of accounts to generate
 * @param acctOffset the offset to start the account index
 * @returns a list of seed accounts
 */
export const getSeedAccounts = (
    strategy: SeedStrategy,
    numAccounts: number,
    acctOffset: number,
): SeedAccount[] => {
    switch (strategy) {
        case SeedStrategy.RANDOM:
            return getSeedAccountsRandom(numAccounts, acctOffset);
        case SeedStrategy.LINEAR:
            return getSeedAccountsLinear(numAccounts, acctOffset);
        case SeedStrategy.FIXED:
            return getSeedAccountsFixed(numAccounts, acctOffset);
        default:
            throw new Error('Unknown seed strategy');
    }
};

const getSeedAccountsFixed = (
    numAccounts: number,
    acctOffset: number,
): SeedAccount[] => {
    const keys = getTestKeys(numAccounts + acctOffset);

    const seedAccounts: SeedAccount[] = [];

    keys.slice(acctOffset).forEach((key) => {
        seedAccounts.push({
            key,
            amount: VET.of(200000).wei,
        });
    });

    return seedAccounts;
};

const getSeedAccountsRandom = (
    numAccounts: number,
    acctOffset: number,
): SeedAccount[] => {
    const keys = getTestKeys(numAccounts + acctOffset);

    const seedAccounts: SeedAccount[] = [];

    keys.slice(acctOffset).forEach((key) => {
        seedAccounts.push({
            key,
            amount: getRandomStartingBalance(5, 1000),
        });
    });

    return seedAccounts;
};

const getSeedAccountsLinear = (
    numAccounts: number,
    acctOffset: number,
): SeedAccount[] => {
    const keys = getTestKeys(numAccounts + acctOffset);

    const seedAccounts: SeedAccount[] = [];

    keys.slice(acctOffset).forEach((key, index) => {
        seedAccounts.push({
            key,
            amount: VET.of(index + 1 * 5).wei,
        });
    });

    return seedAccounts;
};
