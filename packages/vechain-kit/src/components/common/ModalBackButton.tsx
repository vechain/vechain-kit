import { IconButton, IconButtonProps, Icon } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';

type BackButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalBackButton = ({ onClick, ...props }: BackButtonProps) => {
    return (
        <IconButton
            aria-label="Back"
            icon={<Icon as={LuChevronLeft} fontSize={'20px'} />}
            size="sm"
            variant="ghost"
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            {...props}
        />
    );
};
