# VeChain Kit — Tests and edge-case behavior

Package tests capture expected behavior, regressions, and edge cases. They supplement the public API sources but do not make internal helpers public.

> Generated from the VeChain Kit repository. File paths are preserved so answers can cite the source.
> VeChain Kit commit: `f8f32209bf76b08a0e459f534c9fb488a9e5fd00`. VeChain AI Skills commit: `b0d8b8f0dbb97cf4224840f7ee7a2eaadea677f2`.

## Source: `tests/e2e/README.md`

#### VeChain Kit E2E Tests

## Pre-conditions

In order to run the tests, you'll need to deploy a simple app that uses vechain kit and run thor-solo network. Here how to do it all:

1. Install all dependencies:
```bash
# project root
yarn install
```

2. Run thor-solo. If you already have an instance of thor-solo running - skip this step
```bash
# ./thor-solo
make solo-up
```

3. Build vechain-kit package:
```bash
# ./packages/vechain-kit
yarn build
```

4. Build and start next-template example app:
```bash
# ./examples/next-template
yarn build
yarn dev
```

5. Install playwright browsers
```bash
# ./tests/e2e
yarn install-browsers
```

## Running the tests

There are a couple options available. By default, tests are running in a headless state:

```bash
yarn test
```

You can also run them in headed state in case you want to see the tests execution:

```bash
yarn test:headed
```

And there's a debug option. It will run tests in a serial manner, allowing to execute every test "step-by-step" giving enough time to inspect all the stuff needed in-between steps execution.

```bash
yarn test:debug
```

## Reporting

After tests are complete, run this command. It will generate and open a report in your default browser.
```bash
yarn report
```

## Source: `tests/e2e/constants/index.ts`

````typescript
// app home page
export const HOMEPAGE = "http://localhost:3000/"

export const PRIVY_TEST_EMAIL_SENDER = "test-1392@privy.io"
export const PRIVY_TEST_EMAIL_RECEIVER = "test-1392+recipient@privy.io"
export const PRIVY_TEST_EMAIL = (prefix?: string) =>
    `test-1392${prefix ? `+${prefix}` : ''}@privy.io`
export const DENIAL_KITCHEN = [
    "0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa",
    "0x435933c8064b4Ae76bE665428e0307eF2cCFBD68",
    "0x0F872421Dc479F3c11eDd89512731814D0598dB5",
    "0xF370940aBDBd2583bC80bfc19d19bc216C88Ccf0",
    "0x99602e4Bbc0503b8ff4432bB1857F916c3653B85",
]
export const VW_RECIPIENT_ALIAS = 'kitchenpet1'
export const PRIVY_RECIPIENT_ALIAS = 'privyrecipient1'
export const DOMAIN_STATUS = {
    available: 'AVAILABLE',
    unavailable: 'UNAVAILABLE',
    taken: 'This domain is already taken',
    own: 'YOU OWN THIS',
    protected: 'This domain is protected',
}
````

## Source: `tests/e2e/fixtures/fixtures.ts`

````typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`[CONSOLE ERROR] ${msg.text()}\n\n________\n\n`);
            }
        });

        page.on('requestfailed', request => {
            console.error(`[NETWORK ERROR] ${request.method().toUpperCase()} ${request.url()}\n${request.failure()?.errorText}\n\n________\n\n`);
        });

        await use(page);
    },
});
````

## Source: `tests/e2e/models/AccountModal.ts`

````typescript
import { Page } from 'playwright';
import { BrowserContext, expect, Locator, test } from '@playwright/test';
import { BasePage } from './BasePage';
import { trimAddress } from '../utils/strings';
import { DOMAIN_STATUS } from '../constants';
import { AccountModalProfile } from './AccountModalProfile';
import { AccountModalAssets } from './AccountModalAssets';
import { AccountModalSettings } from './AccountModalSettings';
import {
    ActivitiesButtonsTranslations,
    AssetSymbol,
    DomainStatus,
    PersonalizationData,
    QuickActionButton,
    TxStatus,
} from './types';
import { AccountModalNotifications } from './AccountModalNotifications';

/**
 * Dashboard page models
 */
export class AccountModal extends BasePage {
    readonly profile: AccountModalProfile;
    readonly assets: AccountModalAssets;
    readonly settings: AccountModalSettings;
    readonly notifications: AccountModalNotifications;

    private readonly modalBody: Locator;
    readonly closeButton: Locator;
    readonly backButton: Locator;
    readonly modalTitle: Locator;
    readonly doneButton: Locator;
    readonly continueButton: Locator;
    readonly confirmButton: Locator;
    readonly successIcon: Locator;
    readonly quickActionButton: (action: QuickActionButton) => Locator;

    private readonly summaryFormatter = new Intl.NumberFormat('en-US', {
        notation: 'standard',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    constructor(page: Page, context: BrowserContext, vwmock?: any) {
        super(page, context, vwmock);
        this.profile = new AccountModalProfile(page);
        this.assets = new AccountModalAssets(page);
        this.settings = new AccountModalSettings(page);
        this.notifications = new AccountModalNotifications(page);

        this.modalBody = this.page.locator(
            "//*[contains(@class, 'chakra-modal__content-container')]",
        );
        this.closeButton = this.modalBody.locator(
            "//button[@aria-label='Close']",
        );
        this.backButton = this.modalBody.locator(
            "//button[@aria-label='Back']",
        );
        this.modalTitle = this.modalBody.locator(
            "//*[contains(@id, 'chakra-modal--header')]",
        );
        this.doneButton = this.modalBody.locator("//button[text()='Done']");
        this.continueButton = this.page.getByTestId('continue-button');
        this.confirmButton = this.page.getByTestId('confirm-button');
        this.successIcon = this.page.getByTestId('success-icon');
        this.quickActionButton = (action: QuickActionButton) =>
            this.page.getByTestId(`${action}-button-label`);
    }

    async closeModal() {
        return await test.step('Close account modal', async () => {
            await this.closeButton.click();
            await this.page.waitForTimeout(750); // wait for modal close animation
        });
    }

    async verifyButtonsTranslation(
        translations: ActivitiesButtonsTranslations,
    ) {
        return await test.step('Verify quick action buttons translation', async () => {
            const buttons = Object.keys(translations);
            for (const button of buttons) {
                const label = button as QuickActionButton;
                await expect(this.quickActionButton(label)).toHaveText(
                    translations[label],
                );
            }
        });
    }

    async sendTx(amount: string, asset: AssetSymbol, addressOrDomain: string) {
        return await test.step(`Send '${amount}' '${asset}' to "${addressOrDomain}"`, async () => {
            // await this.quickActionButton('send').click()
            await this.assets.open();
            await this.assets.searchTokenInput.fill(asset);
            await this.assets.assetButton(asset).click();
            await this.assets.amountInput.fill(amount);
            await this.assets.addressInput.fill(addressOrDomain);
            await this.page.waitForTimeout(750); // wait for FE to do the form validation
            await expect(this.assets.amountErrorMsg).not.toBeVisible();
            await expect(this.assets.addressErrorMsg).not.toBeVisible();
            await this.assets.sendButton.click();
            if (addressOrDomain.includes('.veworld.vet')) {
                await expect(this.assets.recipientDomain).toHaveText(
                    addressOrDomain,
                );
            } else {
                await expect(this.assets.recipientAddress).toHaveText(
                    trimAddress(addressOrDomain, 6),
                );
            }
            await expect(this.assets.summaryAmount).toHaveText(
                `${this.summaryFormatter.format(Number(amount))} ${asset}`,
            );
            await this.confirmButton.click();
            await expect(this.confirmButton).toContainText('Sending...');
        });
    }

    async expectTxStatus(txStatus: TxStatus) {
        return await test.step(`Expect transaction sending to resolve with ${txStatus}`, async () => {
            if (txStatus === 'success') {
                await expect(this.successIcon).toBeVisible();
            } else if (txStatus === 'error') {
                await expect(this.confirmButton).toHaveText('Retry');
                await expect(this.assets.txSendErrorMsg).toBeVisible();
            }
        });
    }

    /**
     * @param domain - domain name to claim
     * @param expectedStatus - optional; if specified - status check will be performed before
     *                         confirming the domain change
     */
    async claimDomainName(domain: string, expectedStatus?: DomainStatus) {
        return await test.step(`Claim domain name: "${domain}"`, async () => {
            await this.profile.open();
            await this.profile.customizeButton.click();
            await this.profile.setDomainNameButton.click();
            if (
                (await this.modalTitle.textContent()) ===
                'Choose your account name'
            ) {
                await this.profile.chooseNameButton.click();
            }
            await this.profile.domainInput.fill(domain);
            if (expectedStatus) {
                await this.expectDomainStatus(expectedStatus);
            }
            if (expectedStatus === 'taken') return;
            await this.continueButton.click();
            await expect(this.profile.preconfirmDomain).toHaveText(
                `${domain}.veworld.vet`,
            );
            await this.confirmButton.click();
        });
    }

    async expectDomainStatus(status: DomainStatus) {
        return test.step(`Expect domain status to be "${status}"`, async () => {
            await expect(this.profile.domainAvailabilityStatus).toHaveText(
                DOMAIN_STATUS[status],
            );
        });
    }

    async logOut() {
        return test.step('Log out', async () => {
            await this.profile.open();
            await this.profile.logoutButton.click();
            await this.profile.disconnectButton.click();
        });
    }

    async personalizeAccount(data: PersonalizationData) {
        return await test.step('Personalize account', async () => {
            await this.profile.customizeButton.click();
            if (data.displayName)
                await this.profile.displayNameInput.fill(data.displayName!);
            if (data.description)
                await this.profile.descriptionInput.fill(data.description!);
            if (data.socialLinks) {
                if (data.socialLinks.email)
                    await this.profile.twitterInput.fill(
                        data.socialLinks!.twitter!,
                    );
                if (data.socialLinks.website)
                    await this.profile.websiteInput.fill(
                        data.socialLinks!.website!,
                    );
                if (data.socialLinks.twitter)
                    await this.profile.emailInput.fill(
                        data.socialLinks!.email!,
                    );
            }
            await this.profile.saveChangesButton.click();
            await this.confirmButton.click();
        });
    }

    async expectPersonalizedInfo(data: PersonalizationData) {
        return await test.step('Expect submitted personalization data to be correct', async () => {
            if (data.displayName)
                await expect(this.profile.displayNameVal).toHaveText(
                    data.displayName!,
                );
            if (data.description)
                await expect(this.profile.descriptionVal).toHaveText(
                    data.description!,
                );
            if (data.socialLinks) {
                if (data.socialLinks.email)
                    await expect(this.profile.emailVal).toHaveAttribute(
                        'href',
                        `mailto:${data.socialLinks!.email}`,
                    );

                if (data.socialLinks.website)
                    await expect(this.profile.websiteVal).toHaveAttribute(
                        'href',
                        data.socialLinks.website!,
                    );

                if (data.socialLinks.twitter)
                    await expect(this.profile.twitterVal).toHaveAttribute(
                        'href',
                        `https://x.com/${data.socialLinks.twitter!}`,
                    );
            }
        });
    }

    async openNotifications() {
        return await test.step('Open notifications', async () => {
            await this.page.getByTestId('notifications-button').click();
        });
    }
}
````

## Source: `tests/e2e/models/AccountModalAssets.ts`

````typescript
import {Page} from "playwright";
import {Locator, test} from "@playwright/test";
import {AssetSymbol} from "./types";

export class AccountModalAssets {
    private readonly page: Page;
    readonly allAssetsButton: Locator
    readonly searchTokenInput: Locator
    readonly amountInput: Locator
    readonly addressInput: Locator
    readonly sendButton: Locator
    readonly recipientAddress: Locator
    readonly recipientDomain: Locator
    readonly summaryAmount: Locator
    readonly txSendErrorMsg: Locator
    readonly amountErrorMsg: Locator
    readonly addressErrorMsg: Locator
    readonly assetButton: (symbol: AssetSymbol) => Locator


    constructor(page: Page) {
        this.page = page;
        this.allAssetsButton = this.page.getByTestId('all-assets-button')
        this.searchTokenInput = this.page.getByTestId('search-token-input')
        this.amountInput = this.page.getByTestId('tx-amount-input')
        this.addressInput = this.page.getByTestId('tx-address-input')
        this.sendButton = this.page.getByTestId('send-button')
        this.recipientAddress = this.page.getByTestId('to-address')
        this.recipientDomain = this.page.getByTestId('to-domain')
        this.summaryAmount = this.page.getByTestId('send-summary-amount')
        this.txSendErrorMsg = this.page.getByTestId('tx-send-error-msg')
        this.amountErrorMsg = this.page.getByTestId('amount-error-msg')
        this.addressErrorMsg = this.page.getByTestId('address-error-msg')
        this.assetButton = (symbol: AssetSymbol) => this.page.getByTestId(`asset-${symbol}`)
    }

    async open() {
        return test.step('Open "Assets" section', async () => {
            await this.allAssetsButton.click()
        })
    }
}
````

## Source: `tests/e2e/models/AccountModalNotifications.ts`

````typescript
import {Page} from "playwright";
import {Locator, test, expect} from "@playwright/test";
import {NotificationsViewName} from "./types";

export class AccountModalNotifications {
    private readonly page: Page
    readonly modalTitle: Locator
    readonly clearAllButton: Locator
    readonly notificationsList: Locator
    readonly notificationTitle: (index: number) => Locator
    readonly notificationDescription: (index: number) => Locator
    readonly archiveNotificationButton: (index: number) => Locator
    readonly toggleViewButton: Locator

    constructor(page: Page) {
        this.page = page
        this.modalTitle = this.page.getByTestId('modal-title')
        this.clearAllButton = this.page.getByTestId('clear-all-button')
        this.toggleViewButton = this.page.getByTestId('toggle-view-button')
        this.notificationsList = this.page.locator("[data-testid='notification-item']")
        this.notificationTitle = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('notification-title')
        this.notificationDescription = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('notification-text')
        this.archiveNotificationButton = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('remove-notification-button')
    }

    async clearAll() {
        return test.step('Clear all notifications', async () => {
            await this.clearAllButton.click()
        })
    }

    async switchToView(viewName: NotificationsViewName) {
        return test.step(`Switch to "${viewName}" notifications view`, async () => {
            const expectedTitle = viewName === 'archived'
                ? 'Archived Notifications'
                : 'Notifications'
            const currentView = await this.modalTitle.textContent()
            if (currentView !== expectedTitle) {
                await this.toggleViewButton.click()
            }
        })
    }

    async expectNotificationByTitle(title: string) {
        return await test.step(`Expect a notification to be on the list: "${title}"`, async () => {
            const count = await this.notificationsList.count()
            let isNotificationDisplayed = false
            for (let i = 0; i < count; i++) {
                try {
                    const actualTitle = await this.notificationTitle(i).innerText()
                    expect(actualTitle).toBe(title)
                    isNotificationDisplayed = true
                    break
                } catch(e) {console.error(e)}
            }
            expect(isNotificationDisplayed).toBe(true)
        })
    }

    async archiveNotification(title: string) {
        return await test.step(`Archive notification with the title: "${title}"`, async () => {
            const notifIndex = await this.findNotificationByTitle(title)
            await this.archiveNotificationButton(notifIndex).click()
        })
    }

    async findNotificationByTitle(title: string) {
        const count = await this.notificationsList.count()
        let index = 0
        for (let i = 0; i < count; i++) {
            try {
                const actualTitle = await this.notificationTitle(i).innerText()
                expect(actualTitle).toBe(title)
                index = i
                break
            } catch(e) {console.error(e)}
        }

        await this.notificationsList.nth(index).scrollIntoViewIfNeeded()
        return index
    }
}
````

## Source: `tests/e2e/models/AccountModalProfile.ts`

````typescript
import {Page} from "playwright";
import {Locator, test} from "@playwright/test";

export class AccountModalProfile {
    private readonly page: Page;
    readonly profileButton: Locator
    readonly customizeButton: Locator
    readonly setDomainNameButton: Locator
    readonly chooseNameButton: Locator
    readonly domainInput: Locator
    readonly domainAvailabilityStatus: Locator
    readonly preconfirmDomain: Locator
    readonly logoutButton: Locator
    readonly disconnectButton: Locator
    readonly cancelLogoutButton: Locator
    readonly displayNameInput: Locator
    readonly descriptionInput: Locator
    readonly twitterInput: Locator
    readonly websiteInput: Locator
    readonly emailInput: Locator
    readonly saveChangesButton: Locator
    readonly displayNameVal: Locator
    readonly descriptionVal: Locator
    readonly emailVal: Locator
    readonly websiteVal: Locator
    readonly twitterVal: Locator

    constructor(page: Page) {
        this.page = page;
        this.profileButton = this.page.getByTestId("profile-button")
        this.customizeButton = this.page.getByTestId("customize-button")
        this.setDomainNameButton = this.page.getByTestId("set-domain-name-button")
        this.chooseNameButton = this.page.getByTestId("choose-name-button")
        this.domainInput = this.page.getByTestId("domain-input")
        this.domainAvailabilityStatus = this.page.getByTestId("domain-availability-status")
        this.preconfirmDomain = this.page.getByTestId("preconfirm-domain-val")
        this.logoutButton = this.page.getByTestId('logout-button')
        this.disconnectButton = this.page.getByTestId('disconnect-button')
        this.cancelLogoutButton = this.page.getByTestId('cancel-logout-button')
        this.displayNameInput = this.page.getByTestId('display-name-input')
        this.descriptionInput = this.page.getByTestId('description-input')
        this.twitterInput = this.page.getByTestId('twitter-input')
        this.websiteInput = this.page.getByTestId('website-input')
        this.emailInput = this.page.getByTestId('email-input')
        this.saveChangesButton = this.page.getByTestId('save-changes-button')
        this.displayNameVal = this.page.getByTestId('display-name-val')
        this.descriptionVal = this.page.getByTestId('description-val')
        this.emailVal = this.page.getByTestId('mail-link')
        this.websiteVal = this.page.getByTestId('website-link')
        this.twitterVal = this.page.getByTestId('twitter-link')
    }

    async open() {
        return test.step('Open "Profile" section', async () => {
            await this.profileButton.click()
        })
    }
}
````

## Source: `tests/e2e/models/AccountModalSettings.ts`

````typescript
import {Page} from "playwright";
import {Locator, test} from "@playwright/test";
import {SettingsSectionName} from "./types";

export class AccountModalSettings {
    private readonly page: Page;
    readonly settingsButton: Locator
    readonly settingsSection: (name: SettingsSectionName) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.settingsButton = this.page.getByTestId('settings-button-label')
        this.settingsSection = (name) => this.page.getByTestId(`${name.split(" ").join("-")}-button`)
    }

    async open() {
        return test.step('Open "Settings" section', async () => {
            await this.settingsButton.click()
        })
    }

    async openSection(sectionName: SettingsSectionName) {
        return test.step(`Open "${sectionName}" of the settings menu`, async () => {
            await this.settingsSection(sectionName).click()
        })
    }
}
````

## Source: `tests/e2e/models/BasePage.ts`

````typescript
import {BrowserContext, expect, Page, test} from "@playwright/test"

export class BasePage {
  protected page: Page
  protected context: BrowserContext
  protected vwmock: any

  constructor(page: Page, context: BrowserContext, vwmock?: any) {
    this.page = page
    this.context = context
    this.vwmock = vwmock
  }

  /**
   * Initializes veworld mock. Always has to be called before authenticating.
   * If the page was reloaded/refreshed (an equivalent of hitting F5 or refresh button
   * in the browser) - vwmock has to be re-initialized.
   * @param accountIndex
   */
  async initVWMock(accountIndex: number) {
    return test.step(`Initialize VeWorld Mock; account index: "${accountIndex}"`, async () => {
      await this.vwmock.load(this.page)
      await this.vwmock.installMock(this.page)
      await this.vwmock.setOptions(this.page, { gasMultiplier: 0.5 })
      if (accountIndex) await this.vwmock.setConfig(this.page, { accountIndex: accountIndex })
    })
  }

  async assertSessionIsDeleted() {
    const isObjectHasProperty = (
        args: { obj: any, property: string, isPropNameSubstring?: boolean }
    ) => {
      return args.isPropNameSubstring
        ? Object.keys(args.obj).some(key => key.includes(args.property))
        : args.obj.hasOwnProperty(args.property)
    }

    // get browser's local storage
    const localStorage: any = await this.page.evaluate(() => localStorage);

    // check for veworld wallet session
    expect(isObjectHasProperty({
      obj: localStorage,
      property: "dappkit@vechain/connectionCertificate"
    })).toBeFalsy()

    // check for privy session
    expect(isObjectHasProperty({
      obj: localStorage,
      property: "privy_wallet:",
      isPropNameSubstring: true
    })).toBeFalsy()
  }
}
````

## Source: `tests/e2e/models/DashboardPage.ts`

````typescript
import { Page } from "playwright"
import {BrowserContext, Locator, expect, test} from "@playwright/test"
import { BasePage } from "./BasePage"
import {Language, Theme} from "./types";

/**
 * Dashboard page models
 */
export class DashboardPage extends BasePage {
  readonly connectWalletButton: Locator
  readonly pageBodyElem: Locator
  readonly languageDropdown: Locator
  readonly accountModalButton: Locator
  readonly walletButton: Locator
  readonly walletAddress: Locator
  readonly txWithToastButton: Locator
  readonly txWithModalButton: Locator
  readonly signMessageButton: Locator
  readonly signTypedDataButton: Locator
  readonly pendingSpinnerToast: Locator
  readonly successIconToast: Locator
  readonly pendingSpinnerModal: Locator
  readonly successIconModal: Locator
  readonly successToastTitle: (msg: string) => Locator
  readonly messageSignatureCodeBox: Locator
  readonly typedDataSignatureCodeBox: Locator
  readonly themeButton: (theme: Theme) => Locator

  constructor(page: Page, context: BrowserContext, vwmock?: any) {
    super(page, context, vwmock)

    this.connectWalletButton = this.page.getByTestId("connect-wallet")
    this.pageBodyElem = this.page.locator("//body[contains(@class, 'chakra-ui')]")
    this.languageDropdown = this.page.getByTestId("select-language")
    this.accountModalButton = this.page.getByTestId("account-modal-button")
    this.walletButton = this.page.getByTestId("wallet-button")
    this.walletAddress = this.page.getByTestId("trimmed-address")
    this.txWithToastButton = this.page.getByTestId("tx-with-toast-button")
    this.txWithModalButton = this.page.getByTestId("tx-with-modal-button")
    this.signMessageButton = this.page.getByTestId("sign-message-button")
    this.signTypedDataButton = this.page.getByTestId("sign-typed-data-button")
    this.pendingSpinnerToast = this.page.getByTestId("pending-spinner-toast")
    this.successIconToast = this.page.getByTestId("success-icon-toast")
    this.pendingSpinnerModal = this.page.getByTestId("pending-spinner-modal")
    this.successIconModal = this.page.getByTestId("success-icon-modal")
    this.successToastTitle = (msg) => this.page.locator(`//div[@data-status='success' and text()='${msg}']`)
    this.messageSignatureCodeBox = this.signMessageButton.locator("//following-sibling::code")
    this.typedDataSignatureCodeBox = this.signTypedDataButton.locator("//following-sibling::code")
    this.themeButton = (theme: Theme) => this.page.getByTestId(`${theme}-mode-button`)
  }

  async currentTheme(): Promise<string> {
    const classVal = await this.pageBodyElem.getAttribute("class")
    return classVal!.slice('chakra-ui-'.length)
  }

  async changeTheme(theme: Theme): Promise<void> {
    expect(await this.currentTheme()).not.toBe(theme)
    await this.themeButton(theme).click()
  }

  async changeLanguage(language: Language) {
    return await test.step(`Change language to "${language}"`, async () => {
      await this.languageDropdown.selectOption(language)
    })
  }

  async openAccountModal() {
    return await test.step('Click "Account Modal" button', async () => {
      await this.accountModalButton.click()
    })
  }

  async sendTxWithToast() {
    return await test.step('Send transaction with toast', async () => {
      await this.txWithToastButton.click()
    })
  }

  async sendTxWithModal() {
    return await test.step('Send transaction with modal', async () => {
      await this.txWithModalButton.click()
    })
  }

  async signMessage() {
    return await test.step('Sign a message', async () => {
      await this.signMessageButton.click()
    })
  }

  async signTypedData() {
    return await test.step('Sign typed data', async () => {
      await this.signTypedDataButton.click()
    })
  }

  async getWalletAddress() {
    return await test.step('Get wallet address', async () => {
      const text = await this.page.getByTestId("connected-wallet-address").innerText()
      return text.substring(text.indexOf(':') + 1).trim()
    })
  }

  async getSmartAccountInfo() {
    return await test.step('Get smart contract info', async () => {
      const addressText = await this.page.getByTestId("smart-account-address").innerText()
      const address = addressText.substring(addressText.indexOf(':') + 1).trim()
      const isDeployedText = await this.page.getByTestId("is-sa-deployed").innerText()
      const isDeployed = isDeployedText.substring(isDeployedText.indexOf(':') + 1).trim()
      const b3trBalanceText = await this.page.getByTestId("b3tr-balance").innerText()
      const b3trBalance = b3trBalanceText.substring(b3trBalanceText.indexOf(':') + 1).trim()

      return {
        address,
        isDeployed,
        b3trBalance,
      }
    })
  }

  async getConnectionInfo() {
    return await test.step('Get connection info', async () => {
      const typeText = await this.page.getByTestId("connection-type").innerText()
      const type = typeText.substring(typeText.indexOf(':') + 1).trim()
      const networkText = await this.page.getByTestId("network").innerText()
      const network = networkText.substring(networkText.indexOf(':') + 1).trim()

      return {
        type,
        network,
      }
    })
  }

  async getVeBetterDAOInfo() {
    return await test.step('Get VeBetterDAO' +
        ' info', async () => {
      const roundIdText = await this.page.getByTestId("current-allocation-round-id").innerText()
      const roundId = roundIdText.substring(roundIdText.indexOf(':') + 1).trim()
      const gmNFTText = await this.page.getByTestId("selected-gm-nft").innerText()
      const gmNFT = gmNFTText.substring(gmNFTText.indexOf(':') + 1).trim()
      const participatedInGovernanceText = await this.page.getByTestId("participated-in-governance").innerText()
      const participatedInGovernance = participatedInGovernanceText.substring(participatedInGovernanceText.indexOf(':') + 1).trim()
      const isPassportValidText = await this.page.getByTestId("is-passport-valid").innerText()
      const isPassportValid = isPassportValidText.substring(isPassportValidText.indexOf(':') + 1).trim()

      return {
        roundId,
        gmNFT,
        participatedInGovernance,
        isPassportValid,
      }
    })
  }
}
````

## Source: `tests/e2e/models/HomePage.ts`

````typescript
import { BrowserContext, Locator, test } from '@playwright/test';
import { Page } from 'playwright';

import { HOMEPAGE } from '../constants';
import { BasePage } from './BasePage';
import { SocialLoginModal } from './SocialLoginModal';

/**
 * Dashboard page models
 */
export class HomePage extends BasePage {
    readonly loginButton: Locator;
    readonly loginWithVechainButton: Locator;
    readonly connectWalletButton: Locator;
    readonly veworldButton: Locator;
    readonly socialLoginButton: Locator;
    readonly acceptTncButton: Locator;
    readonly rejectTncButton: Locator;

    constructor(page: Page, context: BrowserContext, vwmock?: any) {
        super(page, context, vwmock);

        this.loginButton = this.page
            .getByRole('button', { name: 'Login', exact: true })
            .first();
        this.loginWithVechainButton = this.page.getByText('Login with VeChain');
        this.connectWalletButton = this.page.locator(
            "//*[text()='Connect wallet']/../..",
        );
        this.veworldButton = this.page.getByTestId('VeWorld');
        this.socialLoginButton = this.page.getByText(
            'Use social login with VeChain',
        );
        this.acceptTncButton = this.page.getByTestId('accept-tnc-button');
        this.rejectTncButton = this.page.getByTestId('reject-tnc-button');
    }

    async open() {
        return await test.step('Open home page', async () => {
            await this.vwmock.load(this.page);
            await this.page.goto(HOMEPAGE);
        });
    }

    async acceptTnc() {
        return await test.step('Accept Terms & Conditions', async () => {
            await this.acceptTncButton.waitFor({
                state: 'visible',
                timeout: 10000,
            });
            await this.acceptTncButton.click();
        });
    }

    async rejectTnc() {
        return await test.step('Reject Terms and Conditions', async () => {
            await this.rejectTncButton.waitFor({
                state: 'visible',
                timeout: 10000,
            });
            await this.rejectTncButton.click();
        });
    }

    async connectWallet(args?: { acceptTnc: boolean }) {
        return await test.step('Connect VeChain Wallet', async () => {
            await this.loginButton.click();
            await this.connectWalletButton.click();
            await this.veworldButton.click();

            if (args) {
                switch (args!.acceptTnc) {
                    case true:
                        await this.acceptTnc();
                        break;
                    case false:
                        await this.rejectTnc();
                        break;
                    default:
                        console.error(
                            `unknown 'acceptTnc' value received: "${
                                args!.acceptTnc
                            }", omitting taking action`,
                        );
                        break;
                }
            }
        });
    }

    async loginWithEmail(args: { email: string; acceptTnc?: boolean }) {
        return await test.step(`Login with Email address: "${args.email}"`, async () => {
            await this.loginButton.click();

            // instantiate the context of the auth modal window
            const [page_socialLoginModal] = await Promise.all([
                this.context.waitForEvent('page'),
                this.socialLoginButton.click(),
            ]);
            // init console and network error event listeners for the modal page context
            page_socialLoginModal.on('console', (msg) => {
                if (msg.type() === 'error') {
                    console.error(
                        `[CONSOLE ERROR] (#Privy) - ${msg.text()}\n________\n`,
                    );
                }
            });
            page_socialLoginModal.on('requestfailed', (request) => {
                console.error(
                    `[NETWORK ERROR] (#Privy) - ${request
                        .method()
                        .toUpperCase()} ${request.url()}\n${
                        request.failure()?.errorText
                    }\n________\n`,
                );
            });

            const socialLoginModal = new SocialLoginModal(
                page_socialLoginModal,
            );
            await socialLoginModal.fillInEmailAndSubmit(args.email);
            if (args.acceptTnc !== null) {
                switch (args!.acceptTnc) {
                    case true:
                        await this.acceptTnc();
                        break;
                    case false:
                        await this.rejectTnc();
                        break;
                    default:
                        console.error(
                            `unknown 'acceptTnc' value received: "${
                                args!.acceptTnc
                            }", omitting taking action`,
                        );
                        break;
                }
            }
        });
    }
}
````

## Source: `tests/e2e/models/SocialLoginModal.ts`

````typescript
import { Page } from "playwright"
import { Locator, test } from "@playwright/test"

/**
 * Base class for all dialogs
 */
export class SocialLoginModal {
    protected readonly page: Page
    protected readonly emailInput: Locator
    protected readonly submitEmailButton: Locator
    protected readonly approveButton: Locator

    constructor(page: Page) {
        this.page = page
        this.emailInput = this.page.locator('#email-input')
        this.submitEmailButton = this.page.getByText('Submit')
        this.approveButton = this.page.getByText('Approve')
    }

    /**
     * Expect the dialog to be displayed with success title
     */
    async fillInEmailAndSubmit(email: string) {
        await test.step(`Type in email: ${email}, then click "Submit"`, async () => {
            await this.emailInput.fill(email)
            await this.submitEmailButton.click()
        })
    }
}
````

## Source: `tests/e2e/models/types.ts`

````typescript
export type Theme = 'light' | 'dark';
export type Language =
    | 'English'
    | 'Italiano'
    | 'Deutsch'
    | 'Français'
    | 'Español'
    | '中文'
    | '日本語';
export type AssetSymbol = 'VET' | 'B3TR' | 'VOT3' | 'VTHO';
export type TxStatus = 'success' | 'error';
export type DomainStatus =
    | 'available'
    | 'unavailable'
    | 'taken'
    | 'own'
    | 'protected';
export type QuickActionButton =
    | 'swap'
    | 'receive'
    | 'send'
    | 'ecosystem'
    | 'settings';
export type AuthType = 'veworld' | 'privy';
export type SettingsSectionName =
    | 'notifications'
    | 'customize profile'
    | 'choose account name'
    | 'connection details'
    | 'help';
export type NotificationsViewName = 'archived' | 'current';

export type AuthArgs = {
    authType: AuthType;
    accountIndex: number;
    email: string;
};

export type ActivitiesButtonsTranslations = {
    swap: string;
    receive: string;
    send: string;
    ecosystem: string;
    settings: string;
};

export type PersonalizationData = {
    displayName?: string;
    description?: string;
    socialLinks?: {
        email?: string;
        website?: string;
        twitter?: string;
    };
};
````

## Source: `tests/e2e/playwright.config.ts`

````typescript
import { defineConfig, devices } from "@playwright/test"

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on GHA if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.GITHUB_RUN_ID,
  /* Never retry failing tests */
  retries: 0,
  /* Set workers for GHA */
  workers: process.env.GITHUB_RUN_ID ? 1 : undefined,
  /* HTML Reporter */
  reporter: [["html", { open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    headless: true,
    trace: "on",
    screenshot: "on-first-failure",
  },
  /* Global setup file */
  // globalSetup: require.resolve("./tests/global_setup.spec.ts"),
  /* Set timeout for each test */
  timeout: 80_000,
  expect: {
    /* Set timeout for expect */
    timeout: 20_000,
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    /*

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
````

## Source: `tests/e2e/tests/connect-wallet.spec.ts`

````typescript
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
````

## Source: `tests/e2e/tests/hooks.spec.ts`

````typescript
import { test } from "../fixtures/fixtures";
import { HomePage } from "../models/HomePage";
import { DashboardPage } from "../models/DashboardPage";
import { veWorldMockClient } from "@vechain/veworld-mock-playwright";
import { expect } from "@playwright/test";
import { DENIAL_KITCHEN } from "../constants";

test.describe.skip("Hooks", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)

        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet({ acceptTnc: true })
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
````

## Source: `tests/e2e/tests/misc.spec.ts`

````typescript
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

test.describe.skip("Misc", () => {
    let homePage: HomePage
    let dashboardPage: DashboardPage
    let accountModal: AccountModal

    test.beforeEach(async ({ page, context }) => {
        homePage = new HomePage(page, context, veWorldMockClient)
        dashboardPage = new DashboardPage(page, context, veWorldMockClient)
        accountModal = new AccountModal(page, context)

        await homePage.open()
        await homePage.initVWMock(0)
        await homePage.connectWallet({ acceptTnc: true })
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
                await homePage.connectWallet({ acceptTnc: true })
            } else if (authType === 'privy') {
                await homePage.loginWithEmail({ email: PRIVY_TEST_EMAIL(randStr), acceptTnc: true })
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
                await homePage.connectWallet({ acceptTnc: true })
            } else if (authType === 'privy') {
                await homePage.loginWithEmail({ email: PRIVY_TEST_EMAIL(randStr), acceptTnc: true })
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
                await homePage.connectWallet({ acceptTnc: true })
            } else if (authType === 'privy') {
                await homePage.loginWithEmail({email: PRIVY_TEST_EMAIL(randomString(6)), acceptTnc: true})
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
````

## Source: `tests/e2e/tests/notifications.spec.ts`

````typescript
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
````

## Source: `tests/e2e/tests/transactions.spec.ts`

````typescript
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
    test.describe.skip("Demo transactions", () => {
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
                await homePage.connectWallet({ acceptTnc: true })
            } else if (authType === 'privy') {
                await homePage.loginWithEmail({ email: PRIVY_TEST_EMAIL_SENDER, acceptTnc: true })
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
    test.describe.skip("Wallet-to-wallet transactions", () => {
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
                await homePage.connectWallet({ acceptTnc: true })
            } else if (args.authType === 'privy') {
                await homePage.loginWithEmail({ email: args.email, acceptTnc: true })
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
````

## Source: `tests/e2e/utils/numbers.ts`

````typescript
export const randomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min
}
````

## Source: `tests/e2e/utils/strings.ts`

````typescript
import {randomBytes} from "node:crypto";
import {randomNumber} from "./numbers";

/**
 * Takes an integer and formats it into a compacted string. E.g. 200000 -> 200K
 * The output is the same to what's displayed in the UI.
 * @param number
 * @returns string
 */
export const compact = (number: number | bigint): string => {
  const getCompactFormatter = (decimalPlaces?: number) =>
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: decimalPlaces,
    })

  return getCompactFormatter(4).format(number)
}

export const expand = (compactString: string): number => {
  // Define the multipliers for different compact notations
  const multipliers: Record<string, number> = {
    K: 1_000, // Kilo -> 1,000
    M: 1_000_000, // Million -> 1,000,000
    B: 1_000_000_000, // Billion -> 1,000,000,000
    T: 1_000_000_000_000, // Trillion -> 1,000,000,000,000
  }

  // Regular expression to match the number part and the suffix
  const regex = /^([\d,.]+)([KMBT]?)$/i

  // Check if the input matches the format
  const match = compactString.match(regex)
  if (!match) throw new Error("Invalid input format")

  const numberPart = parseFloat(match[1].replace(/,/g, "")) // Convert the numeric part to a number (handles commas)
  const suffix = match[2].toUpperCase() // Get the suffix and convert it to uppercase

  // Multiply the numberPart by the appropriate multiplier, or just return the number if there's no suffix
  const multiplier = multipliers[suffix] || 1

  return numberPart * multiplier
}

/**
 * Trims full wallet address to a shorter version in same way it's displayed in the UI on a Connect Wallet button.
 * @param fullAddress
 * @param frontChars
 */
export const trimAddress = (fullAddress: string, frontChars?: number): string => {
  const trimmedLength = frontChars ? frontChars + 4 : 8
  return fullAddress.length > trimmedLength
    ? `${fullAddress.slice(0, frontChars ? frontChars : 4)}•••${fullAddress.slice(-4)}`
    : fullAddress
}

/**
 * Generates random string out of a random 64 bytes hex string.
 * @param length - length of an output string; max is 128.
 */
export const randomString = (length: number): string => {
  if (length > 128)
    throw Error(`Trying to generate random string with length ${length}. Length must be 128 or less`);

  const bytes = 64
  const sliceStart = randomNumber(0, bytes * 2 - length)
  const sliceEnd = sliceStart + length

  return randomBytes(64).toString('hex').slice(sliceStart, sliceEnd);
}
````
