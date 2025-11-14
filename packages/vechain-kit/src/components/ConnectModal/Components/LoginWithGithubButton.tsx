import { GridItem } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { ConnectionButton } from '@/components';
import { useTranslation } from 'react-i18next';
import { useLoginWithOAuth } from '@/hooks';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const LoginWithGithubButton = ({ isDark, gridColumn }: Props) => {
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
                icon={FaGithub}
                text={t('Continue with Github')}
            />
        </GridItem>
    );
};
