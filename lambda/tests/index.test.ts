import { beforeEach, describe, expect, it, vi, type Mocked } from 'vitest';
import axios from 'axios';
import { PrivyClient, User } from '@privy-io/server-auth';
import {
    getUserIdentifiers,
    checkPrivyDenylist,
    tryUserCheck,
    addToDenylist,
} from '../index';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

const { mockGetUserByWalletAddress } = vi.hoisted(() => ({
    mockGetUserByWalletAddress: vi.fn(),
}));
vi.mock('@privy-io/server-auth', () => ({
    PrivyClient: vi.fn(function () {
        return { getUserByWalletAddress: mockGetUserByWalletAddress };
    }),
}));

const createMockUser = (email: string, linkedAccounts: any[] = []): User =>
    ({
        id: 'test-id',
        createdAt: new Date(),
        isGuest: false,
        customMetadata: {},
        email: {
            address: email,
            verifiedAt: new Date(),
            firstVerifiedAt: new Date(),
            latestVerifiedAt: new Date(),
        },
        linkedAccounts,
    } as User);

describe('Privy User Functions', () => {
    let privy: PrivyClient;

    beforeEach(() => {
        vi.clearAllMocks();
        mockedAxios.get.mockReset();
        privy = new PrivyClient(
            process.env.PRIVY_APP_ID!,
            process.env.PRIVY_APP_SECRET!,
        );
    });

    describe('getUserByWalletAddress', () => {
        it('should return null if user is not found', async () => {
            mockGetUserByWalletAddress.mockResolvedValueOnce(null);
            const user = await privy.getUserByWalletAddress('0x123');
            expect(user).toBeNull();
        });

        it('should return user data if user exists', async () => {
            const mockUser = createMockUser('mojawih502@movfull.com', [
                { type: 'email', email: 'mojawih502@movfull.com' },
            ]);
            mockGetUserByWalletAddress.mockResolvedValueOnce(mockUser);
            const user = await privy.getUserByWalletAddress(
                '0xeae63d5e8d9e582EB59ED3a07f295da1D4068fD4',
            );
            expect(user).toEqual(mockUser);
        });
    });

    describe('getUserIdentifiers', () => {
        it('should extract email from user data', () => {
            const mockUser = createMockUser('mojawih502@movfull.com', [
                { type: 'email', email: 'mojawih502@movfull.com' },
            ]);
            expect(getUserIdentifiers(mockUser)).toEqual({
                email: 'mojawih502@movfull.com',
            });
        });

        it('should extract multiple identifiers from linked accounts', () => {
            const mockUser = createMockUser('test@example.com', [
                { type: 'email', email: 'test@example.com' },
                { type: 'google_oauth', email: 'google@example.com' },
                { type: 'twitter_oauth', username: 'tempuser1234' },
            ]);
            expect(getUserIdentifiers(mockUser)).toEqual({
                email: 'test@example.com',
                google: 'google@example.com',
                twitter: 'tempuser1234',
            });
        });
    });

    describe('checkPrivyDenylist', () => {
        it('should return true if email domain is in denylist', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { data: [{ value: 'movfull.com' }] },
            });
            expect(await checkPrivyDenylist('test@movfull.com')).toBe(true);
        });

        it('should return false if email domain is not in denylist', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { data: [], next_cursor: null },
            });
            expect(await checkPrivyDenylist('test@gmail.com')).toBe(false);
        });

        it('should handle API errors gracefully', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
            expect(await checkPrivyDenylist('test@example.com')).toBe(false);
        });
    });

    describe('tryUserCheck', () => {
        beforeEach(() => {
            process.env.USERCHECK_API_KEY = 'test-key';
        });

        it('should return true if email is disposable', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { disposable: true },
            });
            expect(await tryUserCheck('test@tempmail.com')).toBe(true);
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        it('should return false if email is not disposable', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                status: 200,
                data: { disposable: false },
            });
            expect(await tryUserCheck('test@gmail.com')).toBe(false);
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        it('should handle rate limit exceeded', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                status: 429,
                data: { error: 'Error too many requests' },
            });
            expect(await tryUserCheck('test@example.com')).toBe(false);
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        it('should return false if API key is not set', async () => {
            delete process.env.USERCHECK_API_KEY;
            vi.resetModules();
            const { tryUserCheck: freshTryUserCheck } = await import(
                '../index'
            );
            expect(await freshTryUserCheck('test@example.com')).toBe(false);
            expect(mockedAxios.get).not.toHaveBeenCalled();
        });
    });

    describe('addToDenylist', () => {
        it('should add email domain to denylist', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                status: 200,
                data: { rule_type: 'emailDomain', value: 'movfull.com' },
            });
            expect(await addToDenylist('test@movfull.com')).toBe(true);
            expect(mockedAxios.post).toHaveBeenCalled();
        });

        it('should handle invalid domain', async () => {
            mockedAxios.post.mockRejectedValueOnce({
                status: 400,
                response: { data: { value: 'Invalid domain' } },
            });
            // not an email address: the domain is derived from the part after '@'
            expect(await addToDenylist('movfull.com')).toBe(false);
            expect(mockedAxios.post).toHaveBeenCalled();
        });
    });
});
