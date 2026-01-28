import {
    Card,
    CardBody,
    Grid,
    GridItem,
    Image,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEcosystemShortcuts } from '@/hooks';
import { AccountModalContentTypes } from '@/components/AccountModal/Types';
import { useTranslation } from 'react-i18next';
import { notFoundImage } from '../../../../../utils';

type Props = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

export const ShortcutsSection = ({}: Props) => {
    const { t } = useTranslation();
    const { shortcuts } = useEcosystemShortcuts();

    if (shortcuts.length === 0) return null;

    return (
        <VStack w="full" align="flex-start" spacing={2}>
            <Text fontSize="sm" fontWeight="500">
                {t('Shortcuts')}
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} w="full">
                {shortcuts.map((shortcut) => (
                    <GridItem key={shortcut.url}>
                        <Card
                            _hover={{ opacity: 0.8 }}
                            cursor="pointer"
                            onClick={() => window.open(shortcut.url, '_blank')}
                        >
                            <CardBody p={2} alignItems="center">
                                <Image
                                    src={shortcut.image}
                                    fallbackSrc={notFoundImage}
                                    alt={shortcut.name}
                                    objectFit="contain"
                                    rounded="full"
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                ))}
            </Grid>
        </VStack>
    );
};
