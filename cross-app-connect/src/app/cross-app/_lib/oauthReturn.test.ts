import { beforeEach, describe, expect, it } from 'vitest';
import {
    getOAuthRedirectUrl,
    restoreQueryAfterOAuth,
    stashQueryForOAuth,
} from './oauthReturn';

const PAGE = 'https://connect.vechain.org/cross-app/connect';
const REQUEST_QUERY =
    '?intent=google&requester_public_key=abc&connect=true&requester_origin=https%3A%2F%2Fapp.example';

const navigate = (url: string) => window.history.replaceState(null, '', url);

describe('oauthReturn', () => {
    beforeEach(() => {
        sessionStorage.clear();
        navigate(`${PAGE}${REQUEST_QUERY}`);
    });

    it('redirects OAuth to the page without its query', () => {
        expect(getOAuthRedirectUrl()).toBe(PAGE);
    });

    it('merges the stashed request query with Privy return params', () => {
        stashQueryForOAuth();
        navigate(
            `${PAGE}?privy_oauth_code=c&privy_oauth_state=s&privy_oauth_provider=google`,
        );

        restoreQueryAfterOAuth();

        const params = new URL(window.location.href).searchParams;
        expect(params.get('requester_public_key')).toBe('abc');
        expect(params.get('intent')).toBe('google');
        expect(params.get('requester_origin')).toBe('https://app.example');
        expect(params.get('privy_oauth_code')).toBe('c');
        expect(params.get('privy_oauth_provider')).toBe('google');
    });

    it('restores only once', () => {
        stashQueryForOAuth();
        navigate(`${PAGE}?privy_oauth_code=c&privy_oauth_state=s`);
        restoreQueryAfterOAuth();

        navigate(`${PAGE}?privy_oauth_code=c2&privy_oauth_state=s2`);
        restoreQueryAfterOAuth();

        expect(window.location.search).toBe(
            '?privy_oauth_code=c2&privy_oauth_state=s2',
        );
    });

    it('leaves a URL without Privy return params untouched', () => {
        stashQueryForOAuth();
        navigate(`${PAGE}?other=1`);

        restoreQueryAfterOAuth();

        expect(window.location.search).toBe('?other=1');
    });

    it('keeps stashes per page', () => {
        stashQueryForOAuth();
        navigate(
            'https://connect.vechain.org/cross-app/transact?privy_oauth_code=c&privy_oauth_state=s',
        );

        restoreQueryAfterOAuth();

        expect(window.location.search).toBe(
            '?privy_oauth_code=c&privy_oauth_state=s',
        );
    });
});
