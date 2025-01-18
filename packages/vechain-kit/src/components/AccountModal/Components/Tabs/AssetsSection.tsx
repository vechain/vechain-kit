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
import { AccountModalContentTypes } from '../../Types';

type Props = {
    mt?: number;
    setCurrentContent: (content: AccountModalContentTypes) => void;
};

export const AssetsSection = ({ mt, setCurrentContent }: Props) => {
    const tabBgColor = useColorModeValue('white', '#1f1f1e');
    const tabBorderColor = useColorModeValue('#ebebeb', '#2d2d2d');
    const tabTextColor = useColorModeValue('#4d4d4d', '#dfdfdd');
    const tabTextSelectedColor = useColorModeValue('#000000', '#ffffff');
    const tabSelectedBgColor = useColorModeValue('#f7f7f7', '#3c3c39');
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
        <VStack w="full" spacing={3} align="stretch" mt={mt}>
            <Tabs variant="soft-rounded" size="sm" onChange={scrollToContent}>
                <HStack justify="space-between" align="center">
                    <TabList
                        bg={tabBgColor}
                        p={2}
                        borderRadius="xl"
                        flex={1}
                        border={`1px solid ${tabBorderColor}`}
                        gap={2}
                    >
                        <Tab
                            borderRadius="lg"
                            color={tabTextColor}
                            _selected={{
                                bg: tabSelectedBgColor,
                                color: tabTextSelectedColor,
                            }}
                            flex={1}
                            onClick={scrollToContent}
                            transition="all 0.2s"
                            _hover={{
                                bg: tabSelectedBgColor,
                                opacity: 0.8,
                            }}
                        >
                            Assets
                        </Tab>
                        <Tab
                            borderRadius="lg"
                            color={tabTextColor}
                            _selected={{
                                bg: tabSelectedBgColor,
                                color: tabTextSelectedColor,
                            }}
                            flex={1}
                            transition="all 0.2s"
                            _hover={{
                                bg: tabSelectedBgColor,
                                opacity: 0.8,
                            }}
                        >
                            NFTs
                        </Tab>
                        <Tab
                            borderRadius="lg"
                            color={tabTextColor}
                            _selected={{
                                bg: tabSelectedBgColor,
                                color: tabTextSelectedColor,
                            }}
                            flex={1}
                            transition="all 0.2s"
                            _hover={{
                                bg: tabSelectedBgColor,
                                opacity: 0.8,
                            }}
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
                        <NFTsTabPanel
                            onOpenReceiveModal={() =>
                                setCurrentContent('receive-token')
                            }
                        />
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <ActivityTabPanel />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    );
};
