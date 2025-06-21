import { network } from 'hardhat';
import { HttpNetworkConfig } from 'hardhat/types';

import { deployProxy, getOrDeployContractInstances } from '../helpers';
import { Logger } from '../helpers/logger';
import { News } from '../../typechain-types';

/**
 * Deploys all the contracts
 * @param config  The contracts configuration
 * @param printLogs  Whether to print logs
 * @returns  The deployed contracts
 */
export async function deployAll() {
    const printLogs = true;
    const logger = new Logger(printLogs);
    const start = performance.now();
    const networkConfig = network.config as HttpNetworkConfig;
    logger.log(
        `================  Deploying contracts on ${network.name} (${networkConfig.url}) `,
    );

    const deployResult = await getOrDeployContractInstances({
        forceDeploy: false, // Let the helper decide based on network
        printLogs,
    });

    const contractAddresses = {
        x2EarnApps: await deployResult.x2EarnApps.getAddress(),
    };

    logger.log('Deploying News contract');
    const cooldownPeriod = 100; //Should move to a config file

    const newsContract = (await deployProxy(
        'News',
        [
            contractAddresses.x2EarnApps,
            cooldownPeriod,
            deployResult?.owner.address,
            deployResult?.owner.address,
            deployResult?.owner.address,
        ],
        {},
        printLogs,
    )) as News;

    const newsContractAddress = await newsContract.getAddress();
    logger.log('News contract proxy deployed at: ', newsContractAddress);

    logger.log(
        '================================================================================',
    );

    const end = new Date(performance.now() - start);
    logger.log(
        `Total execution time: ${end.getMinutes()}m ${end.getSeconds()}s`,
    );

    return contractAddresses;
}
