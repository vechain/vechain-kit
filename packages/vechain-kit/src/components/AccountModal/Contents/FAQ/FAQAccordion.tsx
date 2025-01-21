import { useVeChainKitConfig } from '@/providers';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Text,
    Icon,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

export const FAQAccordion = () => {
    const { t } = useTranslation();
    const { darkMode: isDark } = useVeChainKitConfig();

    const faqItems = [
        {
            question: 'What is VeChain?',
            answer: 'VeChain, headquartered in San Marino, Europe, is a pioneering blockchain ecosystem and creator of VeChainThor, a world-class smart contract platform driving real-world blockchain adoption. Founded in 2015 by Sunny Lu, VeChain has consistently worked to deliver a transparent, efficient, scalable, and adaptable blockchain solution.',
        },
        {
            question: 'What is a wallet?',
            answer: 'A wallet is your gateway to the VeChain blockchain. It stores your private keys and allows you to securely manage your digital assets, send and receive tokens, and interact with decentralized applications. Think of it as your digital bank account for blockchain transactions.',
        },
        {
            question: 'What is a Smart Account?',
            answer: 'A Smart Account is a smart contract wallet that provides enhanced security and functionality. It allows for features like social recovery, transaction batching, and more.',
        },
        {
            question: 'How is my wallet secured?',
            answer: 'Your wallet security depends on how you access it. With self-custody options like the VeWorld extension, mobile app, or hardware wallet, you have complete control over your private keys. This extension itself has no access to your private keys. When logging in with social accounts or VeChain, your wallet is created and secured by Privy and managed by VeChain, providing an easier onboarding experience while maintaining security.',
        },
        {
            question: 'How do I backup my wallet?',
            answer: "Backing up your wallet is crucial as you are the only one with access to your private keys. If something goes wrong, having your private key is the only way to recover your assets. How to backup depends on how you access your wallet: If using VeWorld, the backup option is available within the app. For social login users, you can find backup options in the Wallet section. If you're connected through VeChain or another ecosystem app, you'll need to visit the original website, log in, and access the Wallet section from there.",
        },
        {
            question: 'What is a network?',
            answer: "A network in blockchain refers to the environment where transactions take place. VeChain has two main networks: Mainnet (the live network where real transactions occur) and Testnet (a testing environment for developers). The network you're connected to is displayed at the top of this modal.",
        },
        {
            question: 'What is a domain name?',
            answer: 'A domain name is a sort of nickname for your wallet address. It allows you to easily identify your wallet and interact with dApps using a human-readable name. For example, if your wallet address is 0x1234567890, your nickname could be "alice.vechain".',
        },
        {
            question: 'What is Privy?',
            answer: 'Privy builds user onboarding and embedded wallet infrastructure to enable better products built on crypto rails. This means embedding asset control within applications themselves to enable users, businesses or machines to use digital assets through seamless product experiences.',
        },
        {
            question: 'What is VeBetterDAO?',
            answer: 'VeBetterDAO is a decentralized organization on VeChain blockchain focused on sustainability. Members participate in the governance of the DAO using B3TR tokens for rewards and VOT3 for voting in proposals and weekly token allocation rounds.',
        },
        {
            question: 'What is an x2earn application?',
            answer: 'An X2Earn application in VeBetterDAO is a sustainable app that rewards users with B3TR tokens for eco-friendly actions. These apps must distribute B3TR, link user wallets, and provide proof of sustainable actions. They join VeBetterDAO through endorsement and participate in weekly token allocation rounds.',
        },
        {
            question: 'What is B3TR?',
            answer: 'B3TR is the incentive token of VeBetterDAO, built on VechainThor blockchain. It has a capped supply of 1 billion tokens, emitted weekly over 12 years. B3TR is used for rewards, governance, and backing VOT3 tokens 1:1. It supports sustainability applications and DAO treasury management.',
        },
        {
            question: 'What is VET?',
            answer: 'VET is the primary cryptocurrency of the VeChain network. It represents value and ownership in the VeChain ecosystem, similar to how stocks represent ownership in a company. Holding VET automatically generates VTHO, which is needed to pay for transactions on the network.',
        },
        {
            question: 'What is VTHO?',
            answer: "VTHO (VeThor) is the energy or 'gas' token of the VeChain network. It's used to pay for transaction fees when interacting with the blockchain. VTHO is automatically generated by holding VET tokens, creating a two-token system that helps maintain network stability and manage transaction costs.",
        },
        {
            question: 'How do I send tokens?',
            answer: "You can send tokens by clicking the send icon in the Quick Actions section. Enter the recipient's address or VeChain domain name, select the token, and specify the amount you want to send.",
        },
        {
            question: 'What is fee delegation?',
            answer: "Fee delegation is a unique feature of VeChain that allows someone else (a delegator) to pay for your transaction fees. While many dApps and service providers act as delegators to make it easier for new users to get started, some transactions may still require you to pay fees using your own VTHO. Fees are necessary to prevent network spam and compensate the nodes that process and validate transactions on the blockchain. When paying fees yourself, you'll be able to select VTHO from your assets to cover the transaction cost.",
        },
    ];

    return (
        <Accordion allowMultiple>
            {faqItems.map((item, index) => (
                <AccordionItem key={index} border="none" mb={2}>
                    {({ isExpanded }) => (
                        <>
                            <AccordionButton
                                bg={isDark ? 'whiteAlpha.50' : 'gray.50'}
                                borderRadius="xl"
                                _hover={{
                                    bg: isDark ? 'whiteAlpha.100' : 'gray.100',
                                }}
                            >
                                <Box flex="1" textAlign="left" py={2}>
                                    <Text fontWeight="500">
                                        {t(item.question)}
                                    </Text>
                                </Box>
                                <Icon
                                    as={
                                        isExpanded ? IoChevronUp : IoChevronDown
                                    }
                                    fontSize="20px"
                                    opacity={0.5}
                                />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Text fontSize="sm" opacity={0.8}>
                                    {t(item.answer)}
                                </Text>
                            </AccordionPanel>
                        </>
                    )}
                </AccordionItem>
            ))}
        </Accordion>
    );
};
