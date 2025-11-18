import { useVeChainKitConfig } from '@/providers';
import { IconButton, IconButtonProps } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';

type BackButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalBackButton = ({ onClick, ...props }: BackButtonProps) => {
    const { darkMode: isDark } = useVeChainKitConfig();
    return (
        <IconButton
            aria-label="Back"
            icon={<LuChevronLeft fontSize={'20px'} />}
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
