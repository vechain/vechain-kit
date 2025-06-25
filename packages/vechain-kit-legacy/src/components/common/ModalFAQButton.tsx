import { IconButton, IconButtonProps, Icon } from '@chakra-ui/react';
import { BsQuestionCircle } from 'react-icons/bs';

type FAQButtonProps = {
    onClick: () => void;
} & Partial<IconButtonProps>;

export const ModalFAQButton = ({ onClick, ...props }: FAQButtonProps) => {
    return (
        <IconButton
            aria-label="FAQ"
            icon={<Icon as={BsQuestionCircle} fontSize={'17px'} />}
            size="sm"
            variant="ghost"
            _hover={{ bg: 'blackAlpha.100' }}
            _dark={{ _hover: { bg: 'whiteAlpha.100' } }}
            position="absolute"
            borderRadius={'50%'}
            left="10px"
            top="10px"
            onClick={onClick}
            {...props}
        />
    );
};
