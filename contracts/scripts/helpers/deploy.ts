import { ethers } from 'hardhat';

import { Logger } from './logger';
import { X2EarnAppsLight, News } from '../../typechain-types';

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

    logger.log('Deploying X2EarnApps contract');
    const X2EarnApps = await ethers.getContractFactory('X2EarnAppsLight');
    const x2EarnAppsContract = await X2EarnApps.deploy({ from: owner.address });
    await x2EarnAppsContract.waitForDeployment();
    const x2EarnAppsContractAddress = await x2EarnAppsContract.getAddress();
    logger.log('X2EarnApps contract deployed at: ', x2EarnAppsContractAddress);

    logger.log('Deploying News contract');
    const News = await ethers.getContractFactory('News');
    const newsContract = await News.deploy({ from: owner.address });
    await newsContract.waitForDeployment();
    const newsContractAddress = await newsContract.getAddress();
    logger.log('News contract deployed at: ', newsContractAddress);

    cachedDeployInstance = {
        owner,
        otherAccount,
        otherAccounts,
        x2EarnApps: x2EarnAppsContract,
        news: newsContract,
    };
    return cachedDeployInstance as DeployInstance;
};
