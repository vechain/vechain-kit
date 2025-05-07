import { test } from "../fixtures/fixtures"
import { expect } from "@playwright/test"
import { veWorldMockClient } from "@vechain/veworld-mock-playwright"
import { HomePage } from "../models/HomePage";
import { DashboardPage } from "../models/DashboardPage";
import {DENIAL_KITCHEN, HOMEPAGE, PRIVY_TEST_EMAIL_SENDER} from "../constants";
import { trimAddress } from "../utils/strings";
import {AccountModal} from "../models/AccountModal";

test.describe("Connect Wallet", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context, veWorldMockClient)
    })

    test('Can log in using VeWorld wallet and then log out', async ({ page }) => {
        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet()
        await expect(dashboardPage.walletAddress).toHaveText(trimAddress(DENIAL_KITCHEN[0]))
        await dashboardPage.openAccountModal()
        await accountModal.logOut()
        await expect(homePage.loginButton).toBeVisible()
        const storagePostLogout = await page.evaluate(() => { return localStorage });
        expect(storagePostLogout).not.toHaveProperty("dappkit@vechain/connectionCertificate")
    })
})

test.describe.skip("Privy", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context, veWorldMockClient)
    })

    test('Can log in using email and then log out', async ({ page }) => {
        await homePage.open()
        await homePage.loginWithEmail(PRIVY_TEST_EMAIL_SENDER)
        await expect(dashboardPage.walletButton).toBeVisible()
        await dashboardPage.openAccountModal()
        await accountModal.logOut()
        await expect(homePage.loginButton).toBeVisible()
        const isSessionDeleted = await page.evaluate(() =>
            Object.keys(localStorage).some(key => key.includes('privy_wallet:'))
        );
        expect(isSessionDeleted).toBeTruthy()
    })
})