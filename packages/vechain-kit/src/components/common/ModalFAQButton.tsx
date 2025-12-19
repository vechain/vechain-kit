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
            variant="vechainKitHeaderIconButtons"
            position="absolute"
            lineHeight={'normal'}
            left="10px"
            top="8px"
            onClick={onClick}
            {...props}
        />
    );
};
