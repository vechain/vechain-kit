import { IconButton, IconButtonProps, Icon } from '@chakra-ui/react';
import { LuCircleHelp } from 'react-icons/lu';

type FAQButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalFAQButton = ({ onClick, ...props }: FAQButtonProps) => {
    return (
        <IconButton
            aria-label="FAQ"
            icon={<Icon as={LuCircleHelp} fontSize={'17px'} />}
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
