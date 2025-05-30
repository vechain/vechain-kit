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
