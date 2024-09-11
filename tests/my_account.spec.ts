import { test } from "@playwright/test"
import { MyAccount } from "../pages/MyAccount.ts"
import { getLoginToken } from "../api/getLoginToken.ts"
import { adminDetails } from "../data/userDetails.ts"

test("My Account using cookie injection and mocked network request", async ({ page }) => {
    // Make a request to get login token
    const loginToken = await getLoginToken(adminDetails.username, adminDetails.password)

    // Mock the request to the api/user endpoint
    await page.route("**/api/user**", async (route, request) => {
        await route.fulfill({
            status: 500,
            contentType: "application/json",
            body: JSON.stringify({message: "PLAYWRIGHT ERROR FROM MOCKING"}),
        })
    })

    const myAccount = new MyAccount(page)
    await myAccount.visit()
    // Inject the login token into the browser
    await page.evaluate(([loginTokenInsideBrowserCode]) => {
        document.cookie = "token=" + loginTokenInsideBrowserCode
    }, [loginToken])
    await myAccount.visit()
    await myAccount.waitForPageHeading()
    await myAccount.waitForErrorMessage()
})