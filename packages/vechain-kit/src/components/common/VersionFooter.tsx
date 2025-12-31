import { HStack, Link, StackProps } from '@chakra-ui/react';
import { VechainLogo } from '../../assets';
import packageJson from '../../../package.json';
import { useVeChainKitConfig } from '@/providers';
import { VECHAIN_KIT_RELEASES_TAG_BASE_URL } from '@/constants';

type Props = {} & Omit<StackProps, 'dangerouslySetInnerHTML'>;

export const VersionFooter = ({ ...props }: Props) => {
    const { darkMode: isDark } = useVeChainKitConfig();

    return (
        <HStack
            w={'full'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={0}
            {...props}
        >
            <VechainLogo
                isDark={isDark}
                w={'70px'}
                h={'auto'}
                opacity={0.4}
                mr={1}
                ml={'-16px'}
            />
            <Link
                fontSize={'11px'}
                fontWeight={'500'}
                opacity={0.4}
                textAlign={'left'}
                href={new URL(
                    `/${packageJson.version}`,
                    VECHAIN_KIT_RELEASES_TAG_BASE_URL,
                ).toString()}
                isExternal
                pt={'1px'}
            >
                v{packageJson.version}
            </Link>
        </HStack>
    );
};
