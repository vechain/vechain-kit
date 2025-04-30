import { Page } from "playwright"
import {BrowserContext, Locator, test} from "@playwright/test"
import { BasePage } from "./BasePage"
import {HOMEPAGE} from "../constants";
import {SocialLoginModal} from "./SocialLoginModal";

/**
 * Dashboard page models
 */
export class HomePage extends BasePage {
  readonly loginButton: Locator
  readonly loginWithVechainButton: Locator
  readonly connectWalletButton: Locator
  readonly veworldButton: Locator
  readonly socialLoginButton: Locator

  constructor(page: Page, context: BrowserContext, vwmock?: any) {
    super(page, context, vwmock)

    this.loginButton = this.page.getByText('Login')
    this.loginWithVechainButton = this.page.getByText('Login with VeChain')
    this.connectWalletButton = this.page.locator("//*[text()='Connect wallet']/../..")
    this.veworldButton = this.page.getByTestId('VeWorld')
    this.socialLoginButton = this.page.getByText('Use social login with VeChain')
  }

  async open() {
    return await test.step('Open home page', async () => {
      await this.vwmock.load(this.page)
      await this.page.goto(HOMEPAGE)
    })
  }

  async connectWallet() {
    return await test.step('Connect VeChain Wallet', async () => {
      await this.loginButton.click()
      await this.connectWalletButton.click()
      await this.veworldButton.click()
    })
  }

  async loginWithEmail(email: string) {
    return await test.step(`Login with Email address: "${email}"`, async () => {
      await this.loginButton.click()

      // instantiate the context of the auth modal window
      const [page_socialLoginModal] = await Promise.all([
        this.context.waitForEvent('page'),
        this.socialLoginButton.click()
      ])
      // init console and network error event listeners for the modal page context
      page_socialLoginModal.on('console', msg => {
        if (msg.type() === 'error') {
          console.error(`[CONSOLE ERROR] (#Privy) - ${msg.text()}\n________\n`);
        }
      });
      page_socialLoginModal.on('requestfailed', request => {
        console.error(`[NETWORK ERROR] (#Privy) - ${request.method().toUpperCase()} ${request.url()}\n${request.failure()?.errorText}\n________\n`);
      });

      const socialLoginModal = new SocialLoginModal(page_socialLoginModal)
      await socialLoginModal.fillInEmailAndSubmit(email)
    })
  }
}
