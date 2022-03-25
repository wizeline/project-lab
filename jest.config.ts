import type { Config } from "@jest/types"
const blitzPreset = require("blitz/jest-preset")

const config: Config.InitialOptions = {
  ...blitzPreset,
  projects: blitzPreset.projects.map((p: any) => ({
    ...p,
    testPathIgnorePatterns: [...p.testPathIgnorePatterns, "playwright"],
  })),
}

export default config
