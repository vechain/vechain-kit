import { test } from "../fixtures/fixtures"
import { expect } from "@playwright/test"
import { veWorldMockClient } from "@vechain/veworld-mock-playwright"
import { HomePage } from "../models/HomePage";
import { DashboardPage } from "../models/DashboardPage";
import {DENIAL_KITCHEN, PRIVY_TEST_EMAIL_SENDER} from "../constants";
import { trimAddress } from "../utils/strings";
import {AccountModal} from "../models/AccountModal";

test.describe.skip("Connect Wallet", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context, veWorldMockClient)
    })

    test('Can log in using VeWorld wallet and then log out', async () => {
        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet({ acceptTnc: true })
        await expect(homePage.acceptTncButton).toBeVisible({ visible: false })
        await expect(dashboardPage.walletAddress).toHaveText(trimAddress(DENIAL_KITCHEN[0]))
        await dashboardPage.openAccountModal()
        await accountModal.logOut()
        await expect(homePage.loginButton).toBeVisible()
        await homePage.assertSessionIsDeleted()
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

    test('Can log in using email and then log out', async () => {
        await homePage.open()
        await homePage.loginWithEmail({ email: PRIVY_TEST_EMAIL_SENDER, acceptTnc: true })
        await expect(homePage.acceptTncButton).toBeVisible({ visible: false })
        await expect(dashboardPage.walletButton).toBeVisible()
        await dashboardPage.openAccountModal()
        await accountModal.logOut()
        await expect(homePage.loginButton).toBeVisible()
        await homePage.assertSessionIsDeleted()
    })
})

test.describe.skip('Terms and Conditions', () => {
    let homePage: HomePage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context, veWorldMockClient)
    })

    test('Reject T&C and disconnect', async () => {
        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet({ acceptTnc: false })
        await accountModal.profile.disconnectButton.click()
        await expect(homePage.loginButton).toBeVisible()
        // TODO: uncomment after PR#280 is merged
        // await homePage.assertSessionIsDeleted()
    })
})