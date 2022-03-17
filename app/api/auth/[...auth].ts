import { passportAuth } from "blitz"
import db from "db"
import { Strategy as Auth0Strategy } from "passport-auth0"
import { getUserProfile } from "app/auth/mutations/login"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  strategies: [
    {
      authenticateOptions: { scope: "openid email profile" },

      strategy: new Auth0Strategy(
        {
          domain: process.env.AUTH0_DOMAIN,
          clientID: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          callbackURL: `${process.env.BASE_URL}/api/auth/auth0/callback`,
        },
        async (_token, _tokenSecret, extraParams, profile, done) => {
          const email = profile.emails && profile.emails[0]?.value

          if (!email) {
            // This can happen if you haven't enabled email access in your twitter app permissions
            return done(new Error("Auth0 response doesn't have email."))
          }

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
            },
            update: { email, name: profile.displayName },
          })
          const profileId = await getUserProfile(user.id)

          const publicData = {
            userId: user.id,
            profileId: profileId,
            roles: [user.role],
            source: "auth0",
          }
          done(undefined, { publicData })
        }
      ),
    },
  ],
})
