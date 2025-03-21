'use client';

import {
    Box,
    VStack,
    Heading,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
} from '@chakra-ui/react';

export function FAQSection() {
    const faqItems = [
        {
            question: 'What is the VeChain Kit?',
            answer: 'The VeChain Kit is a powerful widget that enables developers to integrate blockchain functionality into their applications. It provides multiple login options, including both wallet connections and social logins. End users gain access to essential tools including asset management, wallet services, and profile customization (VET domain claiming, avatar, display name, description, social links). The Kit also offers access to valuable resources such as FAQs, ecosystem applications, decentralized exchanges, and cross-chain bridges.',
        },
        {
            question: 'Who is the VeChain Kit designed for?',
            answer: "The VeChain Kit serves both developers and end users. For developers, it's a powerful toolkit that accelerates blockchain integration and reduces development time. For end users, it functions as a seamless onboarding platform and comprehensive asset management solution directly within applications they already use.",
        },
        {
            question: 'What are the benefits of using the VeChain Kit?',
            answer: 'For developers, the VeChain Kit eliminates the need to build blockchain functionality from scratch, offering pre-built components, social login capabilities, and seamless integration. For users, it provides a frictionless experience with blockchain technology, allowing them to manage digital assets and engage with decentralized applications without requiring technical knowledge of VeChain or blockchain concepts, and by having the same user experience on all apps.',
        },
        {
            question: 'How is the VeChain Kit implemented?',
            answer: "Developers can easily implement the VeChain Kit by installing the package, customizing its appearance and functionality to match their application's needs, and utilizing the provided hooks and components. End users interact with the Kit to authenticate, manage digital assets, and access important blockchain tools—all within the familiar environment of their favorite applications, without needing to understand the underlying blockchain technology.",
        },
    ];

    return (
        <Box
            p={8}
            borderRadius="lg"
            boxShadow="xl"
            bg="whiteAlpha.100"
            backdropFilter="blur(10px)"
            w="full"
        >
            <VStack spacing={6} align="stretch">
                <Heading as="h2" size="lg" textAlign="center">
                    Frequently Asked Questions
                </Heading>

                <Accordion allowToggle>
                    {faqItems.map((item, index) => (
                        <AccordionItem key={index} border="none" mb={4}>
                            <h3>
                                <AccordionButton
                                    bg="whiteAlpha.100"
                                    borderRadius="md"
                                    _hover={{ bg: 'whiteAlpha.200' }}
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
        </Box>
    );
}
