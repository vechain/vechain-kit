import { useTranslation } from 'react-i18next';
import { EmptyContent } from '../../../../common/EmptyContent';
import { LuBell, LuArchive } from 'react-icons/lu';

type Props = {
    showArchived: boolean;
};

export const EmptyNotifications = ({ showArchived }: Props) => {
    const { t } = useTranslation();

    return (
        <EmptyContent
            title={
                showArchived
                    ? t('No archived notifications')
                    : t('No notifications')
            }
            description={
                showArchived
                    ? t('Cleared notifications will appear here')
                    : t('When you have notifications, they will appear here')
            }
            icon={showArchived ? LuArchive : LuBell}
        />
    );
};
