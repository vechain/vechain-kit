import { useVeChainKitConfig } from '@/providers';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { IoChevronBack } from 'react-icons/io5';

type BackButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalBackButton = ({ onClick, ...props }: BackButtonProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    return (
        <IconButton
            aria-label="Back"
            icon={<IoChevronBack fontSize={'20px'} />}
            size="sm"
            variant="ghost"
            _hover={{ bg: isDark ? 'whiteAlpha.100' : 'blackAlpha.100' }}
            color={isDark ? 'white' : 'black'}
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            {...props}
        />
    );
};
