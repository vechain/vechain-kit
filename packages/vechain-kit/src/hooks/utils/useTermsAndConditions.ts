import { compareAddresses } from '@/utils';
import { useLocalStorage } from '../cache/useLocalStorage';
import { useMemo } from 'react';
import { useWallet } from '../api/wallet';
import { useVeChainKitConfig } from '@/providers/VeChainKitProvider';

export type TermsAndConditions = {
    walletAddress: string;
    url: string;
    timestamp: number;
};
export const useTermsAndConditions = () => {
    const { account } = useWallet();
    const { termsAndConditionsUrl } = useVeChainKitConfig();

    const [termsAndConditions, setTermsAndConditions] = useLocalStorage<
        TermsAndConditions[]
    >('vechain-kit-terms-and-conditions', []);
    const termsUrl =
        termsAndConditionsUrl ?? 'https://vechain.org/terms-of-use/';

    const hasAgreedToTerms = useMemo(
        () =>
            termsAndConditions.some(
                (term) =>
                    compareAddresses(term.walletAddress, account?.address) &&
                    term.url === termsUrl,
            ),
        [account?.address, termsAndConditions, termsUrl],
    );

    const agreeToTerms = () => {
        if (hasAgreedToTerms) return; // Already agreed so we don't need to update

        // Update terms in localStorage
        const newTerms = [
            ...termsAndConditions,
            {
                walletAddress: account?.address ?? '',
                url: termsUrl,
                timestamp: new Date().getTime(),
            },
        ];

        return setTermsAndConditions(newTerms);
    };

    return {
        termsAndConditions,
        agreeToTerms,
        hasAgreedToTerms,
        termsUrl,
    };
};
