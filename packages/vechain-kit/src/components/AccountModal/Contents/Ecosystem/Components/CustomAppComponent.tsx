import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { SharedAppCard } from './SharedAppCard';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { CategoryFilter } from './CategoryFilterSection';
import { AllowedCategories } from './CategoryLabel';

type Props = {
    name: string;
    image: string;
    url: string;
    description: string;
    category?: AllowedCategories;
    logoComponent?: JSX.Element;
    selectedCategory?: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const CustomAppComponent = ({
    name,
    image,
    url,
    description,
    category,
    logoComponent,
    selectedCategory,
    setCurrentContent,
}: Props) => {
    const handleAppClick = () => {
        Analytics.ecosystem.appSelected(name);
        setCurrentContent({
            type: 'app-overview',
            props: {
                name,
                image,
                url,
                description,
                category,
                logoComponent,
                selectedCategory,
                setCurrentContent,
            },
        });
    };

    return (
        <SharedAppCard
            name={name}
            imageUrl={image}
            linkUrl={url}
            category={category}
            onClick={handleAppClick}
            {...(logoComponent && { logoComponent })}
        />
    );
};
