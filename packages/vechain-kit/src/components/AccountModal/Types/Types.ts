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
    | 'smart-account'
    | 'accounts'
    | 'receive-token'
    | 'swap-token'
    | 'connection-details'
    | 'choose-name'
    | 'privy-linked-accounts'
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
      };
