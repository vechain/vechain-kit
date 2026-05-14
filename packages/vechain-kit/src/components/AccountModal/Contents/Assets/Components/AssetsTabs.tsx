import {
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export type AssetsTabIndex = 0 | 1;

type Props = {
    tabIndex: AssetsTabIndex;
    onTabChange: (index: AssetsTabIndex) => void;
    tokenPanel: React.ReactNode;
    stakingPanel: React.ReactNode;
};

export const AssetsTabs = ({
    tabIndex,
    onTabChange,
    tokenPanel,
    stakingPanel,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Tabs
            index={tabIndex}
            onChange={(idx) => onTabChange((idx as AssetsTabIndex) ?? 0)}
            variant="unstyled"
            isLazy
        >
            <TabList>
                <Tab fontWeight="600" fontSize="md">
                    {t('Token')}
                </Tab>
                <Tab fontWeight="600" fontSize="md">
                    {t('Staking')}
                </Tab>
            </TabList>
            <TabIndicator mt="-2px" height="2px" bg="vechain-kit-accent" />

            <TabPanels>
                <TabPanel px={0} pt={4}>
                    {tokenPanel}
                </TabPanel>
                <TabPanel px={0} pt={4}>
                    {stakingPanel}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
