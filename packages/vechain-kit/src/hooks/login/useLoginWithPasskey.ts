import { useLoginWithPasskey as usePrivyLoginWithPasskey } from '@privy-io/react-auth';

export const useLoginWithPasskey = () => {
    const { loginWithPasskey: privyLoginWithPasskey } =
        usePrivyLoginWithPasskey();

    const loginWithPasskey = async () => {
        try {
            await privyLoginWithPasskey();
        } catch (error) {
            throw error;
        }
    };

    return { loginWithPasskey };
};
