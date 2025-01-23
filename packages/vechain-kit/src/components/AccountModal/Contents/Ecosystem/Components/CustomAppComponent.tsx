import { SharedAppCard } from './SharedAppCard';

type Props = {
    name: string;
    image: string;
    url: string;
};

export const CustomAppComponent = ({ name, image, url }: Props) => {
    return <SharedAppCard name={name} imageUrl={image} linkUrl={url} />;
};
