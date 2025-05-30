import {Page} from "playwright";
import {Locator, test, expect} from "@playwright/test";
import {NotificationsViewName} from "./types";

export class AccountModalNotifications {
    private readonly page: Page
    readonly modalTitle: Locator
    readonly clearAllButton: Locator
    readonly notificationsList: Locator
    readonly notificationTitle: (index: number) => Locator
    readonly notificationDescription: (index: number) => Locator
    readonly archiveNotificationButton: (index: number) => Locator
    readonly toggleViewButton: Locator

    constructor(page: Page) {
        this.page = page
        this.modalTitle = this.page.getByTestId('modal-title')
        this.clearAllButton = this.page.getByTestId('clear-all-button')
        this.toggleViewButton = this.page.getByTestId('toggle-view-button')
        this.notificationsList = this.page.locator("[data-testid='notification-item']")
        this.notificationTitle = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('notification-title')
        this.notificationDescription = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('notification-text')
        this.archiveNotificationButton = (index: number) =>
            this.page.getByTestId('notification-item').nth(index).getByTestId('remove-notification-button')
    }

    async clearAll() {
        return test.step('Clear all notifications', async () => {
            await this.clearAllButton.click()
        })
    }

    async switchToView(viewName: NotificationsViewName) {
        return test.step(`Switch to "${viewName}" notifications view`, async () => {
            const expectedTitle = viewName === 'archived'
                ? 'Archived Notifications'
                : 'Notifications'
            const currentView = await this.modalTitle.textContent()
            if (currentView !== expectedTitle) {
                await this.toggleViewButton.click()
            }
        })
    }

    async expectNotificationByTitle(title: string) {
        return await test.step(`Expect a notification to be on the list: "${title}"`, async () => {
            const count = await this.notificationsList.count()
            let isNotificationDisplayed = false
            for (let i = 0; i < count; i++) {
                try {
                    const actualTitle = await this.notificationTitle(i).innerText()
                    expect(actualTitle).toBe(title)
                    isNotificationDisplayed = true
                    break
                } catch(e) {console.error(e)}
            }
            expect(isNotificationDisplayed).toBe(true)
        })
    }

    async archiveNotification(title: string) {
        return await test.step(`Archive notification with the title: "${title}"`, async () => {
            const notifIndex = await this.findNotificationByTitle(title)
            await this.archiveNotificationButton(notifIndex).click()
        })
    }

    async findNotificationByTitle(title: string) {
        const count = await this.notificationsList.count()
        let index = 0
        for (let i = 0; i < count; i++) {
            try {
                const actualTitle = await this.notificationTitle(i).innerText()
                expect(actualTitle).toBe(title)
                index = i
                break
            } catch(e) {console.error(e)}
        }

        await this.notificationsList.nth(index).scrollIntoViewIfNeeded()
        return index
    }
}
