import { Button } from '@chakra-ui/react';
import { ConnectModalContentsTypes } from '@/components';
import { useTranslation } from 'react-i18next';
import type { PrivyAppInfo } from '../../../types';

type Props = {
    isDark: boolean;
    appsInfo: PrivyAppInfo[];
    isLoading: boolean;
    gridColumn?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<ConnectModalContentsTypes>
    >;
};

export const EcosystemButton = ({
    appsInfo,
    isLoading,
    setCurrentContent,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Button
            fontSize={'sm'}
            variant="link"
            onClick={() =>
                setCurrentContent({
                    type: 'ecosystem',
                    props: { appsInfo, isLoading },
                })
            }
        >
            {t('Already have an x2earn app wallet?')}
        </Button>
    );
};
