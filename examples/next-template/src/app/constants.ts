import { ERC20_ABI, VTHO_ADDRESS } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import { ENV } from '@vechain/vechain-kit/utils';

export const b3trMainnetAddress = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
export const b3trTestnetAddress = '0xbf64cf86894Ee0877C4e7d03936e35Ee8D8b864F';
export const b3trAbi = [
    // Replace this with your actual transfer function ABI
    {
        inputs: [
            {
                name: 'recipient',
                type: 'address',
            },
            {
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

export const thorClient = ThorClient.at(
    ENV.isDevelopment
        ? 'https://testnet.vechain.org'
        : 'https://mainnet.vechain.org',
);
export const vthorContract = thorClient.contracts.load(VTHO_ADDRESS, ERC20_ABI);
