// @ts-check
const { test, expect } = require("@playwright/test")
require("dotenv").config()

test("Login test flow", async ({ page, context }) => {
  await page.goto(process.env.APP_URL + "/testLogin")

  await page.locator("input[name='email']").fill(process.env.TEST_USER)
  await page.locator("input[name='password']").fill(process.env.TEST_USER_PASSWORD)

  await page.locator("text=Create Account").click()
  await page.pause()
  await page.waitForSelector(".logo--text")
  await context.storageState({ path: "state.json" })
})
