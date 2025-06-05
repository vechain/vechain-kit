/* eslint-disable no-console */
import { ethers } from 'hardhat';

interface DeployInstance {
    owner: any;
    otherAccount: any;
    otherAccounts: any[];
}

let cachedDeployInstance: DeployInstance | undefined = undefined;

export const getOrDeployContractInstances = async ({
    forceDeploy = false,
    printLogs = false,
}) => {
    if (!forceDeploy && cachedDeployInstance !== undefined) {
        return cachedDeployInstance;
    }
    printLogs && console.log('Deploying contract instances');

    const [owner, otherAccount, ...otherAccounts] = await ethers.getSigners();

    cachedDeployInstance = {
        owner,
        otherAccount,
        otherAccounts,
    };
    return cachedDeployInstance as DeployInstance;
};
