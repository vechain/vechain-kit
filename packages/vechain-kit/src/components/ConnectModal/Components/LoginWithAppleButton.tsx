import { GridItem, Icon } from '@chakra-ui/react';
import { FaApple } from 'react-icons/fa';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

/** Secondary outline button per spec — transparent fill, subtle stroke. */
export const LoginWithAppleButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    const stroke = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(14,13,24,0.12)';
    const strokeStrong = isDark
        ? 'rgba(255,255,255,0.24)'
        : 'rgba(14,13,24,0.24)';
    const hoverBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(14,13,24,0.04)';

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await initOAuth({ provider: 'apple' });
                }}
                customIcon={
                    <Icon
                        as={FaApple}
                        w={'24px'}
                        h={'24px'}
                        color={isDark ? '#ffffff' : '#0E0D18'}
                    />
                }
                text={t('Continue with Apple')}
                style={{
                    bg: 'transparent',
                    border: `1px solid ${stroke}`,
                    _hover: {
                        bg: hoverBg,
                        borderColor: strokeStrong,
                        opacity: 1,
                    },
                }}
            />
        </GridItem>
    );
};
