const { test, expect } = require("@playwright/test")

test("Login cookie json", async ({ browser }) => {
  const context = await browser.newContext({ storageState: "state.json" })
  const page = await context.newPage()
  await page.goto("https://labs.wizeline.com/")
  await page.pause()
})
