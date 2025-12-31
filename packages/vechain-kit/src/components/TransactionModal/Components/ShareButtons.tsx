import { Box, HStack, Link } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import React from 'react';
import { useVeChainKitConfig } from '@/providers';
import { TELEGRAM_BASE_URL, TWITTER_BASE_URL, WHATSAPP_BASE_URL } from '@/constants';

// bouncing circle button animation provider
const BouncingAnimation = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay:
                (crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32) * 5,
        }}
        animate={{
            y: [0, -2, 0],
            rotate: [0, 10, -10, 0],
        }}
    >
        {children}
    </motion.div>
);

type Props = {
    description: string;
    url?: string;
    facebookHashtag?: string;
};

export const ShareButtons = ({ description }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    // `description` is treated as raw text; use URLSearchParams so values are encoded.
    const twitterUrl = new URL('/intent/tweet', TWITTER_BASE_URL);
    twitterUrl.searchParams.set('text', description);

    const telegramUrl = new URL('/share/url', TELEGRAM_BASE_URL);
    telegramUrl.searchParams.set('url', description);

    const whatsappUrl = new URL('/', WHATSAPP_BASE_URL);
    whatsappUrl.searchParams.set('text', description);

    return (
        <HStack gap={2}>
            <BouncingAnimation>
                <Link href={twitterUrl.toString()} isExternal>
                    <Box
                        bg={isDark ? 'blackAlpha.700' : 'lightgrey'}
                        p={2}
                        borderRadius={'full'}
                    >
                        <FaXTwitter size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link href={telegramUrl.toString()} isExternal>
                    <Box bg={'#30abec'} p={2} borderRadius={'full'}>
                        <FaTelegramPlane color="white" size={22} />
                    </Box>
                </Link>
            </BouncingAnimation>
            <BouncingAnimation>
                <Link href={whatsappUrl.toString()} isExternal>
                    <Box bg={'#01cb37'} p={2} borderRadius={'full'}>
                        <FaWhatsapp size={22} color="white" />
                    </Box>
                </Link>
            </BouncingAnimation>
        </HStack>
    );
};
