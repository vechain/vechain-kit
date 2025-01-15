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
    const tabListBgColor = useColorModeValue('#000000d1', '#f4f4f4');
    const tabTextColor = useColorModeValue('white', '#1f1f1e');
    const tabTextSelectedColor = useColorModeValue('#000000d1', '#ffffffeb');
    const tabBgSelectedColor = useColorModeValue('white', '#1f1f1e');
    const tabPanelsRef = useRef<HTMLDivElement>(null);

    const scrollToContent = () => {
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
            <Tabs variant="soft-rounded" size="sm" onChange={scrollToContent}>
                <HStack justify="space-between" align="center">
                    <TabList
                        bg={tabListBgColor}
                        p={1}
                        borderRadius="full"
                        flex={1}
                    >
                        <Tab
                            borderRadius="full"
                            color={tabTextColor}
                            _selected={{
                                bg: tabBgSelectedColor,
                                color: tabTextSelectedColor,
                            }}
                            flex={1}
                            onClick={scrollToContent}
                        >
                            Assets
                        </Tab>
                        <Tab
                            borderRadius="full"
                            color={tabTextColor}
                            _selected={{
                                bg: tabBgSelectedColor,
                                color: tabTextSelectedColor,
                            }}
                            flex={1}
                        >
                            NFTs
                        </Tab>
                        <Tab
                            borderRadius="full"
                            color={tabTextColor}
                            _selected={{
                                bg: tabBgSelectedColor,
                                color: tabTextSelectedColor,
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
