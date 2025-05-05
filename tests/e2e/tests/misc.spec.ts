import { test } from "../fixtures/fixtures"
import { expect } from "@playwright/test"
import { veWorldMockClient } from "@vechain/veworld-mock-playwright"
import { HomePage } from "../models/HomePage";
import {DashboardPage} from "../models/DashboardPage";
import {AccountModal} from "../models/AccountModal";
import {
    PRIVY_TEST_EMAIL,
} from "../constants";
import {randomNumber} from "../utils/numbers";
import {randomString} from "../utils/strings";
import {AuthType, Language, PersonalizationData} from "../models/types";

test.describe("Misc", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context)

        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet()
    })

    test('Can change the theme', async () => {
        await dashboardPage.changeTheme('light')
        expect(await dashboardPage.currentTheme()).toBe('light')
        await dashboardPage.changeTheme('dark')
        expect(await dashboardPage.currentTheme()).toBe('dark')
    })

    test('Can change language', async () => {
        const data = [
            {
                language: 'Italiano',
                translations: {
                    swap: 'Scambia',
                    receive: 'Ricevi',
                    send: 'Invia',
                    bridge: 'Ponte',
                    ecosystem: 'Ecosistema',
                    settings: 'Impostazioni',
                }
            },
            {
                language: 'Deutsch',
                translations: {
                    swap: 'Tauschen',
                    receive: 'Empfangen',
                    send: 'Senden',
                    bridge: 'Brücke',
                    ecosystem: 'Ökosystem',
                    settings: 'Einstellungen',
                }
            },
            {
                language: 'Français',
                translations: {
                    swap: 'Échanger',
                    receive: 'Recevoir',
                    send: 'Envoyer',
                    bridge: 'Pont',
                    ecosystem: 'Écosystème',
                    settings: 'Paramètres',
                }
            },
            {
                language: 'Español',
                translations: {
                    swap: 'Intercambiar',
                    receive: 'Recibir',
                    send: 'Enviar',
                    bridge: 'Puente',
                    ecosystem: 'Ecosistema',
                    settings: 'Configuración',
                }
            },
            {
                language: '中文',
                translations: {
                    swap: '交换',
                    receive: '接收',
                    send: '发送',
                    bridge: '桥接',
                    ecosystem: '生态系统',
                    settings: '设置',
                }
            },
            {
                language: '日本語',
                translations: {
                    swap: 'スワップ',
                    receive: '受け取る',
                    send: '送る',
                    bridge: 'ブリッジ',
                    ecosystem: 'エコシステム',
                    settings: '設定',
                }
            },
        ]

        for (const dataSet of data) {
            await dashboardPage.changeLanguage(dataSet.language as Language)
            await dashboardPage.openAccountModal()
            await accountModal.verifyButtonsTranslation(dataSet.translations)
            await accountModal.closeModal()
        }
    })
})

for (const authType of [
    'veworld',
    // 'privy'
] as AuthType[]) {
    // most of the tests are disabled because profile customization contract isn't deployed on solo
    test.describe.serial(`[${authType}] Profile customization`, () => {
        const accIndex = randomNumber(4, 18)
        const randStr = randomString(6)
        const personalizationData: PersonalizationData = {
            displayName: `${authType}-${randStr} Name`,
            description: `${authType}-${randStr} Description`,
            socialLinks: {
                email: `${authType}-${randStr}@mail.com`,
                website: `https://${authType}-${randStr}.com`,
                twitter:  `x_${authType}_${randStr}`,
            }
        }
        let homePage: HomePage
        let dashboardPage: DashboardPage
        let accountModal: AccountModal

        test.beforeEach(async ({ page, context }, testInfo) => {
            if (testInfo.title.includes("Can't claim a domain name owned by other account")) return

            homePage = new HomePage(page, context, veWorldMockClient)
            dashboardPage = new DashboardPage(page, context, veWorldMockClient)
            accountModal = new AccountModal(page, context)

            await homePage.open()
            if (authType === 'veworld') {
                await homePage.initVWMock(accIndex)
                await homePage.connectWallet()
            } else if (authType === 'privy') {
                await homePage.loginWithEmail(PRIVY_TEST_EMAIL(randStr))
            } else {
                throw new Error(`Invalid auth type: "${authType}"`)
            }
            await expect(dashboardPage.walletButton).toBeVisible()
        })

        test.skip(`[${authType}] Claim available domain name`, async () => {
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(`${authType}-${randStr}`)
            await expect(accountModal.successIcon).toBeVisible()
        })

        test.skip(`[${authType}] Personalize account`, async () => {
            await dashboardPage.openAccountModal()
            await accountModal.personalizeAccount(personalizationData)
            await expect(accountModal.successIcon).toBeVisible()
            await accountModal.doneButton.click()
            await accountModal.expectPersonalizedInfo(personalizationData)
        })

        test.skip(`[${authType}] Set an already owned domain name`, async () => {
            // claim a throw-away domain name
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(`${authType}-${randomString(4)}`)
            await expect(accountModal.successIcon).toBeVisible()
            await accountModal.closeModal()

            // claim an already owned domain name
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(`${authType}-${randStr}`, 'own')
            await expect(accountModal.successIcon).toBeVisible()
            await accountModal.doneButton.click()
            // all the previous profile customization should be in place
            await accountModal.expectPersonalizedInfo(personalizationData)
        })

        // ignored by beforeEach hook due to unique auth pattern required by test steps
        test.skip(`[${authType}] Can't claim a domain name owned by other account`, async () => {
            const accIndex = randomNumber(4, 18)
            const randStr = randomString(6)

            // log in
            await homePage.open()
            if (authType === 'veworld') {
                await homePage.initVWMock(19)
                await homePage.connectWallet()
            } else if (authType === 'privy') {
                await homePage.loginWithEmail(PRIVY_TEST_EMAIL(randStr))
            } else {
                throw new Error(`Invalid auth type: "${authType}"`)
            }
            await expect(dashboardPage.walletButton).toBeVisible()

            // claim domain
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(`${authType}-${randStr}`)
            await expect(accountModal.successIcon).toBeVisible()

            // log out
            await accountModal.closeModal()
            await dashboardPage.openAccountModal()
            await accountModal.logOut()

            // log in with another acc and try to claim a taken domain
            await homePage.open()
            if (authType === 'veworld') {
                await homePage.initVWMock(accIndex)
                await homePage.connectWallet()
            } else if (authType === 'privy') {
                await homePage.loginWithEmail(PRIVY_TEST_EMAIL(randomString(6)))
            } else {
                throw new Error(`Invalid auth type: "${authType}"`)
            }
            await expect(dashboardPage.walletButton).toBeVisible()

            // attempt to claim a taken domain name
            await dashboardPage.openAccountModal()
            await accountModal.claimDomainName(`${authType}-${randStr}`, 'taken')
        })
    })
}
