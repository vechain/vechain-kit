import {
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    VStack,
    Input,
    InputGroup,
    InputLeftElement,
    Grid,
    GridItem,
    ModalFooter,
    Text,
    Box,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import React, { useState, useMemo, useEffect } from 'react';
import {
    useCurrentAllocationsRoundId,
    useEcosystemShortcuts,
    useMostVotedAppsInRound,
    XAppMetadata,
} from '@/hooks';
import { useAppHubApps, AppHubApp } from '@/hooks';
import { AppComponent } from './Components/AppComponent';
import { CustomAppComponent } from './Components/CustomAppComponent';
import { ShortcutsSection } from './Components/ShortcutsSection';
import {
    CategoryFilterSection,
    CategoryFilter,
} from './Components/CategoryFilterSection';
import { AllowedCategories } from './Components/CategoryLabel';
import { useAccountModalOptions } from '@/hooks/modals/useAccountModalOptions';

export type EcosystemWithCategoryProps = {
    selectedCategory: CategoryFilter;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
    selectedCategory?: CategoryFilter;
};

// Mock data - Replace with real data from your API
const DEFAULT_APPS: XAppMetadata[] = [
    {
        name: 'VeBetterDAO',
        description: 'Engage, earn and prosper by doing sustainable actions.',
        external_url: 'https://governance.vebetterdao.org/',
        logo: 'https://i.ibb.co/cgJBj83/vbd.png',
        banner: 'https://i.ibb.co/cgJBj83/vbd.png',
        screenshots: [],
        social_urls: [],
        app_urls: [],
        tweets: [],
        ve_world: {
            banner: 'https://i.ibb.co/cgJBj83/vbd.png',
        },
        categories: [],
    },
    {
        name: 'vet.domains',
        description:
            '.vet.domains provides a unique and unchangeable identity for Vechain users by linking information to their wallet addresses. It becomes easier for people to use the blockchain by replacing complicated wallet addresses with easy-to-remember names.',
        external_url: 'https://vet.domains',
        logo: 'https://vet.domains/assets/walletconnect.png',
        banner: 'https://vet.domains/assets/walletconnect.png',
        screenshots: [],
        social_urls: [],
        app_urls: [],
        tweets: [],
        ve_world: {
            banner: 'https://vet.domains/assets/walletconnect.png',
        },
        categories: [],
    },
    // {
    //     name: 'VeChain Kit',
    //     description: 'A all-in-one library for building VeChain applications.',
    //     external_url: 'https://vechainkit.vechain.org/',
    //     logo: 'https://vechain.org/wp-content/uploads/2025/02/VeChain_Icon_Quartz_300ppi.png',
    //     banner: '',
    //     screenshots: [],
    //     social_urls: [],
    //     app_urls: [],
    //     tweets: [],
    //     ve_world: {
    //         banner: '',
    //     },
    // },
];

export const ExploreEcosystemContent = ({
    setCurrentContent,
    selectedCategory,
}: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const { isolatedView } = useAccountModalOptions();
    const [searchQuery, setSearchQuery] = useState('');

    // Initialize currentCategory with selectedCategory or null
    const [currentCategory, setCurrentCategory] = useState<CategoryFilter>(
        selectedCategory || null,
    );

    // Update currentCategory when selectedCategory changes
    useEffect(() => {
        if (selectedCategory !== undefined) {
            setCurrentCategory(selectedCategory);
        }
    }, [selectedCategory]);

    const { data: currentRoundId } = useCurrentAllocationsRoundId();
    const { data: vbdApps } = useMostVotedAppsInRound(
        currentRoundId ? (parseInt(currentRoundId) - 1).toString() : '1',
    );
    const {
        data: appHubApps,
        isLoading: appHubLoading,
        error: appHubError,
    } = useAppHubApps();

    // Extract unique categories from app hub apps and add VeBetter category
    const categories = useMemo(() => {
        const categorySet = new Set<AllowedCategories>();

        // Add VeBetter category if there are VBD apps and we're on mainnet
        if (network.type === 'main' && vbdApps && vbdApps.length > 0) {
            categorySet.add('vebetter');
        }

        // Add categories from app hub
        if (appHubApps) {
            appHubApps.forEach((app) => {
                if (app.category) {
                    categorySet.add(app.category);
                }
            });
        }

        return Array.from(categorySet).sort();
    }, [appHubApps, vbdApps, network.type]);

    // Only show VBD apps if we're on mainnet
    const isMainnet = network.type === 'main';

    // Filter VeBetterDAO apps based on search query
    const filteredVbdApps = isMainnet
        ? vbdApps.filter((dapp) =>
              dapp.app.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [];

    // Filter default apps based on search query
    const filteredDefaultApps = DEFAULT_APPS.filter((dapp) =>
        dapp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Filter App Hub apps based on search query and selected category
    const filteredAppHubApps =
        appHubApps?.filter(
            (app: AppHubApp) =>
                // Text search filter
                (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    app.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    app.tags.some((tag: string) =>
                        tag.toLowerCase().includes(searchQuery.toLowerCase()),
                    )) &&
                // Category filter
                (currentCategory === null || app.category === currentCategory),
        ) || [];

    // Determine which apps to display based on category filter
    const shouldShowDefaultApps = currentCategory === null;
    const shouldShowVbdApps =
        currentCategory === null || currentCategory === 'vebetter';

    const { shortcuts } = useEcosystemShortcuts();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (category: CategoryFilter) => {
        setCurrentCategory(category);
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{t('Ecosystem')}</ModalHeader>
                {!isolatedView && (
                    <ModalBackButton onClick={() => setCurrentContent('main')} />
                )}
                <ModalCloseButton />
            </StickyHeaderContainer>

            <ModalBody overflowY="auto" minH="300px">
                <VStack spacing={6} w="full">
                    <ShortcutsSection setCurrentContent={setCurrentContent} />

                    {shortcuts.length > 0 && (
                        <Text
                            fontSize="sm"
                            fontWeight="500"
                            w="full"
                            textAlign="left"
                        >
                            {t('All apps')}
                        </Text>
                    )}
                    <InputGroup size="lg">
                        <Input
                            placeholder={t('Search Apps')}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            bg={isDark ? '#00000038' : 'gray.50'}
                            borderRadius="xl"
                            height="56px"
                            pl={12}
                        />
                        <InputLeftElement h="56px" w="56px" pl={4}>
                            <LuSearch
                                color={isDark ? 'whiteAlpha.400' : 'gray.400'}
                            />
                        </InputLeftElement>
                    </InputGroup>

                    {/* Category filter section */}
                    {categories.length > 0 && (
                        <CategoryFilterSection
                            selectedCategory={currentCategory}
                            onCategoryChange={handleCategoryChange}
                            categories={categories}
                            darkMode={isDark}
                        />
                    )}

                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        {/* Default Apps */}
                        {shouldShowDefaultApps &&
                            filteredDefaultApps.length > 0 && (
                                <>
                                    {filteredDefaultApps.map((dapp) => (
                                        <GridItem key={dapp.name}>
                                            <CustomAppComponent
                                                name={dapp.name}
                                                image={dapp.logo}
                                                url={dapp.external_url}
                                                setCurrentContent={
                                                    setCurrentContent
                                                }
                                                description={dapp.description}
                                                selectedCategory={
                                                    currentCategory
                                                }
                                            />
                                        </GridItem>
                                    ))}
                                </>
                            )}

                        {/* VeBetterDAO Apps */}
                        {shouldShowVbdApps && filteredVbdApps.length > 0 && (
                            <>
                                {filteredVbdApps.map((dapp) => (
                                    <GridItem key={dapp.id}>
                                        <AppComponent
                                            xApp={dapp.app}
                                            setCurrentContent={
                                                setCurrentContent
                                            }
                                            selectedCategory={currentCategory}
                                        />
                                    </GridItem>
                                ))}
                            </>
                        )}

                        {/* App Hub Apps */}
                        {appHubLoading ? (
                            <GridItem colSpan={2}>
                                <Center py={4}>
                                    <Spinner />
                                </Center>
                            </GridItem>
                        ) : appHubError ? (
                            <GridItem colSpan={2}>
                                <Text color="red.500" textAlign="center">
                                    {t('Failed to load App Hub apps')}
                                </Text>
                            </GridItem>
                        ) : filteredAppHubApps.length > 0 ? (
                            filteredAppHubApps.map((app: AppHubApp) => (
                                <GridItem key={app.id}>
                                    <CustomAppComponent
                                        name={app.name}
                                        image={app.logo}
                                        url={app.url}
                                        setCurrentContent={setCurrentContent}
                                        description={app.description}
                                        category={app.category}
                                        selectedCategory={currentCategory}
                                    />
                                </GridItem>
                            ))
                        ) : (
                            currentCategory &&
                            !shouldShowVbdApps && (
                                <GridItem colSpan={2}>
                                    <Center py={4}>
                                        <Text>
                                            {t(
                                                'No apps found in this category',
                                            )}
                                        </Text>
                                    </Center>
                                </GridItem>
                            )
                        )}
                    </Grid>
                </VStack>
            </ModalBody>

            <ModalFooter pt={0} />
        </Box>
    );
};
