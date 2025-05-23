import { ThorClient } from "@vechain/sdk-network";

const MAINNET_URL = 'https://mainnet.vechain.org';
const TESTNET_URL = 'https://testnet.vechain.org';
const THOR_SOLO_URL = 'http://localhost:8669';

const thorSolo = ThorClient.at(THOR_SOLO_URL);
const thorTestnet = ThorClient.at(TESTNET_URL);
const thorMainnet = ThorClient.at(MAINNET_URL);

export const Thor = {
  Solo: thorSolo,
  Testnet: thorTestnet,
  Mainnet: thorMainnet,
}


