import {
    AccountCustomizationContentProps,
    ChooseNameContentProps,
    ChooseNameSearchContentProps,
    ChooseNameSummaryContentProps,
    CustomizationSummaryContentProps,
    UpgradeSmartAccountContentProps,
} from '../Contents';
import { DisconnectConfirmContentProps } from '../Contents/DisconnectConfirmation/DisconnectConfirmContent';
import { RemoveWalletConfirmContentProps } from '../Contents/SelectWallet/RemoveWalletConfirmContent';
import { AppOverviewContentProps } from '../Contents/Ecosystem/AppOverviewContent';
import { CategoryFilter } from '../Contents/Ecosystem/Components/CategoryFilterSection';
import { FAQContentProps } from '../Contents/FAQ/FAQContent';
import { SendTokenContentProps } from '../Contents/SendToken/SendTokenContent';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';
import { SuccessfulOperationContentProps } from '../Contents/SuccessfulOperation/SuccessfulOperationContent';
import { FailedOperationContentProps } from '../Contents/FailedOperation/FailedOperationContent';
import { TermsAndPrivacyContentProps } from '../Contents/TermsAndPrivacy/TermsAndPrivacyContent';

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'profile'
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
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              onClose: () => void;
              returnTo?: 'main' | 'profile';
              onLogoutSuccess?: () => void;
          };
      }
    | {
          type: 'swap-token';
          props: {
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              fromTokenAddress?: string;
              toTokenAddress?: string;
          };
      }
    | {
          type: 'account-customization';
          props: AccountCustomizationContentProps;
      }
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      }
    | {
          type: 'failed-operation';
          props: FailedOperationContentProps;
      }
    | {
          type: 'account-customization-summary';
          props: CustomizationSummaryContentProps;
      }
    | {
          type: 'app-overview';
          props: AppOverviewContentProps;
      }
    | {
          type: 'ecosystem-with-category';
          props: {
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
              selectedCategory: CategoryFilter;
          };
      }
    | { type: 'send-token'; props: SendTokenContentProps }
    | {
          type: 'send-token-summary';
          props: SendTokenSummaryContentProps;
      }
    | { type: 'choose-name'; props: ChooseNameContentProps }
    | {
          type: 'choose-name-search';
          props: ChooseNameSearchContentProps;
      }
    | {
          type: 'choose-name-summary';
          props: ChooseNameSummaryContentProps;
      }
    | {
          type: 'disconnect-confirm';
          props: DisconnectConfirmContentProps;
      }
    | {
          type: 'remove-wallet-confirm';
          props: RemoveWalletConfirmContentProps;
      }
    | {
          type: 'upgrade-smart-account';
          props: UpgradeSmartAccountContentProps;
      }
    | {
          type: 'faq';
          props: FAQContentProps;
      }
    | {
          type: 'terms-and-privacy';
          props: TermsAndPrivacyContentProps;
      };
