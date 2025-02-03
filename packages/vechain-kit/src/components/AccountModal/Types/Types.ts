import {
    ChooseNameSearchContentProps,
    ChooseNameSummaryContentProps,
} from '../Contents';
import { SendTokenContentProps } from '../Contents/SendToken/SendTokenContent';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';

export type AccountModalContentTypes =
    | 'main'
    | 'faq'
    | 'settings'
    | 'embedded-wallet'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'choose-name'
    | 'ecosystem'
    | 'notifications'
    | 'privy-linked-accounts'
    | 'account-customization'
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
