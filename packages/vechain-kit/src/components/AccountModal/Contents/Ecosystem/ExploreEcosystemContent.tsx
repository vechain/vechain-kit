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
import { useState } from 'react';
import {
    useCurrentAllocationsRoundId,
    useEcosystemShortcuts,
    useMostVotedAppsInRound,
    XAppMetadata,
} from '@/hooks';
import { AppComponent } from './Components/AppComponent';
import { CustomAppComponent } from './Components/CustomAppComponent';
import { ShortcutsSection } from './Components/ShortcutsSection';

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
        external_url: 'https://sample-vechain-app-demo.vechain.org/',
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
    const { darkMode: isDark } = useVeChainKitConfig();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: currentRoundId } = useCurrentAllocationsRoundId();
    const { data: vbdApps } = useMostVotedAppsInRound(
        currentRoundId ? (parseInt(currentRoundId) - 1).toString() : '1',
    );

    const filteredDapps = vbdApps.filter((dapp) =>
        dapp.app.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const filteredDefaultApps = DEFAULT_APPS.filter((dapp) =>
        dapp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const { shortcuts } = useEcosystemShortcuts();

    return (
        <Box>
            <StickyHeaderContainer>
                <ModalHeader
                    fontSize={'md'}
                    fontWeight={'500'}
                    textAlign={'center'}
                    color={isDark ? '#dfdfdd' : '#4d4d4d'}
                >
                    {t('VeChain Ecosystem')}
                </ModalHeader>
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
                            placeholder={t('Search dApps')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            bg={isDark ? '#1a1a1a' : 'gray.50'}
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

            <ModalFooter />
        </Box>
    );
};
