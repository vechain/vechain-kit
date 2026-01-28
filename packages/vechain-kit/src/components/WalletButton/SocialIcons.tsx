import { HStack, Circle, Icon, useMediaQuery } from '@chakra-ui/react';
import { useVeChainKitConfig } from '../../providers';
import { FcGoogle } from 'react-icons/fc';
import { FaDiscord, FaXTwitter } from 'react-icons/fa6';
import { LuPlus } from 'react-icons/lu';

export const SocialIcons = () => {
    const iconSize = 25;
    const { darkMode } = useVeChainKitConfig();
    const marginLeft = iconSize / 2;
    const [isSmallScreen] = useMediaQuery('(max-width: 280px)');
    const [isMediumScreen] = useMediaQuery('(max-width: 380px)');

    return (
        <HStack spacing={0} ml={0}>
            <Circle
                size={`${iconSize}px`}
                borderRadius="full"
                bg={'#F8F8F8'}
                p={2}
                alignItems="center"
                justifyContent="center"
                zIndex={3}
            >
                <Icon as={FcGoogle} fontSize={'20px'} />
            </Circle>
            {!isSmallScreen && (
                <Circle
                    ml={`-${marginLeft}px`}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={'black'}
                    p={2}
                    alignItems="center"
                    justifyContent="center"
                    zIndex={2}
                >
                    <Icon as={FaXTwitter} color={'white'} fontSize={'20px'} />
                </Circle>
            )}
            {!isSmallScreen && !isMediumScreen && (
                <Circle
                    ml={`-${marginLeft}px`}
                    zIndex={1}
                    size={`${iconSize}px`}
                    borderRadius="full"
                    bg={'#5865F2'}
                    p={2}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Icon as={FaDiscord} color={'white'} fontSize={'20px'} />
                </Circle>
            )}
            <Icon
                zIndex={1}
                as={LuPlus}
                color={darkMode ? 'black' : 'white'}
                fontSize={'15px'}
            />
        </HStack>
    );
};
