const { test, expect } = require("@playwright/test")
require("dotenv").config()

test("Login cookie json", async ({ browser }) => {
  const context = await browser.newContext({ storageState: "state.json" })
  const page = await context.newPage()
  await page.goto(process.env.APP_URL, { timeout: 60000 })

  await page.pause()
})
