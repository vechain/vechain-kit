import {
    VStack,
    Text,
    HStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Icon,
    Image,
    Box,
    useColorModeValue,
} from '@chakra-ui/react';
import { BiTransferAlt } from 'react-icons/bi';
import { IoWalletOutline } from 'react-icons/io5';
import { useBalances } from '../../../hooks';
import { motion } from 'framer-motion';
import { TOKEN_LOGOS } from '../../../utils';
import { useRef } from 'react';

const compactFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
});

const MotionVStack = motion(VStack);

export const AssetsSection = () => {
    const { balances, prices } = useBalances();
    const tabTextColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
    const tabPanelsRef = useRef<HTMLDivElement>(null);

    const handleTabChange = () => {
        // Wait for the next tick to ensure the content is rendered
        setTimeout(() => {
            if (tabPanelsRef.current) {
                tabPanelsRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);
    };

    return (
        <VStack w="full" spacing={3} align="stretch">
            <Tabs variant="soft-rounded" size="sm" onChange={handleTabChange}>
                <TabList bg="blackAlpha.300" p={1} borderRadius="full">
                    <Tab
                        borderRadius="full"
                        color={tabTextColor}
                        _selected={{
                            bg: 'white',
                            color: 'black',
                        }}
                        flex={1}
                    >
                        Assets
                    </Tab>
                    <Tab
                        borderRadius="full"
                        color={tabTextColor}
                        _selected={{
                            bg: 'white',
                            color: 'black',
                        }}
                        flex={1}
                    >
                        NFTs
                    </Tab>
                    <Tab
                        borderRadius="full"
                        color={tabTextColor}
                        _selected={{
                            bg: 'white',
                            color: 'black',
                        }}
                        flex={1}
                    >
                        Activity
                    </Tab>
                </TabList>
                <TabPanels ref={tabPanelsRef}>
                    <TabPanel p={0} pt={3}>
                        <MotionVStack
                            spacing={2}
                            align="stretch"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            mt={2}
                        >
                            <AssetRow
                                symbol="VET"
                                amount={balances.vet}
                                usdValue={balances.vet * prices.vet}
                            />
                            <AssetRow
                                symbol="VTHO"
                                amount={balances.vtho}
                                usdValue={balances.vtho * prices.vtho}
                            />
                            <AssetRow
                                symbol="B3TR"
                                amount={balances.b3tr}
                                usdValue={balances.b3tr * prices.b3tr}
                            />
                            {balances.vot3 > 0 && (
                                <AssetRow
                                    symbol="VOT3"
                                    amount={balances.vot3}
                                    usdValue={balances.vot3 * prices.b3tr}
                                />
                            )}
                            {balances.veB3tr > 0 && (
                                <AssetRow
                                    symbol="veB3TR"
                                    amount={balances.veB3tr}
                                    usdValue={balances.veB3tr * prices.b3tr}
                                />
                            )}
                        </MotionVStack>
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <MotionVStack
                            spacing={4}
                            align="center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            mt={8}
                        >
                            <Icon
                                as={IoWalletOutline}
                                boxSize={12}
                                color="gray.500"
                                p={2}
                                bg="whiteAlpha.100"
                                borderRadius="xl"
                            />
                            <VStack spacing={1}>
                                <Text fontSize="lg" fontWeight="500">
                                    Coming soon
                                </Text>
                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    textAlign="center"
                                >
                                    Stay tuned for our upcoming NFT feature
                                </Text>
                            </VStack>
                        </MotionVStack>
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <MotionVStack
                            spacing={4}
                            align="center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            mt={8}
                        >
                            <Icon
                                as={BiTransferAlt}
                                boxSize={12}
                                color="gray.500"
                                p={2}
                                bg="whiteAlpha.100"
                                borderRadius="xl"
                            />
                            <VStack spacing={1}>
                                <Text fontSize="lg" fontWeight="500">
                                    Coming soon
                                </Text>
                                <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    textAlign="center"
                                >
                                    Stay tuned for our upcoming Activity feature
                                </Text>
                            </VStack>
                        </MotionVStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};

const AssetRow = ({
    symbol,
    amount,
    usdValue,
}: {
    symbol: string;
    amount: number;
    usdValue: number;
}) => (
    <HStack justify="space-between" px={2} py={1}>
        <HStack spacing={2}>
            <Image
                src={TOKEN_LOGOS[symbol]}
                alt={`${symbol} logo`}
                boxSize="24px"
                borderRadius="full"
                fallback={
                    <Box
                        boxSize="24px"
                        borderRadius="full"
                        bg="whiteAlpha.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text fontSize="10px" fontWeight="bold">
                            {symbol.slice(0, 3)}
                        </Text>
                    </Box>
                }
            />
            <Text fontSize="sm">{symbol}</Text>
        </HStack>
        <Text fontSize="sm">
            {compactFormatter.format(amount)}
            <Text as="span" color="gray.500">
                {' '}
                (${compactFormatter.format(usdValue)})
            </Text>
        </Text>
    </HStack>
);
