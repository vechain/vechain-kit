export type ExternalLinkDestination =
    | 'documentation'
    | 'npm'
    | 'github'
    | 'smart-accounts'
    | `example-app-${string}`;

export interface ExternalLinkProperties {
    destination: ExternalLinkDestination;
    isConnected: boolean;
    source: string;
}
