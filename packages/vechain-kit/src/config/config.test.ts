import { describe, expect, it } from 'vitest';
import { Address } from '@vechain/sdk-core';
import { getConfig, type AppConfig } from './index';
import type { NETWORK_TYPE } from './network';

const NETWORKS: NETWORK_TYPE[] = ['main', 'test', 'solo'];

describe('getConfig', () => {
    it.each(NETWORKS)('returns a self-consistent config for %s', (type) => {
        const config = getConfig(type);
        expect(config.network.type).toBe(type);
        expect(config.nodeUrl).toMatch(/^https?:\/\//);
        expect(config.network.genesis.id).toMatch(/^0x[0-9a-f]{64}$/);
        expect(config.network.genesis.number).toBe(0);
    });

    // Contracts not deployed on a network are configured as '' (never a bogus address).
    it.each(NETWORKS)(
        '*Address fields are valid addresses or empty for %s',
        (type) => {
            const config = getConfig(type) as unknown as Record<
                keyof AppConfig,
                string
            >;
            const invalid = Object.entries(config)
                .filter(
                    ([key, value]) =>
                        /Address$/.test(key) &&
                        value !== undefined &&
                        value !== '',
                )
                .filter(([, value]) => !Address.isValid(value))
                .map(([key]) => key);
            expect(invalid).toEqual([]);
        },
    );

    it.each(NETWORKS)(
        'has a smart-account factory and VTHO contract on %s',
        (type) => {
            expect(Address.isValid(getConfig(type).accountFactoryAddress)).toBe(
                true,
            );
            expect(getConfig(type).vthoContractAddress.toLowerCase()).toBe(
                '0x0000000000000000000000000000456e65726779',
            );
        },
    );

    it('rejects unknown network types', () => {
        expect(() => getConfig('devnet' as NETWORK_TYPE)).toThrow(
            'Unsupported NETWORK_TYPE devnet',
        );
    });
});
