import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrivyClient, User } from '@privy-io/server-auth';
import axios from 'axios';

// Define types for all identifiers
type UserIdentifiers = {
    [key: string]: string | boolean | undefined;
    email?: string;
    google?: string;
    apple?: string;
    twitter?: string;
    discord?: string;
    github?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
    isDisposable?: boolean;
};
  
// Define social account types for type safety
type SocialAccountType =
    | 'email'
    | 'google_oauth'
    | 'apple_oauth'
    | 'twitter_oauth'
    | 'discord_oauth'
    | 'github_oauth'
    | 'telegram'
    | 'instagram_oauth'
    | 'linkedin_oauth';

interface LinkedAccount {
    type: string;
    email?: string | null;
    address?: string | null;
    username?: string | null;
}

const PRIVY_APP_ID = process.env.PRIVY_APP_ID as string;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET as string;
const USERCHECK_API_KEY = process.env.USERCHECK_API_KEY as string;

export async function checkPrivyDenylist(email: string): Promise<boolean> {
    const emailDomain = email.split('@')[1];
    try {
        const response = await axios.get(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/denylist`, { // Initial request to get the denylist, no cursor query parameter
            auth: {
                username: PRIVY_APP_ID,
                password: PRIVY_APP_SECRET
            },
            headers: {
                'privy-app-id': PRIVY_APP_ID
            }
        });

        if (!response.data.data) {
            return false;
        }

        const exists = response.data.data.some((dataObject: { value: string }) => dataObject.value === emailDomain);
        if (exists) {
            return true;
        }

        let cursor = response.data?.next_cursor;
        while (cursor) {
            const nextResponse = await axios.get(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/denylist?cursor=${cursor}`, {
                auth: {
                    username: PRIVY_APP_ID,
                    password: PRIVY_APP_SECRET
                },
                headers: {
                    'privy-app-id': PRIVY_APP_ID
                }
            });

            const exists = nextResponse.data.data.some((dataObject: { value: string }) => dataObject.value === emailDomain);
            if (exists) {
                return true;
            }
            cursor = nextResponse.data.next_cursor;
        }

        return false;
    } catch (error) {
        console.error('Error checking email disposability:', error);
        return false;
    }
}

export async function tryUserCheck(email: string): Promise<boolean> {
    if (!USERCHECK_API_KEY) {
        return false;
    }
    try {
        const response = await axios.get(`https://api.usercheck.com/domain/${email.split('@')[1]}`, {
            headers: {
                'Authorization': `Bearer ${USERCHECK_API_KEY}`
            }
        });
        return response.data.disposable;
    } catch (error) {
        console.error('Error checking email disposability:', error);
        return false;
    }
}

/**
 * Get the identifiers for the user
 * @param user - The user object from Privy
 * @returns The identifiers for the user
 */
export function getUserIdentifiers(user: User): UserIdentifiers {
    const identifiers: UserIdentifiers = {};

    // Get email if available
    if (user.email?.address) {
        identifiers.email = user.email.address;
    }

    // Get usernames from linked accounts
    user.linkedAccounts.forEach((account: LinkedAccount) => {
        const accountType = account.type as SocialAccountType;
        // Remove '_oauth' suffix to get the field name
        const field = accountType.replace('_oauth', '') as keyof UserIdentifiers;
        
        // Handle email-based accounts (email, google, apple, linkedin)
        if (accountType === 'email' || accountType === 'google_oauth' || accountType === 'apple_oauth' || accountType === 'linkedin_oauth') {
            if (account.email) {
                identifiers[field] = account.email || undefined;
            } else if (account.address) {
                identifiers[field] = account.address || undefined;
            }
        } 
        // Handle username-based accounts
        else if (account.username) {
            identifiers[field] = account.username || undefined;
        }
    });
    return identifiers;
}

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // Get wallet address from query parameters
        const walletAddress = event.pathParameters?.walletAddress;
        if (!walletAddress) {
            return {
                statusCode: 422,
                body: JSON.stringify({
                    message: 'Unprocessable Entity',
                }),
            };
        }

        if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
            throw new Error('Missing required environment variables');
        }

        const privy = new PrivyClient(
            PRIVY_APP_ID,
            PRIVY_APP_SECRET
        );
      
        const user = await privy.getUserByWalletAddress(walletAddress);

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'User not found',
                }),
            };
        }

        const identifiers = getUserIdentifiers(user);

        if (identifiers.email) {
            try {
                const isInDenylist = await checkPrivyDenylist(identifiers.email);
                identifiers.isDisposable = isInDenylist;
                if (!isInDenylist) {
                    const isDisposable = await tryUserCheck(identifiers.email);
                    identifiers.isDisposable = isDisposable;
                }
            } catch (error) {
                console.error('Error checking email disposability:', error);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(identifiers),
        };
    } catch (err) {
        console.error('Error processing request:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    }
};
