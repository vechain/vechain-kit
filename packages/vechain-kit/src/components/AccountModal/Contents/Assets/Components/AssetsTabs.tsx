import {
    HStack,
    IconButton,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tooltip,
} from '@chakra-ui/react';
import { LuSettings } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export type AssetsTabIndex = 0 | 1;

type Props = {
    tabIndex: AssetsTabIndex;
    onTabChange: (index: AssetsTabIndex) => void;
    tokenPanel: React.ReactNode;
    stakingPanel: React.ReactNode;
    onManageTokens?: () => void;
};

export const AssetsTabs = ({
    tabIndex,
    onTabChange,
    tokenPanel,
    stakingPanel,
    onManageTokens,
}: Props) => {
    const { t } = useTranslation();

    return (
        <Tabs
            index={tabIndex}
            onChange={(idx) => onTabChange((idx as AssetsTabIndex) ?? 0)}
            variant="unstyled"
            isLazy
        >
            <HStack w="full" justify="space-between" align="center">
                <TabList>
                    <Tab fontWeight="600" fontSize="md">
                        {t('Token')}
                    </Tab>
                    <Tab fontWeight="600" fontSize="md">
                        {t('Staking')}
                    </Tab>
                </TabList>
                {tabIndex === 0 && onManageTokens && (
                    <Tooltip label={t('Manage Custom Tokens')}>
                        <IconButton
                            aria-label={t('Manage Custom Tokens')}
                            icon={<LuSettings />}
                            variant="ghost"
                            size="sm"
                            onClick={onManageTokens}
                        />
                    </Tooltip>
                )}
            </HStack>
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
