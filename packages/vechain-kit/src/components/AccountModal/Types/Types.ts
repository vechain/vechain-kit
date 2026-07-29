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
import { SendNftContentProps } from '../Contents/SendNft/SendNftContent';
import { SendNftSummaryContentProps } from '../Contents/SendNft/SendNftSummaryContent';
import { ReceiveTokenContentProps } from '../Contents/Receive/ReceiveTokenContent';
import { TokenDetailContentProps } from '../Contents/TokenDetail/TokenDetailContent';
import { NftDetailContentProps } from '../Contents/NftDetail/NftDetailContent';
import { NftCollectionContentProps } from '../Contents/NftCollection/NftCollectionContent';
import { TransactionHistoryContentProps } from '../Contents/TransactionHistory/TransactionHistoryContent';
import { TransactionDetailContentProps } from '../Contents/TransactionHistory/TransactionDetailContent';
import { SuccessfulOperationContentProps } from '../Contents/SuccessfulOperation/SuccessfulOperationContent';
import { FailedOperationContentProps } from '../Contents/FailedOperation/FailedOperationContent';
import { TermsAndPrivacyContentProps } from '../Contents/TermsAndPrivacy/TermsAndPrivacyContent';
import { FiatOnrampContentProps } from '../Contents/FiatOnramp/FiatOnrampContent';

export type SwitchFeedback = {
    showFeedback: boolean;
};

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
    | 'account-customization'
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
              onBack?: () => void;
          };
      }
    | {
          type: 'receive-token';
          props: ReceiveTokenContentProps;
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
    | { type: 'send-nft'; props: SendNftContentProps }
    | {
          type: 'send-nft-summary';
          props: SendNftSummaryContentProps;
      }
    | { type: 'token-detail'; props: TokenDetailContentProps }
    | { type: 'nft-detail'; props: NftDetailContentProps }
    | { type: 'nft-collection'; props: NftCollectionContentProps }
    | {
          type: 'transaction-history';
          props: TransactionHistoryContentProps;
      }
    | {
          type: 'transaction-detail';
          props: TransactionDetailContentProps;
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
      }
    | {
          type: 'fiat-onramp';
          props: FiatOnrampContentProps;
      };
