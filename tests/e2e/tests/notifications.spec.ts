import { test } from "../fixtures/fixtures";
import { HomePage } from "../models/HomePage";
import { expect} from "@playwright/test";
import { DashboardPage } from "../models/DashboardPage";
import { veWorldMockClient} from "@vechain/veworld-mock-playwright";
import {AccountModal} from "../models/AccountModal";
import {AccountModalNotifications} from "../models/AccountModalNotifications";

test.describe.skip("Hooks", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal
    let notificationsPage: AccountModalNotifications

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context, veWorldMockClient)
        notificationsPage = new AccountModalNotifications(page)

        await homePage.open()
        await homePage.initVWMock(15)
        await homePage.connectWallet({ acceptTnc: true })
    })

    test('Can see a notification', async () => {
        await dashboardPage.openAccountModal()
        await accountModal.openNotifications()
        await notificationsPage.expectNotificationByTitle('Welcome to the VeChain')
    })

    test('Can archive a notification', async () => {
        await dashboardPage.openAccountModal()
        await accountModal.openNotifications()
        await notificationsPage.archiveNotification('Welcome to the VeChain')
        await expect(notificationsPage.notificationsList.nth(0)).toBeVisible({ visible: false })
        await notificationsPage.switchToView('archived')
        await notificationsPage.expectNotificationByTitle('Welcome to the VeChain')
    })
})