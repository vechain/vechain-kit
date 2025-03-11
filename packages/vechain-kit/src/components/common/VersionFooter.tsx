import { HStack, Link, StackProps } from '@chakra-ui/react';
import { VechainLogo } from '../../assets';
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
                href={`https://github.com/vechain/vechain-kit/releases/tag/${packageJson.version}`}
                isExternal
                pt={'1px'}
            >
                v{packageJson.version}
            </Link>
        </HStack>
    );
};
