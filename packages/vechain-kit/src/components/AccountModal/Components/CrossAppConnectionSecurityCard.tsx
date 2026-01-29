import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    HStack,
    Text,
    Icon,
    Button,
    VStack,
    Center,
    Box,
} from '@chakra-ui/react';
import { LuExternalLink, LuUserCog, LuShieldCheck } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { useCrossAppConnectionCache } from '../../../hooks';
import { VEBETTERDAO_GOVERNANCE_BASE_URL } from '../../../constants';

export const CrossAppConnectionSecurityCard = () => {
    const { t } = useTranslation();

    const { getConnectionCache } = useCrossAppConnectionCache();

    const connectionCache = getConnectionCache();

    return (
        <Card variant="vechainKitBase" w="full">
            <CardHeader p={4} pl={6} borderBottomWidth="1px">
                <Text fontWeight="medium" opacity={0.8}>
                    {t('Security preferences')}
                </Text>

                <Text fontSize="xs" mt={1} opacity={0.7}>
                    {t(
                        'For security reasons, you can manage your embedded wallet settings only on the {{appName}} platform.',
                        {
                            appName:
                                connectionCache?.ecosystemApp.name ??
                                'origin app',
                        },
                    )}
                </Text>
            </CardHeader>

            <CardBody borderRadius={'none'}>
                <VStack spacing={3} align="stretch">
                    <HStack spacing={3} align="center">
                        <Center
                            w={'fit-content'}
                            h={'fit-content'}
                            p={2}
                            borderRadius="full"
                            bg="blackAlpha.100"
                            flexShrink={0}
                        >
                            <Icon as={LuUserCog} />
                        </Center>
                        <Box flex={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="shorter"
                            >
                                {t('Login methods')}
                            </Text>
                            <Text
                                fontSize="xs"
                                opacity={0.7}
                                lineHeight="shorter"
                            >
                                {t('Manage your login methods and passkeys')}
                            </Text>
                        </Box>
                    </HStack>

                    <HStack spacing={3} align="center">
                        <Center
                            w={'fit-content'}
                            h={'fit-content'}
                            p={2}
                            borderRadius="full"
                            bg="blackAlpha.100"
                            flexShrink={0}
                        >
                            <Icon as={LuShieldCheck} />
                        </Center>
                        <Box flex={1}>
                            <Text
                                fontSize="sm"
                                fontWeight="medium"
                                lineHeight="shorter"
                            >
                                {t('Security settings')}
                            </Text>
                            <Text
                                fontSize="xs"
                                opacity={0.7}
                                lineHeight="shorter"
                            >
                                {t(
                                    'Backup your wallet, configure MFA and set recovery options',
                                )}
                            </Text>
                        </Box>
                    </HStack>
                </VStack>
            </CardBody>

            <CardFooter>
                <Button
                    variant="vechainKitSecondary"
                    w="full"
                    onClick={() => {
                        window.open(
                            connectionCache?.ecosystemApp.website ??
                                VEBETTERDAO_GOVERNANCE_BASE_URL,
                            '_blank',
                        );
                    }}
                >
                    {t('Manage on {{appName}}', {
                        appName:
                            connectionCache?.ecosystemApp.name ?? 'origin app',
                    })}
                    <Icon as={LuExternalLink} ml={2} />
                </Button>
            </CardFooter>
        </Card>
    );
};
