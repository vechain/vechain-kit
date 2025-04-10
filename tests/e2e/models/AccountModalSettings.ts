import {Page} from "playwright";
import {Locator, test} from "@playwright/test";

export class AccountModalSettings {
    private readonly page: Page;
    readonly settingsButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.settingsButton = this.page.getByTestId('settings-button-label')
    }

    async open() {
        return test.step('Open "Settings" section', async () => {
            await this.settingsButton.click()
        })
    }
}
