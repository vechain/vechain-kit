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

export type AuthAction =
    | 'start'
    | 'method_selected'
    | 'connect_initiated'
    | 'connect_success'
    | 'connect_failed'
    | 'drop_off'
    | 'logout'
    | 'chain_selected';

export type AuthProperties = {
    action: AuthAction;
    loginMethod?: VeLoginMethod;
    platform?: VePrivySocialLoginMethod;
    chainName?: string;
    fromScreen?: string;
    error?: string;
    isError?: boolean;
    dropOffStage?: 'wallet-connect' | 'email-verification' | 'social-callback';
    totalConnections?: number;
};
export type AccountAction =
    | 'view'
    | 'settings_updated'
    | 'name_changed'
    | 'security_viewed'
    | 'embedded_wallet_viewed'
    | 'manage_dao'
    | 'connections_viewed'
    | 'address_copied'
    | 'customise_opened';

export type AccountProperties = {
    action: AccountAction;
    section?: string;
    newName?: string;
    fromScreen?: string;
    fields?: string[];
    error?: string;
    isError?: boolean;
};

export type FAQAction =
    | 'view'
    | 'faq_opened'
    | 'search'
    | 'category_selected'
    | 'question_expanded';

export type FAQProperties = {
    action: FAQAction;
    faqId?: string;
    faqTitle?: string;
    category?: string;
    searchQuery?: string;
    resultsCount?: number;
    error?: string;
    isError?: boolean;
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

export type NotificationAction =
    | 'view'
    | 'clear'
    | 'archive'
    | 'toggle_view'
    | 'click'
    | 'dismiss';

export type NotificationProperties = {
    action: NotificationAction;
    notificationType?: 'transaction' | 'system' | 'marketing' | 'security';
    totalCount?: number;
    unreadCount?: number;
    isError?: boolean;
    error?: string;
    viewType?: 'current' | 'archived';
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
    | 'Wallet Opened'
    | 'QR Code Scanned'
    | 'Tokens Received'
    | 'Tokens Sent'
    | 'Balance Viewed'
    | 'DApp Connected'
    | 'DApp Disconnected'
    | 'Transaction Requested'
    | 'Transaction Completed'
    | 'Transaction Failed'
    | 'Ecosystem Page Opened'
    | 'Auth Flow'
    | 'Send Flow'
    | 'Notification Flow'
    | 'Account Flow'
    | 'FAQ Flow';

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

export type TokenSentProperties = {
    tokenSymbol: string;
    amount: string;
    txHash: string;
    transactionType: 'erc20' | 'vet';
};

export type TransactionFailedProperties = {
    dappName: string;
    transactionType: string;
    reason: string;
    tokenType?: 'erc20' | 'vet';
};

export type SendFlowProperties = {
    stage: 'token-select' | 'amount' | 'recipient' | 'review' | 'confirmation';
    tokenSymbol: string;
    amount?: string;
    recipientAddress?: string;
    recipientType?: 'address' | 'domain' | 'contact';
    error?: string;
    isError: boolean;
};

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
    'Wallet Opened': object;
    'QR Code Scanned': object;
    'Tokens Received': { token: string; amount: string };
    'Tokens Sent': TokenSentProperties;
    'Balance Viewed': { tokens: string[] };
    'DApp Connected': { dappName: string; walletAddress: string };
    'DApp Disconnected': { dappName: string };
    'Transaction Requested': { dappName: string; transactionType: string };
    'Transaction Completed': { dappName: string; transactionType: string };
    'Transaction Failed': TransactionFailedProperties;
    'Account Connected': AccountConnectedProperties;
    'Account Disconnected': AccountDisconnectedProperties;
    'Send Flow': SendFlowProperties;
    'Send Recipient Entered': SendFlowProperties;
    'Send Review Started': SendFlowProperties;
    'Send Completed': SendFlowProperties;
    'Notification Flow': NotificationProperties;
    'Auth Flow': AuthProperties;
    'Account Flow': AccountProperties;
    'FAQ Flow': FAQProperties;
    [key: string]: Record<string, any>;
};

export type AccountConnectedProperties = {
    address: string;
    walletType: string;
};

export type AccountDisconnectedProperties = {
    address: string;
    walletType: string;
};
