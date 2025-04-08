import axios from 'axios';
import { PrivyClient, User } from '@privy-io/server-auth';
import { getUserIdentifiers, checkPrivyDenylist, tryUserCheck } from '../index';

const ENV_VARS = process.env;

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Privy client
const mockGetUserByWalletAddress = jest.fn();
jest.mock('@privy-io/server-auth', () => ({
    PrivyClient: jest.fn().mockImplementation(() => ({
        getUserByWalletAddress: mockGetUserByWalletAddress
    }))
}));

const createMockUser = (email: string, linkedAccounts: any[] = []): User => ({
    id: 'test-id',
    createdAt: new Date(),
    isGuest: false,
    customMetadata: {},
    email: {
        address: email,
        verifiedAt: new Date(),
        firstVerifiedAt: new Date(),
        latestVerifiedAt: new Date()
    },
    linkedAccounts
});

describe('Privy User Functions', () => {
    let privy: PrivyClient;

    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockReset();
        process.env = { ...ENV_VARS };
        privy = new PrivyClient(process.env.PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);
    });

    describe('getUserByWalletAddress', () => {
        it('should return null if user is not found', async () => {
            mockGetUserByWalletAddress.mockResolvedValueOnce(null);
            const user = await privy.getUserByWalletAddress('0x123');
            expect(user).toBeNull();
        });

        it('should return user data if user exists', async () => {
            const mockUser = createMockUser('mojawih502@movfull.com', [
                { type: 'email', email: 'mojawih502@movfull.com' }
            ]);
            mockGetUserByWalletAddress.mockResolvedValueOnce(mockUser);
            const user = await privy.getUserByWalletAddress('0xe6A9e966139c0C160d0aACb390F3F318397356Fb');
            expect(user).toEqual(mockUser);
        });
    });

    describe('getUserIdentifiers', () => {
        it('should extract email from user data', () => {
            const mockUser = createMockUser('mojawih502@movfull.com', [
                { type: 'email', email: 'mojawih502@movfull.com' }
            ]);
            const identifiers = getUserIdentifiers(mockUser);
            expect(identifiers).toEqual({
                email: 'mojawih502@movfull.com'
            });
        });

        it('should extract multiple identifiers from linked accounts', () => {
            const mockUser = createMockUser('test@example.com', [
                { type: 'email', email: 'test@example.com' },
                { type: 'google_oauth', email: 'google@example.com' },
                { type: 'twitter_oauth', username: 'tempuser1234' }
            ]);
            const identifiers = getUserIdentifiers(mockUser);
            expect(identifiers).toEqual({
                email: 'test@example.com',
                google: 'google@example.com',
                twitter: 'tempuser1234'
            });
        });
    });

    describe('checkPrivyDenylist', () => {
        it('should return true if email domain is in denylist', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: [{ value: 'movfull.com' }]
                }
            });
            const isInDenylist = await checkPrivyDenylist('test@movfull.com');
            expect(isInDenylist).toBe(true);
        });

        it('should return false if email domain is not in denylist', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    data: [],
                    next_cursor: null
                }
            });
            const isDisposable = await checkPrivyDenylist('test@gmail.com');
            expect(isDisposable).toBe(false);
        });

        it('should handle API errors gracefully', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
            const isDisposable = await checkPrivyDenylist('test@example.com');
            expect(isDisposable).toBe(false);
        });
    });

    describe('tryUserCheck', () => {
        it('should return true if email is disposable', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { disposable: true }
            });
            const isDisposable = await tryUserCheck('test@tempmail.com');
            expect(isDisposable).toBe(true);
        });

        it('should return false if email is not disposable', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { disposable: false }
            });
            const isDisposable = await tryUserCheck('test@gmail.com');
            expect(isDisposable).toBe(false);
        });

        it('should handle API errors gracefully', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Rate limit exceeded'));
            const isDisposable = await tryUserCheck('test@example.com');
            expect(isDisposable).toBe(false);
        });
    });
}); 