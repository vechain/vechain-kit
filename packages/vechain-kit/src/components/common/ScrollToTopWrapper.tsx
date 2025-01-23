import { VStack, StackProps } from '@chakra-ui/react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export const ScrollToTopWrapper = ({ children, ...props }: StackProps) => {
    useScrollToTop();

    return <VStack {...props}>{children}</VStack>;
};
