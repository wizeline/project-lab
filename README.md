[![Blitz.js](https://raw.githubusercontent.com/blitz-js/art/master/github-cover-photo.png)](https://blitzjs.com)

This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **proposalHunt**

## Requirements

First you should install postgres on your computer. For MacOS an easy method is to use [Postgres.app](https://postgresapp.com/downloads.html). If you have an M1 chip, the lastest version has support for it without Rossetta. As documented in their [page](https://postgresapp.com/documentation/cli-tools.html), you can add postgresql tools to your path using:

```
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
```

After that you can create a DB using the commands:

```
createdb projectlab
createdb projectlab_test
```

## Getting Started

### Environment Variables

1. In root, create `.env.local` file with the following:

```
DATABASE_URL=postgresql://[username]@localhost:5432/projectlab
AUTH0_CLIENT_ID=
AUTH0_DOMAIN=
AUTH0_CLIENT_SECRET=

## Optional, for WizelineOS sync-* commands
WOS_AUTH_API_URL=
WOS_AUTH_API_AUDIENCE=
WOS_AUTH_API_CLIENT_ID=
WOS_AUTH_API_CLIENT_SECRET=
WOS_API_URL=
```

2. In root, create `.env.test.local` file with the following:

```
DATABASE_URL=postgresql://[username]@localhost:5432/projectlab_test
```

3. Ask in `#team-projectlab` channel on _Slack_
   for the environment values for `.env.local` and `.env.test.local`.

4. Edit `db/seeds.ts` file and add your user at the very bottom, make sure to replace with your data:

```
  await db.profiles.upsert({
    where: { email: "[YOUR_USERNAME]@wizeline.com" },
    update: {},
    create: {
      email: "[YOUR_USERNAME]@wizeline.com",
      firstName: "[YOUR_FIRNAME]",
      lastName: "[YOUR_LASTNAME]",
      department: "[YOUR_DEPARTMENT]",
    },
  })
```

5. (Only dev environment) Set the project's node version with NVM. If you don't have NVM installed read the [documentation](https://github.com/nvm-sh/nvm):

```
nvm use
```

6. Install dependencies:

```
yarn install
```

7. Create or reset the database schema:

```
npx blitz prisma migrate reset
```

8. Sync profiles and skills from Wizeline OS, this is optional and it takes a couple of minutes, the seeding contains sample data that can be enough to run locally:

```
yarn sync-all-from-wos
```

9. Populate with test data:

```
npx blitz db seed
```

10. Run blitz:

```
npx blitz dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in a browser to see the result.

---

## Tests

Runs your tests using Jest.
The used database will be the defined in `.env.test.local` otherwise `.env` will be used.

```
yarn test
```

Blitz comes with a test setup using [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/).

## Update BlitzJS

BlitzJS is updated constantly so in order to get the latest features we need to mantain the package in its `LTS` version. These are the steps to upgarde BlitzJS in the project:

1. Update the global BlitzJS package through yarn:

```
yarn global add blitz
```

2. Navigate to the parent directory of the project, for example if the project is located at `~/dev/projects/project-lab` you have to navigate to `~/dev/projects`.

3. Once you are located in the parent directory, run the following command:

```
blitz new project-lab
```

4. A prompt will be launched with a series of options, you should skip the generation of the following files:

   - Database generation
   - package.json
   - Authentication
   - README.md

5. Finally, follow the **Getting started** instructions from **step 5** to make sure everything is working.

## Impersonate Users

Admin users are allowed to impersonate other other in the App.

### Prerequisites

1. The User must be an admin user.
2. The User you want to impersonate must exist in the `User`table.

### Steps

1. Go to the `/impersonate` path to access the impersonate page. There is no button for this path so you must type it manually.
2. Type the user email you want to impersonate and click on 'Switch to User'.
3. Click on 'GO HOME' and that's it! You are now impersonating this User.

To Stop impersonating, go to the `/impersonate` path and click on 'STOP IMPERSONATING', you will stop the impersonating, and it's done!

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## What's included?

Here is the starting structure of your app.

```
proposalHunt
├── app/
│   ├── api/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── mutations/
│   │   │   ├── changePassword.ts
│   │   │   ├── forgotPassword.test.ts
│   │   │   ├── forgotPassword.ts
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   ├── resetPassword.test.ts
│   │   │   ├── resetPassword.ts
│   │   │   └── signup.ts
│   │   ├── pages/
│   │   │   ├── forgot-password.tsx
│   │   │   ├── login.tsx
│   │   │   ├── reset-password.tsx
│   │   │   └── signup.tsx
│   │   └── validations.ts
│   ├── core/
│   │   ├── components/
│   │   │   ├── Form.tsx
│   │   │   └── LabeledTextField.tsx
│   │   ├── hooks/
│   │   │   └── useCurrentUser.ts
│   │   └── layouts/
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── 404.tsx
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   └── users/
│       └── queries/
│           └── getCurrentUser.ts
├── db/
│   ├── index.ts
│   ├── schema.prisma
│   └── seeds.ts
├── integrations/
├── mailers/
│   └── forgotPasswordMailer.ts
├── public/
│   ├── favicon.ico*
│   └── logo.png
├── test/
│   ├── setup.ts
│   └── utils.tsx
├── README.md
├── babel.config.js
├── blitz.config.js
├── jest.config.js
├── package.json
├── tsconfig.json
├── types.d.ts
├── types.ts
└── yarn.lock
```

These files are:

- The `app/` folder is a container for most of your project. This is where you’ll put any pages or API routes.

- `db/` is where your database configuration goes. If you’re writing models or checking migrations, this is where to go.

- `public/` is a folder where you will put any static assets. If you have images, files, or videos which you want to use in your app, this is where to put them.

- `integrations/` is a folder to put all third-party integrations like with Stripe, Sentry, etc.

- `test/` is a folder where you can put test utilities and integration tests.

- `package.json` contains information about your dependencies and devDependencies. If you’re using a tool like `npm` or `yarn`, you won’t have to worry about this much.

- `tsconfig.json` is our recommended setup for TypeScript.

- `.babelrc.js`, `.env`, etc. ("dotfiles") are configuration files for various bits of JavaScript tooling.

- `blitz.config.js` is for advanced custom configuration of Blitz. It extends [`next.config.js`](https://nextjs.org/docs/api-reference/next.config.js/introduction).

- `jest.config.js` contains config for Jest tests. You can [customize it if needed](https://jestjs.io/docs/en/configuration).

You can read more about it in the [File Structure](https://blitzjs.com/docs/file-structure) section of the documentation.

### Tools included

Blitz comes with a set of tools that corrects and formats your code, facilitating its future maintenance. You can modify their options and even uninstall them.

- **ESLint**: It lints your code: searches for bad practices and tell you about it. You can customize it via the `.eslintrc.js`, and you can install (or even write) plugins to have it the way you like it. It already comes with the [`blitz`](https://github.com/blitz-js/blitz/tree/canary/packages/eslint-config) config, but you can remove it safely. [Learn More](https://eslint.org).
- **Husky**: It adds [githooks](https://git-scm.com/docs/githooks), little pieces of code that get executed when certain Git events are triggerd. For example, `pre-commit` is triggered just before a commit is created. You can see the current hooks inside `.husky/`. If are having problems commiting and pushing, check out ther [troubleshooting](https://typicode.github.io/husky/#/?id=troubleshoot) guide. [Learn More](https://typicode.github.io/husky).
- **Prettier**: It formats your code to look the same everywhere. You can configure it via the `.prettierrc` file. The `.prettierignore` contains the files that should be ignored by Prettier; useful when you have large files or when you want to keep a custom formatting. [Learn More](https://prettier.io).

## Learn more

Read the [Blitz.js Documentation](https://blitzjs.com/docs/getting-started) to learn more.

The Blitz community is warm, safe, diverse, inclusive, and fun! Feel free to reach out to us in any of our communication channels.

- [Website](https://blitzjs.com/)
- [Discord](https://discord.blitzjs.com/)
- [Report an issue](https://github.com/blitz-js/blitz/issues/new/choose)
- [Forum discussions](https://github.com/blitz-js/blitz/discussions)
- [How to Contribute](https://blitzjs.com/docs/contributing)
- [Sponsor or donate](https://github.com/blitz-js/blitz#sponsors-and-donations)
