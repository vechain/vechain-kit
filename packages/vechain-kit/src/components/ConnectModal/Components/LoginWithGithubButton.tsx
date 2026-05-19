import { GridItem } from '@chakra-ui/react';
import { LuGithub } from 'react-icons/lu';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';
import { RecommendedDot } from './RecommendedDot';
import { primaryButtonStyle } from './primaryButtonStyle';

type Props = {
    isDark: boolean;
    gridColumn?: number;
    /** When true, render as the recommended primary CTA. See VeWorldButton. */
    isPrimary?: boolean;
};

export const LoginWithGithubButton = ({
    isDark,
    gridColumn,
    isPrimary = false,
}: Props) => {
    const { t } = useTranslation();
    const { initOAuth } = useLoginWithOAuth();

    return (
        <GridItem colSpan={gridColumn ?? 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={async () => {
                    await initOAuth({
                        provider: 'github',
                    });
                }}
                icon={LuGithub}
                text={t('Continue with Github')}
                rightIcon={isPrimary ? <RecommendedDot /> : undefined}
                style={isPrimary ? primaryButtonStyle(isDark) : undefined}
            />
        </GridItem>
    );
};
