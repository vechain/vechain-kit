export type AccountModalContentTypes =
    | 'main'
    | 'settings'
    | 'smart-account'
    | 'accounts'
    | 'send-token'
    | 'receive-token'
    | 'swap-token'
    | {
          type: 'send-token-summary';
          props: {
              toAddressOrDomain: string;
              resolvedDomain?: string;
              resolvedAddress?: string;
              amount: string;
              selectedToken: {
                  symbol: string;
                  balance: string;
                  address: string;
                  numericBalance: number;
                  price: number;
              };
              onSend: (address: string, amount: string) => void;
              setCurrentContent: React.Dispatch<
                  React.SetStateAction<AccountModalContentTypes>
              >;
          };
      };
