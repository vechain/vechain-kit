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
