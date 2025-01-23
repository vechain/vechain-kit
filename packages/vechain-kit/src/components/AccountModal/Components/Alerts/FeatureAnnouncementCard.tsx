import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    Badge,
    useColorModeValue,
    IconButton,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { IoCloseCircle } from 'react-icons/io5';
import { useFeatureAnnouncement } from '@/hooks/useFeatureAnnouncement';
import { AccountModalContentTypes } from '../../Types';

type FeatureAnnouncementCardProps = {
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};
export const FeatureAnnouncementCard = ({
    setCurrentContent,
}: FeatureAnnouncementCardProps) => {
    const { t } = useTranslation();
    const { isVisible, closeAnnouncement } = useFeatureAnnouncement();

    const titleColor = useColorModeValue('gray.800', 'whiteAlpha.900');

    const handleOnClick = () => {
        setCurrentContent('choose-name');
        closeAnnouncement();
    };

    if (!isVisible) return null;

    return (
        <Card
            w="full"
            variant={'featureAnnouncement'}
            overflow="hidden"
            mb={4}
            onClick={handleOnClick}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
        >
            <CardBody p={4}>
                <HStack justify="space-between" align="flex-start" spacing={3}>
                    <VStack align="flex-start" spacing={1}>
                        <HStack spacing={2}>
                            <Badge
                                colorScheme="red"
                                variant="subtle"
                                fontSize="xs"
                                px={2}
                                py={0.5}
                                borderRadius="full"
                            >
                                {t('New')}
                            </Badge>
                            <Text
                                fontSize="sm"
                                fontWeight="400"
                                color={titleColor}
                            >
                                {t('Claim your vet domain!')}
                            </Text>
                        </HStack>
                        <Text fontSize="xs" opacity={0.5}>
                            {t(
                                'Say goodbye to 0x addresses, claim your .veworld.vet subdomain now for free!',
                            )}
                        </Text>
                    </VStack>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        icon={<IoCloseCircle />}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeAnnouncement();
                        }}
                        aria-label={t('Close announcement')}
                    />
                </HStack>
            </CardBody>
        </Card>
    );
};
