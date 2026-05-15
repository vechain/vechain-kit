/**
 * Static address book of the well-known VeChain tokens, lifted from the kit's
 * config (packages/vechain-kit/src/config/{mainnet,testnet,solo}.ts). Hits
 * before any live RPC lookup so common cases ("Send 10 B3TR") render
 * instantly without a network round trip.
 */
import type { TokenInfo } from './decoder';

export type NETWORK_TYPE = 'main' | 'test' | 'solo';

const lower = (s: string) => s.toLowerCase();

const VTHO_ADDR = '0x0000000000000000000000000000456E65726779';

const MAINNET: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0x5ef79995FE8a89e0812330E4378eB2660ceDe699')]: {
        address: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x76Ca782B59C74d088C7D2Cce2f211BC00836c602')]: {
        address: '0x76Ca782B59C74d088C7D2Cce2f211BC00836c602',
        symbol: 'VOT3',
        decimals: 18,
    },
};

const TESTNET: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0x95761346d18244bb91664181bf91193376197088')]: {
        address: '0x95761346d18244bb91664181bf91193376197088',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e')]: {
        address: '0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e',
        symbol: 'VOT3',
        decimals: 18,
    },
};

const SOLO: Record<string, TokenInfo> = {
    [lower(VTHO_ADDR)]: {
        address: VTHO_ADDR,
        symbol: 'VTHO',
        decimals: 18,
    },
    [lower('0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4')]: {
        address: '0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4',
        symbol: 'B3TR',
        decimals: 18,
    },
    [lower('0x028Af33230576c1e073C8245F72a7A4aa53564E4')]: {
        address: '0x028Af33230576c1e073C8245F72a7A4aa53564E4',
        symbol: 'VOT3',
        decimals: 18,
    },
};

export function getConfig(network: NETWORK_TYPE): Record<string, TokenInfo> {
    if (network === 'main') return MAINNET;
    if (network === 'test') return TESTNET;
    return SOLO;
}
