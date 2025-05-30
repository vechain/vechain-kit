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
