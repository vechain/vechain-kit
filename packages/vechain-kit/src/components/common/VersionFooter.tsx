import { HStack, Link, StackProps } from '@chakra-ui/react';
import { VechainLogoHorizontal } from '../../assets';
import packageJson from '../../../package.json';
import { useVeChainKitConfig } from '@/providers';

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
            <VechainLogoHorizontal isDark={isDark} w={'69px'} opacity={0.4} />
            <Link
                fontSize={'11px'}
                fontWeight={'800'}
                opacity={0.4}
                textAlign={'left'}
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
                isExternal
            >
                v{packageJson.version}
            </Link>
        </HStack>
    );
};
