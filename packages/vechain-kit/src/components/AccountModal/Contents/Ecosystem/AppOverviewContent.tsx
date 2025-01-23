import {
    Button,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    image: string;
    url: string;
    description?: string;
};

export const AppOverviewContent = ({
    setCurrentContent,
    name,
    image,
    url,
    description,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {name}
                </ModalHeader>
                <ModalBackButton
                    onClick={() => setCurrentContent('ecosystem')}
                />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" w="full">
                    <Image
                        src={image}
                        alt={name}
                        w={'200px'}
                        h={'200px'}
                        objectFit="contain"
                        borderRadius={'xl'}
                    />

                    <Text fontSize="sm" textAlign="center">
                        {description}
                    </Text>

                    <Text fontSize="sm" textAlign="center">
                        {t(
                            'Click below to access {{ name }} and explore its features.',
                            { name },
                        )}
                    </Text>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    px={4}
                    width="full"
                    height="60px"
                    variant="solid"
                    borderRadius="xl"
                    onClick={() => {
                        window.open(url, '_blank');
                    }}
                >
                    {t('Launch {{name}}', { name })}
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </ModalFooter>
        </>
    );
};
