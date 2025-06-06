import {
    VStack,
    Heading,
    Box,
    IconButton,
    Card,
    CardBody,
    Text,
    Flex,
    Hide,
    Image,
} from '@chakra-ui/react';
import { AccountModalContentTypes } from '../Types';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Import Swiper core and required modules
import { A11y, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { useLatestNews } from '@/hooks/thor/contracts/News';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

const NewsCard = ({
    item,
}: {
    item: {
        id: bigint;
        title: string;
        description: string;
        image: string;
        callToActionUrl: string;
        timestamp: bigint;
        publisher: `0x${string}`;
    };
}) => {
    return (
        <Card
            variant={'newsCard'}
            borderRadius="xl"
            overflow="hidden"
            minH="200px"
            w="full"
            transition="all 0.3s ease"
            position="relative"
            cursor="pointer"
        >
            <Box position="relative" w="full" h="120px">
                <Image
                    src={item.image}
                    alt={item.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                />
            </Box>
            <CardBody p={4}>
                <VStack align="start" spacing={2} h="full">
                    <Heading size="sm" fontWeight="600" noOfLines={2}>
                        {item.title}
                    </Heading>
                    <Text
                        fontSize="xs"
                        lineHeight="1.4"
                        noOfLines={2}
                        opacity={0.8}
                    >
                        {item.description}
                    </Text>
                    <Text fontSize="xs" mt="auto" opacity={0.6}>
                        {new Date(
                            Number(item.timestamp) * 1000,
                        ).toLocaleDateString()}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
};

export const NewsSection = ({ mt }: Props) => {
    const { t } = useTranslation();
    const { data: news } = useLatestNews(10, 0);
    const swiperRef = useRef<SwiperClass | null>(null);
    const [isSliderStart, setIsSliderStart] = useState(true);
    const [isSliderEnd, setIsSliderEnd] = useState(false);

    const slides =
        news?.map((item) => (
            <NewsCard key={item.id.toString()} item={item} />
        )) || [];

    const handleSliderChange = (swiper: SwiperClass) => {
        setIsSliderStart(swiper.isBeginning);
        setIsSliderEnd(swiper.isEnd);
    };

    return (
        <VStack w={'full'} mt={mt} spacing={4}>
            <Flex w="full" justify="space-between" align="center">
                <Heading size={'xs'} fontWeight={'500'} opacity={0.5}>
                    {t('News')}
                </Heading>
                <Text
                    fontSize="xs"
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                >
                    {t('See all')}
                </Text>
            </Flex>

            <Box position="relative" w="full">
                <Swiper
                    modules={[A11y, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={true}
                    scrollbar={{ draggable: true }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={handleSliderChange}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide
                            key={`slide-${index}`}
                            className="slide"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                            }}
                        >
                            {slide}
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation Buttons */}
                    <Hide below="md">
                        {!isSliderStart && (
                            <IconButton
                                pos={'absolute'}
                                zIndex={5}
                                variant={'primarySubtle'}
                                left={5}
                                top={'50%'}
                                icon={<FaChevronLeft />}
                                onClick={() => swiperRef.current?.slidePrev()}
                                aria-label="Prev slide"
                            />
                        )}
                    </Hide>
                    <Hide below="md">
                        {!isSliderEnd && slides.length > 1 && (
                            <IconButton
                                pos={'absolute'}
                                zIndex={5}
                                variant={'primarySubtle'}
                                right={5}
                                top={'50%'}
                                icon={<FaChevronRight />}
                                onClick={() => swiperRef.current?.slideNext()}
                                aria-label="Next slide"
                            />
                        )}
                    </Hide>
                </Swiper>
            </Box>
        </VStack>
    );
};
