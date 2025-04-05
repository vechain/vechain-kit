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
}
