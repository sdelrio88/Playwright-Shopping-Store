import { expect, type Locator, type Page } from '@playwright/test'

export class Checkout {
    readonly page: Page;
    readonly basketCards: Locator;
    readonly basketItemPrice: Locator;
    readonly basketItemRemoveButton: Locator;
    readonly continueToCheckoutButton: Locator;

    constructor(page) {
        this.page = page

        this.basketCards = page.locator('[data-qa="basket-card"]')
        this.basketItemPrice = page.locator('[data-qa="basket-item-price"]')
        this.basketItemRemoveButton = page.locator('[data-qa="basket-card-remove-item"]')
        this.continueToCheckoutButton = page.locator('[data-qa="continue-to-checkout"]')
    }

    removeCheapestProduct = async () => {
        await this.basketCards.first().waitFor()
        const itemsBeforeRemoval = await this.basketCards.count()
        await this.basketItemPrice.first().waitFor()
        const allPriceTexts = await this.basketItemPrice.allInnerTexts()
        // [ '499$', '599$', '320$' ] -> [ 499, 599, 320 ]
        const justNumbers = allPriceTexts.map((element) => {
            const withoutDollarSign = element.replace("$", "") // '499$' -> '499'
            return parseInt(withoutDollarSign, 10)
        })
        const smallestPrice = Math.min(...justNumbers)
        const smallestPriceIdx = justNumbers.indexOf(smallestPrice)
        const specificRemoveButton = this.basketItemRemoveButton.nth(smallestPriceIdx)
        await specificRemoveButton.waitFor()
        await specificRemoveButton.click()
        await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1)
    }

    continueToCheckout = async () => {
        await this.continueToCheckoutButton.waitFor()
        await this.continueToCheckoutButton.click()
        await this.page.waitForURL(/\/login/, {timeout: 3000})
    }
}