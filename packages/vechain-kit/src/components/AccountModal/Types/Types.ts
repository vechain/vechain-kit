import {
    ChooseNameSearchContentProps,
    ChooseNameSummaryContentProps,
} from '../Contents';
import { SendTokenContentProps } from '../Contents/SendToken/SendTokenContent';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';
import { SuccessfulOperationContentProps } from '../Contents/SuccessfulOperation/SuccessfulOperationContent';

export type AccountModalContentTypes =
    | 'main'
    | 'faq'
    | 'settings'
    | 'profile'
    | 'access-and-security'
    | 'embedded-wallet'
    | 'manage-mfa'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'choose-name'
    | 'ecosystem'
    | 'notifications'
    | 'privy-linked-accounts'
    | 'account-customization'
    | 'add-custom-token'
    | {
          type: 'successful-operation';
          props: SuccessfulOperationContentProps;
      }
    | {
          type: 'account-customization-summary';
          props: {
              changes: {
                  avatarIpfsHash?: string | null;
                  displayName?: string;
                  description?: string;
                  twitter?: string;
                  website?: string;
                  email?: string;
              };
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
          };
      }
    | {
          type: 'app-overview';
          props: {
              name: string;
              image: string;
              url: string;
              description?: string;
          };
      }
    | { type: 'send-token'; props: SendTokenContentProps }
    | {
          type: 'send-token-summary';
          props: SendTokenSummaryContentProps;
      }
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
          props: {
              onDisconnect: () => void;
              onBack: () => void;
          };
      };
