import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrivyClient, User } from '@privy-io/server-auth';

// Define types for social media usernames
type SocialUsernames = {
    google?: string;
    apple?: string;
    twitter?: string;
    discord?: string;
    github?: string;
    telegram?: string;
    instagram?: string;
    linkedin?: string;
};
  
// Define the user identifiers interface
interface UserIdentifiers {
    email?: string;
    usernames: SocialUsernames;
}

// Define social account types for type safety
type SocialAccountType = 
    | 'google_oauth'
    | 'apple_oauth'
    | 'twitter_oauth'
    | 'discord_oauth'
    | 'github_oauth'
    | 'telegram'
    | 'instagram_oauth'
    | 'linkedin_oauth';

// Map social account types to their username field names
const SOCIAL_ACCOUNT_MAPPINGS: Record<SocialAccountType, keyof SocialUsernames> = {
    'google_oauth': 'google',
    'apple_oauth': 'apple',
    'twitter_oauth': 'twitter',
    'discord_oauth': 'discord',
    'github_oauth': 'github',
    'telegram': 'telegram',
    'instagram_oauth': 'instagram',
    'linkedin_oauth': 'linkedin'
};

/**
 * Extracts user identifiers (email and social media usernames) from a Privy user
 * @param user - The Privy user object
 * @returns UserIdentifiers object containing email and social media usernames
*/
function getUserIdentifiers(user: User): UserIdentifiers {
    const identifiers: UserIdentifiers = {
        usernames: {}
    };
  
    // Get email if available
    if (user.email?.address) {
      identifiers.email = user.email.address;
    }
  
    // Get usernames from linked accounts
    user.linkedAccounts.forEach(account => {
        const accountType = account.type as SocialAccountType;
        const usernameField = SOCIAL_ACCOUNT_MAPPINGS[accountType];
        
        if (usernameField) {
            // Handle email-based accounts (google, apple)
            if (accountType === 'google_oauth' || accountType === 'apple_oauth' || accountType === 'linkedin_oauth') {
                const emailAccount = account as { email?: string };
                identifiers.usernames[usernameField] = emailAccount.email || undefined;
            } 
            // Handle username-based accounts
            else {
                const usernameAccount = account as { username?: string };
                identifiers.usernames[usernameField] = usernameAccount.username || undefined;
            }
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
