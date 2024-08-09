# @zitadel/vue Example

Authenticate your [ZITADEL](https://zitadel.com) users within your Vue applications.

![NPM Version](https://img.shields.io/npm/v/@zitadel/vue)
![NPM License](https://img.shields.io/npm/l/@zitadel/vue)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

> [!IMPORTANT]
> If you want to try out [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue), read the [ZITADEL step-by-step guide for Vue](https://zitadel.com/docs/examples/login/vue).
> It shows how to get the *client_id* and the *project_resource_id* from ZITADEL and how to wire everything up in Vue.

## Project Structure

The example project is generated in the repositories root directory using [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project).

The following pages are added to the scaffolded example application:
- *src/views/Login.vue*: The protected login page shows the information retrieved from ZITADEL when a user is authenticated.
- *src/views/Admin.vue*: The protected admin page renders different views depending on if the user has the role "admin" or not.

![Example GUI](./example-gui.png)

The following files are added or modified to enable ZITADEL authentication:
- *src/router/index.ts*: The routes are protected using the meta field *authName* and conditional lazy loading.
- *src/App.vue*: The navigation bar is conditionally rendered depending on the authentication state.
- *src/services/zitadelAuth.ts*: The [@zitadel/vue SDK](https://www.npmjs.com/package/@zitadel/vue) is configured.
- The file *src/main.ts* shows how the Vue application is bootstrapped with ZITADEL auth support.
- The folder *./lib* contains the [@zitadel/vue SDK](https://www.npmjs.com/package/@zitadel/vue).

## Features

The NPM package [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) wraps the NPM package [vue-oidc-client](https://github.com/soukoku/vue-oidc-client).
All [vue-oidc-client](https://github.com/soukoku/vue-oidc-client) features are available and the whole configuration can be overridden.

The following features are added to [vue-oidc-client](https://github.com/soukoku/vue-oidc-client)

- [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) defaults as much configuration as possible.
- [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) provides a simple way to check for user roles.
- An example application is provided to show how to use [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue).

The following is an example for a minimal OIDC configuration:

```typescript
const zitadelAuth = createZITADELAuth({
   issuer: `${myZITADELInstancesOrigin}`,
   client_id: `${myApplicationsClientID}`,
   project_resource_id: `${myApplicationsProjectResourceID}`,
   organization_id: `${myApplicationsOrganizationID}`, // optional
})
```

The following defaults apply:
- The OIDC Code Flow with PKCE is used for authentication at ZITADEL.
- ZITADELs user info endpoint is called to enrich the user profile.
- The access token is refreshed automatically by default before it expires.
- If you specify a *project_resource_id*, the scopes for retrieving the users roles from the user info endpoint are added automatically.
You can conveniently use `zitadelAuth.hasRole("someRoleKey")`.

Optional:
- add an *organization_id* to register and login users directly in the organization scope.

## Running the Example

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
yarn
```

#### Compile and Hot-Reload for Development

```sh
yarn dev
```

#### Type-Check, Compile and Minify for Production

```sh
yarn build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
