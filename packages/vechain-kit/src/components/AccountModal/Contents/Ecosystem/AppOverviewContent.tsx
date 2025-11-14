import {
    Box,
    Button,
    Icon,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
    Flex,
    HStack,
} from '@chakra-ui/react';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { ShortcutButton } from './Components/ShortcutButton';
import { CategoryLabel, AllowedCategories } from './Components/CategoryLabel';
import { CategoryFilter } from './Components/CategoryFilterSection';

export type AppOverviewContentProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    name: string;
    image: string;
    url: string;
    description: string;
    category?: AllowedCategories;
    selectedCategory?: CategoryFilter;
    logoComponent?: JSX.Element;
};

export const AppOverviewContent = ({
    setCurrentContent,
    name,
    image,
    url,
    description,
    category,
    selectedCategory,
    logoComponent,
}: AppOverviewContentProps) => {
    const { t } = useTranslation();

    const handleLaunchApp = () => {
        window.open(url, '_blank');
    };

    const handleBackClick = () => {
        if (selectedCategory) {
            setCurrentContent({
                type: 'ecosystem-with-category',
                props: {
                    selectedCategory,
                    setCurrentContent,
                },
            });
        } else {
            setCurrentContent('ecosystem');
        }
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{name}</ModalHeader>
                <ModalBackButton onClick={handleBackClick} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="center" w="full">
                    <Flex direction="column" align="center">
                        {logoComponent ? (
                            logoComponent
                        ) : (
                            <Image
                                src={image}
                                alt={name}
                                w={'200px'}
                                h={'200px'}
                                objectFit="contain"
                                borderRadius={'xl'}
                            />
                        )}

                        {category && (
                            <HStack mt={2}>
                                <CategoryLabel category={category} />
                            </HStack>
                        )}
                    </Flex>

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
                <VStack w="full" spacing={4}>
                    <Button
                        variant="vechainKitSecondary"
                        onClick={handleLaunchApp}
                    >
                        {t('Launch {{name}}', { name })}
                        <Icon as={FaExternalLinkAlt} ml={2} />
                    </Button>

                    <ShortcutButton
                        name={name}
                        image={image}
                        url={url}
                        description={description}
                    />
                </VStack>
            </ModalFooter>
        </Box>
    );
};
