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
} from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import React, { useState, useEffect } from 'react';
import {
    useCurrentAllocationsRoundId,
    useEcosystemShortcuts,
    useMostVotedAppsInRound,
    XAppMetadata,
} from '@/hooks';
import { AppComponent } from './Components/AppComponent';
import { CustomAppComponent } from './Components/CustomAppComponent';
import { ShortcutsSection } from './Components/ShortcutsSection';
import { Analytics } from '@/utils/mixpanelClientInstance';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
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
    },
    {
        name: 'VeChain Kit',
        description: 'A all-in-one library for building VeChain applications.',
        external_url: 'https://vechainkit.vechain.org/',
        logo: 'https://i.ibb.co/ncysMF9/vechain-kit-logo-transparent.png',
        banner: '',
        screenshots: [],
        social_urls: [],
        app_urls: [],
        tweets: [],
        ve_world: {
            banner: '',
        },
    },
];

export const ExploreEcosystemContent = ({ setCurrentContent }: Props) => {
    const { t } = useTranslation();
    const { darkMode: isDark, network } = useVeChainKitConfig();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: currentRoundId } = useCurrentAllocationsRoundId();
    const { data: vbdApps } = useMostVotedAppsInRound(
        currentRoundId ? (parseInt(currentRoundId) - 1).toString() : '1',
    );

    useEffect(() => {
        Analytics.ecosystem.buttonClicked();
    }, []);

    // Only show VBD apps if we're on mainnet
    const isMainnet = network.type === 'main';
    const filteredDapps = isMainnet
        ? vbdApps.filter((dapp) =>
              dapp.app.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : [];

    const filteredDefaultApps = DEFAULT_APPS.filter((dapp) =>
        dapp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ).map((dapp) => {
        if (dapp.logoComponent) {
            return {
                ...dapp,
                logoComponent: React.cloneElement(dapp.logoComponent, {
                    isDark,
                }),
            };
        }
        return dapp;
    });

    const { shortcuts } = useEcosystemShortcuts();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query) {
            Analytics.ecosystem.searchPerformed(
                query,
                filteredDefaultApps.length + filteredDapps.length,
            );
        }
    };

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader>{t('Ecosystem')}</ModalHeader>
                <ModalBackButton onClick={() => setCurrentContent('main')} />
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
                            <CiSearch
                                color={isDark ? 'whiteAlpha.400' : 'gray.400'}
                            />
                        </InputLeftElement>
                    </InputGroup>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        {filteredDefaultApps.map((dapp) => (
                            <GridItem key={dapp.name}>
                                <CustomAppComponent
                                    name={dapp.name}
                                    image={dapp.logo}
                                    url={dapp.external_url}
                                    setCurrentContent={setCurrentContent}
                                    description={dapp.description}
                                    {...(dapp.logoComponent && {
                                        logoComponent: dapp.logoComponent,
                                    })}
                                />
                            </GridItem>
                        ))}
                        {filteredDapps.map((dapp) => (
                            <GridItem key={dapp.id}>
                                <AppComponent
                                    xApp={dapp.app}
                                    setCurrentContent={setCurrentContent}
                                />
                            </GridItem>
                        ))}
                    </Grid>
                </VStack>
            </ModalBody>

            <ModalFooter pt={0} />
        </Box>
    );
};
