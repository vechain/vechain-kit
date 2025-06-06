import { network } from 'hardhat';
import { HttpNetworkConfig } from 'hardhat/types';

import { getOrDeployContractInstances } from '../helpers';

/**
 * Deploys all the contracts
 * @param config  The contracts configuration
 * @param printLogs  Whether to print logs
 * @returns  The deployed contracts
 */
export async function deployAll() {
    const start = performance.now();
    const networkConfig = network.config as HttpNetworkConfig;
    console.log(
        `================  Deploying contracts on ${network.name} (${networkConfig.url}) `,
    );

    const deployResult = await getOrDeployContractInstances({
        forceDeploy: true,
        printLogs: true,
    });

    const contractAddresses = {
        x2EarnApps: await deployResult.x2EarnApps.getAddress(),
        news: await deployResult.news.getAddress(),
    };

    console.log(
        '================================================================================',
    );

    const end = new Date(performance.now() - start);
    console.log(
        `Total execution time: ${end.getMinutes()}m ${end.getSeconds()}s`,
    );

    return contractAddresses;
}
