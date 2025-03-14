export enum VeLoginMethod {
    EMAIL = 'email',
    GOOGLE = 'google',
    VECHAIN = 'vechain',
    DAPPKIT = 'dappkit',
    ECOSYSTEM = 'ecosystem',
    PASSKEY = 'passkey',
    MORE = 'more',
}

export enum VePrivySocialLoginMethod {
    EMAIL = 'email',
    X = 'X',
    DISCORD = 'Discord',
    VECHAIN = 'VeChain',
}

export type LoginEventProperties = {
    loginMethod: VeLoginMethod;
    platform?: VePrivySocialLoginMethod;
};

export type DAppOpenedProperties = {
    dappName: 'VeBetterDAO' | 'vet.domains' | 'VeChain Kit';
};

export type UserProperties = {
    first_login_date?: string;
    last_login_date?: string;
    preferred_login_method?: VeLoginMethod;
    total_logins?: number;
    last_active?: string;
    claimed_vet_domain?: boolean;
    [key: string]: any;
};

export type EventName =
    | 'Auth Flow Started'
    | 'User Logged In'
    | 'Login Failed'
    | 'Login Drop-off'
    | 'Login Method Selected'
    | 'First Login'
    | 'Close Connecting'
    | 'Swap Clicked'
    | 'Launch BetterSwap'
    | 'Receive QR Generated'
    | 'Balance Refresh Clicked'
    | 'Balance Refreshed'
    | 'DApp Opened'
    | 'Connection List Viewed'
    | 'Wallet Connect Initiated'
    | 'Wallet Disconnected'
    | 'Chain Selected'
    | 'Profile Page Viewed'
    | 'Address Copied'
    | 'Customise Page Opened'
    | 'Logout Completed'
    | 'Assets Viewed'
    | 'Token Search Performed'
    | 'Token Page Viewed'
    | 'Send Token Initiated'
    | 'Max Token Selected'
    | 'Token Sent'
    | 'Profile Updated'
    | 'Swap Button Clicked'
    | 'Swap Page Opened'
    | 'Bridge Button Clicked'
    | 'Bridge Page Opened'
    | 'Launch VeChain Energy'
    | 'Ecosystem Button Clicked'
    | 'App Search Performed'
    | 'Ecosystem App Selected'
    | 'Launch Ecosystem App'
    | 'Add Ecosystem App To Shortcuts'
    | 'Settings Opened'
    | 'Account Name Changed'
    | 'Access And Security Viewed'
    | 'Preference Updated'
    | 'Embedded Wallet Viewed'
    | 'Manage VeBetterDAO'
    | 'Connection Details Viewed'
    | 'Notifications Cleared'
    | 'Notifications Archived'
    | 'Help Page Viewed'
    | 'FAQ Viewed'
    | 'Search Query Performed'
    | 'Language Changed'
    | 'Swap Flow Started'
    | 'Swap Token Selected'
    | 'Swap Amount Entered'
    | 'Swap Quote Received'
    | 'Swap Executed'
    | 'Swap Completed'
    | 'Swap Failed'
    | 'Wallet Opened'
    | 'QR Code Scanned'
    | 'Tokens Received'
    | 'Tokens Sent'
    | 'Balance Viewed'
    | 'DApp Connected'
    | 'DApp Disconnected'
    | 'Transaction Requested'
    | 'Transaction Completed'
    | 'Transaction Failed';

// Extended property types for new events
export type ConnectionListProperties = {
    totalConnections?: number;
};

export type WalletConnectProperties = {
    walletType: VeLoginMethod;
};

export type ChainSelectedProperties = {
    chainName: string;
    fromScreen: string;
};

export type AddressCopiedProperties = {
    fromScreen?: string;
    context?: string;
};

export type TokenSearchProperties = {
    query: string;
    resultsCount: number;
};

export type TokenPageProperties = {
    tokenSymbol: string;
    tokenAddress?: string;
};

export type SendTokenProperties = {
    tokenSymbol: string;
    recipientType: 'address' | 'domain' | 'contact';
};

export type BridgeProperties = {
    fromChain: string;
    toChain?: string;
};

export type EcosystemProperties = {
    appName?: string;
    searchQuery?: string;
};

export type SettingsProperties = {
    section: string;
    action?: string;
};

export type SearchQueryProperties = {
    query: string;
    section: string;
    resultsCount: number;
};

export type LanguageProperties = {
    language: string;
    previousLanguage: string;
};

// Update EventPropertiesMap with new property types
export type EventPropertiesMap = {
    'User Logged In': LoginEventProperties;
    'DApp Opened': DAppOpenedProperties;
    'Connection List Viewed': ConnectionListProperties;
    'Wallet Connect Initiated': WalletConnectProperties;
    'Chain Selected': ChainSelectedProperties;
    'Address Copied': AddressCopiedProperties;
    'Token Search Performed': TokenSearchProperties;
    'Token Page Viewed': TokenPageProperties;
    'Send Token Initiated': SendTokenProperties;
    'Bridge Button Clicked': BridgeProperties;
    'Bridge Page Opened': BridgeProperties;
    'Launch VeChain Energy': object;
    'Ecosystem Button Clicked': object;
    'App Search Performed': { query: string; resultsCount: number };
    'Ecosystem App Selected': { appName: string };
    'Launch Ecosystem App': { appName: string };
    'Add Ecosystem App To Shortcuts': { appName: string };
    'Settings Opened': SettingsProperties;
    'Search Query Performed': SearchQueryProperties;
    'Language Changed': LanguageProperties;
    'Swap Flow Started': { fromToken: string };
    'Swap Token Selected': { position: 'from' | 'to'; token: string };
    'Swap Amount Entered': { amount: string; token: string };
    'Swap Quote Received': {
        fromToken: string;
        toToken: string;
        rate: number;
        provider: string;
    };
    'Swap Executed': {
        txHash: string;
        fromToken: string;
        toToken: string;
        amount: string;
    };
    'Swap Completed': { txHash: string };
    'Swap Failed': {
        reason: string;
        stage: 'quote' | 'approval' | 'execution';
    };
    'Wallet Opened': object;
    'QR Code Scanned': object;
    'Tokens Received': { token: string; amount: string };
    'Tokens Sent': { token: string; amount: string; destination: string };
    'Balance Viewed': { tokens: string[] };
    'DApp Connected': { dappName: string; walletAddress: string };
    'DApp Disconnected': { dappName: string };
    'Transaction Requested': { dappName: string; transactionType: string };
    'Transaction Completed': { dappName: string; transactionType: string };
    'Transaction Failed': {
        dappName: string;
        transactionType: string;
        reason: string;
    };
    [key: string]: Record<string, any>;
};
