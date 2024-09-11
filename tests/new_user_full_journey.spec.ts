import {test, expect } from "@playwright/test"
import { v4 as uuidv4 } from "uuid"
import { Products } from "../pages/Products.ts"
import { Navigation } from "../pages/Navigation.ts"
import { Checkout } from "../pages/Checkout.ts"
import { Login } from "../pages/Login.ts"
import { Register } from "../pages/Register.ts"
import { DeliveryDetails } from "../pages/DeliveryDetails.ts"
import { deliveryDetails as userAddress } from "../data/deliveryDetails.ts"
import { Payment } from "../pages/Payment.ts"
import { paymentDetails } from "../data/paymentDetails.ts"

test("New user e2e journey", async ({ page }) => {
    const productsPage = new Products(page);
    await productsPage.visit()
    await productsPage.sortByCheapest()
    await productsPage.addProductToBasket(0)
    await productsPage.addProductToBasket(1)
    await productsPage.addProductToBasket(2)
    const navigation = new Navigation(page)
    await navigation.goToCheckout()

    const checkout = new Checkout(page)
    await checkout.removeCheapestProduct()
    await checkout.continueToCheckout()

    const login = new Login(page)
    await login.moveToSignup()

    const registerPage = new Register(page)
    const email = uuidv4() + "@gmail.com"
    const password = uuidv4()
    await registerPage.signUpAsNewUser(email, password)

    const deliveryDetails = new DeliveryDetails(page)
    await deliveryDetails.fillDetails(userAddress)
    await deliveryDetails.saveDetails()
    await deliveryDetails.continueToPayment()

    const paymentPage = new Payment(page)
    await paymentPage.activateDiscount()
    await paymentPage.fillPaymentDetails(paymentDetails)

    await paymentPage.completePayment()
})