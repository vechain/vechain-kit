import { GridItem } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { VeLoginMethod } from '@/types/mixPanel';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const LoginWithGoogleButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={() => {
                    Analytics.auth.flowStarted(VeLoginMethod.GOOGLE);
                    Analytics.auth.methodSelected(VeLoginMethod.GOOGLE);
                    initOAuth({
                        provider: 'google',
                    });
                }}
                icon={FcGoogle}
                text={t('Continue with Google')}
            />
        </GridItem>
    );
};
