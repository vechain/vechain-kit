import fs from 'fs';
import path from 'path';

const sourcePath = path.join(__dirname, '../../typechain-types');
const targetPath = path.join(
    __dirname,
    '../../../packages/vechain-kit/src/contracts/typechain-types',
);

// List of Smart Contracts and Interfaces to copy to vechain-kit
const interfaces: string[] = ['INews'];
const contracts: string[] = ['News'];

const contractsPath = path.join('contracts');
const contractsInterfacesPath = path.join(contractsPath, 'interfaces');

const factoriesPath = path.join('factories', 'contracts');
const factoriesInterfacesPath = path.join(factoriesPath, 'interfaces');

const filesToCopy = [
    //Smart Contracts Types paths
    ...interfaces.map((sc_interface) => ({
        source: `${contractsInterfacesPath}/${sc_interface}.ts`,
        target: `${contractsInterfacesPath}/${sc_interface}.ts`,
    })),
    ...contracts.map((contract) => ({
        source: `${contractsPath}/${contract}.ts`,
        target: `${contractsPath}/${contract}.ts`,
    })),

    //Factories Types paths
    ...interfaces.map((sc_interface) => ({
        source: `${factoriesInterfacesPath}/${sc_interface}__factory.ts`,
        target: `${factoriesInterfacesPath}/${sc_interface}__factory.ts`,
    })),
    ...contracts.map((contract) => ({
        source: `${factoriesPath}/${contract}__factory.ts`,
        target: `${factoriesPath}/${contract}__factory.ts`,
    })),
];

function copySelectedFiles() {
    filesToCopy.forEach((file) => {
        const sourceFile = path.join(sourcePath, file.source);
        const targetFile = path.join(targetPath, file.target);

        if (!fs.existsSync(sourceFile)) {
            throw new Error(`Source file not found: '${file.source}'`);
        }

        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
            throw new Error(`Target directory not found: '${targetDir}'`);
        }

        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Copied ${file.source} to vechain-kit`);
    });
}

try {
    copySelectedFiles();
    process.stdout.write(
        '✅ Successfully copied files and interfaces to vechain-kit\n',
    );
} catch (error) {
    console.error('❌ Error copying files:', error);
    process.exit(1);
}
