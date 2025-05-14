import {
    generatePrivateKey,
    privateKeyToAccount,
    Account,
} from 'viem/accounts';

export const randomTransactionUser: {
    privateKey: string;
    account: Account;
    address: string;
} = (() => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    return {
        privateKey,
        account,
        address: account.address,
    };
})();
