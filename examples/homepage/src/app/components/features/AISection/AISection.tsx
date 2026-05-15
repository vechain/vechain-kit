'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    HStack,
    Box,
    Icon,
    useColorMode,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuSparkles, LuCheck } from 'react-icons/lu';

interface AISectionProps {
    bg?: string;
    title: string;
    content: string;
}

const TERMINAL_LINES: { prompt: string; text: string; check?: boolean }[] = [
    { prompt: '$', text: 'npx skills add vechain/vechain-ai-skills' },
    { prompt: '✓', text: '11 VeChain skills installed', check: true },
    { prompt: '>', text: 'Build a B3TR rewards contract for my X2Earn app' },
    { prompt: '✨', text: 'Using vebetterdao + smart-contract-development...' },
];

function TerminalMock() {
    const bg = '#0d1117';
    const borderColor = '#30363d';
    const textColor = '#c9d1d9';
    const promptColor = '#58a6ff';
    const greenColor = '#3fb950';

    return (
        <Box
            bg={bg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
            p={5}
            fontFamily="monospace"
            w={['90%', '450px']}
            boxShadow="0 10px 30px rgba(0,0,0,0.25)"
        >
            <HStack spacing={2} mb={4}>
                <Box w={3} h={3} borderRadius="full" bg="#ff5f57" />
                <Box w={3} h={3} borderRadius="full" bg="#febc2e" />
                <Box w={3} h={3} borderRadius="full" bg="#28c840" />
            </HStack>
            <VStack align="stretch" spacing={2}>
                {TERMINAL_LINES.map((line, i) => (
                    <HStack key={i} align="flex-start" spacing={3}>
                        <Text
                            color={line.check ? greenColor : promptColor}
                            fontSize="sm"
                            fontWeight="bold"
                            minW="14px"
                        >
                            {line.check ? <Icon as={LuCheck} boxSize={4} /> : line.prompt}
                        </Text>
                        <Text
                            color={line.check ? greenColor : textColor}
                            fontSize="sm"
                            wordBreak="break-word"
                        >
                            {line.text}
                        </Text>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}

export function AISection({
    bg = '#e8e0d3',
    title,
    content,
}: AISectionProps) {
    const { colorMode } = useColorMode();
    const { t } = useTranslation();

    return (
        <Card
            px={[0, 20]}
            py={[0, 20]}
            mx={[4, '5%']}
            borderRadius={25}
            bg={bg}
            minH={'550px'}
            justifyContent={'center'}
        >
            <Grid
                templateColumns={[
                    'minmax(0, 1fr)',
                    'repeat(2, minmax(0, 1fr))',
                ]}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
                w="full"
            >
                <VStack spacing={4} align="start" p={10}>
                    <HStack spacing={2}>
                        <Icon as={LuSparkles} boxSize={5} color="black" />
                        <Text
                            fontSize="sm"
                            fontWeight="bold"
                            letterSpacing="wider"
                            textTransform="uppercase"
                            color="black"
                        >
                            {t('VeChain AI Skills')}
                        </Text>
                    </HStack>
                    <Heading
                        as="h2"
                        fontSize="3xl"
                        fontWeight="bold"
                        color={colorMode === 'dark' ? 'white' : 'gray.900'}
                    >
                        {title}
                    </Heading>
                    <Text
                        fontSize="lg"
                        color={colorMode === 'dark' ? 'gray.400' : 'gray.700'}
                    >
                        {content}
                    </Text>
                </VStack>

                <Box
                    p={[6, 10]}
                    display="flex"
                    justifyContent="center"
                    w="full"
                >
                    <TerminalMock />
                </Box>
            </Grid>
        </Card>
    );
}
