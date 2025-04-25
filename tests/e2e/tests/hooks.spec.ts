import { test } from "../fixtures/fixtures";
import { HomePage } from "../models/HomePage";
import { DashboardPage } from "../models/DashboardPage";
import { veWorldMockClient } from "@vechain/veworld-mock-playwright";
import { expect } from "@playwright/test";
import { DENIAL_KITCHEN } from "../constants";

test.describe("Hooks", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)

        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet()
    })

    // smart account is not available on thor solo
    test.skip('Smart Account', async () => {
        const smartAcc = await dashboardPage.getSmartAccountInfo()
        expect.soft(smartAcc.address.length).toBeGreaterThan(0)
        expect.soft(smartAcc.isDeployed.length).toBeGreaterThan(0)
        expect.soft(smartAcc.b3trBalance.length).toBeGreaterThan(0)
    })

    test('Wallet', async () => {
        const wallet = await dashboardPage.getWalletAddress()
        expect(wallet.toLowerCase()).toBe(DENIAL_KITCHEN[0].toLowerCase())
    })

    test('Connection', async () => {
        const connection = await dashboardPage.getConnectionInfo()
        expect.soft(connection.type).toBe('wallet')
        expect.soft(connection.network).toBe('solo')
    })

    // requires voting round to be started
    test.skip('VeBetterDAO', async () => {
        const vbDAO = await dashboardPage.getVeBetterDAOInfo()
        expect.soft(vbDAO.roundId.length).toBeGreaterThan(0)
        expect.soft(vbDAO.gmNFT.length).toBeGreaterThan(0)
        expect.soft(vbDAO.participatedInGovernance).toBe('false')
        expect.soft(vbDAO.isPassportValid.length).toBeGreaterThan(0)
    })
})