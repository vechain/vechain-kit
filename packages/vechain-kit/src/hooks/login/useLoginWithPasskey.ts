import { useLoginWithPasskey as usePrivyLoginWithPasskey } from '@privy-io/react-auth';

export const useLoginWithPasskey = () => {
    const { loginWithPasskey: privyLoginWithPasskey } =
        usePrivyLoginWithPasskey();

    const loginWithPasskey = async () => {
        try {
            await privyLoginWithPasskey();
        } catch (error) {
            console.error('Passkey login failed:', error);
            throw error;
        }
    };

    return { loginWithPasskey };
};
