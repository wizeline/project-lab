const { test, expect } = require("@playwright/test")
const { generateToken } = require("authenticator")
require("dotenv").config()
//console.log(process.env)

test("Login test ", async ({ page, context }) => {
  await page.goto("https://labs.wizeline.com/")

  await page.locator("text=Login with your Wizeline email account").click()
  await page.locator("button:has-text('Continue with Google')").click()
  await page.locator("[aria-label='Correo electrónico o teléfono']").fill(process.env.OKTA_USERNAME)
  await page.locator("button:has-text('Siguiente')").click()
  await page.locator("#okta-signin-username").fill(process.env.OKTA_USERNAME)
  await page.locator("#okta-signin-password").fill(process.env.OKTA_PASSWORD)
  await page.locator("input:has-text('Sign In')").click()
  let otp = generateToken(process.env.SECRET_KEY)
  await page.locator("#input59").fill(otp)
  await page.locator("input:has-text('Verify')").click()
  await page.pause()
})