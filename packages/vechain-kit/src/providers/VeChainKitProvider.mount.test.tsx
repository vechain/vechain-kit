import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createFakeThorNode, FAKE_NODE_URL } from '../../test/fakes/thorNode';
import { resetPrivyMock } from '../../test/mocks/privyReactAuth';

// Privy is faked (it needs a live backend); dapp-kit, wagmi, cross-app-connect,
// react-query and Chakra are real. This is the "builds but crashes on load" guard.
vi.mock(
    '@privy-io/react-auth',
    () => import('../../test/mocks/privyReactAuth'),
);

import { VeChainKitProvider, useVeChainKitConfig } from './VeChainKitProvider';
import { useWallet, useThor } from '@/hooks';
import { WalletButton } from '@/components';

let observed:
    | {
          connection: ReturnType<typeof useWallet>['connection'];
          nodeUrl: string;
      }
    | undefined;
const Probe = () => {
    const { connection } = useWallet();
    const thor = useThor();
    useVeChainKitConfig();
    observed = { connection, nodeUrl: thor.httpClient.baseURL };
    return <div data-testid="child">child</div>;
};

beforeEach(() => {
    resetPrivyMock();
    observed = undefined;
    window.localStorage.clear();
    createFakeThorNode().install();
});
afterEach(() => vi.unstubAllGlobals());

describe('VeChainKitProvider mount', () => {
    it('renders children through the full provider stack with a real DAppKitProvider', async () => {
        const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(
            <VeChainKitProvider
                network={{ type: 'test', nodeUrl: FAKE_NODE_URL }}
            >
                <Probe />
                <WalletButton />
            </VeChainKitProvider>,
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(await screen.findByRole('button')).toBeInTheDocument();
        expect(observed?.nodeUrl).toBe(FAKE_NODE_URL);
        expect(observed?.connection).toMatchObject({
            isConnected: false,
            isConnectedWithDappKit: false,
            isConnectedWithPrivy: false,
            network: 'test',
            nodeUrl: FAKE_NODE_URL,
        });
        const crashes = errors.mock.calls.filter((call) =>
            /Cannot read properties|is not a function|Minified React error/.test(
                String(call[0]),
            ),
        );
        expect(crashes).toEqual([]);
    });
});
