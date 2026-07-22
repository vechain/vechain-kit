# VeChain Kit — Public API, provider, configuration, and theme

The package manifest, public export graph, provider contract, network configuration, public types, and theming API. Treat these sources as authoritative for valid imports and props.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `packages/vechain-kit/package.json`

````json
{
    "name": "@vechain/vechain-kit",
    "version": "2.12.0",
    "author": "VeChain Foundation",
    "homepage": "https://github.com/vechain/vechain-kit",
    "repository": {
        "type": "git",
        "url": "git+https://github.com/vechain/vechain-kit.git",
        "directory": "packages/vechain-kit"
    },
    "bugs": {
        "url": "https://github.com/vechain/vechain-kit/issues"
    },
    "description": "All-in-one React library for building VeChain applications with wallet integration, social logins, developer hooks, and pre-built UI components.",
    "license": "MIT",
    "sideEffects": false,
    "type": "module",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "keywords": [
        "vechain",
        "vechain-kit",
        "blockchain",
        "web3",
        "dapp",
        "react",
        "nextjs",
        "typescript",
        "vechain-thor",
        "social",
        "login",
        "wallet",
        "cross-app",
        "ecosystem",
        "privy",
        "veworld",
        "sync2",
        "walletconnect",
        "embedded-wallet",
        "smart-account"
    ],
    "files": [
        "dist",
        "package.json",
        "README.md",
        "LICENSE"
    ],
    "scripts": {
        "build": "tsc --noEmit && cross-env NODE_OPTIONS='--max-old-space-size=8192' tsdown",
        "watch": "cross-env NODE_OPTIONS='--max-old-space-size=8192' tsdown --watch",
        "clean": "rm -rf dist .turbo",
        "lint": "eslint",
        "purge": "yarn clean && rm -rf node_modules",
        "translate": "dotenv -e .env -- translo-cli",
        "typecheck": "tsc --noEmit"
    },
    "dependencies": {
        "@adraffy/ens-normalize": "^1.11.0",
        "@chakra-ui/react": "^2.8.2",
        "@emotion/styled": "^11.14.1",
        "@privy-io/cross-app-connect": "0.5.8",
        "@privy-io/react-auth": "2.25.0",
        "@solana/web3.js": "^1.98.0",
        "@tanstack/react-query": "^5.64.2",
        "@tanstack/react-query-devtools": "^5.64.1",
        "@vechain/contract-getters": "1.3.0",
        "@vechain/dapp-kit-react": "2.3.2",
        "@vechain/picasso": "^2.1.1",
        "@vechain/vechain-contract-types": "1.6.0-rc",
        "@wagmi/core": "^2.17.2",
        "bignumber.js": "^9.1.2",
        "browser-image-compression": "^2.0.2",
        "dotenv": "^16.4.7",
        "ethers": "^6.13.5",
        "framer-motion": "^11.15.0",
        "i18next": "^24.2.1",
        "i18next-browser-languagedetector": "^8.0.2",
        "net": "^1.0.2",
        "process": "^0.11.10",
        "react": "^18.2.0",
        "react-device-detect": "^2.2.3",
        "react-hook-form": "^7.54.2",
        "react-i18next": "^15.4.0",
        "react-icons": "^5.4.0",
        "react-qrcode-logo": "^3.0.0",
        "vaul": "^1.1.2",
        "viem": "^2.29.3",
        "wagmi": "^2.15.4"
    },
    "devDependencies": {
        "@types/react": "^18.2.28",
        "@types/react-dom": "^18.2.13",
        "cross-env": "^7.0.3",
        "dotenv-cli": "^8.0.0",
        "eslint": "^9.12.0",
        "eslint-plugin-i18next": "^6.1.1",
        "translo-cli": "^1.0.6",
        "tsdown": "^0.16.5",
        "typescript": "*"
    },
    "peerDependencies": {
        "@chakra-ui/react": "^2.8.2",
        "@emotion/react": "^11.0.0",
        "@emotion/styled": "^11.0.0",
        "@tanstack/react-query": "^5.64.2",
        "@vechain/dapp-kit-react": "2.3.2",
        "framer-motion": "^11.0.0",
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
    },
    "peerDependenciesMeta": {
        "@chakra-ui/react": {
            "optional": true
        },
        "@emotion/react": {
            "optional": true
        },
        "@emotion/styled": {
            "optional": true
        },
        "@tanstack/react-query": {
            "optional": true
        },
        "@vechain/dapp-kit-react": {
            "optional": true
        },
        "framer-motion": {
            "optional": true
        }
    },
    "exports": {
        ".": {
            "import": {
                "types": "./dist/index.d.mts",
                "default": "./dist/index.mjs"
            },
            "require": {
                "types": "./dist/index.d.cts",
                "default": "./dist/index.cjs"
            }
        },
        "./utils": {
            "import": {
                "types": "./dist/utils/index.d.mts",
                "default": "./dist/utils/index.mjs"
            },
            "require": {
                "types": "./dist/utils/index.d.cts",
                "default": "./dist/utils/index.cjs"
            }
        },
        "./assets": {
            "import": {
                "types": "./dist/assets/index.d.mts",
                "default": "./dist/assets/index.mjs"
            },
            "require": {
                "types": "./dist/assets/index.d.cts",
                "default": "./dist/assets/index.cjs"
            }
        }
    }
}
````

## Source: `packages/vechain-kit/src/assets/icons/BetterSwapLogo/index.ts`

````typescript
export { BetterSwapLogo } from './BetterSwapLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/GitHubLogo/index.ts`

````typescript
export * from './GitHubLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/GoogleLogo/index.ts`

````typescript
export * from './GoogleLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/PrivyLogo/index.ts`

````typescript
export * from './PrivyLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/TwitterLogo/index.ts`

````typescript
export * from './TwitterLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/VeTradeLogo/index.ts`

````typescript
export { VeTradeLogo } from './VeTradeLogo';
````

## Source: `packages/vechain-kit/src/assets/icons/VechainEnergy/index.ts`

````typescript
export * from './VechainEnergy';
````

## Source: `packages/vechain-kit/src/assets/icons/VechainLogo/index.ts`

````typescript
export * from './VechainLogo';
export * from './VechainLogoDark';
export * from './VechainLogoLight';
export * from './VechainLogoHorizontalDark';
export * from './VechainLogoHorizontalLight';

export * from './VechainIcon';
export * from './VechainIconLight';
export * from './VechainIconDark';

export * from './VeBetterLogo';
export * from './VeBetterLogoLight';
export * from './VeBetterLogoDark';

export * from './VeBetterIcon';
export * from './VeBetterIconLight';
export * from './VeBetterIconDark';

export * from './VETLogo';
export * from './VTHOLogo';

export * from './VeWorldLogoLight';
export * from './VeWorldLogoDark';
````

## Source: `packages/vechain-kit/src/assets/icons/index.ts`

````typescript
export * from './GoogleLogo';
export * from './GitHubLogo';
export * from './TwitterLogo';
export * from './VechainLogo';
export * from './PrivyLogo';
export * from './VechainEnergy';
export * from './BetterSwapLogo';
export * from './VeTradeLogo';
````

## Source: `packages/vechain-kit/src/assets/index.ts`

````typescript
export * from './icons';
````

## Source: `packages/vechain-kit/src/assets/svg/index.ts`

````typescript
export * from './googleSvg';
export * from './twitterSvg';
export * from './vechainEnergySvg';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Alerts/index.ts`

````typescript
export * from './FeatureAnnouncementCard';
export * from './ExchangeWarningAlert';
export * from './DomainRequiredAlert';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Tabs/Contents/index.ts`

````typescript
export * from './ActivityTabPanel';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/Tabs/index.ts`

````typescript
export * from './Contents';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Components/index.ts`

````typescript
export * from './AccountDetailsButton';
export * from './ActionButton';
export * from './AccountSelector';
export * from './BalanceSection';
export * from './QuickActionsSection';
export * from './Alerts';
export * from './CrossAppConnectionSecurityCard';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Account/index.ts`

````typescript
export * from './AccountMainContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Assets/index.ts`

````typescript
export * from './AssetsContent';
export * from './ManageCustomTokenContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Bridge/index.ts`

````typescript
export * from './BridgeContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ChooseName/index.ts`

````typescript
export * from './ChooseNameContent';
export * from './ChooseNameSearchContent';
export * from './ChooseNameSummaryContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ConnectionDetails/Components/index.ts`

````typescript
export * from './ConnectionCard';
export * from './WalletSecuredBy';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/ConnectionDetails/index.ts`

````typescript
export * from './ConnectionDetailsContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/DisconnectConfirmation/index.ts`

````typescript
export * from './DisconnectConfirmContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Ecosystem/index.ts`

````typescript
export * from './ExploreEcosystemContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/FAQ/index.ts`

````typescript
export { FAQContent } from './FAQContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/FailedOperation/index.ts`

````typescript
export * from './FailedOperationContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/KitSettings/index.ts`

````typescript
export * from './ChangeCurrencyContent';
export * from './LanguageSettingsContent';
export * from './GasTokenSettingsContent';
export * from './SettingsContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/NftCollection/index.ts`

````typescript
export * from './NftCollectionContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/NftDetail/index.ts`

````typescript
export * from './NftDetailContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Notifications/index.ts`

````typescript
export * from './NotificationContent';
export * from './Components/EmptyNotifications';
export * from './Components/NotificationItem';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/PrivyLinkedAccounts/index.ts`

````typescript
export * from './PrivyLinkedAccounts';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/Components/ProfileCard/index.ts`

````typescript
export * from './ProfileCard';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/Customization/index.ts`

````typescript
export * from './CustomizationContent';
export * from './CustomizationSummaryContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Profile/index.ts`

````typescript
export * from './Customization';
export * from './ProfileContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Receive/index.ts`

````typescript
export * from './ReceiveTokenContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SelectWallet/index.ts`

````typescript
export * from './SelectWalletContent';
export * from './RemoveWalletConfirmContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendNft/index.ts`

````typescript
export * from './SendNftContent';
export * from './SendNftSummaryContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/SendToken/index.ts`

````typescript
export { SendTokenContent } from './SendTokenContent';
export { SendTokenSummaryContent } from './SendTokenSummaryContent';
export { SelectTokenContent } from './SelectTokenContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/Swap/index.ts`

````typescript
export * from './SwapTokenContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TermsAndPrivacy/index.ts`

````typescript
export { TermsAndPrivacyContent } from './TermsAndPrivacyContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TokenDetail/index.ts`

````typescript
export * from './TokenDetailContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/TransactionHistory/index.ts`

````typescript
export * from './TransactionHistoryContent';
export * from './TransactionDetailContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/UpgradeSmartAccount/index.ts`

````typescript
export * from './UpgradeSmartAccountContent';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Contents/index.ts`

````typescript
export * from './Account';
export * from './SendToken';
export * from './Receive';
export * from './Swap';
export * from './ChooseName';
export * from './FAQ';
export * from './Profile';
export * from './UpgradeSmartAccount';
export * from './Assets';
export * from './Bridge';
export * from './KitSettings';
export * from './TermsAndPrivacy';
export * from './DisconnectConfirmation';
export * from './SelectWallet';
export * from './TokenDetail';
export * from './NftDetail';
export * from './NftCollection';
export * from './SendNft';
export * from './TransactionHistory';
````

## Source: `packages/vechain-kit/src/components/AccountModal/Types/index.ts`

````typescript
export * from './Types';
````

## Source: `packages/vechain-kit/src/components/AccountModal/index.ts`

````typescript
export * from './AccountModal';
export * from './Contents';
export * from './Components';
export * from './Types';
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Components/index.ts`

````typescript
export * from './ConnectionButton';
export * from './EmailLoginButton';
export * from './VeChainLoginButton';
export * from './EcosystemButton';
export * from './PrivyButton';
export * from './LoginWithGoogleButton';
export * from './LoginWithAppleButton';
export * from './PasskeyLoginButton';
export * from './DappKitButton';
export * from './VeChainWithPrivyLoginButton';
export * from './LoginWithGithubButton';
export * from './VeWorldButton';
export * from './Sync2Button';
export * from './WalletConnectButton';
````

## Source: `packages/vechain-kit/src/components/ConnectModal/Contents/index.ts`

````typescript
export * from './MainContent';
export * from './LoadingContent';
export * from './ErrorContent';
export * from './EcosystemContent';
export * from './MoreOptionsContent';
````

## Source: `packages/vechain-kit/src/components/ConnectModal/index.ts`

````typescript
export * from './ConnectModal';
export * from './Contents';
export * from './Components';
export * from './ConnectPopover';
````

## Source: `packages/vechain-kit/src/components/EmailCodeVerificationModal/index.ts`

````typescript
export { EmailCodeVerificationModal } from './EmailCodeVerificationModal';
````

## Source: `packages/vechain-kit/src/components/LegalDocumentsModal/Components/index.ts`

````typescript
export { LegalDocumentItem } from './LegalDocumentItem';
````

## Source: `packages/vechain-kit/src/components/LegalDocumentsModal/index.ts`

````typescript
export * from './LegalDocumentsModal';
export * from './Components';
````

## Source: `packages/vechain-kit/src/components/StepModal/index.ts`

````typescript
export { StepModal } from "./StepModal"
export type { Step, StepModalProps } from "./StepModal"
````

## Source: `packages/vechain-kit/src/components/TransactionModal/Components/index.ts`

````typescript
export * from './ShareButtons';
````

## Source: `packages/vechain-kit/src/components/TransactionModal/index.ts`

````typescript
export * from './TransactionModal';
export * from './Components/ShareButtons';
export * from './TransactionModalContent';
````

## Source: `packages/vechain-kit/src/components/TransactionToast/index.ts`

````typescript
export { TransactionToast } from './TransactionToast';
````

## Source: `packages/vechain-kit/src/components/UpgradeSmartAccountModal/index.ts`

````typescript
export * from './UpgradeSmartAccountModal';
````

## Source: `packages/vechain-kit/src/components/WalletButton/index.ts`

````typescript
export * from './WalletButton';
export * from './types';
export * from './SocialIcons';
````

## Source: `packages/vechain-kit/src/components/common/index.ts`

````typescript
export * from './ModalBackButton';
export * from './AddressDisplay';
export * from './VersionFooter';
export * from './StickyHeaderContainer';
export * from './StickyFooterContainer';
export * from './BaseModal';
export * from './AssetButton';
export * from './AddressDisplayCard';
export * from './ModalFAQButton';
export * from './ScrollToTopWrapper';
export * from './AccountAvatar';
export * from './TransactionButtonAndStatus';
export * from './ModalNotificationButton';
export * from './GasFeeSummary';
export * from './GasFeeTokenSelector';
export * from './InlineFeedback';
export * from './WalletSwitchFeedback';
export * from './PriceChangeBadge';
export * from './AddressOrDomainLabel';
export * from './CopyIconButton';
export * from './PriceChart';
export * from './StatusScreen';
````

## Source: `packages/vechain-kit/src/components/index.ts`

````typescript
export * from './ConnectModal';
export * from './WalletButton';
export * from './TransactionModal';
export * from './TransactionToast';
export * from './AccountModal';
export * from './common';
export { WalletButton as DAppKitWalletButton } from '@vechain/dapp-kit-react';
export * from './UpgradeSmartAccountModal';
export * from './LegalDocumentsModal';
````

## Source: `packages/vechain-kit/src/config/index.ts`

````typescript
import localConfig from './solo';
import testnetConfig from './testnet';
import mainnetConfig from './mainnet';
import { Network, NETWORK_TYPE } from './network';

export type AppConfig = {
    ipfsFetchingService: string;
    ipfsPinningService: string;
    vthoContractAddress: string;
    b3trContractAddress: string;
    vot3ContractAddress: string;
    b3trGovernorAddress: string;
    timelockContractAddress: string;
    xAllocationPoolContractAddress: string;
    xAllocationVotingContractAddress: string;
    emissionsContractAddress: string;
    voterRewardsContractAddress: string;
    galaxyMemberContractAddress: string;
    treasuryContractAddress: string;
    x2EarnAppsContractAddress: string;
    x2EarnCreatorContractAddress: string;
    x2EarnRewardsPoolContractAddress: string;
    nodeManagementContractAddress: string;
    veBetterPassportContractAddress: string;
    veDelegate: string;
    veDelegateVotes: string;
    veDelegateTokenContractAddress: string;
    oracleContractAddress: string;
    accountFactoryAddress: string;
    cleanifyCampaignsContractAddress: string;
    cleanifyChallengesContractAddress: string;
    veWorldSubdomainClaimerContractAddress: string;
    vetDomainsContractAddress: string;
    vetDomainsPublicResolverAddress: string;
    vetDomainsReverseRegistrarAddress: string;
    vnsResolverAddress: string;
    sassContractAddress: string;
    vvetContractAddress: string;
    stargateContractAddress: string;
    stargateNftContractAddress: string;
    navigatorRegistryContractAddress: string;
    betterSwapFactoryAddress: string;
    juicyPoolAddress: string;
    nftBlacklistContractAddress?: string;
    vetDomainAvatarUrl: string;
    nodeUrl: string;
    indexerUrl: string;
    b3trIndexerUrl: string;
    graphQlIndexerUrl: string;
    network: Network;
    explorerUrl: string;
};

export const getConfig = (env: NETWORK_TYPE): AppConfig => {
    if (env === 'solo') return localConfig;
    if (env === 'test') return testnetConfig;
    if (env === 'main') return mainnetConfig;
    throw new Error(`Unsupported NETWORK_TYPE ${env}`);
};
````

## Source: `packages/vechain-kit/src/config/mainnet.ts`

````typescript
import { AppConfig } from '.';
const config: AppConfig = {
    ipfsFetchingService: 'https://api.gateway-proxy.vechain.org/ipfs',
    indexerUrl: 'https://indexer.mainnet.vechain.org/api/v1',
    ipfsPinningService:
        'https://api.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    b3trIndexerUrl: 'https://indexer.mainnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'https://mainnet.vechain.org',
    network: {
        id: 'main',
        name: 'main',
        type: 'main',
        defaultNet: true,
        urls: [
            'https://mainnet.vechain.org',
            'https://vethor-node.vechain.com',
            'https://mainnet.veblocks.net',
            'https://mainnet.vecha.in',
        ],
        explorerUrl: 'https://vechainstats.com',
        blockTime: 10000,
        genesis: {
            number: 0,
            id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        },
    },
    explorerUrl: 'https://vechainstats.com/transaction',
    // general
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    //VeBetterDAO
    b3trContractAddress: '0x5ef79995FE8a89e0812330E4378eB2660ceDe699',
    vot3ContractAddress: '0x76Ca782B59C74d088C7D2Cce2f211BC00836c602',
    b3trGovernorAddress: '0x1c65C25fABe2fc1bCb82f253fA0C916a322f777C',
    timelockContractAddress: '0x7B7EaF620d88E38782c6491D7Ce0B8D8cF3227e4',
    xAllocationPoolContractAddress:
        '0x4191776F05f4bE4848d3f4d587345078B439C7d3',
    xAllocationVotingContractAddress:
        '0x89A00Bb0947a30FF95BEeF77a66AEdE3842Fe5B7',
    emissionsContractAddress: '0xDf94739bd169C84fe6478D8420Bb807F1f47b135',
    voterRewardsContractAddress: '0x838A33AF756a6366f93e201423E1425f67eC0Fa7',
    galaxyMemberContractAddress: '0x93B8cD34A7Fc4f53271b9011161F7A2B5fEA9D1F',
    treasuryContractAddress: '0xD5903BCc66e439c753e525F8AF2FeC7be2429593',
    x2EarnAppsContractAddress: '0x8392B7CCc763dB03b47afcD8E8f5e24F9cf0554D',
    x2EarnRewardsPoolContractAddress:
        '0x6Bee7DDab6c99d5B2Af0554EaEA484CE18F52631',
    x2EarnCreatorContractAddress: '0xe8e96a768ffd00417d4bd985bec9EcfC6F732a7f',
    nodeManagementContractAddress: '0xB0EF9D89C6b49CbA6BBF86Bf2FDf0Eee4968c6AB',
    veBetterPassportContractAddress:
        '0x35a267671d8EDD607B2056A9a13E7ba7CF53c8b3',
    //veDelegate
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    //utility
    oracleContractAddress: '0x49eC7192BF804Abc289645ca86F1eD01a6C17713',
    accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    //cleanify
    cleanifyCampaignsContractAddress:
        '0x7a11D63338576aE8c038868433ea199d7E5319A6',
    cleanifyChallengesContractAddress:
        '0xa58681692AdDD2e8E37f9113D40Bb9253C03F65e',
    veWorldSubdomainClaimerContractAddress:
        '0xa4173c32fe8a61a8fd0d0234675b559fc360446a',
    vetDomainsContractAddress: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
    vetDomainsPublicResolverAddress:
        '0xabac49445584C8b6c1472b030B1076Ac3901D7cf',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A',
    vetDomainAvatarUrl: 'https://vet.domains/api/avatar',
    sassContractAddress: '0x84b0caf6436aace4e21d10f126963fdd53ac31ea',
    // wrapped VET
    vvetContractAddress: '0x45429A2255e7248e57fce99E7239aED3f84B7a53',
    // staking
    stargateContractAddress: '0x03C557bE98123fdb6faD325328AC6eB77de7248C',
    stargateNftContractAddress: '0x1856c533ac2d94340aaa8544d35a5c1d4a21dee7',
    navigatorRegistryContractAddress:
        '0xef238e33fc78Ecc79BeaF8386254A0fC67D048E0',
    // dex
    betterSwapFactoryAddress: '0x5970DcBeBAc33e75eFf315C675f1d2654f7bF1f5',
    // lending
    juicyPoolAddress: '0x00Bd212704A8816264607a7110cCabe70219D5aB',
    // nft blacklist (VeWorld scam protection)
    nftBlacklistContractAddress: '0x0f9b01618cd5e0030f8e26ff61bc1349cb9eb8d5',
};
export default config;
````

## Source: `packages/vechain-kit/src/config/network.ts`

````typescript
import { CompressedBlockDetail } from '@vechain/sdk-network';

/**
 * The type of network that we are connected to (indentified by the genesis block)
 * */
export type NETWORK_TYPE = 'main' | 'test' | 'solo';

/**
 * A model for the VechainThor network that we are connected to
 * @field `id` - Unique ID for this network
 * @field `defaultNet` - If the network is a default network
 * @field `name` - A name for this network
 * @field `type` - What type of network is it? `main, test, solo or custom`
 * @field `urls` - A list of URLs for this network
 * @field `currentUrl` - The current URL that we are connected to
 * @field `explorerUrl` - The explorer URL for this network
 * @field `genesis` - The genesis block for the network
 * @field `blockTime` - The time it takes to mine a block in milliseconds
 */
export type Network = {
    id: string;
    defaultNet: boolean;
    name: string;
    type: NETWORK_TYPE;
    urls: string[];
    explorerUrl?: string;
    genesis: typeof genesises.main;
    blockTime: number;
};

const THOR_MAIN_URLS = [
    'https://mainnet.vechain.org',
    'https://vethor-node.vechain.com',
    'https://mainnet.veblocks.net',
    'https://mainnet.vecha.in',
];

const THOR_TESTNET_URLS = [
    'https://testnet.vechain.org',
    'https://vethor-node-test.vechaindev.com',
    'https://sync-testnet.veblocks.net',
    'https://testnet.vecha.in',
];

const THOR_SOLO_URLS = ['http://localhost:8669'];

const MAIN_EXPLORER_URL = 'https://explore.vechain.org';
const TEST_EXPLORER_URL = 'https://explore-testnet.vechain.org';

export const genesisesId = {
    get main(): string {
        return '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a';
    },
    get test(): string {
        return '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127';
    },
    get solo(): string {
        return '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6';
    },
};

export const genesises = {
    get main(): CompressedBlockDetail {
        return {
            number: 0,
            id: '0x00000000851caf3cfdb6e899cf5958bfb1ac3413d346d43539627e6be7ec1b4a',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x09bfdf9e24dd5cd5b63f3c1b5d58b97ff02ca0490214a021ed7d99b93867839c',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    get test(): CompressedBlockDetail {
        return {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    get solo(): CompressedBlockDetail {
        return {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        };
    },
    which(gid: string) {
        switch (gid) {
            case this.main.id:
                return 'main';
            case this.test.id:
                return 'test';
            case this.solo.id:
                return 'solo';
        }
    },
};

export const DEFAULT_GAS_COEFFICIENT = 0;

export const BASE_GAS_PRICE =
    '0x000000000000000000000000000000000000626173652d6761732d7072696365';

export const defaultMainNetwork: Network = {
    id: 'main',
    name: 'main',
    type: 'main',
    defaultNet: true,
    urls: THOR_MAIN_URLS,
    explorerUrl: MAIN_EXPLORER_URL,
    genesis: genesises.main,
    blockTime: 1000 * 10,
};

export const defaultTestNetwork: Network = {
    id: 'test',
    name: 'test',
    type: 'test',
    defaultNet: true,
    urls: THOR_TESTNET_URLS,
    explorerUrl: TEST_EXPLORER_URL,
    genesis: genesises.test,
    blockTime: 1000 * 10,
};

export const defaultSoloNetwork: Network = {
    id: 'solo',
    name: 'solo',
    type: 'solo',
    defaultNet: true,
    urls: THOR_SOLO_URLS,
    explorerUrl: TEST_EXPLORER_URL,
    genesis: genesises.solo,
    blockTime: 1000 * 10,
};

export const defaultNetworks: Network[] = [
    defaultMainNetwork,
    defaultTestNetwork,
    defaultSoloNetwork,
];

export const getNetworkById = (id: string): Network | undefined => {
    return defaultNetworks.find((net) => net.id === id);
};

export const getNetworkByName = (name: string): Network | undefined => {
    return defaultNetworks.find((net) => net.name === name);
};

//https://docs.vechain.org/miscellaneous
export const chainTagToGenesisId: Record<number, string> = {
    74: genesisesId.main,
    39: genesisesId.test,
    246: genesisesId.solo,
};
````

## Source: `packages/vechain-kit/src/config/solo.ts`

````typescript
import { AppConfig } from '.';
const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0xd31A6f2DBa8785cE41AB68Ea192791B5175309F4',
    vot3ContractAddress: '0x028Af33230576c1e073C8245F72a7A4aa53564E4',
    b3trGovernorAddress: '0x36E0e9b46D56dF12Dd69fD560e41954C73cE9ded',
    timelockContractAddress: '0x125389845c93Efcf6471BA8BE1AC19c11e128603',
    xAllocationPoolContractAddress:
        '0xC8232c91E2f744E533322B99F95f809b9f7ec446',
    xAllocationVotingContractAddress:
        '0x074F093f4C534a16cDD09cb4b2669713218A762a',
    emissionsContractAddress: '0x6a084E85f38400790043788FcCee39595616aa3A',
    voterRewardsContractAddress: '0xbAb852081C459c0060960287aDcf9a0C2c1dc4b8',
    galaxyMemberContractAddress: '0xbdA1cff75d2D43AB9186Ada41fECF79e25c49Ba3',
    treasuryContractAddress: '0xe9414513Fe0e3b9bf7a61eC5c1AC7Df943fB3e77',
    x2EarnAppsContractAddress: '0x432C46476f4970575C43B19588A170D237dC4929',
    x2EarnRewardsPoolContractAddress:
        '0x134E4Fce6761f660401808CF86aE0e62cE52a81E',
    nodeManagementContractAddress: '0xa96B5057171D797298A71178b48449A7bC615D8E',
    veBetterPassportContractAddress:
        '0x8db6D14452fE36ba86C341AfEFaC0f90A0Db2bcb',
    x2EarnCreatorContractAddress: '0x4e5f7eb452e9ecd75c0B29e3540014cBe01bBF52',
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    oracleContractAddress: '0x49eC7192BF804Abc289645ca86F1eD01a6C17713',
    accountFactoryAddress: '0xC06Ad8573022e2BE416CA89DA47E8c592971679A',
    cleanifyCampaignsContractAddress:
        '0x7a11D63338576aE8c038868433ea199d7E5319A6',
    cleanifyChallengesContractAddress:
        '0xa58681692AdDD2e8E37f9113D40Bb9253C03F65e',
    veWorldSubdomainClaimerContractAddress:
        '0x0000000000000000000000000000000000000000',
    vetDomainsContractAddress: '0x0000000000000000000000000000000000000000',
    vetDomainsPublicResolverAddress:
        '0x0000000000000000000000000000000000000000',
    vetDomainsReverseRegistrarAddress:
        '0x5c970901a587BA3932C835D4ae5FAE2BEa7e78Bc',
    vnsResolverAddress: '0x0000000000000000000000000000000000000000',
    sassContractAddress: '0x0000000000000000000000000000000000000000',
    vetDomainAvatarUrl: 'https://testnet.vet.domains/api/avatar',
    indexerUrl: 'https://b3tr.testnet.vechain.org/api/v1',
    b3trIndexerUrl: 'https://b3tr.testnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'http://localhost:8669',
    network: {
        id: 'solo',
        name: 'solo',
        type: 'solo',
        defaultNet: true,
        urls: ['http://localhost:8669'],
        explorerUrl: 'https://explore-testnet.vechain.org',
        blockTime: 10000,
        genesis: {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff53616c757465202620526573706563742c20457468657265756d2100',
            timestamp: 1530316800,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        },
    },
    explorerUrl: 'https://explore-testnet.vechain.org',
    // wrapped VET
    vvetContractAddress: '',
    // staking — not deployed on solo
    stargateContractAddress: '',
    stargateNftContractAddress: '',
    navigatorRegistryContractAddress: '',
    // dex
    betterSwapFactoryAddress: '',
    // lending
    juicyPoolAddress: '',
};
export default config;
````

## Source: `packages/vechain-kit/src/config/swapAggregators.ts`

````typescript
import { SwapAggregator } from '@/types/swap';
import { NETWORK_TYPE } from '@/config/network';
import { createVeTradeAggregator } from '@/utils/swap/veTrade';
import { createBetterSwapAggregator } from '@/utils/swap/betterSwap';

/**
 * Get swap aggregators for a specific network
 *
 * Add or remove aggregators by importing their modules and adding them to this array.
 * Each aggregator module must export a function or object implementing the SwapAggregator interface.
 *
 * @param networkType - The network type (main, test, or solo)
 * @returns Array of SwapAggregator instances configured for the specified network
 */
export const getSwapAggregators = (networkType: NETWORK_TYPE): SwapAggregator[] => [
    createVeTradeAggregator(networkType),
    createBetterSwapAggregator(networkType),
];
````

## Source: `packages/vechain-kit/src/config/testnet.ts`

````typescript
import { AppConfig } from '.';

const config: AppConfig = {
    ipfsFetchingService: 'https://api.dev.gateway-proxy.vechain.org/ipfs',
    ipfsPinningService:
        'https://api.dev.gateway-proxy.vechain.org/api/v1/pinning/pinFileToIPFS',
    vthoContractAddress: '0x0000000000000000000000000000456E65726779',
    b3trContractAddress: '0x95761346d18244bb91664181bf91193376197088',
    vot3ContractAddress: '0x6e8b4a88d37897fc11f6ba12c805695f1c41f40e',
    b3trGovernorAddress: '0xc30b4d0837f7e3706749655d8bde0c0f265dd81b',
    timelockContractAddress: '0x835509222aa67c333a1cbf29bd341e014aba86c9',
    xAllocationPoolContractAddress:
        '0x6f7b4bc19b4dc99005b473b9c45ce2815bbe7533',
    xAllocationVotingContractAddress:
        '0x8800592c463f0b21ae08732559ee8e146db1d7b2',
    emissionsContractAddress: '0x66898f98409db20ed6a1bf0021334b7897eb0688',
    voterRewardsContractAddress: '0x851ef91801899a4e7e4a3174a9300b3e20c957e8',
    galaxyMemberContractAddress: '0x38a59fa7fd7039884465a0ff285b8c4b6fe394ca',
    x2EarnCreatorContractAddress: '0xb89f0ecdaf9987f87912d6c77756435fe4085b05',
    nodeManagementContractAddress: '0xde17d0a516c38c168d37685bb71465f656aa256e',
    x2EarnAppsContractAddress: '0x0b54a094b877a25bdc95b4431eaa1e2206b1ddfe',
    treasuryContractAddress: '0x3d531a80c05099c71b02585031f86a2988e0caca',
    x2EarnRewardsPoolContractAddress:
        '0x2d2a2207c68a46fc79325d7718e639d1047b0d8b',
    veBetterPassportContractAddress:
        '0x592c756df7a5d39de1735030e8b9c18b7417e6c4',
    veDelegate: '0xfc32a9895C78CE00A1047d602Bd81Ea8134CC32b',
    veDelegateVotes: '0xeb71148c9B3cd57e228c2152d79f6e78F5F1ef9a',
    veDelegateTokenContractAddress:
        '0xD3f7b82Df5705D34f64C634d2dEf6B1cB3116950',
    oracleContractAddress: '0xdcCAaBd81B38e0dEEf4c202bC7F1261A4D9192C6',
    accountFactoryAddress: '0x713b908Bcf77f3E00EFEf328E50b657a1A23AeaF',
    cleanifyCampaignsContractAddress:
        '0x22d19ACBD2cBf6b2B6C546395c26B9Cb448248BF',
    cleanifyChallengesContractAddress:
        '0x8Cc885DC3e5c376632CCEA0e8e1a51F1B3572442',
    veWorldSubdomainClaimerContractAddress:
        '0xe5af50e7ad1aaab4fbe4efbb2b30f764013918b3',
    vetDomainsContractAddress: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
    vetDomainsPublicResolverAddress:
        '0xA6eFd130085a127D090ACb0b100294aD1079EA6f',
    vetDomainsReverseRegistrarAddress:
        '0x6878f1aD5e3015310CfE5B38d7B7071C5D8818Ca',
    vnsResolverAddress: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94',
    sassContractAddress: '0x1b299f501bce347893f5a3a10e625c9a3345365e',
    vetDomainAvatarUrl: 'https://testnet.vet.domains/api/avatar',
    indexerUrl: 'https://indexer.testnet.vechain.org/api/v1',
    b3trIndexerUrl: 'https://indexer.testnet.vechain.org/api/v1',
    graphQlIndexerUrl: 'https://graph.vet/subgraphs/name/vns',
    nodeUrl: 'https://testnet.vechain.org',
    network: {
        id: 'testnet',
        name: 'testnet',
        type: 'test',
        defaultNet: true,
        urls: [
            'https://testnet.vechain.org',
            'https://vethor-node-test.vechaindev.com',
            'https://sync-testnet.veblocks.net',
            'https://testnet.vecha.in',
        ],
        explorerUrl: 'https://insight.vecha.in/#/test',
        blockTime: 10000,
        genesis: {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            transactions: [],
        },
    },
    explorerUrl: 'https://explore-testnet.vechain.org/transactions',
    // wrapped VET — not deployed on testnet
    vvetContractAddress: '',
    // staking
    stargateContractAddress: '0x7826315bB82d91a7a90230690731e7Eb95192B58',
    stargateNftContractAddress: '0xCEaA3B8961229F2aaB8Bb205Fd8A4f9FF9F7C933',
    navigatorRegistryContractAddress:
        '0x91BdC3ca7228BC28f14990039CAb813f98eA1d40',
    // dex (testnet factory not confirmed yet)
    betterSwapFactoryAddress: '',
    // lending — not deployed on testnet
    juicyPoolAddress: '',
};
export default config;
````

## Source: `packages/vechain-kit/src/constants/index.ts`

````typescript
export * from './urls';
export * from './queryKeys';
````

## Source: `packages/vechain-kit/src/hooks/api/index.ts`

````typescript
export * from './privy';
export * from './vetDomains';
export * from './wallet';
export * from './ipfs';
export * from './swap';
export * from './transferHistory';
export * from './staking';
export * from './nfts';
````

## Source: `packages/vechain-kit/src/hooks/api/ipfs/index.ts`

````typescript
export * from './useIpfsMetadata';
export * from './useIpfsImage';
export * from './useIpfsMetadatas';
export * from './useUploadImages';
export * from './useSingleImageUpload';
````

## Source: `packages/vechain-kit/src/hooks/api/nfts/index.ts`

````typescript
export * from './types';
export * from './useOwnedNfts';
export * from './useNftBlacklist';
export * from './useOwnedNftsFiltered';
export * from './useNftMetadata';
export * from './useNftCollectionName';
````

## Source: `packages/vechain-kit/src/hooks/api/privy/index.ts`

````typescript
export * from './useFetchAppInfo';
export * from './useFetchPrivyStatus';
````

## Source: `packages/vechain-kit/src/hooks/api/staking/index.ts`

````typescript
export * from './useStargatePositions';
export * from './useNavigatorPosition';
export * from './useBetterSwapLpPositions';
export * from './useJuicyPosition';
````

## Source: `packages/vechain-kit/src/hooks/api/swap/index.ts`

````typescript
export { useSwapTransaction } from './useSwapTransaction';
export { useSwapQuotes } from './useSwapQuotes';
````

## Source: `packages/vechain-kit/src/hooks/api/transferHistory/index.ts`

````typescript
export * from './types';
export * from './useTransferHistory';
export * from './useTokenTransferHistory';
````

## Source: `packages/vechain-kit/src/hooks/api/vetDomains/index.ts`

````typescript
export * from './useVechainDomain';
export * from './useEnsRecordExists';
export * from './useClaimVeWorldSubdomain';
export * from './useClaimVetDomain';
export * from './useIsDomainProtected';
export * from './useGetDomainsOfAddress';
export * from './useGetAvatar';
export * from './useGetTextRecords';
export * from './useUpdateTextRecord';
export * from './useGetResolverAddress';
export * from './useGetAvatarOfAddress';
export * from './useGetAvatarLegacy';
export * from './useUnsetDomain';
````

## Source: `packages/vechain-kit/src/hooks/api/wallet/index.ts`

````typescript
export * from './useBalances';
export * from './useCurrentAllocationsRoundId';
export * from './useCustomTokens';
export * from './useGetB3trBalance';
export * from './useGetCustomTokenBalances';
export * from './useGetCustomTokenInfo';
export * from './useGetErc20Balance';
export * from './useGetTokenUsdPrice';
export * from './useOraclePriceChanges24h';
export * from './usePortfolioPriceHistory24h';
export * from './useGetVot3Balance';
export * from './useIsPerson';
export * from './useMostVotedAppsInRound';
export * from './useRefreshBalances';
export * from './useRefreshMetadata';
export * from './useRoundXApps';
export * from './useTokenBalances';
export * from './useTokenPrices';
export * from './useTokensWithValues';
export * from './useTotalBalance';
export * from './useWallet';
export * from './useWalletMetadata';
export * from './useSwitchWallet';
export * from './useWalletStorage';
export * from './useXAppMetadata';
export * from './useXAppShares';
````

## Source: `packages/vechain-kit/src/hooks/cache/index.ts`

````typescript
export * from './useLocalStorage';
export * from './useSyncableLocalStorage';
export * from './useEcosystemShortcuts';
export * from './useCrossAppConnectionCache';
````

## Source: `packages/vechain-kit/src/hooks/generic-delegator/index.ts`

````typescript
export * from './useGenericDelegator';
export * from './useGasTokenSelection';
export * from './useGenericDelegatorFeeEstimation';
export * from './useEstimateAllTokens';
````

## Source: `packages/vechain-kit/src/hooks/index.ts`

````typescript
export * from './api';
export * from './modals';
export * from './notifications';
export * from './signing';
export * from './login';
export * from './utils';
export * from './cache';
export * from './generic-delegator';
export * from './thor';
export {
    usePrivy,
    useMfaEnrollment,
    useSetWalletRecovery,
} from '@privy-io/react-auth';
export {
    useThor,
    useWallet as useDAppKitWallet,
    useWalletModal as useDAppKitWalletModal,
} from '@vechain/dapp-kit-react';
export { ThorClient } from '@vechain/sdk-network';
export { useLegalDocuments } from '../providers/LegalDocumentsProvider';
export { VECHAIN_KIT_QUERY_KEYS } from '@/constants/queryKeys';
````

## Source: `packages/vechain-kit/src/hooks/login/index.ts`

````typescript
export * from './useLoginWithPasskey';
export * from './useLoginWithOAuth';
export * from './useLoginWithVeChain';
export * from './useConnectWithDappKitSource';
````

## Source: `packages/vechain-kit/src/hooks/modals/index.ts`

````typescript
export * from './useConnectModal';
export * from './useAccountModal';
export * from './useTransactionModal';
export * from './useTransactionToast';
export * from './useWalletModal';
export * from './useChooseNameModal';
export * from './useSendTokenModal';
export * from './useSwapTokenModal';
export * from './useExploreEcosystemModal';
export * from './useNotificationsModal';
export * from './useFAQModal';
export * from './useAccountCustomizationModal';
export * from './useReceiveModal';
export * from './useLoginModalContent';
export * from './useUpgradeSmartAccountModal';
export * from './useProfileModal';
export * from './useAccountModalOptions';
export * from './useSettingsModal';
````

## Source: `packages/vechain-kit/src/hooks/notifications/index.ts`

````typescript
export { useNotifications } from './useNotifications';
export { useNotificationAlerts } from './useNotificationAlerts';
````

## Source: `packages/vechain-kit/src/hooks/signing/index.ts`

````typescript
export * from './useSignMessage';
export * from './useSignTypedData';
````

## Source: `packages/vechain-kit/src/hooks/thor/accounts/index.ts`

````typescript
export * from './useAccountBalance';
````

## Source: `packages/vechain-kit/src/hooks/thor/blocks/index.ts`

````typescript
export * from './useCurrentBlock';
export * from './useGetChainId';
````

## Source: `packages/vechain-kit/src/hooks/thor/index.ts`

````typescript
export * from './accounts';
export * from './smartAccounts';
export * from './blocks';
export * from './logs';
export * from './transactions';
````

## Source: `packages/vechain-kit/src/hooks/thor/logs/index.ts`

````typescript
export * from './logUtils';
````

## Source: `packages/vechain-kit/src/hooks/thor/smartAccounts/index.ts`

````typescript
export * from './useAccountImplementationAddress';
export * from './useCurrentAccountImplementationVersion';
export * from './useGetAccountAddress';
export * from './useGetAccountVersion';
export * from './useHasV1SmartAccount';
export * from './useIsSmartAccountDeployed';
export * from './useRefreshFactoryQueries';
export * from './useRefreshSmartAccountQueries';
export * from './useSmartAccount';
export * from './useUpgradeRequired';
export * from './useUpgradeRequiredForAccount';
export * from './useUpgradeSmartAccount';
````

## Source: `packages/vechain-kit/src/hooks/thor/transactions/index.ts`

````typescript
export * from './useSendTransaction';
export * from './useTransferERC20';
export * from './useTransferERC721';
export * from './useTransferVET';
export * from './useBuildTransaction';
export * from './useTxReceipt';
export * from './useGasEstimate';
````

## Source: `packages/vechain-kit/src/hooks/utils/index.ts`

````typescript
export * from './useAppHubApps';
export * from './useCallClause';
export * from './useCurrency';
export * from './useCurrentLanguage';
export * from './useCurrentCurrency';
export * from './useFeatureAnnouncement';
export * from './useGetNodeUrl';
export * from './useIsPwa';
export * from './useScrollToTop';
export * from './useEvents';
export * from './useBuildClauses';
````

## Source: `packages/vechain-kit/src/index.ts`

````typescript
export * from './providers';
export * from './types';
export * from './config';
export * from './hooks';
export * from './components';
export * from './assets';
````

## Source: `packages/vechain-kit/src/providers/VeChainKitProvider.tsx`

````tsx
import { AppConfig, getConfig } from '@/config';
import { NETWORK_TYPE } from '@/config/network';
import { CURRENCY, PrivyLoginMethod } from '@/types';
import { isValidUrl } from '@/utils';
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/ssrUtils';
import { initializeI18n } from '@/utils/i18n';
import {
    LoginMethodOrderOption,
    NonEmptyArray,
    PrivyProvider,
    WalletListEntry,
} from '@privy-io/react-auth';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    WalletSource as DAppKitWalletSource,
    LogLevel,
} from '@vechain/dapp-kit';
import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { WalletConnectOptions } from '@vechain/dapp-kit-react';
import { CustomizedStyle, I18n, SourceInfo } from '@vechain/dapp-kit-ui';
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
} from 'react';
import { VechainKitThemeConfig } from '@/theme/tokens';
import {
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from '@/theme/tokens';
import {
    generateDAppKitCSSVariables,
    generatePrivyCSSVariables,
    applyPrivyCSSVariables,
    applyDAppKitButtonStyles,
    improvePrivyReadability,
} from '@/utils/cssVariables';

import i18n from '../../i18n';
import { EnsureQueryClient } from './EnsureQueryClient';
import { LegalDocumentsProvider } from './LegalDocumentsProvider';
import { ModalProvider } from './ModalProvider';
import {
    VECHAIN_KIT_STORAGE_KEYS,
    DEFAULT_PRIVY_ECOSYSTEM_APPS,
    VECHAIN_PRIVY_APP_ID,
    getGenericDelegatorUrl,
} from '@/utils/constants';
import { Certificate, CertificateData } from '@vechain/sdk-core';
import { CrossAppErrorRecovery } from './CrossAppErrorRecovery';
import { PrivyCrossAppProvider } from './PrivyCrossAppProvider';
import { PrivyWalletProvider } from './PrivyWalletProvider';

type AlwaysAvailableMethods =
    | 'vechain'
    | 'dappkit'
    | 'ecosystem'
    | 'veworld'
    | 'sync2'
    | 'wallet-connect';
type PrivyDependentMethods =
    | 'email'
    | 'google'
    | 'apple'
    | 'github'
    | 'passkey'
    | 'more';
export type AccountQuickAction = 'send' | 'swap' | 'receive';

type LoginMethodOrder = {
    method:
        | AlwaysAvailableMethods
        | (VechainKitProviderProps['privy'] extends undefined
              ? never
              : PrivyDependentMethods);
    gridColumn?: number;
    allowedApps?: string[]; // Only used by ecosystem method, if it's not provided, it will use default apps
    /**
     * Mark this method as the recommended primary CTA — filled inverted
     * surface + RecommendedDot. If no entry sets `isPrimary`, the kit falls
     * back to highlighting the first visible method automatically. The
     * `more` method is never primary (it's a footer link).
     */
    isPrimary?: boolean;
};

export type LegalDocumentOptions = {
    privacyPolicy?: LegalDocument[];
    termsAndConditions?: LegalDocument[];
    cookiePolicy?: LegalDocument[];
};

export type LegalDocument = {
    url: string;
    version: number;
    required: boolean;
    displayName?: string;
};

export type VechainKitProviderProps = {
    children: ReactNode;
    privy?: {
        appId: string;
        clientId: string;
        appearance: {
            walletList?: WalletListEntry[];
            accentColor?: `#${string}`;
            loginMessage: string;
            logo: string;
        };
        embeddedWallets?: {
            createOnLogin: 'users-without-wallets' | 'all-users' | 'off';
        };
        loginMethods: PrivyLoginMethod[];
        /**
         * Custom redirect URL for OAuth flows, useful for mobile applications. If not provided, defaults to window.location.href.
         * For Capacitor/mobile apps, use a custom URL scheme like: 'com.yourapp.oauth://callback' or 'yourapp://oauth'
         * Make sure to register this URL scheme in your app configuration and add it to your app's allowed URL schemes in the Privy dashboard.
         */
        customOAuthRedirectUrl?: string;
    };
    feeDelegation?: {
        delegatorUrl?: string;
        delegateAllTransactions?: boolean;
        genericDelegatorUrl?: string;
        b3trTransfers?: {
            minAmountInEther: number;
        };
    };
    dappKit?: {
        allowedWallets?: DAppKitWalletSource[];
        walletConnectOptions?: WalletConnectOptions;
        usePersistence?: boolean;
        useFirstDetectedSource?: boolean;
        logLevel?: LogLevel;
        themeVariables?: CustomizedStyle;
        modalParent?: HTMLElement;
        onSourceClick?: (source?: SourceInfo) => void;
        v2Api?: {
            enabled?: boolean;
            external?: boolean; // whether to disconnect the user on every visit
        };
    };
    loginModalUI?: {
        logo?: string;
        description?: string;
    };
    loginMethods?: LoginMethodOrder[];
    darkMode?: boolean;
    i18n?: I18n;
    language?: string;
    network?: {
        type?: string; // Accepts any string, validated internally to 'main' | 'test' | 'solo'
        nodeUrl?: string;
        requireCertificate?: boolean;
        // TODO: migration check these types
        connectionCertificate?: {
            message?: Certificate;
            options?: CertificateData;
        };
    };
    allowCustomTokens?: boolean;
    /** When true, community tokens (e.g. SASS) are included in token lists and balances. */
    allowCommunityTokens?: boolean;
    /**
     * Override default contract addresses for the selected network.
     * Useful when deploying custom contract instances (e.g., on solo or testnet).
     * Only the provided fields are overridden; the rest use the network defaults.
     *
     * @example
     * ```tsx
     * <VeChainKitProvider
     *   network={{ type: 'solo' }}
     *   contractAddresses={{
     *     b3trContractAddress: '0x...',
     *     vot3ContractAddress: '0x...',
     *   }}
     * >
     * ```
     */
    contractAddresses?: Partial<AppConfig>;
    legalDocuments?: LegalDocumentOptions;
    hiddenQuickActions?: AccountQuickAction[];
    defaultCurrency?: CURRENCY;
    theme?: VechainKitThemeConfig;
    onLanguageChange?: (language: string) => void;
    onCurrencyChange?: (currency: CURRENCY) => void;
};

/**
 * Configuration object returned by useVeChainKitConfig hook
 */
export type VeChainKitConfig = {
    privy?: VechainKitProviderProps['privy'];
    privyEcosystemAppIDS: string[];
    feeDelegation?: VechainKitProviderProps['feeDelegation'];
    dappKit: VechainKitProviderProps['dappKit'];
    loginModalUI?: VechainKitProviderProps['loginModalUI'];
    loginMethods?: VechainKitProviderProps['loginMethods'];
    darkMode: boolean;
    i18n?: VechainKitProviderProps['i18n'];
    /** The full app config for the current network, with any contractAddresses overrides applied. */
    appConfig: AppConfig;
    network: {
        type: NETWORK_TYPE;
        nodeUrl: string;
        requireCertificate?: boolean;
        connectionCertificate?: {
            message?: Certificate;
            options?: CertificateData;
        };
    };
    /** Current runtime language value. Reflects the active language in VeChainKit. */
    currentLanguage: string;
    allowCustomTokens?: boolean;
    allowCommunityTokens: boolean;
    legalDocuments?: VechainKitProviderProps['legalDocuments'];
    hiddenQuickActions?: AccountQuickAction[];
    /** Current runtime currency value. Reflects the active currency in VeChainKit. */
    currentCurrency: CURRENCY;
    theme?: VechainKitThemeConfig;
    /** Function to change the language from the host app. Changes will sync to VeChainKit. */
    setLanguage: (language: string) => void;
    /** Function to change the currency from the host app. Changes will sync to VeChainKit. */
    setCurrency: (currency: CURRENCY) => void;
};

/**
 * Context to store the Privy and DAppKit configs so that they can be used by the hooks/components
 */
export const VeChainKitContext = createContext<VeChainKitConfig | null>(null);

/**
 * Hook to get the VeChainKit configuration
 *
 * @returns VeChainKitConfig object containing:
 * - `currentLanguage`: Current runtime language value
 * - `currentCurrency`: Current runtime currency value
 * - `setLanguage`: Function to change language from host app
 * - `setCurrency`: Function to change currency from host app
 * - Other configuration values (network, darkMode, etc.)
 *
 * @example
 * ```tsx
 * const config = useVeChainKitConfig();
 * console.log(config.currentLanguage); // 'fr' (current value)
 * console.log(config.currentCurrency); // 'eur' (current value)
 * config.setLanguage('de'); // Change language
 * ```
 */
export const useVeChainKitConfig = () => {
    const context = useContext(VeChainKitContext);
    if (!context) {
        throw new Error('useVeChainKitConfig must be used within VeChainKit');
    }
    return context;
};

/**
 * Hook to get the merged app config for the current network.
 * Returns the base network config with any contractAddresses overrides applied.
 *
 * @example
 * ```tsx
 * const config = useAppConfig();
 * const b3trAddress = config.b3trContractAddress;
 * ```
 */
export const useAppConfig = (): AppConfig => {
    const { appConfig } = useVeChainKitConfig();
    return appConfig;
};

const validateConfig = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    const errors: string[] = [];

    const validatedProps = { ...props };

    // Set default dappKit if not provided
    if (!validatedProps.dappKit) {
        validatedProps.dappKit = {
            allowedWallets: ['veworld'],
        };
    }

    // Auto-inject the default generic-delegator endpoint whenever the
    // consumer hasn't picked their own delegation strategy.
    //
    // We used to gate this on `privy !== undefined || loginMethods includes
    // 'vechain'/'ecosystem'`, but after #620 every Google/Apple/Twitter/etc.
    // button silently falls back to the VeChain whitelabel cross-app host
    // when no host-supplied `privy` prop exists -- meaning users can land
    // on a smart-account wallet without ever listing 'vechain' in
    // loginMethods. The old gate then left `feeDelegation` undefined, and
    // `useGenericDelegatorFeeEstimation` / `useEstimateAllTokens` stayed
    // permanently disabled (their `enabled` depends on
    // `feeDelegation?.genericDelegatorUrl`). Always seed the default so
    // smart-account users have a working fee-delegation path; dapp-kit
    // wallets simply ignore it.
    if (!validatedProps.feeDelegation) {
        validatedProps.feeDelegation = {
            genericDelegatorUrl: getGenericDelegatorUrl(),
        };
    } else if (
        !validatedProps.feeDelegation.delegatorUrl &&
        !validatedProps.feeDelegation.genericDelegatorUrl
    ) {
        validatedProps.feeDelegation.genericDelegatorUrl =
            getGenericDelegatorUrl();
    }

    // Validate network - always ensure we have a valid network configuration
    if (!validatedProps.network || !validatedProps.network.type) {
        validatedProps.network = {
            type: 'main',
        };
    } else {
        const networkType = validatedProps.network.type;
        // Validate and narrow the network type
        if (!['main', 'test', 'solo'].includes(networkType)) {
            // Provide helpful error with the invalid value
            errors.push('network.type must be either "main", "test" or "solo"');
        }
    }

    // Set default login methods if not provided.
    // The no-Privy default mirrors `dappKit.allowedWallets` default
    // (`['veworld']`), so that opt-out devs see VeWorld out of the box.
    // To surface Sync2 or WalletConnect, the dev must opt in via both
    // `dappKit.allowedWallets` AND `loginMethods` (WalletConnect also needs a
    // `walletConnectOptions.projectId`).
    if (!validatedProps.loginMethods) {
        validatedProps.loginMethods = validatedProps.privy
            ? [
                  { method: 'veworld', gridColumn: 4 },
                  { method: 'google', gridColumn: 4 },
                  { method: 'apple', gridColumn: 4 },
                  { method: 'more', gridColumn: 4 },
              ]
            : [{ method: 'veworld', gridColumn: 4 }];
    }

    // Validate login methods if Privy is not configured.
    // Most OAuth providers fall back to the VeChain whitelabel cross-app
    // flow (via useLoginWithVeChain({ intent })) when no privy prop is set.
    // Email and passkey have no cross-app fallback -- VeChain has email
    // disabled in its Privy app, so cross-app-connect doesn't surface it
    // either. `more` is allowed: the More sub-view gracefully degrades to
    // whatever is available (dapp-kit wallets in `allowedWallets` that
    // aren't on the main grid, plus a "Continue with VeChain" cross-app
    // picker entry when `vechain` isn't on the main grid).
    if (validatedProps.loginMethods) {
        if (!validatedProps.privy) {
            const invalidMethods = validatedProps.loginMethods.filter(
                (method) => ['email', 'passkey'].includes(method.method),
            );

            if (invalidMethods.length > 0) {
                errors.push(
                    `Login methods ${invalidMethods
                        .map((m) => `"${m.method}"`)
                        .join(', ')} require Privy configuration. ` +
                        `Please either remove these methods or configure the privy prop.`,
                );
            }
        }
    }

    if (validatedProps?.legalDocuments) {
        if (validatedProps.legalDocuments.termsAndConditions) {
            validatedProps.legalDocuments.termsAndConditions.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.termsAndConditions.url is invalid: ${term.url}`,
                    );
                }
            });
        }
        if (validatedProps.legalDocuments.privacyPolicy) {
            validatedProps.legalDocuments.privacyPolicy.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.privacyPolicy.url is invalid: ${term.url}`,
                    );
                }
            });
        }
        if (validatedProps.legalDocuments.cookiePolicy) {
            validatedProps.legalDocuments.cookiePolicy.forEach((term) => {
                if (!isValidUrl(term.url)) {
                    errors.push(
                        `legalDocuments.cookiePolicy.url is invalid: ${term.url}`,
                    );
                }
            });
        }
    }

    if (errors.length > 0) {
        throw new Error(
            'VeChainKit Configuration Error:\n' + errors.join('\n'),
        );
    }

    return validatedProps;
};

/**
 * Provider to wrap the application with Privy and DAppKit
 */
const CURRENCY_STORAGE_KEY = 'vechain_kit_currency';

export const VeChainKitProvider = (
    props: Omit<VechainKitProviderProps, 'queryClient'>,
) => {
    // Validate all configurations at the start
    const validatedProps = validateConfig(props);
    const {
        children,
        privy,
        feeDelegation,
        dappKit: _dappKit,
        loginModalUI,
        loginMethods,
        darkMode = false,
        i18n: i18nConfig,
        language = 'en',
        network: _network,
        allowCustomTokens,
        allowCommunityTokens = false,
        legalDocuments,
        hiddenQuickActions = [],
        defaultCurrency = 'usd',
        theme: customTheme,
        onLanguageChange,
        onCurrencyChange,
        contractAddresses,
    } = validatedProps;

    // After validation, network and dappKit are guaranteed to be defined
    // Cast the network type to NETWORK_TYPE since validation ensures it's valid
    const networkType = (_network?.type ?? 'main') as NETWORK_TYPE;

    //To avoid this fallback across the codebase, do it globally in the provider
    const nodeUrl = _network?.nodeUrl ?? getConfig(networkType).nodeUrl;

    const network = {
        ..._network,
        type: networkType,
        nodeUrl,
    };

    // Merge base config with any contract address overrides
    const appConfig = useMemo(
        () => ({
            ...getConfig(networkType),
            ...contractAddresses,
        }),
        [networkType, contractAddresses],
    );

    const dappKit = _dappKit ?? {
        allowedWallets: ['veworld'] as DAppKitWalletSource[],
    };

    // Initialize current language from i18n or prop
    const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            const stored = getLocalStorageItem('i18nextLng');
            return stored || language;
        }
        return language;
    });

    // Initialize current currency from localStorage or prop
    const [currentCurrency, setCurrentCurrencyState] = useState<CURRENCY>(
        () => {
            try {
                const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);
                return (stored as CURRENCY) || defaultCurrency;
            } catch {
                return defaultCurrency;
            }
        },
    );

    // Track if we're updating from prop to avoid loops
    const isUpdatingFromPropRef = useRef(false);
    const isUpdatingCurrencyFromPropRef = useRef(false);

    // Remove the validateLoginMethods call since it's now handled in validateConfig
    const validatedLoginMethods = loginMethods;

    const allowedEcosystemApps = useMemo(() => {
        const userEcosystemMethods = validatedLoginMethods?.find(
            (method) => method.method === 'ecosystem',
        );
        return (
            userEcosystemMethods?.allowedApps ??
            DEFAULT_PRIVY_ECOSYSTEM_APPS.map((app) => app.id)
        );
    }, [validatedLoginMethods]);

    let privyAppId: string, privyClientId: string;
    if (!privy) {
        // No host-supplied Privy config -- fall back to VeChain's own
        // Privy app so PrivyProvider mounts cleanly. The previous dummy
        // (`clzdb5k0b02b9qvzjm6jpknsc`) only allowed a handful of origins,
        // so any deploy outside that list 403'd /api/v1/sessions on
        // mount and stalled the connect button forever. VeChain's real
        // app (VECHAIN_PRIVY_APP_ID) has the full kit-ecosystem allow
        // list and is the same app the whitelabel cross-app host serves,
        // so the requester and host stay consistent. The cross-app
        // OAuth fallback in useLoginWithOAuth is gated on the `privy`
        // prop, not on which app id is mounted, so logging in via this
        // path still routes through the whitelabel host.
        privyAppId = VECHAIN_PRIVY_APP_ID;
        privyClientId = '';
    } else {
        privyAppId = privy.appId;
        privyClientId = privy.clientId;
    }

    // Initialize i18n with stored language or prop, and merge translations
    useEffect(() => {
        initializeI18n(i18n);

        if (i18nConfig) {
            Object.keys(i18nConfig).forEach((lang) => {
                i18n.addResourceBundle(
                    lang,
                    'translation',
                    i18nConfig[lang],
                    true,
                    true,
                );
            });
        }

        const storedLanguage =
            typeof window !== 'undefined'
                ? getLocalStorageItem('i18nextLng')
                : null;
        const initialLanguage = storedLanguage || currentLanguage;

        if (initialLanguage && i18n.language !== initialLanguage) {
            isUpdatingFromPropRef.current = true;
            i18n.changeLanguage(initialLanguage);
            if (initialLanguage !== currentLanguage) {
                setCurrentLanguageState(initialLanguage);
            }
            isUpdatingFromPropRef.current = false;
        }
    }, []); // Only run once on mount

    // Sync language prop changes to i18n and state (but only if no stored value exists)
    useEffect(() => {
        const storedLanguage =
            typeof window !== 'undefined'
                ? getLocalStorageItem('i18nextLng')
                : null;

        if (language && !storedLanguage && language !== currentLanguage) {
            isUpdatingFromPropRef.current = true;
            i18n.changeLanguage(language);
            setCurrentLanguageState(language);
            isUpdatingFromPropRef.current = false;
        }
    }, [language, currentLanguage]);

    // Listen to i18n language changes (from kit settings)
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            if (!isUpdatingFromPropRef.current && lng !== currentLanguage) {
                setCurrentLanguageState(lng);
                onLanguageChange?.(lng);
            }
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [currentLanguage, onLanguageChange]);

    // Sync currency prop changes to state (but only if no stored value exists)
    useEffect(() => {
        const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);

        // Only sync prop if there's no stored preference and prop differs from current
        if (defaultCurrency && !stored && defaultCurrency !== currentCurrency) {
            isUpdatingCurrencyFromPropRef.current = true;
            setCurrentCurrencyState(defaultCurrency);
            setLocalStorageItem(CURRENCY_STORAGE_KEY, defaultCurrency);
            isUpdatingCurrencyFromPropRef.current = false;
        }
    }, [defaultCurrency, currentCurrency]);

    // Listen to currency localStorage changes (from kit settings)
    useEffect(() => {
        const checkCurrencyChange = () => {
            try {
                const stored = getLocalStorageItem(CURRENCY_STORAGE_KEY);
                if (
                    stored &&
                    stored !== currentCurrency &&
                    !isUpdatingCurrencyFromPropRef.current
                ) {
                    const newCurrency = stored as CURRENCY;
                    setCurrentCurrencyState(newCurrency);
                    onCurrencyChange?.(newCurrency);
                }
            } catch {
                // Ignore errors
            }
        };

        // Check on mount
        checkCurrencyChange();

        // Listen to storage events (for cross-tab sync)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === CURRENCY_STORAGE_KEY && e.newValue) {
                checkCurrencyChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Poll for changes (in case storage event doesn't fire)
        const interval = setInterval(checkCurrencyChange, 500);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [currentCurrency, onCurrencyChange]);

    const setLanguage = (lang: string) => {
        isUpdatingFromPropRef.current = true;
        i18n.changeLanguage(lang);
        setCurrentLanguageState(lang);
        isUpdatingFromPropRef.current = false;
    };

    const setCurrency = (currency: CURRENCY) => {
        isUpdatingCurrencyFromPropRef.current = true;
        setCurrentCurrencyState(currency);
        setLocalStorageItem(CURRENCY_STORAGE_KEY, currency);
        isUpdatingCurrencyFromPropRef.current = false;
    };

    useEffect(() => {
        setLocalStorageItem(VECHAIN_KIT_STORAGE_KEYS.NETWORK, networkType);
    }, [networkType]);

    // Generate tokens from custom theme config
    const tokens = useMemo(() => {
        const defaultTokens = getDefaultTokens(darkMode);
        const customTokens = convertThemeConfigToTokens(customTheme, darkMode);
        return mergeTokens(defaultTokens, customTokens);
    }, [customTheme, darkMode]);

    // Generate CSS variables for DAppKit and Privy
    const dappKitThemeVariables = useMemo(
        () => generateDAppKitCSSVariables(tokens, darkMode),
        [tokens, darkMode],
    );

    const privyCSSVariables = useMemo(
        () => generatePrivyCSSVariables(tokens, darkMode),
        [tokens, darkMode],
    );

    // Apply Privy CSS variables to document and inject backdrop filter + card styles
    useEffect(() => {
        // Prepare card backgrounds with readability improvements
        const privyCardBg = improvePrivyReadability(
            tokens.colors.background.card,
            darkMode,
        );
        const privyCardElevatedBg = improvePrivyReadability(
            tokens.colors.background.cardElevated,
            darkMode,
        );
        // Use loginIn variant style: white (light) / transparent (dark) background
        const privyButtonBaseBg = darkMode ? 'transparent' : '#ffffff';
        const privyButtonHoverBg = darkMode ? 'transparent' : '#ffffff';
        const privyButtonActiveBg = darkMode ? 'transparent' : '#ffffff';

        applyPrivyCSSVariables(
            privyCSSVariables,
            tokens.effects.backdropFilter.modal,
            privyCardBg,
            privyCardElevatedBg,
            privyButtonBaseBg,
            privyButtonHoverBg,
            privyButtonActiveBg,
            tokens.colors.border.default,
        );
    }, [
        privyCSSVariables,
        tokens.effects.backdropFilter.modal,
        tokens.colors.background.card,
        tokens.colors.background.cardElevated,
        tokens.colors.border.default,
        darkMode,
    ]);

    // Apply DAppKit button styles (hover opacity matching loginIn variant)
    useEffect(() => {
        applyDAppKitButtonStyles();
    }, []);

    return (
        <EnsureQueryClient>
            <ReactQueryDevtools initialIsOpen={false} />
            <PrivyCrossAppProvider privyEcosystemAppIDS={allowedEcosystemApps}>
                <VeChainKitContext.Provider
                    value={{
                        privy,
                        privyEcosystemAppIDS: allowedEcosystemApps,
                        feeDelegation,
                        dappKit,
                        loginModalUI,
                        loginMethods: validatedLoginMethods,
                        darkMode,
                        i18n: i18nConfig,
                        appConfig,
                        currentLanguage,
                        network,
                        allowCustomTokens,
                        allowCommunityTokens,
                        legalDocuments,
                        hiddenQuickActions,
                        currentCurrency,
                        theme: customTheme,
                        setLanguage,
                        setCurrency,
                    }}
                >
                    <PrivyProvider
                        appId={privyAppId}
                        clientId={privyClientId}
                        config={{
                            // loginMethods: privy?.loginMethods,
                            loginMethodsAndOrder: {
                                primary: (privy?.loginMethods.slice(0, 4) ??
                                    []) as NonEmptyArray<LoginMethodOrderOption>,
                                overflow: (privy?.loginMethods.slice(4) ??
                                    []) as Array<LoginMethodOrderOption>,
                            },
                            externalWallets: {
                                walletConnect: {
                                    enabled: false,
                                },
                            },
                            appearance: {
                                theme: darkMode ? 'dark' : 'light',
                                accentColor:
                                    privy?.appearance.accentColor ??
                                    (tokens.buttons.primaryButton.bg?.startsWith(
                                        '#',
                                    )
                                        ? (tokens.buttons.primaryButton
                                              .bg as `#${string}`)
                                        : darkMode
                                        ? '#3182CE'
                                        : '#2B6CB0'),
                                loginMessage: privy?.appearance.loginMessage,
                                logo: privy?.appearance.logo,
                            },
                            embeddedWallets: {
                                createOnLogin:
                                    privy?.embeddedWallets?.createOnLogin ??
                                    'all-users',
                            },
                            passkeys: {
                                shouldUnlinkOnUnenrollMfa: false,
                            },
                            customOAuthRedirectUrl:
                                privy?.customOAuthRedirectUrl,
                        }}
                    >
                        <DAppKitProvider
                            node={network.nodeUrl}
                            alwaysShowConnect={true}
                            v2Api={{
                                enabled: dappKit.v2Api?.enabled ?? true, //defaults to true
                                external: dappKit.v2Api?.external ?? false, //defaults to false
                            }}
                            language={currentLanguage}
                            logLevel={dappKit.logLevel}
                            modalParent={dappKit.modalParent}
                            onSourceClick={dappKit.onSourceClick}
                            usePersistence={dappKit.usePersistence ?? true}
                            allowedWallets={dappKit.allowedWallets}
                            walletConnectOptions={dappKit.walletConnectOptions}
                            themeMode={darkMode ? 'DARK' : 'LIGHT'}
                            themeVariables={
                                dappKit.themeVariables
                                    ? {
                                          ...dappKitThemeVariables,
                                          ...dappKit.themeVariables,
                                      }
                                    : dappKitThemeVariables
                            }
                        >
                            <PrivyWalletProvider
                                nodeUrl={network.nodeUrl}
                                delegatorUrl={
                                    feeDelegation?.delegatorUrl ??
                                    feeDelegation?.genericDelegatorUrl
                                }
                                delegateAllTransactions={
                                    feeDelegation?.delegateAllTransactions ??
                                    false
                                }
                                genericDelegator={
                                    !feeDelegation?.delegatorUrl &&
                                    feeDelegation?.genericDelegatorUrl
                                        ? true
                                        : false
                                }
                            >
                                <ModalProvider>
                                    <CrossAppErrorRecovery />
                                    <LegalDocumentsProvider>
                                        {children}
                                    </LegalDocumentsProvider>
                                </ModalProvider>
                            </PrivyWalletProvider>
                        </DAppKitProvider>
                    </PrivyProvider>
                </VeChainKitContext.Provider>
            </PrivyCrossAppProvider>
        </EnsureQueryClient>
    );
};
````

## Source: `packages/vechain-kit/src/providers/index.ts`

````typescript
export * from './VeChainKitProvider';
export * from './PrivyWalletProvider';
export * from './VechainKitThemeProvider';
export * from './LegalDocumentsProvider';
export * from './ModalProvider';
````

## Source: `packages/vechain-kit/src/theme/button.ts`

````typescript
import { defineStyle, defineStyleConfig } from '@chakra-ui/react';
import { ThemeTokens } from './tokens';

const baseStyle = defineStyle({
    borderRadius: '12px',
});

const getVariants = (tokens: ThemeTokens) => ({
    // Login variants - maintained for backward compatibility
    // These should eventually be replaced with vechainKitTertiary and vechainKitPrimary
    loginIn: defineStyle(() => ({
        bg: tokens.buttons.loginButton.bg,
        color: tokens.buttons.loginButton.color,
        border: tokens.buttons.loginButton.border,
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        py: 6,
        px: 3,
        rounded:
            tokens.buttons.loginButton.rounded ?? tokens.borders.radius.large,
        backdropFilter: tokens.buttons.loginButton.backdropFilter,
        _hover: {
            opacity: 0.5,
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.loginButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.loginButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    loginWithVechain: defineStyle(() => ({
        color: 'white', // Note: Different from vechainKitPrimary which uses 'white'
        bg: '#1a1a1a',
        fontSize: tokens.fonts.sizes.medium,
        fontWeight: tokens.fonts.weights.normal,
        py: 6,
        px: 3,
        borderRadius: tokens.borders.radius.large,
        border: `1px solid ${tokens.colors.border.button}`,
        _hover: {
            opacity: 0.5,
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: '#1a1a1a', // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: '#1a1a1a', // Explicitly set background
        },
        _dark: {
            color: '#1a1a1a',
            bg: 'white',
            _hover: {
                _disabled: {
                    bg: 'white', // Ensure background stays in dark mode
                },
            },
            _disabled: {
                bg: 'white', // Explicitly set background in dark mode
            },
        },
        transition: 'all 0.2s',
    })),
    vechainKitPrimary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded:
            tokens.buttons.primaryButton.rounded ?? tokens.borders.radius.large,
        bg: tokens.buttons.primaryButton.bg,
        color: tokens.buttons.primaryButton.color,
        border: tokens.buttons.primaryButton.border,
        backdropFilter: tokens.buttons.primaryButton.backdropFilter,
        _hover: {
            ...(tokens.buttons.primaryButton.hoverBg
                ? { bg: tokens.buttons.primaryButton.hoverBg }
                : { opacity: 0.8 }),
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.primaryButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.primaryButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitSecondary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded: tokens.buttons.button.rounded ?? tokens.borders.radius.large,
        bg: tokens.buttons.button.bg,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            ...(tokens.buttons.button.hoverBg
                ? { bg: tokens.buttons.button.hoverBg }
                : { opacity: 0.8 }), // Derive hover from bg with opacity if hoverBg not provided
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitTertiary: defineStyle(() => ({
        fontSize: tokens.fonts.sizes.medium,
        px: 4,
        width: 'full',
        height: '60px',
        rounded:
            tokens.buttons.tertiaryButton.rounded ??
            tokens.borders.radius.large,
        bg: tokens.buttons.tertiaryButton.bg,
        color: tokens.buttons.tertiaryButton.color,
        border:
            tokens.buttons.tertiaryButton.border === 'none'
                ? 'none'
                : tokens.buttons.tertiaryButton.border,
        backdropFilter: tokens.buttons.tertiaryButton.backdropFilter,
        _hover: {
            opacity: 0.8, // Derive hover from bg with opacity
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.tertiaryButton.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.tertiaryButton.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    vechainKitLogout: defineStyle(() => ({
        px: 4,
        width: 'full',
        height: '60px',
        rounded: tokens.buttons.button.rounded ?? tokens.borders.radius.large,
        bg: tokens.colors.error + '1f',
        color: tokens.colors.error,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            opacity: 0.8,
            _disabled: {
                opacity: 0.5,
                bg: tokens.colors.error + '1f',
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
        transition: 'all 0.2s',
    })),
    vechainKitHeaderIconButtons: defineStyle(() => ({
        bg: tokens.buttons.button.bg,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? 'none'
                : tokens.buttons.button.border,
        backdropFilter: tokens.buttons.button.backdropFilter,
        _hover: {
            ...(tokens.buttons.button.hoverBg
                ? { bg: tokens.buttons.button.hoverBg }
                : { opacity: 0.8 }), // Derive hover from bg with opacity if hoverBg not provided
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
        rounded: 'full',
        mt: '8px',
    })),
    actionButton: defineStyle(() => ({
        width: 'full',
        minHeight: '50px',
        height: 'fit-content',
        bg: tokens.buttons.button.bg,
        borderRadius: tokens.borders.radius.xl,
        p: 0,
        color: tokens.buttons.button.color,
        border:
            tokens.buttons.button.border === 'none'
                ? `1px solid ${tokens.colors.border.button}`
                : tokens.buttons.button.border,
        _hover: {
            opacity: 0.8, // Derive hover from bg with opacity
            _disabled: {
                opacity: 0.5, // Override hover opacity when disabled
                bg: tokens.buttons.button.bg, // Ensure background stays
            },
        },
        _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
            bg: tokens.buttons.button.bg, // Explicitly set background
        },
        transition: 'all 0.2s',
    })),
    ghost: defineStyle(() => ({
        bg: 'transparent',
        color: tokens.colors.text.primary,
        border: 'none',
        _hover: {
            bg: tokens.buttons.button.bg,
        },
        _active: {
            bg: tokens.buttons.button.bg,
            opacity: 0.8, // Use opacity for active state
        },
        transition: 'all 0.2s',
    })),
    link: defineStyle(() => ({
        color: tokens.colors.text.primary,
        _hover: {
            color: tokens.colors.text.secondary,
            textDecoration: 'underline',
        },
        _active: {
            color: tokens.colors.text.primary,
        },
        transition: 'all 0.2s',
    })),
});

export const getButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
    });

export const getIconButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
    });

export const getCloseButtonTheme = (tokens: ThemeTokens) =>
    defineStyleConfig({
        baseStyle,
        variants: getVariants(tokens),
        defaultProps: {
            variant: 'vechainKitHeaderIconButtons',
        },
    });
````

## Source: `packages/vechain-kit/src/theme/card.ts`

````typescript
import { ThemeTokens } from './tokens';

const CARD_ANATOMY_KEYS = ['container', 'header', 'body', 'footer'] as const;

const definePartsStyle = <T>(config: T): T => config;
const defineMultiStyleConfig = <T extends object>(
    config: T,
): T & { parts: readonly string[] } => ({
    parts: CARD_ANATOMY_KEYS,
    ...config,
});

const getCardVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        container: {
            backgroundColor: tokens.colors.background.card,
            borderRadius: tokens.borders.radius.medium,
            width: 'full',
            border: 'none',
        },
        body: {
            p: 5,
            width: 'full',
        },
        header: {
            p: 5,
            width: 'full',
            borderRadius: `${tokens.borders.radius.medium} ${tokens.borders.radius.medium} 0 0`,
        },
        footer: {
            width: 'full',
            borderRadius: `0 0 ${tokens.borders.radius.medium} ${tokens.borders.radius.medium}`,
        },
    }),

    vechainKitWalletCard: definePartsStyle({
        container: {
            backgroundColor: tokens.colors.background.card,
            borderRadius: tokens.borders.radius.medium,
            width: 'full',
            cursor: 'pointer',
            position: 'relative',
        },
    }),

    featureAnnouncement: definePartsStyle({
        body: {
            backgroundColor: tokens.buttons.button.bg,
            borderRadius: tokens.borders.radius.medium,
            color: tokens.colors.text.secondary,
        },
        container: {
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: 'transparent',
        },
    }),

    vechainKitAppCard: definePartsStyle({
        body: {
            height: 'full',
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: tokens.colors.background.cardElevated,
            border: `1px solid ${tokens.colors.border.default}`,
        },
        container: {
            height: '150px',
            borderRadius: tokens.borders.radius.medium,
            backgroundColor: 'transparent',
        },
    }),
});

export const getCardTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getCardVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase', // default is solid
        },
    });
````

## Source: `packages/vechain-kit/src/theme/index.ts`

````typescript
export * from './theme';
export type { VechainKitThemeConfig, ThemeTokens } from './tokens';
````

## Source: `packages/vechain-kit/src/theme/input.ts`

````typescript
import {
    defineStyle,
    defineStyleConfig,
    createMultiStyleConfigHelpers,
} from '@chakra-ui/react';
import { inputAnatomy } from '@chakra-ui/anatomy';

/**
 * Force a 16px font size on form inputs so mobile Safari doesn't
 * auto-zoom on focus. iOS zooms the page whenever a focused input's
 * computed font-size is below 16px CSS pixels — and the kit's `md`
 * font token resolves to 14px (see tokens.ts), so the Chakra default
 * Input/Textarea would land at 14px and trigger the zoom. We pin the
 * size in absolute pixels rather than `lg` so future token tweaks
 * can't accidentally regress this.
 */
const { definePartsStyle, defineMultiStyleConfig } =
    createMultiStyleConfigHelpers(inputAnatomy.keys);

export const getInputTheme = () =>
    defineMultiStyleConfig({
        baseStyle: definePartsStyle({
            field: {
                fontSize: '16px',
            },
        }),
    });

export const getTextareaTheme = () =>
    defineStyleConfig({
        baseStyle: defineStyle({
            fontSize: '16px',
        }),
    });
````

## Source: `packages/vechain-kit/src/theme/modal.ts`

````typescript
import { ThemeTokens } from './tokens';

const MODAL_ANATOMY_KEYS = [
    'overlay',
    'dialogContainer',
    'dialog',
    'header',
    'closeButton',
    'body',
    'footer',
] as const;

const definePartsStyle = <T>(config: T): T => config;
const defineMultiStyleConfig = <T extends object>(
    config: T,
): T & { parts: readonly string[] } => ({
    parts: MODAL_ANATOMY_KEYS,
    ...config,
});

const getModalVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        dialog: {
            scrollbarWidth: 'none',
            overflow: 'scroll',
            overflowX: 'hidden',
            rounded: tokens.modal.rounded ?? tokens.borders.radius.modal,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            border: tokens.colors.border.modal,
        },
        overlay: {
            backgroundColor: tokens.colors.background.overlay,
            backdropFilter: tokens.effects.backdropFilter.overlay,
        },
        closeButton: {
            borderRadius: tokens.borders.radius.full,
            color: tokens.colors.text.primary,
            _hover: {
                ...(tokens.buttons.button.hoverBg
                    ? { bg: tokens.buttons.button.hoverBg }
                    : { opacity: 0.8 }),
            },
            _active: {
                bg: tokens.buttons.button.bg,
                opacity: 0.8,
            },
        },
        header: {
            w: 'full',
            color: tokens.colors.text.primary,
            fontSize: tokens.fonts.sizes.large,
            fontWeight: tokens.fonts.weights.bold,
            textAlign: 'center',
            paddingBottom: 5,
            paddingTop: 5,
        },
    }),
});

export const getModalTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getModalVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
````

## Source: `packages/vechain-kit/src/theme/popover.ts`

````typescript
import { ThemeTokens } from './tokens';

const POPOVER_ANATOMY_KEYS = [
    'content',
    'header',
    'body',
    'footer',
    'popper',
    'arrow',
    'closeButton',
] as const;

const definePartsStyle = <T>(config: T): T => config;
const defineMultiStyleConfig = <T extends object>(
    config: T,
): T & { parts: readonly string[] } => ({
    parts: POPOVER_ANATOMY_KEYS,
    ...config,
});

const getPopoverVariants = (tokens: ThemeTokens) => ({
    vechainKitBase: definePartsStyle({
        popper: {
            zIndex: 1000,
        },
        content: {
            borderRadius: tokens.borders.radius.xl,
            border: tokens.colors.border.modal,
            backgroundColor: tokens.colors.background.modal,
            backdropFilter: tokens.effects.backdropFilter.modal,
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12)',
            // Tighter than the modal — popovers anchor next to a trigger and
            // don't need the full 380px the modal uses.
            width: '320px',
            minWidth: '320px',
        },
        body: {
            padding: '12px',
        },
    }),
});

export const getPopoverTheme = (tokens: ThemeTokens) =>
    defineMultiStyleConfig({
        variants: getPopoverVariants(tokens),
        defaultProps: {
            variant: 'vechainKitBase',
        },
    });
````

## Source: `packages/vechain-kit/src/theme/theme.tsx`

````tsx
import { ThemeConfig, extendTheme, theme as baseTheme } from '@chakra-ui/react';
import { getModalTheme } from './modal';
import { getCardTheme } from './card';
import {
    getButtonTheme,
    getIconButtonTheme,
    getCloseButtonTheme,
} from './button';
import { getPopoverTheme } from './popover';
import { getInputTheme, getTextareaTheme } from './input';
import {
    VechainKitThemeConfig,
    ThemeTokens,
    getDefaultTokens,
    convertThemeConfigToTokens,
    mergeTokens,
} from './tokens';

/**
 * Opacity helper that handles hex / rgb(a) literals directly and falls back to
 * `color-mix` for anything else (CSS var refs, named colors, etc.) so the
 * resolved color tracks host theme changes at paint time. Mirrors
 * `tokens.ts:applyOpacity`.
 */
const applyOpacityHelper = (color: string, opacity: number): string => {
    const rgba = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (rgba) {
        return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${opacity})`;
    }
    const hex = color.replace('#', '');
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    const percent = Math.round(opacity * 10000) / 100;
    return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
};

// minimal theme that completely disables global styles
const getThemeConfig = (
    darkMode: boolean,
    tokens: ThemeTokens,
): ThemeConfig => ({
    useSystemColorMode: false,
    disableTransitionOnChange: false,

    // @ts-ignore
    components: {
        Modal: getModalTheme(tokens),
        Card: getCardTheme(tokens),
        Button: getButtonTheme(tokens),
        IconButton: getIconButtonTheme(tokens),
        CloseButton: getCloseButtonTheme(tokens),
        Popover: getPopoverTheme(tokens),
        Input: getInputTheme(),
        Textarea: getTextareaTheme(),
    },
    // No global styles - fonts will be applied via component-level styles
    // to ensure they only affect VeChain Kit components, not the host app
    styles: {
        global: () => ({}),
    },

    // semantic tokens derived from ThemeTokens
    semanticTokens: {
        colors: {
            // Note: chakra-body-text, chakra-body-bg, and chakra-border-color are intentionally omitted
            // to prevent Chakra UI from applying global body/html/border styles that would override host apps
            // Chakra injects: *, *::before, *::after { border-color: var(--chakra-colors-chakra-border-color) }
            // which causes unwanted borders on consumer app elements (e.g., variant="link" buttons)
            // Border colors are applied via scoped CSS in VechainKitThemeProvider LayerSetup instead
            'chakra-placeholder-color': tokens.colors.text.tertiary,
            // VeChain Kit semantic tokens
            // Main structural background tokens (for component backgrounds)
            'vechain-kit-modal': tokens.colors.background.modal,
            'vechain-kit-overlay': tokens.colors.background.overlay,
            'vechain-kit-card': darkMode
                ? 'rgba(0, 0, 0, 0.3)'
                : 'rgba(0, 0, 0, 0.05)', // Darker card with transparency
            'vechain-kit-card-elevated': darkMode
                ? 'rgba(0, 0, 0, 0.4)'
                : 'rgba(0, 0, 0, 0.08)', // Darker elevated card with transparency
            'vechain-kit-sticky-header': tokens.colors.background.stickyHeader,
            'vechain-kit-text-primary': tokens.colors.text.primary,
            'vechain-kit-text-secondary': tokens.colors.text.secondary,
            'vechain-kit-text-tertiary': tokens.colors.text.tertiary,
            'vechain-kit-border': tokens.colors.border.default,
            'vechain-kit-border-hover': tokens.colors.border.hover,
            'vechain-kit-border-focus': tokens.colors.border.focus,
            'vechain-kit-border-button': tokens.colors.border.button,
            'vechain-kit-success': tokens.colors.success,
            'vechain-kit-error': tokens.colors.error,
            // Soft tinted surfaces used by the StatusScreen badges and any
            // other "muted success/error" backgrounds. Derived at 12% alpha
            // so they track dev overrides automatically.
            'vechain-kit-success-bg': applyOpacityHelper(
                tokens.colors.success,
                0.12,
            ),
            'vechain-kit-error-bg': applyOpacityHelper(tokens.colors.error, 0.12),
            'vechain-kit-warning': tokens.colors.warning,
            'vechain-kit-accent': tokens.colors.accent,
            'vechain-kit-button-secondary-bg': tokens.buttons.button.bg,
            'vechain-kit-button-primary-bg': tokens.buttons.primaryButton.bg,
            'vechain-kit-button-primary-color':
                tokens.buttons.primaryButton.color,
        },
        effects: {
            'vechain-kit-backdrop-filter-modal':
                tokens.effects.backdropFilter.modal,
            'vechain-kit-backdrop-filter-overlay':
                tokens.effects.backdropFilter.overlay,
            'vechain-kit-backdrop-filter-sticky-header':
                tokens.effects.backdropFilter.stickyHeader,
        },

        config: {
            cssVarPrefix: 'vechain-kit', // consistent naming across all components
        },
    },

    // Don't modify fonts in theme - Chakra creates global CSS variables from fonts.body/heading
    // Custom fonts are applied via scoped CSS in VechainKitThemeProvider instead
    fonts: baseTheme.fonts,
    fontSizes: {
        ...baseTheme.fontSizes,
        // Add theme font sizes as standard Chakra font sizes
        sm: tokens.fonts.sizes.small,
        md: tokens.fonts.sizes.medium,
        lg: tokens.fonts.sizes.large,
    },
    fontWeights: {
        ...baseTheme.fontWeights,
        normal: tokens.fonts.weights.normal,
        medium: tokens.fonts.weights.medium,
        bold: tokens.fonts.weights.bold,
    },
    colors: baseTheme.colors,
    space: baseTheme.space,
});

export const getVechainKitTheme = (
    darkMode: boolean,
    customThemeConfig?: VechainKitThemeConfig,
): ReturnType<typeof extendTheme> => {
    // Get default tokens for the mode
    const defaultTokens = getDefaultTokens(darkMode);

    // Convert custom config to partial tokens
    const customTokens = convertThemeConfigToTokens(
        customThemeConfig,
        darkMode,
    );

    // Merge custom tokens with defaults
    const tokens = mergeTokens(defaultTokens, customTokens);

    // Generate theme config with tokens
    const themeConfig = getThemeConfig(darkMode, tokens);

    const theme = extendTheme(themeConfig);

    // CRITICAL: Completely disable global styles to prevent Chakra from injecting
    // *, *::before, *::after rules that would affect the consumer app
    theme.styles.global = () => ({
        // Return empty object - no global styles should leak to consumer app
        // All VeChain Kit styles are scoped via LayerSetup in VechainKitThemeProvider
    });

    // Override CSS variables to prevent them from being set globally
    // They will be set only within VeChain Kit containers via LayerSetup
    if (theme.__cssVars) {
        theme.__cssVars.global = () => {
            // Don't set any CSS variables globally - they're scoped in LayerSetup
            return {};
        };
    }

    return theme;
};
````

## Source: `packages/vechain-kit/src/theme/tokens.ts`

````typescript
/**
 * Theme token system for VeChain Kit
 * Provides a single source of truth for all styling values
 */

/**
 * Complete internal token type - all fields required
 */
export interface ThemeTokens {
    colors: {
        // Main structural backgrounds for components
        background: {
            modal: string; // Modal dialog background
            overlay: string; // Modal overlay background
            card: string; // Card container background
            cardElevated: string; // Elevated card background
            stickyHeader: string; // Sticky header background
        };
        text: {
            primary: string;
            secondary: string;
            tertiary: string;
            disabled: string;
        };
        border: {
            default: string;
            hover: string;
            focus: string;
            button: string;
            modal: string; // Modal dialog border
        };
        success: string;
        error: string;
        warning: string;
        /** Brand accent. Used by the connect flow's spinner top arc, focus
         *  rings, "Waiting for signature…" headline, and the email submit
         *  link when the address is valid. */
        accent: string;
    };
    // Button-specific tokens - use these for button variants
    buttons: {
        button: {
            bg: string;
            color: string;
            border: string;
            hoverBg?: string; // Optional custom hover background color
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
        };
        primaryButton: {
            bg: string;
            color: string;
            border: string;
            hoverBg?: string; // Optional custom hover background color
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
        };
        tertiaryButton: {
            bg: string;
            color: string;
            border: string;
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
        };
        loginButton: {
            bg: string;
            color: string;
            border: string;
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
        };
    };
    effects: {
        backdropFilter: {
            modal: string;
            overlay: string;
            stickyHeader: string;
        };
        glassOpacity: {
            modal: number;
            overlay: number;
            stickyHeader: number;
        };
    };
    fonts: {
        body: string; // Font family for body text
        heading: string; // Font family for headings (h1-h6)
        sizes: {
            small: string;
            medium: string;
            large: string;
        };
        weights: {
            normal: number;
            medium: number;
            bold: number;
        };
    };
    borders: {
        radius: {
            small: string;
            medium: string;
            large: string;
            xl: string;
            full: string;
            modal: string; // Modal dialog border radius
        };
    };
    modal: {
        rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
    };
}

/**
 * Developer-facing theme configuration
 * Simplified interface - only modal.backgroundColor and textColor required
 * All other colors are automatically derived from these base colors
 */
export interface VechainKitThemeConfig {
    textColor?: string;
    /** Brand accent. Used by the connect modal's spinner, focus rings, the
     *  "Waiting for signature…" headline, and the email submit link when the
     *  address is valid. Default: blue (`#3b82f6` light / `#60a5fa` dark). */
    accent?: string;
    overlay?: {
        backgroundColor?: string; // Customize overlay background color
        blur?: string; // Customize overlay blur effect (e.g., "blur(10px)")
    };
    modal?: {
        backgroundColor?: string; // Base background color for modal (used to derive card, stickyHeader, etc. via opacity)
        border?: string; // Full CSS border string for modal dialog (e.g., "1px solid rgba(255, 255, 255, 0.1)")
        backdropFilter?: string; // Backdrop filter for modal dialog (e.g., "blur(10px)")
        borderRadius?: string; // Modal dialog border radius (e.g., "24px", "1rem") - deprecated, use rounded instead
        rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
        /**
         * Whether to use bottom sheet on mobile devices.
         * When false (default), uses regular modal on all screen sizes.
         * When true, uses bottom sheet on mobile (< 768px) and regular modal on desktop.
         */
        useBottomSheetOnMobile?: boolean;
    };
    buttons?: {
        secondaryButton?: {
            bg?: string;
            color?: string;
            border?: string; // Full CSS border string like "1px solid #color"
            hoverBg?: string; // Optional custom hover background color (if not provided, uses opacity)
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
        };
        primaryButton?: {
            bg?: string;
            color?: string;
            border?: string; // Full CSS border string like "1px solid #color"
            hoverBg?: string; // Optional custom hover background color (if not provided, uses opacity)
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
        };
        tertiaryButton?: {
            bg?: string;
            color?: string;
            border?: string; // Full CSS border string like "1px solid #color"
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
        };
        loginButton?: {
            bg?: string;
            color?: string;
            border?: string; // Full CSS border string like "1px solid #color"
            backdropFilter?: string; // Optional backdrop filter (e.g., "blur(10px)")
            rounded?: string | number; // Border radius (Chakra UI rounded prop: "sm", "md", "lg", "xl", "2xl", "3xl", "full", or number)
        };
    };
    fonts?: {
        family?: string; // Font family for both body and headings (backward compatibility)
        body?: string; // Font family for body text (e.g., "Inter, sans-serif")
        heading?: string; // Font family for headings (e.g., "Satoshi, sans-serif")
        sizes?: {
            small?: string; // Font size for small text (e.g., "12px")
            medium?: string; // Font size for medium text (e.g., "14px")
            large?: string; // Font size for large text (e.g., "16px")
        };
        weights?: {
            normal?: number; // Normal font weight (e.g., 400)
            medium?: number; // Medium font weight (e.g., 500)
            bold?: number; // Bold font weight (e.g., 700)
        };
    };
    effects?: {
        glass?: {
            enabled?: boolean;
            intensity?: 'low' | 'medium' | 'high';
        };
        backdropFilter?: {
            modal?: string; // Optional custom blur for modal
            overlay?: string; // Optional custom blur for overlay (deprecated, use overlay.blur)
        };
    };
}

/**
 * Convert hex color to rgba with opacity
 */
function hexToRgba(hex: string, opacity: number): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Parse color string (hex, rgba, rgb, or named color) and return rgba with new opacity
 */
function applyOpacity(color: string, opacity: number): string {
    // If already rgba/rgb, extract RGB values and apply new opacity
    const rgbaMatch = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/,
    );
    if (rgbaMatch) {
        return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${opacity})`;
    }

    // If hex, convert to rgba
    if (color.startsWith('#')) {
        return hexToRgba(color, opacity);
    }

    // For CSS var() references, named colors, or any other format, emit a
    // color-mix expression so the browser resolves the underlying color at
    // paint time. This keeps the result reactive to host theme changes (e.g.
    // next-themes toggling html.dark) — snapshotting via a temporary DOM
    // element here would freeze whichever value the host had applied at
    // render time, leaving downstream tokens one toggle behind.
    const percent = Math.round(opacity * 10000) / 100;
    return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/**
 * Derive background colors from base color with different opacities
 */
function deriveBackgroundColors(
    baseColor: string,
    darkMode: boolean,
    defaultOverlayColor: string,
    overlayColor?: string,
): ThemeTokens['colors']['background'] {
    // Use custom overlayColor if provided, otherwise use default overlay color
    // Never derive overlay from backgroundColor - always use default unless explicitly set
    const overlay = overlayColor || defaultOverlayColor;

    return {
        modal: baseColor, // 100% opacity
        card: applyOpacity(baseColor, 0.8),
        cardElevated: baseColor, // Same as modal for elevated
        overlay: overlay,
        stickyHeader: applyOpacity(baseColor, 0.9),
    };
}

/**
 * Derive text colors from base text color with opacity
 */
function deriveTextColors(
    baseColor: string,
    darkMode: boolean,
): ThemeTokens['colors']['text'] {
    return {
        primary: baseColor,
        secondary: applyOpacity(baseColor, 0.7),
        tertiary: applyOpacity(baseColor, 0.5),
        disabled: darkMode ? '#4A5568' : '#A0AEC0',
    };
}

/**
 * Derive border colors from background color with low opacity
 */
function deriveBorderColors(
    baseColor: string,
    darkMode: boolean,
    modalBorder?: string,
): ThemeTokens['colors']['border'] {
    const overlayColor = darkMode ? '#ffffff' : '#000000';
    return {
        default: applyOpacity(overlayColor, 0.1),
        hover: applyOpacity(overlayColor, 0.2),
        focus: darkMode ? '#3182CE' : '#2B6CB0',
        button: applyOpacity(overlayColor, 0.1),
        modal: modalBorder || 'none', // Use custom modal border or default to 'none'
    };
}

type ButtonConfig = {
    hoverBg?: string; // Optional custom hover background color
    bg?: string;
    color?: string;
    border?: string;
    backdropFilter?: string; // Optional backdrop filter
    rounded?: string | number; // Optional border radius (Chakra UI rounded prop)
};

/**
 * Derive secondary button styles from backgroundColor and textColor
 */
function deriveSecondaryButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: ButtonConfig | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['button'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.button.bg,
            color: customConfig.color || defaultTokens.buttons.button.color,
            border: customConfig.border || defaultTokens.buttons.button.border,
            hoverBg: customConfig.hoverBg,
            backdropFilter: customConfig.backdropFilter,
            rounded: customConfig.rounded,
        };
    }

    // Derive from backgroundColor and textColor if available
    if (backgroundColor && textColor) {
        const overlayColor = darkMode ? '#ffffff' : '#000000';
        return {
            bg: applyOpacity(overlayColor, 0.1), // Similar to secondary.base
            color: textColor,
            border: `1px solid ${applyOpacity(overlayColor, 0.1)}`, // Similar to border.button
        };
    }

    // Use defaults
    return defaultTokens.buttons.button;
}

/**
 * Derive primary button styles
 */
function derivePrimaryButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: ButtonConfig | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['primaryButton'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.primaryButton.bg,
            color:
                customConfig.color || defaultTokens.buttons.primaryButton.color,
            border:
                customConfig.border ||
                defaultTokens.buttons.primaryButton.border,
            hoverBg: customConfig.hoverBg,
            backdropFilter: customConfig.backdropFilter,
            rounded: customConfig.rounded,
        };
    }

    // Derive from backgroundColor and textColor if available
    // Primary buttons typically use a primary color (defaults to blue)
    if (backgroundColor && textColor) {
        // Use default primary button color (which defaults to blue)
        // But allow customization via primaryButton config
        return {
            bg: defaultTokens.buttons.primaryButton.bg,
            color: defaultTokens.buttons.primaryButton.color,
            border: 'none',
        };
    }

    // Use defaults
    return defaultTokens.buttons.primaryButton;
}

/**
 * Derive tertiary button styles
 */
function deriveTertiaryButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: ButtonConfig | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['tertiaryButton'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.tertiaryButton.bg,
            color:
                customConfig.color ||
                defaultTokens.buttons.tertiaryButton.color,
            border:
                customConfig.border ||
                defaultTokens.buttons.tertiaryButton.border,
            backdropFilter: customConfig.backdropFilter,
            rounded: customConfig.rounded,
        };
    }

    // Derive from backgroundColor and textColor if available
    if (backgroundColor && textColor) {
        // Tertiary buttons are typically transparent with hover effects
        return {
            bg: 'transparent',
            color: textColor,
            border: 'none',
        };
    }

    // Use defaults
    return defaultTokens.buttons.tertiaryButton;
}

/**
 * Derive login button styles
 */
function deriveLoginButtonStyles(
    backgroundColor: string | undefined,
    textColor: string | undefined,
    darkMode: boolean,
    customConfig: ButtonConfig | undefined,
    defaultTokens: ThemeTokens,
): ThemeTokens['buttons']['loginButton'] {
    // Use custom config if provided
    if (customConfig) {
        return {
            bg: customConfig.bg || defaultTokens.buttons.loginButton.bg,
            color:
                customConfig.color || defaultTokens.buttons.loginButton.color,
            border:
                customConfig.border || defaultTokens.buttons.loginButton.border,
            backdropFilter: customConfig.backdropFilter,
            rounded: customConfig.rounded,
        };
    }

    // Use default login button styles (current hardcoded behavior)
    return defaultTokens.buttons.loginButton;
}

/**
 * Get glass effect settings based on intensity
 */
function getGlassEffectSettings(
    intensity: 'low' | 'medium' | 'high',
    enabled: boolean,
): {
    blur: string;
    modalOpacity: number;
    overlayOpacity: number;
    stickyHeaderOpacity: number;
} {
    // Default blur values (used when glass is disabled or as fallback)
    const defaultBlur = {
        modal: 'blur(3px)',
        overlay: 'blur(3px)',
        stickyHeader: 'blur(20px)',
    };

    if (!enabled) {
        return {
            blur: defaultBlur.modal, // Use default blur even when glass is disabled
            modalOpacity: 1,
            overlayOpacity: 0.4,
            stickyHeaderOpacity: 0.9,
        };
    }

    const settings = {
        low: {
            blur: 'blur(4px)',
            modalOpacity: 0.4,
            overlayOpacity: 0.3,
            stickyHeaderOpacity: 0.7,
        },
        medium: {
            blur: 'blur(4px)',
            modalOpacity: 0.6,
            overlayOpacity: 0.4,
            stickyHeaderOpacity: 0.8,
        },
        high: {
            blur: 'blur(5px)',
            modalOpacity: 0.8,
            overlayOpacity: 0.5,
            stickyHeaderOpacity: 0.85,
        },
    };

    return settings[intensity];
}

/**
 * Default tokens for light mode
 */
const defaultLightTokens: ThemeTokens = {
    colors: {
        background: {
            modal: '#ffffff',
            overlay: 'rgba(0, 0, 0, 0.4)',
            card: '#f5f5f5',
            cardElevated: '#ffffff',
            stickyHeader: 'rgba(255, 255, 255, 0.69)',
        },
        text: {
            primary: '#2e2e2e',
            secondary: '#4d4d4d',
            tertiary: '#718096',
            disabled: '#A0AEC0',
        },
        border: {
            default: 'transparent',
            hover: '#d0d0d0',
            focus: '#2B6CB0',
            button: '#ebebeb',
            modal: 'none',
        },
        success: '#10ba3e',
        error: '#ef4444',
        warning: '#F6AD55',
        accent: '#3b82f6',
    },
    buttons: {
        button: {
            bg: 'rgba(0, 0, 0, 0.1)',
            color: '#2e2e2e',
            border: 'none',
        },
        primaryButton: {
            bg: '#272A2E',
            color: 'white',
            rounded: 'full',
            border: 'none',
        },
        tertiaryButton: {
            bg: 'transparent',
            color: '#2e2e2e',
            border: 'none',
        },
        loginButton: {
            bg: 'white',
            color: '#1a1a1a',
            border: '1px solid transparent',
        },
    },
    effects: {
        backdropFilter: {
            modal: 'blur(3px)',
            overlay: 'blur(3px)',
            stickyHeader: 'blur(12px)',
        },
        glassOpacity: {
            modal: 1,
            overlay: 0.4,
            stickyHeader: 0.69,
        },
    },
    fonts: {
        body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        heading:
            'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    borders: {
        radius: {
            small: '8px',
            medium: '12px',
            large: '16px',
            xl: '24px',
            full: '9999px',
            modal: '24px',
        },
    },
    modal: {
        rounded: undefined,
    },
};

/**
 * Default tokens for dark mode
 */
const defaultDarkTokens: ThemeTokens = {
    colors: {
        background: {
            modal: '#151515',
            overlay: 'rgba(0, 0, 0, 0.6)',
            card: 'rgba(0, 0, 0, 0.3)',
            cardElevated: '#2a2a2a',
            stickyHeader: 'rgba(31, 31, 30, 0.9)',
        },
        text: {
            primary: 'rgb(223, 223, 221)',
            secondary: 'rgba(223, 223, 221, 0.6)',
            tertiary: 'rgba(223, 223, 221, 0.4)',
            disabled: 'rgba(223, 223, 221, 0.2)',
        },
        border: {
            default: 'rgba(255, 255, 255, 0.1)',
            hover: 'rgba(255, 255, 255, 0.2)',
            focus: '#3182CE',
            button: 'rgba(255, 255, 255, 0.1)',
            modal: 'none',
        },
        success: '#00ff45de',
        error: '#ef4444',
        warning: '#F6AD55',
        accent: '#60a5fa',
    },
    buttons: {
        button: {
            bg: 'rgba(255, 255, 255, 0.05)',
            color: 'rgb(223, 223, 221)',
            border: 'none',
        },
        primaryButton: {
            bg: 'white',
            color: 'blackAlpha.900',
            border: 'none',
            rounded: 'full',
        },
        tertiaryButton: {
            bg: 'transparent',
            color: 'rgb(223, 223, 221)',
            border: 'none',
        },
        loginButton: {
            bg: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
        },
    },
    effects: {
        backdropFilter: {
            modal: 'blur(3px)',
            overlay: 'blur(3px)',
            stickyHeader: 'blur(12px)',
        },
        glassOpacity: {
            modal: 1,
            overlay: 0.6,
            stickyHeader: 0.9,
        },
    },
    fonts: {
        body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        heading:
            'Satoshi, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        sizes: {
            small: '12px',
            medium: '14px',
            large: '16px',
        },
        weights: {
            normal: 400,
            medium: 500,
            bold: 700,
        },
    },
    borders: {
        radius: {
            small: '8px',
            medium: '12px',
            large: '16px',
            xl: '24px',
            full: '9999px',
            modal: '24px',
        },
    },
    modal: {
        rounded: undefined,
    },
};

/**
 * Get default tokens for a given mode
 */
export const getDefaultTokens = (darkMode: boolean): ThemeTokens => {
    return darkMode ? defaultDarkTokens : defaultLightTokens;
};

/**
 * Deep merge utility for tokens
 * Merges custom tokens into default tokens, only including provided keys
 */
export function mergeTokens(
    defaultTokens: ThemeTokens,
    customTokens: Partial<ThemeTokens>,
): ThemeTokens {
    const merged: ThemeTokens = { ...defaultTokens };

    if (customTokens.colors) {
        merged.colors = {
            ...defaultTokens.colors,
            ...customTokens.colors,
        };

        if (customTokens.colors.background) {
            merged.colors.background = {
                ...defaultTokens.colors.background,
                ...customTokens.colors.background,
            };
        }

        if (customTokens.colors.text) {
            merged.colors.text = {
                ...defaultTokens.colors.text,
                ...customTokens.colors.text,
            };
        }

        if (customTokens.colors.border) {
            merged.colors.border = {
                ...defaultTokens.colors.border,
                ...customTokens.colors.border,
            };
            // Ensure button border defaults to default if not provided
            if (!customTokens.colors.border.button) {
                merged.colors.border.button =
                    defaultTokens.colors.border.button;
            }
        }
    }

    if (customTokens.effects) {
        merged.effects = {
            ...defaultTokens.effects,
            ...customTokens.effects,
        };

        if (customTokens.effects.backdropFilter) {
            merged.effects.backdropFilter = {
                ...defaultTokens.effects.backdropFilter,
                ...customTokens.effects.backdropFilter,
            };
        }

        if (customTokens.effects.glassOpacity) {
            merged.effects.glassOpacity = {
                ...defaultTokens.effects.glassOpacity,
                ...customTokens.effects.glassOpacity,
            };
        }
    }

    if (customTokens.fonts) {
        merged.fonts = {
            ...defaultTokens.fonts,
            ...customTokens.fonts,
        };

        // Ensure body and heading are set (use body as fallback for heading if not provided)
        if (customTokens.fonts.body) {
            merged.fonts.body = customTokens.fonts.body;
        }
        if (customTokens.fonts.heading) {
            merged.fonts.heading = customTokens.fonts.heading;
        }

        if (customTokens.fonts.sizes) {
            merged.fonts.sizes = {
                ...defaultTokens.fonts.sizes,
                ...customTokens.fonts.sizes,
            };
        }

        if (customTokens.fonts.weights) {
            merged.fonts.weights = {
                ...defaultTokens.fonts.weights,
                ...customTokens.fonts.weights,
            };
        }
    }

    if (customTokens.borders) {
        merged.borders = {
            ...defaultTokens.borders,
            ...customTokens.borders,
        };

        if (customTokens.borders.radius) {
            merged.borders.radius = {
                ...defaultTokens.borders.radius,
                ...customTokens.borders.radius,
            };
        }
    }

    if (customTokens.buttons) {
        merged.buttons = {
            ...defaultTokens.buttons,
            ...customTokens.buttons,
        };

        if (customTokens.buttons.button) {
            merged.buttons.button = {
                ...defaultTokens.buttons.button,
                ...customTokens.buttons.button,
            };
        }

        if (customTokens.buttons.primaryButton) {
            merged.buttons.primaryButton = {
                ...defaultTokens.buttons.primaryButton,
                ...customTokens.buttons.primaryButton,
            };
        }

        if (customTokens.buttons.tertiaryButton) {
            merged.buttons.tertiaryButton = {
                ...defaultTokens.buttons.tertiaryButton,
                ...customTokens.buttons.tertiaryButton,
            };
        }

        if (customTokens.buttons.loginButton) {
            merged.buttons.loginButton = {
                ...defaultTokens.buttons.loginButton,
                ...customTokens.buttons.loginButton,
            };
        }
    }

    return merged;
}

/**
 * Convert developer-facing config to internal tokens
 * Derives all colors from modal.backgroundColor and textColor
 */
export function convertThemeConfigToTokens(
    config: VechainKitThemeConfig | undefined,
    darkMode: boolean,
): Partial<ThemeTokens> {
    if (!config) {
        return {};
    }

    const tokens: Partial<ThemeTokens> = {};
    const defaultTokens = getDefaultTokens(darkMode);

    // Derive colors from modal.backgroundColor and textColor
    // Always initialize colors if any color-related config is provided
    const overlayBgColor = config.overlay?.backgroundColor;

    const modalBgColor = config.modal?.backgroundColor;

    if (
        modalBgColor ||
        config.textColor ||
        overlayBgColor ||
        config.buttons ||
        config.modal ||
        config.accent
    ) {
        tokens.colors = {} as ThemeTokens['colors'];

        // Derive background colors from modal.backgroundColor
        if (modalBgColor) {
            tokens.colors.background = deriveBackgroundColors(
                modalBgColor,
                darkMode,
                defaultTokens.colors.background.overlay, // Pass default overlay color
                overlayBgColor, // Use custom overlay backgroundColor if provided
            );
        } else if (overlayBgColor) {
            // If only overlay backgroundColor is provided, use defaults for other backgrounds
            const defaultBg = defaultTokens.colors.background;
            tokens.colors.background = {
                ...defaultBg,
                overlay: overlayBgColor,
            };
        } else {
            // Use defaults if no modal backgroundColor or overlay backgroundColor provided
            tokens.colors.background = defaultTokens.colors.background;
        }

        // Derive text colors from textColor
        if (config.textColor) {
            tokens.colors.text = deriveTextColors(config.textColor, darkMode);
        }

        // Derive border colors from modal.backgroundColor or handle modal border customization
        if (modalBgColor) {
            tokens.colors.border = deriveBorderColors(
                modalBgColor,
                darkMode,
                config.modal?.border,
            );
        } else if (config.modal?.border) {
            // If only modal border is provided, use default borders but override modal border
            tokens.colors.border = {
                ...defaultTokens.colors.border,
                modal: config.modal.border,
            };
        }

        // Keep error/success/warning as defaults
        tokens.colors.error = defaultTokens.colors.error;
        tokens.colors.success = defaultTokens.colors.success;
        tokens.colors.warning = defaultTokens.colors.warning;
        // Accent: dev override wins, otherwise fall back to mode default.
        tokens.colors.accent =
            config.accent ?? defaultTokens.colors.accent;
    }

    // Handle modal border radius (support both borderRadius for backward compatibility and rounded)
    const modalBorderRadius =
        config.modal?.rounded ?? config.modal?.borderRadius;
    if (modalBorderRadius) {
        if (!tokens.borders) {
            tokens.borders = {
                ...defaultTokens.borders,
            };
        }
        // Convert rounded to string if it's a number or Chakra size string
        const borderRadiusValue =
            typeof modalBorderRadius === 'number'
                ? `${modalBorderRadius}px`
                : modalBorderRadius;
        tokens.borders.radius = {
            ...defaultTokens.borders.radius,
            ...tokens.borders.radius,
            modal: borderRadiusValue,
        };
    }

    // Handle modal rounded property
    tokens.modal = {
        rounded: config.modal?.rounded ?? defaultTokens.modal.rounded,
    };

    // Handle glass effect settings
    // Always initialize effects to ensure they're always available
    tokens.effects = {} as ThemeTokens['effects'];

    if (config.effects) {
        const glassEnabled =
            config.effects.glass?.enabled !== undefined
                ? config.effects.glass.enabled
                : true;
        const glassIntensity = config.effects.glass?.intensity || 'medium';

        const glassSettings = getGlassEffectSettings(
            glassIntensity,
            glassEnabled,
        );

        // Apply glass effect to backdrop filters
        // When glass is disabled, use default blur values instead of 'none'
        // Overlay blur can be customized independently via overlay.blur (new) or effects.backdropFilter.overlay (deprecated)
        const overlayBlur =
            config.overlay?.blur || config.effects.backdropFilter?.overlay;

        // Modal backdropFilter priority: modal.backdropFilter > effects.backdropFilter.modal > glass settings > default
        const modalBackdropFilter =
            config.modal?.backdropFilter ||
            config.effects.backdropFilter?.modal ||
            (glassEnabled
                ? glassSettings.blur
                : defaultTokens.effects.backdropFilter.modal);

        tokens.effects.backdropFilter = {
            modal: modalBackdropFilter,
            overlay:
                overlayBlur ||
                (glassEnabled
                    ? glassSettings.blur
                    : defaultTokens.effects.backdropFilter.overlay),
            stickyHeader: glassEnabled
                ? glassSettings.blur
                : defaultTokens.effects.backdropFilter.stickyHeader,
        };

        // Apply glass opacity to backgrounds if enabled
        // Note: overlay color is NOT affected by glass opacity - it uses overlay.backgroundColor directly
        tokens.effects.glassOpacity = {
            modal: glassSettings.modalOpacity,
            overlay: glassSettings.overlayOpacity,
            stickyHeader: glassSettings.stickyHeaderOpacity,
        };

        // Update background colors with glass opacity if glass is enabled
        if (glassEnabled) {
            // Ensure colors.background is initialized
            if (!tokens.colors) {
                tokens.colors = {} as ThemeTokens['colors'];
            }
            if (!tokens.colors.background) {
                tokens.colors.background = {
                    ...defaultTokens.colors.background,
                };
            }

            if (modalBgColor) {
                // Use custom modal.backgroundColor with glass opacity
                tokens.colors.background.modal = applyOpacity(
                    modalBgColor,
                    glassSettings.modalOpacity,
                );
                tokens.colors.background.stickyHeader = applyOpacity(
                    modalBgColor,
                    glassSettings.stickyHeaderOpacity,
                );
            } else {
                // Apply glass opacity to default background colors
                const defaultModalBg = defaultTokens.colors.background.modal;
                const defaultStickyHeaderBg =
                    defaultTokens.colors.background.stickyHeader;

                // Extract base color from default backgrounds and apply glass opacity
                // For rgba colors, we need to extract the RGB values and apply new opacity
                tokens.colors.background.modal = applyOpacity(
                    defaultModalBg,
                    glassSettings.modalOpacity,
                );
                tokens.colors.background.stickyHeader = applyOpacity(
                    defaultStickyHeaderBg,
                    glassSettings.stickyHeaderOpacity,
                );
            }
            // Overlay color is already set correctly from overlay.backgroundColor or default
            // Don't modify it here
        }
    } else {
        // If no effects config provided, use default backdrop filters
        // But still check for overlay.blur and modal.backdropFilter
        const overlayBlur = config.overlay?.blur;
        tokens.effects.backdropFilter = {
            ...defaultTokens.effects.backdropFilter,
            modal:
                config.modal?.backdropFilter ||
                defaultTokens.effects.backdropFilter.modal,
            overlay:
                overlayBlur || defaultTokens.effects.backdropFilter.overlay,
        };
        tokens.effects.glassOpacity = defaultTokens.effects.glassOpacity;
    }

    // Ensure overlay backgroundColor is always respected (after all processing)
    if (overlayBgColor && tokens.colors?.background) {
        tokens.colors.background.overlay = overlayBgColor;
    }

    // Handle font customization
    if (config.fonts) {
        tokens.fonts = {} as ThemeTokens['fonts'];
        const defaultFonts = defaultTokens.fonts;

        // Font families - support backward compatibility with `family` prop
        // If `family` is provided, use it for both body and heading
        // Otherwise, use separate `body` and `heading` props
        if (config.fonts.family) {
            // Backward compatibility: use `family` for both
            tokens.fonts.body = config.fonts.family;
            tokens.fonts.heading = config.fonts.family;
        } else {
            tokens.fonts.body = config.fonts.body ?? defaultFonts.body;
            tokens.fonts.heading = config.fonts.heading ?? defaultFonts.heading;
        }

        // Font sizes
        tokens.fonts.sizes = {
            small: config.fonts.sizes?.small ?? defaultFonts.sizes.small,
            medium: config.fonts.sizes?.medium ?? defaultFonts.sizes.medium,
            large: config.fonts.sizes?.large ?? defaultFonts.sizes.large,
        };

        // Font weights
        tokens.fonts.weights = {
            normal: config.fonts.weights?.normal ?? defaultFonts.weights.normal,
            medium: config.fonts.weights?.medium ?? defaultFonts.weights.medium,
            bold: config.fonts.weights?.bold ?? defaultFonts.weights.bold,
        };
    }

    // Derive button styles
    tokens.buttons = {} as ThemeTokens['buttons'];
    tokens.buttons.button = deriveSecondaryButtonStyles(
        modalBgColor,
        config.textColor,
        darkMode,
        config.buttons?.secondaryButton,
        defaultTokens,
    );
    tokens.buttons.primaryButton = derivePrimaryButtonStyles(
        modalBgColor,
        config.textColor,
        darkMode,
        config.buttons?.primaryButton,
        defaultTokens,
    );
    tokens.buttons.tertiaryButton = deriveTertiaryButtonStyles(
        modalBgColor,
        config.textColor,
        darkMode,
        config.buttons?.tertiaryButton,
        defaultTokens,
    );
    tokens.buttons.loginButton = deriveLoginButtonStyles(
        modalBgColor,
        config.textColor,
        darkMode,
        config.buttons?.loginButton,
        defaultTokens,
    );

    return tokens;
}
````

## Source: `packages/vechain-kit/src/types/ensTextRecords.ts`

````typescript
export const ENS_TEXT_RECORDS = [
    'display',
    'avatar',
    'description',
    'keywords',
    'email',
    'url',
    'header',
    'notice',
    'location',
    'phone',
    'com.x',
] as const;

export type TextRecords = {
    [K in (typeof ENS_TEXT_RECORDS)[number]]?: string;
};
````

## Source: `packages/vechain-kit/src/types/gasEstimation.ts`

````typescript
export interface VthoPerGasAtSpeed {
    regular: number;
    medium: number;
    high: number;
    legacy: number;
}

export interface EstimatedGas {
    vtho: number;
    vet: number;
    b3tr: number;
    smartAccount: number;
}

export interface Rate {
    vtho: number;
    vet: number;
    b3tr: number;
}

export interface CostLevel {
    vtho: number;
    vet: number;
    b3tr: number;
    vetWithSmartAccount: number;
    b3trWithSmartAccount: number;
}

export interface TransactionCost {
    regular: CostLevel;
    medium: CostLevel;
    high: CostLevel;
    legacy: CostLevel;
}

export interface EstimationResponse {
    vthoPerGasAtSpeed?: number;
    estimatedGas?: number;
    rate?: number;
    transactionCost?: number;
    serviceFee?: number;
    totalGasUsed?: number;
}

export interface DepositAccount {
    depositAccount: string;
}

export function calculateTotalCost(
    baseCost: number,
    serviceFeeRate: number,
): number {
    return baseCost * (1 + serviceFeeRate);
}

export function formatGasCost(amount: number, decimals: number = 4): string {
    return Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}
````

## Source: `packages/vechain-kit/src/types/gasToken.ts`

````typescript
export type GasTokenType = 'B3TR' | 'VET' | 'VTHO';

export type TransactionSpeed = 'regular' | 'medium' | 'high';

export interface GasTokenInfo {
    type: GasTokenType;
    name: string;
    symbol: string;
    address?: string;
    description: string;
}

export interface GasTokenPreferences {
    tokenPriority: GasTokenType[];
    availableGasTokens: GasTokenType[];
    excludedTokens: GasTokenType[];
    alwaysConfirm: boolean;
    gasTokenToUse: GasTokenType;
}

export interface GasTokenEstimate {
    token: GasTokenType;
    cost: string;
    available: boolean;
    balance?: string;
}

export interface GasTokenSelection {
    selectedToken: GasTokenType;
    cost: string;
    hasServiceFee: boolean;
}
````

## Source: `packages/vechain-kit/src/types/i18next.d.ts`

````typescript
import en from '../languages/en.json';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof en;
        };
    }
}
````

## Source: `packages/vechain-kit/src/types/index.ts`

````typescript
export * from './types';
export * from './ensTextRecords';
export * from './gasToken';
export * from './gasEstimation';

import { LegalDocument } from '@/providers';

export enum LegalDocumentType {
    TERMS = 'terms',
    PRIVACY = 'privacy',
    COOKIES = 'cookies',
}

export enum LegalDocumentSource {
    VECHAIN_KIT = 'vechain-kit',
    APPLICATION = 'application',
}

// Base type for all legal documents (terms, privacy policy, cookies)
export type EnrichedLegalDocument = LegalDocument & {
    id: string;
    documentType: LegalDocumentType;
    documentSource: LegalDocumentSource;
};

// Agreement record stored in localStorage
export type LegalDocumentAgreement = EnrichedLegalDocument & {
    walletAddress: string;
    timestamp: number;
};
````

## Source: `packages/vechain-kit/src/types/swap.ts`

````typescript
import { TransactionClause } from '@vechain/sdk-core';
import { ThorClient } from '@vechain/sdk-network';
import React from 'react';

/**
 * Swap quote from an aggregator
 */
export interface SwapQuote {
    /**
     * The aggregator name (e.g., "BetterSwap", "VeTrade")
     */
    aggregatorName: string;
    /**
     * Reference to the aggregator that generated this quote
     */
    aggregator: SwapAggregator;
    /**
     * Amount of output token to receive
     */
    outputAmount: bigint;
    /**
     * Estimated price impact percentage
     */
    priceImpact?: number;
    /**
     * Minimum amount of output token (considering slippage)
     */
    minimumOutputAmount?: bigint;
    /**
     * Additional data needed for transaction building
     */
    data?: unknown;
    /**
     * Whether the transaction simulation reverted
     */
    reverted?: boolean;
    /**
     * Revert reason if simulation failed
     */
    revertReason?: string;
    /**
     * Estimated gas cost in VTHO (from simulation)
     */
    gasCostVTHO?: number;
}

/**
 * Swap simulation result
 */
export interface SwapSimulation {
    /**
     * Estimated gas cost in VTHO
     */
    gasCostVTHO: number;
    /**
     * Whether the simulation was successful
     */
    success: boolean;
    /**
     * Error message if simulation failed
     */
    error?: string;
}

/**
 * Swap parameters
 */
export interface SwapParams {
    /**
     * Address of the token to swap from
     */
    fromTokenAddress: string;
    /**
     * Address of the token to swap to
     */
    toTokenAddress: string;
    /**
     * Amount of input token (in raw format, e.g., Wei)
     */
    amountIn: string;
    /**
     * Address of the user making the swap
     */
    userAddress: string;
    /**
     * Slippage tolerance percentage (default: 1)
     */
    slippageTolerance?: number;
}

/**
 * Aggregator module interface
 * Each aggregator must implement these functions
 */
export interface SwapAggregator {
    /**
     * Get a swap quote
     * @param params Swap parameters
     * @param thor Thor client instance for contract calls
     * @returns Promise resolving to a swap quote
     */
    getQuote(params: SwapParams, thor: ThorClient): Promise<SwapQuote>;

    /**
     * Simulate the swap transaction to estimate gas
     * @param params Swap parameters
     * @param quote The quote from getQuote
     * @param thor Thor client instance for transaction simulation
     * @returns Promise resolving to simulation result
     */
    simulateSwap(params: SwapParams, quote: SwapQuote, thor: ThorClient): Promise<SwapSimulation>;

    /**
     * Build transaction clauses for the swap
     * @param params Swap parameters
     * @param quote The quote from getQuote
     * @returns Promise resolving to transaction clauses
     */
    buildSwapTransaction(params: SwapParams, quote: SwapQuote): Promise<TransactionClause[]>;

    /**
     * Display name of the aggregator
     */
    name: string;

    /**
     * Icon component for the aggregator
     * @param boxSize Size of the icon (e.g., "20px", "24px")
     * @returns React element representing the aggregator icon
     */
    getIcon: (boxSize?: string) => React.ReactElement;
}
````

## Source: `packages/vechain-kit/src/types/types.ts`

````typescript
import { LoginMethodOrderOption } from '@privy-io/react-auth';
import { TransactionClause } from '@vechain/sdk-core';

export type TokenBalance = {
    original: string;
    scaled: string;
    formatted: string;
};

export type ENSRecords = {
    display?: string;
    description?: string;
    email?: string;
    url?: string;
    header?: string;
    notice?: string;
    location?: string;
    phone?: string;
    [key: string]: string | undefined;
};

export type Wallet = {
    address: string;
    domain?: string;
    image?: string;
    isLoadingMetadata?: boolean;
    metadata?: ENSRecords;
} | null;

export type SmartAccount = Wallet & {
    isDeployed: boolean;
    isActive: boolean;
    version: number | null;
};

export type ConnectionSource = {
    type: 'privy' | 'wallet' | 'privy-cross-app';
    displayName: string;
};

/**
 * Data that the Privy user must sign in order to execute a transaction
 * by authorizing the Smart Account contract
 */
export type ExecuteWithAuthorizationSignData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        ExecuteWithAuthorization: {
            name: string;
            type: string;
        }[];
        EIP712Domain: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    message: {
        validAfter: number;
        validBefore: number;
        to: string | null | undefined;
        value: string;
        data: string;
    };
};

export type ExecuteBatchWithAuthorizationSignData = {
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    };
    types: {
        ExecuteBatchWithAuthorization: {
            name: string;
            type: string;
        }[];
        EIP712Domain: {
            name: string;
            type: string;
        }[];
    };
    primaryType: string;
    message: {
        to: string[] | null | undefined;
        value: string[] | null | undefined;
        data: string[] | null | undefined;
        validAfter: number;
        validBefore: number;
        nonce: string;
    };
};

/**
 * ready: the user has not clicked on the button yet
 * pending: the user has clicked on the button and we're waiting for the transaction to be sent
 * waitingConfirmation: the transaction has been sent and we're waiting for the transaction to be confirmed by the chain
 * success: the transaction has been confirmed by the chain
 * error: the transaction has failed
 * unknown: the transaction receipt has failed to load
 */
export type TransactionStatus =
    | 'ready'
    | 'pending'
    | 'waitingConfirmation'
    | 'success'
    | 'error'
    | 'unknown';

export type TransactionStatusErrorType = {
    type:
        | 'SendTransactionError'
        | 'TxReceiptError'
        | 'RevertReasonError'
        | 'UserRejectedError';
    reason?: string;
};

/**
 * An enhanced clause with a comment and an abi
 * @param comment a comment to add to the clause
 * @param abi the abi of the contract to call
 */
export type EnhancedClause = TransactionClause;

export type PrivyAppInfo = {
    id: string;
    name: string;
    logo_url: string;
    icon_url: string | null;
    terms_and_conditions_url: string;
    privacy_policy_url: string;
    theme: string;
    accent_color: string;
    wallet_auth: boolean;
    email_auth: boolean;
    google_oauth: boolean;
    twitter_oauth: boolean;
    url: string;
    website?: string;
};

export type PrivyLoginMethod = LoginMethodOrderOption;

export interface CrossAppConnectionCache {
    timestamp: number;
    ecosystemApp: {
        name: string;
        logoUrl?: string;
        appId: string;
        website?: string;
    };
}

export enum NFTMediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    UNKNOWN = 'unknown',
    TEXT = 'text', // mp4 appears as text sometimes
}

export enum VePassportUserStatus {
    NONE = 'NONE',
    WHITELIST = 'WHITELIST',
    BLACKLIST = 'BLACKLIST',
}

export type CURRENCY = 'usd' | 'gbp' | 'eur';

export const CURRENCY_SYMBOLS: Record<CURRENCY, string> = {
    usd: '$',
    gbp: '£',
    eur: '€',
};
````

## Source: `packages/vechain-kit/src/types/veworld.d.ts`

````typescript
/**
 * Type definitions for VeWorld in-app browser API
 * Extends the existing window.vechain type from dapp-kit
 */
declare global {
    interface Window {
        vechain?: {
            isInAppBrowser?: boolean;
            request?: (method: 'thor_switchWallet' | 'thor_disconnect' | 'thor_wallet' | 'thor_methods') => Promise<string | null | string[]>;
            [key: string]: any; // Allow other properties from dapp-kit
        };
    }
}

export {};
````

## Source: `packages/vechain-kit/src/utils/index.ts`

````typescript
export * from './constants';
export * from './formattingUtils';
export * from './randomTxForwarder';
export * from './addressUtils';
export * from './ipfs';
export * from './media';
export * from './uri';
export * from './gmNfts';
export * from './buildQueryString';
export * from './xNode';
export * from './time';
export * from './stringUtils';
export * from './hexUtils';
export * from './url';
export * from './thorUtils';
export * from './ssrUtils';
````

## Source: `packages/vechain-kit/src/utils/swap/index.ts`

````typescript
export { createBetterSwapAggregator } from './betterSwap';
export { createVeTradeAggregator } from './veTrade';
````
