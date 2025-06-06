import { ethers, network } from 'hardhat';

import { Logger } from './logger';
import { deployProxy } from './upgrades';
import { X2EarnAppsLight } from '../../typechain-types';
import { getConfig } from '../../config';
import { ZeroAddress } from 'ethers';

interface DeployInstance {
    owner: any;
    otherAccount: any;
    otherAccounts: any[];
    x2EarnApps: X2EarnAppsLight;
}

let cachedDeployInstance: DeployInstance | undefined = undefined;

export const getOrDeployContractInstances = async ({
    forceDeploy = false,
    printLogs = false,
}) => {
    if (!forceDeploy && cachedDeployInstance !== undefined) {
        return cachedDeployInstance;
    }
    const logger = new Logger(printLogs);
    const networkName = network.name;
    const config = getConfig(networkName);

    logger.info(`Getting or deploying contract instances on ${networkName}`);

    const [owner, otherAccount, ...otherAccounts] = await ethers.getSigners();

    logger.log('Deployer Address: ', owner.address);

    let x2EarnAppsContract: X2EarnAppsLight;
    let x2EarnAppsContractAddress = config.x2EarnAppsContractAddress;

    // Check if we should deploy fresh or use existing address
    if (x2EarnAppsContractAddress === ZeroAddress) {
        logger.log(
            'Deploying X2EarnApps from scratch (local/development network)',
        );
        x2EarnAppsContract = (await deployProxy(
            'X2EarnAppsLight',
            [owner.address, owner.address, owner.address],
            {},
            printLogs,
        )) as X2EarnAppsLight;

        x2EarnAppsContractAddress = await x2EarnAppsContract.getAddress();
        logger.log('X2EarnApps deployed at:', x2EarnAppsContractAddress);
    }

    x2EarnAppsContract = await ethers.getContractAt(
        'X2EarnAppsLight',
        x2EarnAppsContractAddress,
    );

    cachedDeployInstance = {
        owner,
        otherAccount,
        otherAccounts,
        x2EarnApps: x2EarnAppsContract,
    };
    return cachedDeployInstance as DeployInstance;
};
