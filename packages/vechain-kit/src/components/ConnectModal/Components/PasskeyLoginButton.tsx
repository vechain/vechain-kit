import { GridItem } from '@chakra-ui/react';
import { useLoginWithPasskey } from '@privy-io/react-auth';
import { IoIosFingerPrint } from 'react-icons/io';
import { ConnectionButton } from '@/components';

type Props = {
    isDark: boolean;
};

export const PasskeyLoginButton = ({ isDark }: Props) => {
    const { loginWithPasskey } = useLoginWithPasskey();

    const handleLoginWithPasskey = async () => {
        try {
            await loginWithPasskey();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <GridItem colSpan={1} w={'full'}>
            <ConnectionButton
                isDark={isDark}
                onClick={handleLoginWithPasskey}
                icon={IoIosFingerPrint}
            />
        </GridItem>
    );
};
