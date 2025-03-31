import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrivyClient, User } from '@privy-io/server-auth';

// Define types for all identifiers
type UserIdentifiers = {
    email?: string;
    google?: string;
    apple?: string;
    twitter?: string;
    discord?: string;
    github?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
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

/**
 * Extracts user identifiers (email and social media usernames) from a Privy user
 * @param user - The Privy user object
 * @returns UserIdentifiers object containing all identifiers
*/
function getUserIdentifiers(user: User): UserIdentifiers {
    const identifiers: UserIdentifiers = {};

    // Get email if available
    if (user.email?.address) {
        identifiers.email = user.email.address;
    }

    // Get usernames from linked accounts
    user.linkedAccounts.forEach(account => {
        const accountType = account.type as SocialAccountType;
        // Remove '_oauth' suffix to get the field name
        const field = accountType.replace('_oauth', '') as keyof UserIdentifiers;
        
        // Handle email-based accounts (email, google, apple, linkedin)
        if (accountType === 'email' || accountType === 'google_oauth' || accountType === 'apple_oauth' || accountType === 'linkedin_oauth') {
            const emailAccount = account as { email?: string } | { address?: string };
            if ('email' in emailAccount) {
                identifiers[field] = emailAccount.email;
            } else if ('address' in emailAccount) {
                identifiers[field] = emailAccount.address;
            }
        } 
        // Handle username-based accounts
        else {
            const usernameAccount = account as { username?: string };
            identifiers[field] = usernameAccount.username || undefined;
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

        const privy = new PrivyClient(
            process.env.PRIVY_APP_ID!,
            process.env.PRIVY_APP_SECRET!
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
        return {
            statusCode: 200,
            body: JSON.stringify(identifiers),
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Some error happened',
            }),
        };
    }
};
