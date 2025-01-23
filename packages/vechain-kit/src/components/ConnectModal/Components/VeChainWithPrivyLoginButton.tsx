import { GridItem } from '@chakra-ui/react';
import { VechainLogo } from '@/assets';
import { ConnectionButton } from '@/components';
import { usePrivy } from '@/hooks';
import { useTranslation } from 'react-i18next';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

export const VeChainWithPrivyLoginButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { login: viewMoreLogin } = usePrivy();

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={viewMoreLogin}
                customIcon={<VechainLogo boxSize={'20px'} isDark={isDark} />}
                text={t('Login with VeChain')}
            />
        </GridItem>
    );
};
