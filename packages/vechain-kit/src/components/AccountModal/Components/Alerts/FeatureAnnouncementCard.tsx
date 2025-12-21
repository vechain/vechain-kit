import {
    Card,
    CardBody,
    HStack,
    VStack,
    Text,
    useToken,
    IconButton,
    Tag,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuCircleX } from 'react-icons/lu';
import { useFeatureAnnouncement } from '@/hooks/utils/useFeatureAnnouncement';
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

    const titleColor = useToken('colors', 'vechain-kit-text-primary');
    const descriptionColor = useToken('colors', 'vechain-kit-text-secondary');

    const handleOnClick = () => {
        setCurrentContent({
            type: 'choose-name',
            props: {
                setCurrentContent,
                onBack: () => setCurrentContent('main'),
                initialContentSource: 'main',
            },
        });
        closeAnnouncement();
    };

    // We always show the announcement card for now
    // if (!isVisible) return null;

    return (
        <Card
            w="full"
            variant={'featureAnnouncement'}
            overflow="hidden"
            onClick={handleOnClick}
            cursor="pointer"
            _hover={{ opacity: 0.8 }}
        >
            <CardBody p={4}>
                <HStack justify="space-between" align="flex-start" spacing={3}>
                    <VStack align="flex-start" spacing={1}>
                        <HStack spacing={2}>
                            <Text
                                fontSize="sm"
                                fontWeight="400"
                                color={titleColor}
                            >
                                {t('Claim your vet domain!')}
                            </Text>
                            <Tag size="sm" colorScheme="red">
                                {t('New')}
                            </Tag>
                        </HStack>
                        <Text fontSize="xs" color={descriptionColor}>
                            {t(
                                'Say goodbye to 0x addresses, claim your .veworld.vet subdomain now for free!',
                            )}
                        </Text>
                    </VStack>
                    {/* <IconButton
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        icon={<LuCircleX />}
                        onClick={(e) => {
                            e.stopPropagation();
                            closeAnnouncement();
                        }}
                        aria-label={t('Close announcement')}
                    /> */}
                </HStack>
            </CardBody>
        </Card>
    );
};
