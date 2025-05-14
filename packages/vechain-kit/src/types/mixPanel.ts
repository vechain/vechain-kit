export enum VeLoginMethod {
    EMAIL = 'email',
    GOOGLE = 'google',
    VECHAIN = 'vechain',
    DAPPKIT = 'dappkit',
    ECOSYSTEM = 'ecosystem',
    PASSKEY = 'passkey',
    OAUTH = 'oauth',
    MORE = 'more',
}

export enum VePrivySocialLoginMethod {
    EMAIL = 'email',
    X = 'X',
    DISCORD = 'Discord',
    VECHAIN = 'VeChain',
}

export enum DappKitSource {
    VEWORLD = 'veworld',
    SYNC2 = 'sync2',
    WALLET_CONNECT = 'wallet-connect',
}

export type LoginEventProperties = {
    loginMethod: VeLoginMethod;
    platform?: VePrivySocialLoginMethod | DappKitSource | string;
};

export type AuthAction =
    | 'start'
    | 'method_selected'
    | 'try_again'
    | 'connect_initiated'
    | 'connect_success'
    | 'connect_failed'
    | 'drop_off'
    | 'logout'
    | 'disconnect_initiated';

export type DropOffStage =
    | 'social-login'
    | 'oauth'
    | 'social-callback'
    | 'email-verification'
    | 'email-code-entry'
    | 'vechain-connect'
    | 'vechain-approval'
    | 'dappkit-view'
    | 'dappkit-app-selection'
    | 'dappkit-wallet-connect'
    | 'dappkit-veworld'
    | 'dappkit-sync2'
    | 'ecosystem-view'
    | 'ecosystem-app-selection'
    | 'ecosystem-app-connect'
    | 'passkey-prompt'
    | 'passkey-creation'
    | 'passkey-authentication';

export type AuthProperties = {
    action: AuthAction;
    loginMethod?: VeLoginMethod;
    platform?: VePrivySocialLoginMethod | DappKitSource | string;
    chainName?: string;
    fromScreen?: string;
    error?: string;
    isError?: boolean;
    dropOffStage?: DropOffStage;
    totalConnections?: number;
    appName?: string;
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
    | 'customise_opened'
    | 'customization_started'
    | 'customization_completed'
    | 'customization_failed'
    | 'customization_drop_off'
    | 'image_upload';

export type AccountProperties = {
    action: AccountAction;
    section?: string;
    newName?: string;
    fromScreen?: string;
    fields?: string[];
    error?: string;
    isError?: boolean;
    stage?: 'avatar' | 'form' | 'confirmation';
    success?: boolean;
    hasAvatar?: boolean;
    hasDisplayName?: boolean;
    hasDescription?: boolean;
    hasSocials?: boolean;
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
    | 'Profile Updated'
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
    | 'FAQ Flow'
    | 'Settings Flow'
    | 'Wallet Flow'
    | 'Ecosystem Flow'
    | 'Swap Flow'
    | 'Bridge Flow'
    | 'Name Selection Flow'
    | 'Customization Flow';

export type ConnectionListProperties = {
    totalConnections?: number;
};

export type WalletConnectProperties = {
    walletType: VeLoginMethod;
};

export type AddressCopiedProperties = {
    fromScreen?: string;
    context?: string;
};

export type EcosystemAction =
    | 'view'
    | 'button_click'
    | 'search'
    | 'app_select'
    | 'app_launch'
    | 'add_shortcut'
    | 'filter_by_category';

export type EcosystemProperties = {
    action: EcosystemAction;
    appName?: string;
    query?: string;
    resultsCount?: number;
    category?: string;
    error?: string;
    isError?: boolean;
};

export type NameSelectionDropOffStage =
    | 'search'
    | 'avatar'
    | 'form'
    | 'confirmation';

export type NameSelectionAction =
    | 'name_selection_started'
    | 'name_selection_searched'
    | 'name_selection_completed'
    | 'name_selection_drop_off'
    | 'name_selection_failed'
    | 'name_selection_retry';

export type NameSelectionProperties = {
    action: NameSelectionAction;
    stage?: NameSelectionDropOffStage;
    newName?: string;
    language?: string;
    previousLanguage?: string;
    isOwnDomain?: boolean;
    isAvailable?: boolean;
    error?: string;
    source?: string;
    isError?: boolean;
    reason?: string;
    success?: boolean;
};

export type SettingsAction =
    | 'view'
    | 'security_view'
    | 'manage_security_settings'
    | 'upgrade_smart_account'
    | 'embedded_wallet_view'
    | 'connection_view'
    | 'language_changed'
    | 'general_settings_view'
    | 'currency_settings_view'
    | 'language_settings_view'
    | 'appearance_settings_view';

export type SettingsProperties = {
    action: SettingsAction;
    section?: string;
    stage?: NameSelectionDropOffStage;
    language?: string;
    previousLanguage?: string;
    error?: string;
    isError?: boolean;
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
    action: SendAction;
    tokenSymbol: string;
    amount?: string;
    recipientAddress?: string;
    recipientType?: 'address' | 'domain' | 'contact';
    txHash?: string;
    transactionType?: 'erc20' | 'vet';
    error?: string;
    isError: boolean;
};

export type EventPropertiesMap = {
    'User Logged In': LoginEventProperties;
    'DApp Opened': DAppOpenedProperties;
    'Connection List Viewed': ConnectionListProperties;
    'Wallet Connect Initiated': WalletConnectProperties;
    'Address Copied': AddressCopiedProperties;
    'Balance Viewed': { tokens: string[] };
    'DApp Connected': { dappName: string; walletAddress: string };
    'DApp Disconnected': { dappName: string };
    'Transaction Requested': { dappName: string; transactionType: string };
    'Transaction Completed': { dappName: string; transactionType: string };
    'Transaction Failed': TransactionFailedProperties;
    'Account Connected': AccountConnectedProperties;
    'Account Disconnected': AccountDisconnectedProperties;
    'Notification Flow': NotificationProperties;
    'Auth Flow': AuthProperties;
    'Account Flow': AccountProperties;
    'FAQ Flow': FAQProperties;
    'Settings Flow': SettingsProperties;
    'Wallet Flow': WalletProperties;
    'Ecosystem Flow': EcosystemProperties;
    'Swap Flow': SwapProperties;
    'Bridge Flow': object;
    'Name Selection Flow': NameSelectionProperties;
    'Customization Flow': CustomizationProperties;
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

export type WalletAction =
    | 'view'
    | 'close'
    | 'balance_refresh'
    | 'assets_view'
    | 'token_search'
    | 'token_page_view'
    | 'max_token_selected'
    | 'receive_qr_generated'
    | 'address_copied';

export type WalletProperties = {
    action: WalletAction;
    tokenSymbol?: string;
    tokenAddress?: string;
    connected?: boolean;
    query?: string;
    resultsCount?: number;
    context?: string;
    error?: string;
    isError?: boolean;
};

export type SendAction =
    | 'initiated'
    | 'token_select'
    | 'token_search'
    | 'token_page_view'
    | 'token_selected'
    | 'amount'
    | 'recipient'
    | 'review'
    | 'confirmation'
    | 'completed';

export type SendProperties = {
    action: SendAction;
    tokenSymbol?: string;
    amount?: string;
    recipientAddress?: string;
    recipientType?: 'address' | 'domain' | 'contact';
    txHash?: string;
    transactionType?: 'erc20' | 'vet';
    query?: string;
    error?: string;
    isError?: boolean;
};

export type SwapAction = 'view' | 'button_click' | 'launch_better_swap';

export type SwapProperties = {
    action: SwapAction;
    error?: string;
    isError?: boolean;
};

export type BridgeAction = 'view' | 'button_click' | 'launch_vechain_energy';

export type BridgeProperties = {
    action: BridgeAction;
    error?: string;
    isError?: boolean;
};

export type CustomizationAction =
    | 'started'
    | 'completed'
    | 'drop_off'
    | 'customization_failed'
    | 'image_upload';

export type CustomizationProperties = {
    action: CustomizationAction;
    stage?: 'avatar' | 'form' | 'confirmation';
    reason?: string;
    error?: string;
    isError?: boolean;
    success?: boolean;
    hasAvatar?: boolean;
    hasDisplayName?: boolean;
    hasDescription?: boolean;
    hasSocials?: boolean;
};
