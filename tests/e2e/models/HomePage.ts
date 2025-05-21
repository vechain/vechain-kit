import { BrowserContext, Locator, test } from '@playwright/test';
import { Page } from 'playwright';

import { HOMEPAGE } from '../constants';
import { BasePage } from './BasePage';
import { SocialLoginModal } from './SocialLoginModal';

/**
 * Dashboard page models
 */
export class HomePage extends BasePage {
    readonly loginButton: Locator;
    readonly loginWithVechainButton: Locator;
    readonly connectWalletButton: Locator;
    readonly veworldButton: Locator;
    readonly socialLoginButton: Locator;
    readonly acceptTncButton: Locator;
    readonly rejectTncButton: Locator;

    constructor(page: Page, context: BrowserContext, vwmock?: any) {
        super(page, context, vwmock);

        this.loginButton = this.page.getByText('Login');
        this.loginWithVechainButton = this.page.getByText('Login with VeChain');
        this.connectWalletButton = this.page.locator(
            "//*[text()='Connect wallet']/../..",
        );
        this.veworldButton = this.page.getByTestId('VeWorld');
        this.socialLoginButton = this.page.getByText(
            'Use social login with VeChain',
        );
        this.acceptTncButton = this.page.getByTestId('accept-tnc-button');
        this.rejectTncButton = this.page.getByTestId('reject-tnc-button');
    }

    async open() {
        return await test.step('Open home page', async () => {
            await this.vwmock.load(this.page);
            await this.page.goto(HOMEPAGE);
        });
    }

    async acceptTnc() {
        return await test.step('Accept Terms & Conditions', async () => {
            await this.acceptTncButton.click();
        });
    }

    async rejectTnc() {
        return await test.step('Reject Terms and Conditions', async () => {
            await this.rejectTncButton.click();
        });
    }

    async connectWallet(args?: { acceptTnc: boolean }) {
        return await test.step('Connect VeChain Wallet', async () => {
            await this.loginButton.click();
            await this.connectWalletButton.click();
            await this.veworldButton.click();
            if (args) {
                switch (args!.acceptTnc) {
                    case true:
                        await this.acceptTnc();
                        break;
                    case false:
                        await this.rejectTnc();
                        break;
                    default:
                        console.error(
                            `unknown 'acceptTnc' value received: "${
                                args!.acceptTnc
                            }", omitting taking action`,
                        );
                        break;
                }
            }
        });
    }

    async loginWithEmail(args: { email: string; acceptTnc?: boolean }) {
        return await test.step(`Login with Email address: "${args.email}"`, async () => {
            await this.loginButton.click();

            // instantiate the context of the auth modal window
            const [page_socialLoginModal] = await Promise.all([
                this.context.waitForEvent('page'),
                this.socialLoginButton.click(),
            ]);
            // init console and network error event listeners for the modal page context
            page_socialLoginModal.on('console', (msg) => {
                if (msg.type() === 'error') {
                    console.error(
                        `[CONSOLE ERROR] (#Privy) - ${msg.text()}\n________\n`,
                    );
                }
            });
            page_socialLoginModal.on('requestfailed', (request) => {
                console.error(
                    `[NETWORK ERROR] (#Privy) - ${request
                        .method()
                        .toUpperCase()} ${request.url()}\n${
                        request.failure()?.errorText
                    }\n________\n`,
                );
            });

            const socialLoginModal = new SocialLoginModal(
                page_socialLoginModal,
            );
            await socialLoginModal.fillInEmailAndSubmit(args.email);
            if (args.acceptTnc !== null) {
                switch (args!.acceptTnc) {
                    case true:
                        await this.acceptTnc();
                        break;
                    case false:
                        await this.rejectTnc();
                        break;
                    default:
                        console.error(
                            `unknown 'acceptTnc' value received: "${
                                args!.acceptTnc
                            }", omitting taking action`,
                        );
                        break;
                }
            }
        });
    }
}
