import {
    VStack,
    HStack,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { AssetsTabPanel } from './Contents/AssetsTabPanel';
import { NFTsTabPanel } from './Contents/NFTsTabPanel';
import { ActivityTabPanel } from './Contents/ActivityTabPanel';

export const AssetsSection = () => {
    const tabTextColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
    const tabPanelsRef = useRef<HTMLDivElement>(null);

    const handleTabChange = () => {
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
                <HStack justify="space-between" align="center">
                    <TabList
                        bg="blackAlpha.300"
                        p={1}
                        borderRadius="full"
                        flex={1}
                    >
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
                </HStack>
                <TabPanels ref={tabPanelsRef}>
                    <TabPanel p={0} pt={3}>
                        <AssetsTabPanel />
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <NFTsTabPanel />
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <ActivityTabPanel />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};
