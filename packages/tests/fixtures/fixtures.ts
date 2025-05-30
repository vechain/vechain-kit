import { test as base } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`[CONSOLE ERROR] ${msg.text()}\n\n________\n\n`);
            }
        });

        page.on('requestfailed', request => {
            console.error(`[NETWORK ERROR] ${request.method().toUpperCase()} ${request.url()}\n${request.failure()?.errorText}\n\n________\n\n`);
        });

        await use(page);
    },
});