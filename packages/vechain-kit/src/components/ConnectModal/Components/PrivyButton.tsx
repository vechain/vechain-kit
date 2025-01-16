import { GridItem } from '@chakra-ui/react';
import { CiCircleMore } from 'react-icons/ci';
import { ConnectionButton } from '@/components';

type Props = {
    isDark: boolean;
    onViewMoreLogin: () => void;
};

export const PrivyButton = ({ isDark, onViewMoreLogin }: Props) => {
    return (
        <GridItem colSpan={1} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={onViewMoreLogin}
                icon={CiCircleMore}
            />
        </GridItem>
    );
};
