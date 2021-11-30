import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  env: {
    BASE_URL: "http://localhost:3000",
    SLACK_NOTIFICATION_WEBHOOK:
      "https://hooks.slack.com/services/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",
  },
  middleware: [
    sessionMiddleware({
      cookiePrefix: "proposalHunt",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.slack-edge.com", "s3.us-west-1.amazonaws.com"],
  },
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
