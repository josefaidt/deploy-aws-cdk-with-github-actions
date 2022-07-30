# Deploy AWS CDK apps with GitHub Actions

Using temporary AWS credentials to deploy CDK apps with GitHub Actions.

## What's Included

- [CDK Construct to create resources for GitHub Actions](./src/github-actions.ts)
- [GitHub Actions workflow to release](./.github/workflows/release.yml)
  - uses [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials) action

## Get Started

1. `gh repo fork josefaidt/deploy-aws-cdk-with-github-actions`
2. modify the repository name in [`src/app.ts`](./src/app.ts#L27)
3. `pnpm install`
4. `pnpm cdk synth`
5. `pnpm cdk deploy`
6. create the following secrets in GitHub using the output from the initial deployment
   a. `AWS_ROLE_TO_ASSUME` - use the ARN output from the deployment
   b. `AWS_ROLE_SESSION_NAME` - the name to use for the session (e.g. `github-actions-deploy-<repo-name>`)
7. modify the [`AWS_REGION`](./.github/workflows/release.yml#L7) environment variable in the GitHub Actions workflow
8. push to git
9. you're ready to deploy using GitHub Actions 🎉

## Features

- uses [`vite-node`](https://www.npmjs.com/package/vite-node) to execute CDK app
- [tsconfig](./tsconfig.json) is configured to support ESM (no need to build the app)
- resources created with this app are tagged with this repository's version from `package.json`

## Moving Forward

- copy the `release` workflow to other repositories to deploy other CDK applications!
- create an action to add additional repositories to the trust policy (demo currently creates the trust policy enabling _all_ repositories within `josefaidt`, however we can specify individual repositories)
- with `vite-node`, we can add a dotenv file for [public environment variables](https://vitejs.dev/config/#environment-variables) (add `vite` for `import.meta` types)
- with `vite-node`, we can also expand to add tests with [`vitest`](https://vitest.dev/)
