import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { SharedAppCard } from './SharedAppCard';

type Props = {
    name: string;
    image: string;
    url: string;
    description: string;
    logoComponent?: JSX.Element;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const CustomAppComponent = ({
    name,
    image,
    url,
    description,
    logoComponent,
    setCurrentContent,
}: Props) => {
    return (
        <SharedAppCard
            name={name}
            imageUrl={image}
            linkUrl={url}
            onClick={() =>
                setCurrentContent({
                    type: 'app-overview',
                    props: {
                        name,
                        image,
                        url,
                        description,
                        logoComponent,
                    },
                })
            }
            {...(logoComponent && { logoComponent })}
        />
    );
};
