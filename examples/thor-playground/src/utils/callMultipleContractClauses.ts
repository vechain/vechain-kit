import { X2EarnApps__factory } from '@vechain/vechain-kit/contracts';
import { Thor } from './thorClient';
import type { Abi } from 'abitype';
import type { ViewFunctionResult } from './callContractClause';
import { getConfig } from '../config';


const thor = Thor.Mainnet;
const contract = thor.contracts.load(
  getConfig('main').x2EarnAppsContractAddress,
  X2EarnApps__factory.abi,
);

export const getXApps = async () => {
  const clauses = [contract.clause.unendorsedApps(), contract.clause.apps()];

  const res = await thor.transactions.executeMultipleClausesCall(clauses);
  if (!res.every((r) => r.success)) throw new Error(`Failed to fetch xApps`);

  const apps = res[0].result.plain as ViewFunctionResult<
    typeof X2EarnApps__factory.abi,
    'apps'
  >[0];

  const unendorsedApps = res[1].result.plain as ViewFunctionResult<
    typeof X2EarnApps__factory.abi,
    'unendorsedApps'
  >[0];

  console.log({ apps, unendorsedApps });

  const allApps = {};

  for (const app of apps) {
    allApps[app.id] = {
      id: app.id,
      teamWalletAddress: app.teamWalletAddress,
      name: app.name,
      metadataURI: app.metadataURI,
      createdAtTimestamp: app.createdAtTimestamp.toString(),
    };
  }
  for (const app of unendorsedApps) {
    allApps[app.id] = {
      id: app.id,
      teamWalletAddress: app.teamWalletAddress,
      name: app.name,
      metadataURI: app.metadataURI,
      createdAtTimestamp: app.createdAtTimestamp.toString(),
      appAvailableForAllocationVoting:
        app.appAvailableForAllocationVoting,
    };
  }

  return {
    allApps: Object.values(allApps),
    active: apps.map((app) => ({
      ...app,
      createdAtTimestamp: app.createdAtTimestamp.toString(),
    })),
    unendorsed: unendorsedApps.map((app) => ({
      ...app,
      createdAtTimestamp: app.createdAtTimestamp.toString(),
    })),
    endorsed: apps
      .filter(
        (app) =>
          !unendorsedApps.some(
            (unendorsedApp) => unendorsedApp.id === app.id,
          ),
      )
      .map((app) => ({
        ...app,
        createdAtTimestamp: app.createdAtTimestamp.toString(),
      })),
  };
};

await getXApps();
