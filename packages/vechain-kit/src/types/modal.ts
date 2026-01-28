/**
 * Shared modal-related types used by providers and hooks.
 * These types are defined here to avoid circular dependencies between
 * providers, hooks, and components modules.
 *
 * Note: AccountModalContentTypes and SwitchFeedback are defined in
 * components/AccountModal/Types/Types.ts with full type safety.
 * This file contains only types that need to be shared without
 * component dependencies.
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
