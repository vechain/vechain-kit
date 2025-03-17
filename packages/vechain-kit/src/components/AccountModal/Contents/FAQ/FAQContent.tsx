import {
    Button,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    Text,
    VStack,
    Icon,
    HStack,
    Heading,
    Tag,
    Select,
    ModalFooter,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import {
    ModalBackButton,
    ScrollToTopWrapper,
    StickyHeaderContainer,
} from '@/components/common';
import { useVeChainKitConfig } from '@/providers';
import { VechainLogo } from '@/assets';
import { FAQAccordion } from './FAQAccordion';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, languageNames } from '../../../../../i18n';
import { Analytics } from '@/utils/mixpanelClientInstance';
import { useEffect } from 'react';

export type FAQContentProps = {
    onGoBack: () => void;
};

export const FAQContent = ({ onGoBack }: FAQContentProps) => {
    const { network, darkMode: isDark } = useVeChainKitConfig();
    const { i18n, t } = useTranslation();

    useEffect(() => {
        Analytics.help.pageViewed();
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        Analytics.settings.language.changed(e.target.value, i18n.language);
        i18n.changeLanguage(e.target.value);
    };

    return (
        <ScrollToTopWrapper>
            <StickyHeaderContainer>
                <ModalHeader>{t('Help')}</ModalHeader>
                <ModalBackButton onClick={onGoBack} />
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody>
                <VStack spacing={6} align="stretch">
                    <VStack>
                        <HStack justify={'center'}>
                            <VechainLogo
                                isDark={isDark}
                                w={'200px'}
                                h={'auto'}
                                ml={-6}
                            />
                        </HStack>
                        <Text fontSize="sm" opacity={0.7} textAlign={'center'}>
                            {t(
                                'Welcome! Here you can manage your wallet, send tokens, and interact with the VeChain blockchain and its applications.',
                            )}
                        </Text>
                    </VStack>

                    <HStack justify={'center'} spacing={2}>
                        <Tag
                            size={'sm'}
                            colorScheme={'blue'}
                            width={'fit-content'}
                            justifyContent={'center'}
                            padding={'10px'}
                        >
                            {t('Network')}: {network.type}
                        </Tag>
                        <Select
                            borderRadius={'md'}
                            size="sm"
                            width="auto"
                            value={i18n.language}
                            onChange={handleLanguageChange}
                            bg={isDark ? 'whiteAlpha.200' : 'gray.100'}
                            borderColor={isDark ? 'whiteAlpha.300' : 'gray.200'}
                            _hover={{
                                borderColor: isDark
                                    ? 'whiteAlpha.400'
                                    : 'gray.300',
                            }}
                        >
                            {supportedLanguages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {
                                        languageNames[
                                            lang as keyof typeof languageNames
                                        ]
                                    }
                                </option>
                            ))}
                        </Select>
                    </HStack>

                    <Heading
                        fontSize={'md'}
                        fontWeight={'500'}
                        textAlign={'center'}
                        mt={4}
                        mb={1}
                    >
                        {t('Frequently asked questions')}
                    </Heading>

                    <FAQAccordion />
                </VStack>
            </ModalBody>
            <ModalFooter w="full">
                <Button
                    as={Link}
                    href="https://docs.vechainkit.vechain.org/"
                    isExternal
                    variant="vechainKitSecondary"
                    rightIcon={<Icon as={FaExternalLinkAlt} />}
                    mt={4}
                >
                    {t('For developers')}
                </Button>
            </ModalFooter>
        </ScrollToTopWrapper>
    );
};
