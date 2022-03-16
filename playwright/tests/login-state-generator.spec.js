// @ts-check
const { test, expect } = require("@playwright/test")

test("Login test flow", async ({ page, context }) => {
  await page.goto("https://labs.wizeline.com/")

  await page.locator("text=Login with your Wizeline email account").click()
  await page.locator("button:has-text('Continue with Google')").click()
  await page.locator("[aria-label='Correo electrónico o teléfono']").fill(process.env.OKTA_USERNAME)
  await page.locator("button:has-text('Siguiente')").click()
  await page.locator("input[name='username']").fill(process.env.OKTA_USERNAME)
  await 1
  await page.locator("#okta-signin-password").fill(process.env.OKTA_PASSWORD)
  await page.locator("input:has-text('Sign In')").click()
  await page.pause()
  await context.storageState({ path: "state.json" })
})
