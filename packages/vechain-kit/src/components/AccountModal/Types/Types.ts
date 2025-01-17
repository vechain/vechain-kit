import { ChooseNameSearchContentProps } from '../Contents';
import { SendTokenSummaryContentProps } from '../Contents/SendToken/SendTokenSummaryContent';

export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'smart-account'
    | 'accounts'
    | 'send-token'
    | 'receive-token'
    | 'swap-token'
    | 'choose-name'
    | {
          type: 'send-token-summary';
          props: SendTokenSummaryContentProps;
      }
    | {
          type: 'choose-name-search';
          props: ChooseNameSearchContentProps;
      };
