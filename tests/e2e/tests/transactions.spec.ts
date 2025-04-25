import { test } from "../fixtures/fixtures"
import { expect } from "@playwright/test"
import { veWorldMockClient } from "@vechain/veworld-mock-playwright"
import { HomePage } from "../models/HomePage";
import { DashboardPage } from "../models/DashboardPage";
import {
    PRIVY_TEST_EMAIL_SENDER,
    PRIVY_TEST_EMAIL_RECEIVER,
    VW_RECIPIENT_ALIAS,
    DENIAL_KITCHEN,
} from "../constants";
import {AccountModal} from "../models/AccountModal";
import {AuthArgs, AuthType} from "../models/types";

for (const authType of [
    'veworld',
    // 'privy'
]) {
    test.describe("Demo transactions", () => {
        let homePage: HomePage
        let dashboardPage: DashboardPage
        // let accountModal: AccountModal

        test.beforeEach(async ({ page, context }) => {
            homePage = new HomePage(page, context, veWorldMockClient)
            dashboardPage = new DashboardPage(page, context, veWorldMockClient)
            // accountModal = new AccountModal(page, context)

            await homePage.open()
            if (authType === 'veworld') {
                await homePage.initVWMock(0)
                await homePage.connectWallet()
            } else if (authType === 'privy') {
                await homePage.loginWithEmail(PRIVY_TEST_EMAIL_SENDER)
            } else {
                throw new Error(`Invalid auth type: "${authType}"`)
            }
            await expect(dashboardPage.walletButton).toBeVisible()
        })

        test('tx with toast', async () => {
            await dashboardPage.sendTxWithToast()
            await expect(dashboardPage.successIconToast).toBeVisible()
        })

        test('tx with modal', async () => {
            await dashboardPage.sendTxWithModal()
            await expect(dashboardPage.successIconModal).toBeVisible()
        })

        test('sign message', async () => {
            await dashboardPage.signMessage()
            await expect(dashboardPage.messageSignatureCodeBox).not.toBeEmpty()
            await expect(dashboardPage.successToastTitle('Message signed!')).toBeVisible()
        })

        // enable after this is merged and new version of vwmock is published:
        // https://github.com/vechain/veworld-mock/pull/22
        test.skip('sign typed data', async () => {
            await dashboardPage.signTypedData()
            await expect(dashboardPage.typedDataSignatureCodeBox).not.toBeEmpty()
            await expect(dashboardPage.successToastTitle('Typed data signed!')).toBeVisible()
        })
    })
}

for (const authType of [
    'veworld',
    // 'privy'
] as AuthType[]) {
    test.describe.serial("Wallet-to-wallet transactions", () => {
        let homePage: HomePage
        let dashboardPage: DashboardPage
        let accountModal: AccountModal

        /**
         * Authenticates user with either veworld wallet or email.
         * @param args
         *  @param {string} args.authType - either 'veworld' or 'privy'
         *  @param {number} args.accountIndex - child node index of the "denial kitchen pet" wallet;
         *  has to be specified if @args.authType is 'veworld', otherwise - optional and is ignored even if specified
         *  @param {string} args.email - email address to log in using Privy
         *  has to specified if @args.authType is 'privy', otherwise - optional and is ignored even if specified
         */
        const logIn = async (args: AuthArgs) => {
            if (args.authType === 'veworld') {
                await homePage.initVWMock(args.accountIndex)
                await homePage.connectWallet()
            } else if (args.authType === 'privy') {
                await homePage.loginWithEmail(args.email)
            } else {
                throw new Error(`Invalid auth type: "${authType}"`)
            }
            await expect(dashboardPage.walletButton).toBeVisible()
        }

        test.beforeEach(async ({ page, context }) => {
            homePage = new HomePage(page, context, veWorldMockClient)
            dashboardPage = new DashboardPage(page, context, veWorldMockClient)
            accountModal = new AccountModal(page, context)

            await homePage.open()
        })

        test('claim domain name', async () => {
            await logIn({
                authType: authType,
                accountIndex: 1,
                email: PRIVY_TEST_EMAIL_RECEIVER
            })
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(VW_RECIPIENT_ALIAS)
            await expect(accountModal.successIcon).toBeVisible()
        })

        for (const recipient of [
            { addressType: 'address', address: DENIAL_KITCHEN[1] },
            // { addressType: 'vw-domain', address: VW_RECIPIENT_ALIAS },       // disabled because claiming domain name doesn't work on solo
            // { addressType: 'privy-domain', address: PRIVY_RECIPIENT_ALIAS }  // disabled because of https://github.com/vechain/vechain-kit/issues/235
        ]) {
            test(`send tx from account modal to wallet ${recipient.addressType}`, async () => {
                await logIn({
                    authType: authType,
                    accountIndex: 0,
                    email: PRIVY_TEST_EMAIL_SENDER
                })
                await dashboardPage.openAccountModal()
                await accountModal.sendTx("100", "VET", recipient.address)
                await accountModal.expectTxStatus('success')
            })
        }
    })
}
