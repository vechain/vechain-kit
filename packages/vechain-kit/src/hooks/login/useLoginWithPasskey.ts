import { useLoginWithPasskey as usePrivyLoginWithPasskey } from '@privy-io/react-auth';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';
import { usePrivy } from '@privy-io/react-auth';

export const useLoginWithPasskey = () => {
    const { loginWithPasskey: privyLoginWithPasskey } =
        usePrivyLoginWithPasskey();
    const { user } = usePrivy();

    const loginWithPasskey = async () => {
        try {
            Analytics.auth.methodSelected(VeLoginMethod.PASSKEY);
            await privyLoginWithPasskey();
            Analytics.auth.completed({
                userId: user?.id,
                loginMethod: VeLoginMethod.PASSKEY,
            });
        } catch (error) {
            Analytics.auth.failed(
                VeLoginMethod.PASSKEY,
                error instanceof Error ? error.message : 'Unknown error',
            );
            throw error;
        }
    };

    return { loginWithPasskey };
};
