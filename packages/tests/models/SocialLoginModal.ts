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
