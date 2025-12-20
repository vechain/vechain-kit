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

export function FAQSection() {
    const faqItems = [
        {
            question: 'Is VeChain Kit free to use?',
            answer: "Yes, VeChain Kit is completely free to use. You only need to pay if you want to use your own Privy account for additional customization and control. The shared VeChain Privy integration doesn't incur any costs for developers.",
        },
        {
            question: 'What are the limitations when using VeChain Kit?',
            answer: "When using the shared VeChain Kit integration, there are some limitations: you cannot target only specific social login methods, you cannot fully customize the login UX (users will need to go through a popup window), and users' signatures are always requested when doing transactions. For full customization freedom, you would need to create your own Privy account.",
        },

        {
            question: 'Can I customize the login methods shown to users?',
            answer: 'With the shared VeChain Kit integration, you cannot limit the login methods to specific options (like email-only). All available login options will be shown to users. If you need to target specific login methods, you would need to use your own Privy account.',
        },
        {
            question: 'Do users need to sign transactions to receive rewards?',
            answer: 'It depends on how you structure your application. In many cases, users should not need to sign anything to receive rewards - this can be handled on the backend. However, users will need to confirm transactions and signings when they initiate actions, similar to how they would with a normal wallet connection.',
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
                Frequently Asked Questions
            </Heading>

            <Accordion allowToggle>
                {faqItems.map((item, index) => (
                    <AccordionItem key={index} border="none" mb={4}>
                        <h3>
                            <AccordionButton
                                bg="#e1e5e4"
                                color="black"
                                borderRadius="md"
                                rounded="xl"
                                _hover={{ bg: '#e1e5e4' }}
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
