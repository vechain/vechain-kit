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
import { FaExternalLinkAlt } from 'react-icons/fa';
import { GrUserAdmin } from 'react-icons/gr';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

export const VeBetterDAOSecurityCard = () => {
    const { t } = useTranslation();

    return (
        <Card variant="vechainKitBase" w="full">
            <CardHeader p={4} pl={6} borderBottomWidth="1px">
                <Text fontWeight="medium" opacity={0.8}>
                    {t('Security preferences')}
                </Text>

                <Text fontSize="xs" mt={1} opacity={0.7}>
                    {t(
                        'For security reasons, you can manage your embedded wallet settings only on the {{appName}} platform.',
                        { appName: 'VeBetterDAO' },
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
                            _dark={{ bg: 'blackAlpha.100' }}
                            flexShrink={0}
                        >
                            <Icon as={GrUserAdmin} />
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
                            _dark={{ bg: 'blackAlpha.100' }}
                            flexShrink={0}
                        >
                            <Icon as={HiOutlineShieldCheck} />
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
                            'https://governance.vebetterdao.org/',
                            '_blank',
                        );
                    }}
                >
                    {t('Manage on VeBetterDAO')}
                    <Icon as={FaExternalLinkAlt} ml={2} />
                </Button>
            </CardFooter>
        </Card>
    );
};
