import {BrowserContext, Page, test} from "@playwright/test"

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
}
