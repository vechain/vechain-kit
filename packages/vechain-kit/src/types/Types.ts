export type Wallet = {
    address: string | null;
    domain?: string;
    image?: string;
};

export type SmartAccount = Wallet & {
    isDeployed: boolean;
};

export type ConnectionSource = {
    type: 'privy' | 'wallet' | 'privy-cross-app';
    displayName: string;
};
