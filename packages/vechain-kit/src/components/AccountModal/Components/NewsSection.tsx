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
import { useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Import Swiper core and required modules
import { A11y, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

type Props = {
    mt?: number;
    setCurrentContent: React.Dispatch<
        React.SetStateAction<AccountModalContentTypes>
    >;
};

type NewsItem = {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
};

const mockNewsData: NewsItem[] = [
    {
        id: '1',
        title: 'Mugshot Mobile App',
        description:
            'Introducing a new mobile app for Mugshot. You can now track your assets on the go.',
        date: '28 may 2025',
        image: 'https://pbs.twimg.com/media/Gr4SkmUWoAE-Jli?format=jpg&name=small',
    },
    {
        id: '2',
        title: 'Vechain Partner',
        description:
            "Today, VeChain's cross-chain future moves a step closer. We are excited to announce the first full cross-chain bridging service coming to VeChain via a strategic partnership and integration with the VeChain Foundation.",
        date: '21 may 2025',
        image: 'https://pbs.twimg.com/media/GrepbRpW4AAXaFI?format=jpg&name=small',
    },
    {
        id: '3',
        title: 'B3TR Launchpool',
        description:
            "The VeChain Renaissance journey continues, and we're about to step into the most transformative phase yet: Hayabusa. Following Galactica's successful testnet launch, Hayabusa introduces a",
        date: '10 may 2025',
        image: 'https://pbs.twimg.com/media/GpT5u6yW0AEx1nS?format=jpg&name=small',
    },
];

const NewsCard = ({ item }: { item: NewsItem }) => {
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
                        {item.date}
                    </Text>
                </VStack>
            </CardBody>
        </Card>
    );
};

export const NewsSection = ({ mt }: Props) => {
    const { t } = useTranslation();
    const swiperRef = useRef<SwiperClass | null>(null);
    const [isSliderStart, setIsSliderStart] = useState(true);
    const [isSliderEnd, setIsSliderEnd] = useState(false);

    const slides = mockNewsData.map((item) => (
        <NewsCard key={item.id} item={item} />
    ));

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
