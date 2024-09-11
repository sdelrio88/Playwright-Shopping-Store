import { type Locator, type Page } from '@playwright/test'

export class Register {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;

    constructor(page) {
        this.page = page

        this.emailInput = page.getByPlaceholder('e-mail')
        this.passwordInput = page.getByPlaceholder('password')
        this.registerButton = page.getByRole('button', { name: 'register' })
    }

    signUpAsNewUser = async (email, password) => {
        // type into email input
        await this.emailInput.waitFor()
        await this.emailInput.fill(email)
        // type into password input
        await this.passwordInput.waitFor()
        await this.passwordInput.fill(password)
        // click register button
        await this.registerButton.waitFor()
        await this.registerButton.click()
    }
}