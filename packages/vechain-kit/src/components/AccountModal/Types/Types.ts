import {
    AccountCustomizationContentProps,
    ChooseNameContentProps,
    ChooseNameSearchContentProps,
    ChooseNameSummaryContentProps,
    CustomizationSummaryContentProps,
    UpgradeSmartAccountContentProps,
} from '../Contents';
import { DisconnectConfirmContentProps } from '../Contents/Account/DisconnectConfirmContent';
import { AppOverviewContentProps } from '../Contents/Ecosystem/AppOverviewContent';
import { FAQContentProps } from '../Contents/FAQ/FAQContent';
import { SendTokenContentProps } from '../Contents/SendToken/SendTokenContent';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';
import { SuccessfulOperationContentProps } from '../Contents/SuccessfulOperation/SuccessfulOperationContent';

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'profile'
    | 'access-and-security'
    | 'embedded-wallet'
    | 'manage-mfa'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'ecosystem'
    | 'notifications'
    | 'privy-linked-accounts'
    | 'add-custom-token'
    | 'assets'
    | 'bridge'
    | 'change-currency'
    | 'general-settings'
    | 'change-language'
    | 'appearance-settings'
    | {
          type: 'account-customization';
          props: AccountCustomizationContentProps;
      }
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      }
    | {
          type: 'account-customization-summary';
          props: CustomizationSummaryContentProps;
      }
    | {
          type: 'app-overview';
          props: AppOverviewContentProps;
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
          type: 'upgrade-smart-account';
          props: UpgradeSmartAccountContentProps;
      }
    | {
          type: 'faq';
          props: FAQContentProps;
      };
