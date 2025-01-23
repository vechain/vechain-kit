import { useIpfsImage, useXAppMetadata } from '@/hooks';
import { XApp } from '@/types';
import { SharedAppCard } from './SharedAppCard';
import { SkeletonAppCard } from './SkeletonAppCard';

type Props = {
    xApp: XApp;
};

export const AppComponent = ({ xApp }: Props) => {
    const { data: appMetadata, isLoading: appMetadataLoading } =
        useXAppMetadata(xApp.id);
    const { data: logo, isLoading: isLogoLoading } = useIpfsImage(
        appMetadata?.logo,
    );

    if (appMetadataLoading || isLogoLoading) {
        return <SkeletonAppCard />;
    }

    return (
        <SharedAppCard
            name={appMetadata?.name ?? ''}
            imageUrl={logo?.image ?? ''}
            linkUrl={appMetadata?.external_url ?? ''}
        />
    );
};
