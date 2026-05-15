'use client';

import {
    Card,
    Grid,
    VStack,
    Heading,
    Text,
    HStack,
    Box,
    useColorMode,
} from '@chakra-ui/react';

interface BoostedDevSectionProps {
    bg?: string;
    title: string;
    content: string;
}

const COLORS = {
    keyword: '#ff7b72',
    fn: '#7ee787',
    variable: '#79c0ff',
    string: '#a5d6ff',
    comment: '#8b949e',
    text: '#e6edf3',
};

type Token = { t: string; c: string };

const k = (t: string): Token => ({ t, c: COLORS.keyword });
const fn = (t: string): Token => ({ t, c: COLORS.fn });
const v = (t: string): Token => ({ t, c: COLORS.variable });
const s = (t: string): Token => ({ t, c: COLORS.string });
const c = (t: string): Token => ({ t, c: COLORS.comment });
const x = (t: string): Token => ({ t, c: COLORS.text });

const LINES: Token[][] = [
    [
        k('import'),
        x(' { '),
        v('useWallet'),
        x(', '),
        v('useThor'),
        x(', '),
        v('useBuildTransaction'),
        x(' } '),
        k('from'),
        x(' '),
        s('"@vechain/vechain-kit"'),
        x(';'),
    ],
    [],
    [k('function'), x(' '), fn('MyComponent'), x('() {')],
    [x('  '), c('// Manage the wallet')],
    [
        x('  '),
        k('const'),
        x(' { '),
        v('account'),
        x(', '),
        v('connection'),
        x(', '),
        v('disconnect'),
        x(' } = '),
        fn('useWallet'),
        x('()'),
    ],
    [],
    [x('  '), c('// Interact with Thor provider')],
    [x('  '), k('const'), x(' '), v('thor'), x(' = '), fn('useThor'), x('()')],
    [],
    [x('  '), c('// Send transaction')],
    [x('  '), k('const'), x(' {')],
    [x('      '), v('sendTransaction'), x(',')],
    [x('      '), v('status'), x(',')],
    [x('      '), v('txReceipt'), x(',')],
    [x('  } = '), fn('useBuildTransaction'), x('({})')],
    [],
    [x('  '), k('return'), x(' <></>')],
    [x('}')],
];

function CodeWindow() {
    return (
        <Box
            bg="#1f2229"
            borderRadius="xl"
            w={['90%', '550px']}
            maxW="100%"
            boxShadow="0 10px 30px rgba(0,0,0,0.25)"
            overflow="hidden"
        >
            <HStack
                spacing={2}
                px={4}
                py={3}
                bg="#2a2d36"
                position="relative"
            >
                <Box w={3} h={3} borderRadius="full" bg="#ff5f57" />
                <Box w={3} h={3} borderRadius="full" bg="#febc2e" />
                <Box w={3} h={3} borderRadius="full" bg="#28c840" />
                <Text
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    color="#8b949e"
                    fontSize="sm"
                    fontFamily="monospace"
                >
                    My App
                </Text>
            </HStack>
            <Box
                px={5}
                py={4}
                fontFamily="monospace"
                fontSize={{ base: 'xs', md: 'sm' }}
                lineHeight="1.6"
                overflowX="auto"
            >
                {LINES.map((line, i) => (
                    <Box key={i} whiteSpace="pre" minH="1.6em">
                        {line.length === 0 ? (
                            <Text as="span">{' '}</Text>
                        ) : (
                            line.map((tok, j) => (
                                <Text
                                    key={j}
                                    as="span"
                                    color={tok.c}
                                    fontStyle={
                                        tok.c === COLORS.comment
                                            ? 'italic'
                                            : 'normal'
                                    }
                                >
                                    {tok.t}
                                </Text>
                            ))
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export function BoostedDevSection({
    bg = '#dae8fb',
    title,
    content,
}: BoostedDevSectionProps) {
    const { colorMode } = useColorMode();

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
                templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                gap={4}
                placeItems={'center center'}
                alignItems={'center'}
            >
                <VStack spacing={4} align="start" p={10}>
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
                    <CodeWindow />
                </Box>
            </Grid>
        </Card>
    );
}
