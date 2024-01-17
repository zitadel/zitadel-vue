# ZITADEL Vue SDK

Authenticate your [ZITADEL](https://zitadel.com) users within your Vue applications.

![NPM Version](https://img.shields.io/npm/v/@zitadel/vue)
![NPM License](https://img.shields.io/npm/l/@zitadel/vue)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

## Getting Started

- Check out the docs on how to [integrate ZITADEL into your existing Vue application](https://zitadel.com/docs/examples/login/vue).
- Create a new Vue application with ZITADEL integration from scratch by following the example at [ZITADEL Vue example application](https://github.com/zitadel/zitadel-vue/blob/main/README.md).

## Features

The NPM package [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) wraps the NPM package [vue-oidc-client](https://github.com/soukoku/vue-oidc-client).
All [vue-oidc-client](https://github.com/soukoku/vue-oidc-client) features are available and the whole configuration can be overridden.

The following features are added to [vue-oidc-client](https://github.com/soukoku/vue-oidc-client)

- [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) defaults as much configuration as possible.
- [@zitadel/vue](https://www.npmjs.com/package/@zitadel/vue) provides a simple way to check for user roles.

The following is an example for a minimal OIDC configuration:

```typescript
const zitadelAuth = createZITADELAuth({
   issuer: `${myZITADELInstancesOrigin}`,
   client_id: `${myApplicationsClientID}`,
   project_resource_id: `${myApplicationsProjectResourceID}`,
})
```

The following defaults apply:
- The OIDC Code Flow with PKCE is used for authentication at ZITADEL.
- ZITADELs user info endpoint is called to enrich the user profile.
- The access token is refreshed automatically by default before it expires.
- If you specify a *project_resource_id*, the scopes for retrieving the users roles from the user info endpoint are added automatically.
  You can conveniently use `zitadelAuth.hasRole("someRoleKey")`.