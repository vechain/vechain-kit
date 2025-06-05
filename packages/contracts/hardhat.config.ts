import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-truffle5";
import "@vechain/sdk-hardhat-plugin";
import "hardhat-contract-sizer";
import "hardhat-ignore-warnings";
import "solidity-coverage";
import "solidity-docgen";
import "hardhat-interface-generator";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
dotenv.config();

const VECHAIN_DERIVATION_PATH = "m/44'/818'/0'/0";

const getEnvMnemonic = () => {
  const mnemonic = process.env.MNEMONIC;

  return mnemonic ?? "";
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          evmVersion: "paris",
        },
      },
    ],
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  mocha: {
    timeout: 1800000,
  },
  gasReporter: {
    enabled: false,
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    vechain_solo: {
      url: "http://localhost:8669",
      accounts: {
        mnemonic: getEnvMnemonic(),
        count: 20,
        path: VECHAIN_DERIVATION_PATH,
      },
      gas: 10000000,
    },
    vechain_testnet: {
      url: "https://testnet.vechain.org",
      chainId: 100010,
      accounts: {
        mnemonic: getEnvMnemonic(),
        count: 20,
        path: VECHAIN_DERIVATION_PATH,
      },
      gas: 10000000,
    },
    vechain_mainnet: {
      url: "https://mainnet.vechain.org",
      chainId: 100009,
      accounts: {
        mnemonic: getEnvMnemonic(),
        count: 20,
        path: VECHAIN_DERIVATION_PATH,
      },
      gas: 10000000,
    },
  },
  docgen: {
    pages: "files",
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://sourcify.dev/server",
    browserUrl: "https://repo.sourcify.dev",
  }
};

export default config;
