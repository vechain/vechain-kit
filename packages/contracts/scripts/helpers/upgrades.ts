import { BaseContract, Interface } from 'ethers';
import { ethers } from 'hardhat';
import { getImplementationAddress } from '@openzeppelin/upgrades-core';
import { compareAddresses } from './utils';
import { DeployUpgradeOptions } from './type';
import { Logger } from './logger';

export const deployProxy = async (
    contractName: string,
    args: any[],
    libraries: { [libraryName: string]: string } = {},
    logOutput: boolean = false,
    version?: number,
): Promise<BaseContract> => {
    // Deploy the implementation contract
    const Contract = await ethers.getContractFactory(contractName, {
        libraries: libraries,
    });
    const implementation = await Contract.deploy();
    await implementation.waitForDeployment();

    const logger = new Logger(logOutput);
    logger.log(`${contractName} impl.: ${await implementation.getAddress()}`);

    // Deploy the proxy contract, link it to the implementation and call the initializer
    const proxyFactory = await ethers.getContractFactory('ContractProxy');
    const proxy = await proxyFactory.deploy(
        await implementation.getAddress(),
        getInitializerData(Contract.interface, args, version),
    );
    await proxy.waitForDeployment();
    logger.log(`${contractName} proxy: ${await proxy.getAddress()}`);

    const newImplementationAddress = await getImplementationAddress(
        ethers.provider,
        await proxy.getAddress(),
    );
    if (
        !compareAddresses(
            newImplementationAddress,
            await implementation.getAddress(),
        )
    ) {
        throw new Error(
            `The implementation address is not the one expected: ${newImplementationAddress} !== ${await implementation.getAddress()}`,
        );
    }

    // Return an instance of the contract using the proxy address
    return Contract.attach(await proxy.getAddress());
};

export const deployProxyOnly = async (
    contractName: string,
    libraries: { [libraryName: string]: string } = {},
    logOutput: boolean = false,
): Promise<string> => {
    // Deploy the implementation contract
    const Contract = await ethers.getContractFactory(contractName, {
        libraries: libraries,
    });
    const implementation = await Contract.deploy();
    await implementation.waitForDeployment();
    const logger = new Logger(logOutput);
    logger.log(`${contractName} impl.: ${await implementation.getAddress()}`);

    // Deploy the proxy contract without initialization
    const proxyFactory = await ethers.getContractFactory('B3TRProxy');
    const proxy = await proxyFactory.deploy(
        await implementation.getAddress(),
        '0x',
    );
    await proxy.waitForDeployment();
    logger.log(`${contractName} proxy: ${await proxy.getAddress()}`);

    const newImplementationAddress = await getImplementationAddress(
        ethers.provider,
        await proxy.getAddress(),
    );
    if (
        !compareAddresses(
            newImplementationAddress,
            await implementation.getAddress(),
        )
    ) {
        throw new Error(
            `The implementation address is not the one expected: ${newImplementationAddress} !== ${await implementation.getAddress()}`,
        );
    }

    // Return the proxy address
    return await proxy.getAddress();
};

export const initializeProxy = async (
    proxyAddress: string,
    contractName: string,
    args: any[],
    libraries: { [libraryName: string]: string } = {},
    version?: number,
): Promise<BaseContract> => {
    // Get the ContractFactory
    const Contract = await ethers.getContractFactory(contractName, {
        libraries: libraries,
    });

    // Prepare the initializer data using getInitializerData
    const initializerData = getInitializerData(
        Contract.interface,
        args,
        version,
    );

    // Interact with the proxy contract to call the initializer using the prepared initializer data
    const signer = (await ethers.getSigners())[0];
    const tx = await signer.sendTransaction({
        to: proxyAddress,
        data: initializerData,
    });
    await tx.wait();

    // Return an instance of the contract using the proxy address
    return Contract.attach(proxyAddress);
};

export const upgradeProxy = async (
    previousVersionContractName: string,
    newVersionContractName: string,
    proxyAddress: string,
    args: any[] = [],
    options?: {
        version?: number;
        libraries?: { [libraryName: string]: string };
        logOutput?: boolean;
    },
): Promise<BaseContract> => {
    // Deploy the implementation contract
    const Contract = await ethers.getContractFactory(newVersionContractName, {
        libraries: options?.libraries,
    });
    const implementation = await Contract.deploy();
    await implementation.waitForDeployment();

    const currentImplementationContract = await ethers.getContractAt(
        previousVersionContractName,
        proxyAddress,
    );

    const logger = new Logger(!!options?.logOutput);
    logger.log(
        `${newVersionContractName} impl.: ${await implementation.getAddress()}`,
    );

    const tx = await currentImplementationContract.upgradeToAndCall(
        await implementation.getAddress(),
        args.length > 0
            ? getInitializerData(Contract.interface, args, options?.version)
            : '0x',
    );
    await tx.wait();
    const newImplementationAddress = await getImplementationAddress(
        ethers.provider,
        proxyAddress,
    );
    if (
        !compareAddresses(
            newImplementationAddress,
            await implementation.getAddress(),
        )
    ) {
        throw new Error(
            `The implementation address is not the one expected: ${newImplementationAddress} !== ${await implementation.getAddress()}`,
        );
    }
    return Contract.attach(proxyAddress);
};

export const deployAndUpgrade = async (
    contractNames: string[],
    args: any[][],
    options: DeployUpgradeOptions,
): Promise<BaseContract> => {
    if (contractNames.length === 0) throw new Error('No contracts to deploy');

    if (contractNames.length !== args.length)
        throw new Error(
            'Contract names and arguments must have the same length',
        );

    if (options.libraries && contractNames.length !== options.libraries.length)
        throw new Error(
            'Contract names and libraries must have the same length',
        );

    if (options.versions && contractNames.length !== options.versions.length)
        throw new Error(
            'Contract names and versions must have the same length',
        );

    // 1. Deploy proxy and first implementation
    const contractName = contractNames[0];
    const contractArgs = args[0];

    let proxy = await deployProxy(
        contractName,
        contractArgs,
        options?.libraries?.[0],
        options.logOutput,
        options.versions?.[0],
    );

    // 2. Upgrade the proxy to the next versions
    for (let i = 1; i < contractNames.length; i++) {
        const previousVersionContractName = contractNames[i - 1];
        const newVersionContractName = contractNames[i];
        const contractArgs = args[i];

        proxy = await upgradeProxy(
            previousVersionContractName,
            newVersionContractName,
            await proxy.getAddress(),
            contractArgs,
            {
                version: options.versions?.[i],
                libraries: options.libraries?.[i],
                logOutput: options.logOutput,
            },
        );
    }

    return proxy;
};

export function getInitializerData(
    contractInterface: Interface,
    args: any[],
    version?: number,
) {
    const initializer = version ? `initializeV${version}` : 'initialize';

    const fragment = contractInterface.getFunction(initializer);
    if (!fragment) {
        throw new Error(`Contract initializer not found`);
    }
    return contractInterface.encodeFunctionData(fragment, args);
}
