import { useIpfsImage, useXAppMetadata, XApp } from '@/hooks';
import { SharedAppCard } from './SharedAppCard';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { Skeleton } from '@chakra-ui/react';

type Props = {
    xApp: XApp;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AppComponent = ({ xApp, setCurrentContent }: Props) => {
    const { data: appMetadata, isLoading: appMetadataLoading } =
        useXAppMetadata(xApp.id);
    const { data: logo, isLoading: isLogoLoading } = useIpfsImage(
        appMetadata?.logo,
    );

    return (
        <Skeleton isLoaded={!appMetadataLoading && !isLogoLoading}>
            <SharedAppCard
                name={appMetadata?.name ?? ''}
                imageUrl={logo?.image ?? ''}
                linkUrl={appMetadata?.external_url ?? ''}
                onClick={() => {
                    setCurrentContent({
                        type: 'app-overview',
                        props: {
                            name: appMetadata?.name ?? '',
                            image: logo?.image ?? '',
                            url: appMetadata?.external_url ?? '',
                            description: appMetadata?.description ?? '',
                        },
                    });
                }}
            />
        </Skeleton>
    );
};
