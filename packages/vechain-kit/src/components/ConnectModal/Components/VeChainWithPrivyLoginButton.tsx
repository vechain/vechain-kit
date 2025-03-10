import { GridItem } from '@chakra-ui/react';
import { VechainIconDark, VechainIconLight } from '@/assets';
import { ConnectionButton, SocialIcons } from '@/components';
import { usePrivy } from '@/hooks';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';

type Props = {
    isDark: boolean;
    gridColumn?: number;
};

/// This button is used to login with VeChain using Privy on
/// platforms like VeBetterDAO and VeChain Kit Homepage.
/// It is a very specific scenario.
export const VeChainWithPrivyLoginButton = ({ isDark, gridColumn }: Props) => {
    const { t } = useTranslation();
    const { login: viewMoreLogin } = usePrivy();

    return (
        <GridItem colSpan={gridColumn ? gridColumn : 4} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={viewMoreLogin}
                icon={
                    isDark
                        ? (VechainIconLight as IconType)
                        : (VechainIconDark as IconType)
                }
                text={t('Use social login with VeChain')}
                variant={'loginWithVechain'}
                rightIcon={<SocialIcons />}
            />
        </GridItem>
    );
};
