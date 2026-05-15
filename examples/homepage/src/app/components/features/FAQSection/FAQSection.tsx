'use client';

import {
    VStack,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    Box,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export function FAQSection() {
    const { t } = useTranslation();
    const faqItems = [
        {
            question: t('Is the kit free to use?'),
            answer: t(
                'Yes — free for the shared VeChain + Privy integration. Bring your own Privy account if you want full control over the login UX (Privy pricing applies).',
            ),
        },
        {
            question: t('Are there any limitations?'),
            answer: t(
                "Yes. To support all login methods, use the kit's hooks (useSendTransaction, useSignMessage). For full control over the login UX, bring your own Privy account — the shared VeChain + Privy integration can't target specific social methods and always prompts for signatures.",
            ),
        },
        {
            question: t('What are the supported frameworks?'),
            answer: t('The kit supports Next.js and React.'),
        },
        {
            question: t('Can I customize the login methods shown to users?'),
            answer: t(
                'Yes. You can decide to use only veworld, or only social login methods. To maximize flexibility, you can also use your own Privy account and connect it to VeChain Kit, allowing you to use OAuth2-based login methods like Google, Apple, Twitter, GitHub, etc. and completely customize the login experience.',
            ),
        },
        {
            question: t('What can I customize?'),
            answer: t(
                'Color, fonts, background color, etc. You can create your own login button, and modal or use the provided one. You can decide to show or not the wallet or transaction modal, or show only specific contents (Send, Receive, Assets, Profile, etc.).',
            ),
        },
        {
            question: t('Who pays for the transactions?'),
            answer: t(
                'The user pays for the transactions. However, if you want to sponsor them (always or only in specific scenarios), you can use the fee delegation feature.',
            ),
        },
    ];

    return (
        <VStack
            py={{ base: 12, md: 16 }}
            px={{ base: 4, md: 8 }}
            spacing={8}
            align="stretch"
            maxW="4xl"
            mx="auto"
            w="full"
        >
            <Heading as="h2" size="lg" textAlign="center">
                {t('Frequently Asked Questions')}
            </Heading>

            <Accordion allowMultiple defaultIndex={[0]}>
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} border="none" mb={4}>
                        <h3>
                            <AccordionButton
                                bg="#e3ebe1"
                                color="black"
                                borderRadius="md"
                                rounded="xl"
                                _hover={{ bg: '#e2eae0' }}
                            >
                                <Box
                                    as="span"
                                    flex="1"
                                    textAlign="left"
                                    fontWeight="medium"
                                >
                                    {item.question}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h3>
                        <AccordionPanel pb={4} pt={4} px={6}>
                            <Text>{item.answer}</Text>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </VStack>
    );
}
