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
            variant="modalCloseButton"
            position="absolute"
            left="10px"
            top="8px"
            onClick={onClick}
            lineHeight={'0'}
            {...props}
        />
    );
};
