import { useIpfsImage, useXAppMetadata, XApp } from '@/hooks';
import { SharedAppCard } from './SharedAppCard';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { Skeleton } from '@chakra-ui/react';
import { CategoryFilter } from './CategoryFilterSection';

type Props = {
    xApp: XApp;
    selectedCategory?: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const AppComponent = ({
    xApp,
    setCurrentContent,
    selectedCategory,
}: Props) => {
    const { data: appMetadata, isLoading: appMetadataLoading } =
        useXAppMetadata(xApp.id);
    const { data: logo, isLoading: isLogoLoading } = useIpfsImage(
        appMetadata?.logo,
    );

    // xApp.name is already resolved from metadata with an on-chain fallback, so
    // it keeps the card readable when this card's own fetch is still in flight
    // or failed.
    const name = appMetadata?.name?.trim() || xApp.name || '';

    const handleAppClick = () => {
        if (name) {
            setCurrentContent({
                type: 'app-overview',
                props: {
                    name,
                    image: logo?.image ?? '',
                    url: appMetadata?.external_url ?? '',
                    description: appMetadata?.description ?? '',
                    category: 'vebetter',
                    selectedCategory,
                    setCurrentContent,
                },
            });
        }
    };

    return (
        <Skeleton
            isLoaded={!appMetadataLoading && !isLogoLoading}
            borderRadius="md"
            height="100%"
        >
            <SharedAppCard
                name={name}
                imageUrl={logo?.image ?? ''}
                linkUrl={appMetadata?.external_url ?? ''}
                category="vebetter"
                onClick={handleAppClick}
            />
        </Skeleton>
    );
};
