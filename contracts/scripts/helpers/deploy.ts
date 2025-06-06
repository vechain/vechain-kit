import { ethers } from 'hardhat';

import { Logger } from './logger';
import { deployProxy } from './upgrades';
import { X2EarnAppsLight, News } from '../../typechain-types';
const DEV_TESTNET_X2EARNAPPS_ADDRESS =
    '0xcB23Eb1bBD5c07553795b9538b1061D0f4ABA153';
interface DeployInstance {
    owner: any;
    otherAccount: any;
    otherAccounts: any[];
    x2EarnApps: X2EarnAppsLight;
    news: News;
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
    logger.info('Deploying contract instances');

    const [owner, otherAccount, ...otherAccounts] = await ethers.getSigners();

    logger.log('Deployer Address: ', owner.address);

    //Get X2EarnApps contract
    const x2EarnAppsContract = await ethers.getContractAt(
        'X2EarnAppsLight',
        DEV_TESTNET_X2EARNAPPS_ADDRESS,
    );

    logger.log('Deploying News contract');
    const cooldownPeriod = 100;

    const newsContract = (await deployProxy(
        'News',
        [
            DEV_TESTNET_X2EARNAPPS_ADDRESS,
            cooldownPeriod,
            owner.address,
            owner.address,
            owner.address,
        ],
        {},
        printLogs,
    )) as News;

    const newsContractAddress = await newsContract.getAddress();
    logger.log('News contract proxy deployed at: ', newsContractAddress);

    cachedDeployInstance = {
        owner,
        otherAccount,
        otherAccounts,
        x2EarnApps: x2EarnAppsContract,
        news: newsContract,
    };
    return cachedDeployInstance as DeployInstance;
};
