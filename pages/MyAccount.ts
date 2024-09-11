import { type Locator, type Page } from '@playwright/test'

export class MyAccount {
    readonly page: Page;
    readonly pageHeading: Locator;
    readonly errorMessage: Locator;

    constructor(page) {
        this.page = page
        this.pageHeading = page.getByRole('heading', { name: 'My Account' })
        this.errorMessage = page.locator('[data-qa="error-message"]')
    }

    visit = async () => {
        await this.page.goto("/my-account")
    }

    waitForPageHeading = async () => {
        await this.pageHeading.waitFor()
    }

    waitForErrorMessage = async () => {
        await this.errorMessage.waitFor()
    }
}