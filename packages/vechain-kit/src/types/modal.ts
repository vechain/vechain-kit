/**
 * Shared modal-related types used by providers and hooks.
 * These types are defined here to avoid circular dependencies between
 * providers, hooks, and components modules.
 *
 * IMPORTANT: This file should NOT import from components to prevent cycles.
 * Prop types for components remain in their respective component files.
 */

import type { ThemeTypings } from '@chakra-ui/react';
import type { PrivyAppInfo } from './types';

/**
 * Allowed categories for App Hub apps displayed in the Ecosystem modal.
 */
export type AllowedCategories =
    | 'defi'
    | 'games'
    | 'collectibles'
    | 'marketplaces'
    | 'utilities'
    | 'vebetter';

/**
 * Category filter type for ecosystem content
 */
export type CategoryFilter = string | null;

/**
 * All possible content types for the ConnectModal
 */
export type ConnectModalContentsTypes =
    | 'main'
    | 'faq'
    | {
          type: 'ecosystem';
          props: {
              appsInfo: PrivyAppInfo[];
              isLoading: boolean;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'loading';
          props: {
              title?: string;
              loadingText?: string;
              onTryAgain?: () => void;
              showBackButton?: boolean;
          };
      }
    | {
          type: 'error';
          props: {
              error: string;
              onTryAgain: () => void;
          };
      };

/**
 * Style options for UpgradeSmartAccountModal
 */
export type UpgradeSmartAccountModalStyle = {
    accentColor?: string;
    modalSize?: ThemeTypings['components']['Modal']['sizes'];
};

/**
 * Content types for UpgradeSmartAccountModal
 */
export type UpgradeSmartAccountModalContentsTypes =
    | 'upgrade-smart-account'
    | {
          type: 'successful-operation';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props: any;
      };

/**
 * Feedback type for switch operations
 */
export type SwitchFeedback = {
    showFeedback: boolean;
};

/**
 * Generic dispatcher type for setCurrentContent
 * Using this avoids circular dependency with AccountModalContentTypes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SetContentDispatcher = React.Dispatch<React.SetStateAction<any>>;

/**
 * All possible content types for the AccountModal.
 *
 * This type is defined here (instead of in components/AccountModal/Types/Types.ts)
 * to avoid circular dependencies. The prop types for complex content types
 * use inline definitions rather than importing from component files.
 */
export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'profile'
    | {
          type: 'main';
          props?: {
              switchFeedback?: SwitchFeedback;
          };
      }
    | {
          type: 'profile';
          props?: {
              switchFeedback?: SwitchFeedback;
          };
      }
    | 'manage-mfa'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'ecosystem'
    | 'notifications'
    | 'privy-linked-accounts'
    | 'add-custom-token'
    | 'assets'
    | 'change-currency'
    | 'change-language'
    | 'gas-token-settings'
    | {
          type: 'select-wallet';
          props: {
              setCurrentContent: SetContentDispatcher;
              onClose: () => void;
              returnTo?: 'main' | 'profile';
              onLogoutSuccess?: () => void;
          };
      }
    | {
          type: 'swap-token';
          props: {
              setCurrentContent: SetContentDispatcher;
              fromTokenAddress?: string;
              toTokenAddress?: string;
          };
      }
    | {
          type: 'account-customization';
          props: {
              setCurrentContent: SetContentDispatcher;
              initialContentSource?: AccountModalContentTypes;
          };
      }
    | {
          type: 'successful-operation';
          props: {
              setCurrentContent: SetContentDispatcher;
              txId?: string;
              title: string;
              description?: string;
              onDone: () => void;
              showSocialButtons?: boolean;
          };
      }
    | {
          type: 'failed-operation';
          props: {
              setCurrentContent: SetContentDispatcher;
              txId?: string;
              title: string;
              description?: string;
              onDone: () => void;
          };
      }
    | {
          type: 'account-customization-summary';
          props: {
              setCurrentContent: SetContentDispatcher;
              changes: {
                  avatarIpfsHash?: string | null;
                  displayName?: string;
                  description?: string;
                  twitter?: string;
                  website?: string;
                  email?: string;
              };
              onDoneRedirectContent: AccountModalContentTypes;
          };
      }
    | {
          type: 'app-overview';
          props: {
              setCurrentContent: SetContentDispatcher;
              name: string;
              image: string;
              url: string;
              description: string;
              category?: AllowedCategories;
              selectedCategory?: CategoryFilter;
              logoComponent?: JSX.Element;
          };
      }
    | {
          type: 'ecosystem-with-category';
          props: {
              setCurrentContent: SetContentDispatcher;
              selectedCategory: CategoryFilter;
          };
      }
    | {
          type: 'send-token';
          props: {
              setCurrentContent: SetContentDispatcher;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              preselectedToken?: any;
              initialAmount?: string;
              initialToAddressOrDomain?: string;
              onBack?: () => void;
          };
      }
    | {
          type: 'send-token-summary';
          props: {
              setCurrentContent: SetContentDispatcher;
              toAddressOrDomain: string;
              resolvedDomain?: string;
              resolvedAddress?: string;
              amount: string;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              selectedToken: any;
              formattedTotalAmount: string;
          };
      }
    | {
          type: 'choose-name';
          props: {
              setCurrentContent: SetContentDispatcher;
              onBack?: () => void;
              initialContentSource?: AccountModalContentTypes;
          };
      }
    | {
          type: 'choose-name-search';
          props: {
              name: string;
              setCurrentContent: SetContentDispatcher;
              initialContentSource?: AccountModalContentTypes;
          };
      }
    | {
          type: 'choose-name-summary';
          props: {
              setCurrentContent: SetContentDispatcher;
              fullDomain: string;
              domainType?: string;
              isOwnDomain: boolean;
              isUnsetting?: boolean;
              initialContentSource?: AccountModalContentTypes;
          };
      }
    | {
          type: 'disconnect-confirm';
          props: {
              onDisconnect: () => void;
              onBack: () => void;
              onClose?: () => void;
              text?: string;
              showCloseButton?: boolean;
          };
      }
    | {
          type: 'remove-wallet-confirm';
          props: {
              walletAddress: string;
              walletDomain: string | null;
              onConfirm: () => void;
              onBack: () => void;
              onClose?: () => void;
          };
      }
    | {
          type: 'upgrade-smart-account';
          props: {
              setCurrentContent: SetContentDispatcher;
              handleClose?: () => void;
              initialContent?: AccountModalContentTypes;
          };
      }
    | {
          type: 'faq';
          props: {
              onGoBack: () => void;
              showLanguageSelector?: boolean;
          };
      }
    | {
          type: 'terms-and-privacy';
          props: {
              onGoBack: () => void;
          };
      };
