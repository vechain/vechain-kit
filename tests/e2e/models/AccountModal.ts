import { Page } from "playwright"
import {BrowserContext, expect, Locator, test} from "@playwright/test"
import { BasePage } from "./BasePage"
import {trimAddress} from "../utils/strings";
import {DOMAIN_STATUS} from "../constants";
import {AccountModalProfile} from "./AccountModalProfile";
import {AccountModalAssets} from "./AccountModalAssets";
import {AccountModalSettings} from "./AccountModalSettings";
import {
  ActivitiesButtonsTranslations,
  AssetSymbol,
  DomainStatus,
  PersonalizationData,
  QuickActionButton,
  TxStatus
} from "./types";
import {AccountModalNotifications} from "./AccountModalNotifications";

/**
 * Dashboard page models
 */
export class AccountModal extends BasePage {
  readonly profile: AccountModalProfile
  readonly assets: AccountModalAssets
  readonly settings: AccountModalSettings
  readonly notifications: AccountModalNotifications

  private readonly modalBody: Locator
  readonly closeButton: Locator
  readonly backButton: Locator
  readonly modalTitle: Locator
  readonly doneButton: Locator
  readonly continueButton: Locator
  readonly confirmButton: Locator
  readonly successIcon: Locator
  readonly quickActionButton: (action: QuickActionButton) => Locator

  constructor(page: Page, context: BrowserContext, vwmock?: any) {
    super(page, context, vwmock)
    this.profile = new AccountModalProfile(page)
    this.assets = new AccountModalAssets(page)
    this.settings = new AccountModalSettings(page)
    this.notifications = new AccountModalNotifications(page)

    this.modalBody = this.page.locator("//*[contains(@class, 'chakra-modal__content-container')]")
    this.closeButton = this.modalBody.locator("//button[@aria-label='Close']")
    this.backButton = this.modalBody.locator("//button[@aria-label='Back']")
    this.modalTitle = this.modalBody.locator("//*[contains(@id, 'chakra-modal--header')]")
    this.doneButton = this.modalBody.locator("//button[text()='Done']")
    this.continueButton = this.page.getByTestId("continue-button")
    this.confirmButton = this.page.getByTestId('confirm-button')
    this.successIcon = this.page.getByTestId('success-icon')
    this.quickActionButton = (action: QuickActionButton) => this.page.getByTestId(`${action}-button-label`)
  }

  async closeModal() {
    return await test.step('Close account modal', async () => {
      await this.closeButton.click()
      await this.page.waitForTimeout(750) // wait for modal close animation
    })
  }

  async verifyButtonsTranslation(translations: ActivitiesButtonsTranslations) {
    return await test.step('Verify quick action buttons translation', async () => {
      const buttons = Object.keys(translations)
      for (const button of buttons) {
        const label = button as QuickActionButton
        await expect(this.quickActionButton(label)).toHaveText(translations[label])
      }
    })
  }

  async sendTx(amount: string, asset: AssetSymbol, addressOrDomain: string) {
    return await test.step(`Send '${amount}' '${asset}' to "${addressOrDomain}"`, async () => {
      // await this.quickActionButton('send').click()
      await this.assets.open()
      await this.assets.searchTokenInput.fill(asset)
      await this.assets.assetButton(asset).click()
      await this.assets.amountInput.fill(amount)
      await this.assets.addressInput.fill(addressOrDomain)
      await this.page.waitForTimeout(750) // wait for FE to do the form validation
      await expect(this.assets.amountErrorMsg).not.toBeVisible()
      await expect(this.assets.addressErrorMsg).not.toBeVisible()
      await this.assets.sendButton.click()
      if (addressOrDomain.includes('.veworld.vet')) {
        await expect(this.assets.recipientDomain).toHaveText(addressOrDomain)
      } else {
        await expect(this.assets.recipientAddress).toHaveText(trimAddress(addressOrDomain, 6))
      }
      await expect(this.assets.summaryAmount).toHaveText(`${amount} ${asset}`)
      await this.confirmButton.click()
      await expect(this.confirmButton).toContainText('Sending...')
    })
  }

  async expectTxStatus(txStatus: TxStatus) {
    return await test.step(`Expect transaction sending to resolve with ${txStatus}`, async () => {
      if (txStatus === 'success') {
        await expect(this.successIcon).toBeVisible()
      } else if (txStatus === 'error') {
        await expect(this.confirmButton).toHaveText('Retry')
        await expect(this.assets.txSendErrorMsg).toBeVisible()
      }
    })
  }

  /**
   * @param domain - domain name to claim
   * @param expectedStatus - optional; if specified - status check will be performed before
   *                         confirming the domain change
   */
  async claimDomainName(domain: string, expectedStatus?: DomainStatus) {
    return await test.step(`Claim domain name: "${domain}"`, async () => {
      await this.profile.open()
      await this.profile.customizeButton.click()
      await this.profile.setDomainNameButton.click()
      if (await this.modalTitle.textContent() === 'Choose your account name') {
        await this.profile.chooseNameButton.click()
      }
      await this.profile.domainInput.fill(domain)
      if (expectedStatus) {
        await this.expectDomainStatus(expectedStatus)
      }
      if (expectedStatus === 'taken') return
      await this.continueButton.click()
      await expect(this.profile.preconfirmDomain).toHaveText(`${domain}.veworld.vet`)
      await this.confirmButton.click()
    })
  }

  async expectDomainStatus(status: DomainStatus) {
    return test.step(`Expect domain status to be "${status}"`, async () => {
      await expect(this.profile.domainAvailabilityStatus)
          .toHaveText(DOMAIN_STATUS[status])
    })
  }

  async logOut() {
    return test.step('Log out', async () => {
      await this.profile.open()
      await this.profile.logoutButton.click()
      await this.profile.disconnectButton.click()
    })
  }

  async personalizeAccount(data: PersonalizationData) {
    return await test.step('Personalize account', async () => {
      await this.profile.customizeButton.click()
      if (data.displayName) await this.profile.displayNameInput.fill(data.displayName!)
      if (data.description) await this.profile.descriptionInput.fill(data.description!)
      if (data.socialLinks) {
        if (data.socialLinks.email) await this.profile.twitterInput.fill(data.socialLinks!.twitter!)
        if (data.socialLinks.website) await this.profile.websiteInput.fill(data.socialLinks!.website!)
        if (data.socialLinks.twitter) await this.profile.emailInput.fill(data.socialLinks!.email!)
      }
      await this.profile.saveChangesButton.click()
      await this.confirmButton.click()
    })
  }

  async expectPersonalizedInfo(data: PersonalizationData) {
    return await test.step('Expect submitted personalization data to be correct', async () => {
      if (data.displayName) await expect(this.profile.displayNameVal).toHaveText(data.displayName!)
      if (data.description) await expect(this.profile.descriptionVal).toHaveText(data.description!)
      if (data.socialLinks) {
        if (data.socialLinks.email)
          await expect(this.profile.emailVal).toHaveAttribute('href', `mailto:${data.socialLinks!.email}`)

        if (data.socialLinks.website)
          await expect(this.profile.websiteVal).toHaveAttribute('href', data.socialLinks.website!)

        if (data.socialLinks.twitter)
          await expect(this.profile.twitterVal).toHaveAttribute('href', `https://x.com/${data.socialLinks.twitter!}`)
      }
    })
  }

  async openNotifications() {
    return await test.step('Open notifications', async () => {
      await this.settings.open()
      await this.settings.openSection('notifications')
    })
  }
}
