'use client';

import {
    Card,
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
        {
            question: 'Is VeChain Kit free to use?',
            answer: "Yes, VeChain Kit is completely free to use. You only need to pay if you want to use your own Privy account for additional customization and control. The shared VeChain Privy integration doesn't incur any costs for developers.",
        },
        {
            question: 'What are the limitations when using VeChain Kit?',
            answer: "When using the shared VeChain Kit integration, there are some limitations: you cannot target only specific social login methods, you cannot fully customize the login UX (users will need to go through a popup window), and users' signatures are always requested when doing transactions. For full customization freedom, you would need to create your own Privy account.",
        },
        {
            question: 'Which dApps are currently using VeChain Kit?',
            answer: 'Several dApps are already using VeChain Kit, including: scoopup, vetrade, betterswap, solarwise, vepet, velottery, and eatgreen. You can see an example of how it looks with a custom Privy setup at governance.vebetterdao.org.',
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
        <VStack spacing={8} align="stretch" maxW="4xl" mx="auto" w="full">
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
    );
}
