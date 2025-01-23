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
} from '@chakra-ui/react';
import { CiSearch } from 'react-icons/ci';
import { ModalBackButton, StickyHeaderContainer } from '@/components/common';
import { AccountModalContentTypes } from '../../Types';
import { useTranslation } from 'react-i18next';
import { useVeChainKitConfig } from '@/providers';
import { useState } from 'react';
import { useCurrentAllocationsRoundId, useMostVotedAppsInRound } from '@/hooks';
import { AppComponent } from './Components/AppComponent';
import { CustomAppComponent } from './Components/CustomAppComponent';
type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

// Mock data - Replace with real data from your API
const DEFAULT_APPS = [
    {
        id: 1,
        name: 'VeBetterDAO',
        image: 'https://i.ibb.co/cgJBj83/vbd.png',
        url: 'https://governance.vebetterdao.org/',
    },
    {
        id: 2,
        name: 'vetDomains',
        image: 'https://vet.domains/assets/walletconnect.png',
        url: 'https://vet.domains',
    },
];

export const EcosystemContent = ({ setCurrentContent }: Props) => {
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

    return (
        <>
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

            <ModalBody>
                <VStack spacing={6} w="full">
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
                        {DEFAULT_APPS.map((dapp) => (
                            <GridItem key={dapp.id}>
                                <CustomAppComponent
                                    name={dapp.name}
                                    image={dapp.image}
                                    url={dapp.url}
                                />
                            </GridItem>
                        ))}
                        {filteredDapps.map((dapp) => (
                            <GridItem key={dapp.id}>
                                <AppComponent xApp={dapp.app} />
                            </GridItem>
                        ))}
                    </Grid>
                </VStack>
            </ModalBody>

            <ModalFooter />
        </>
    );
};
