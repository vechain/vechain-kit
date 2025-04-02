import { getConfig } from '@/config';
import { VoterRewards__factory } from '@/contracts';
import { getCallKey, useCall } from '@/hooks';
import { useVeChainKitConfig } from '@/providers';
import { Interface } from 'ethers';

const contractInterface =
    VoterRewards__factory.createInterface() as Interface & {
        abi: readonly any[];
    };
contractInterface.abi = VoterRewards__factory.abi;
const method = 'levelToMultiplier';

export const getLevelMultiplierQueryKey = (level?: string) =>
    getCallKey({ method, keyArgs: [level] });

const percentageToMultiplier = (percentage: number) => 1 + percentage / 100;

export const useLevelMultiplier = (level: string, enabled = true) => {
    const { network } = useVeChainKitConfig();
    const contractAddress = getConfig(network.type).voterRewardsContractAddress;

    return useCall({
        contractInterface,
        contractAddress,
        method,
        args: [level],
        enabled: !!level && enabled && !!network.type,
        mapResponse: (res) => percentageToMultiplier(Number(res.decoded[0])),
    });
};
