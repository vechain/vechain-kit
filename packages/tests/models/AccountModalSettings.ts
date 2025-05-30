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
