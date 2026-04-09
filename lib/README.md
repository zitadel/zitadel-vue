# ZITADEL Vue SDK

Authenticate your [ZITADEL](https://zitadel.com) users within your Vue applications.

![NPM Version](https://img.shields.io/npm/v/@zitadel/vue)
![NPM License](https://img.shields.io/npm/l/@zitadel/vue)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)

## Getting Started

- Check out the docs on how to [integrate ZITADEL into your existing Vue application](https://zitadel.com/docs/examples/login/vue).
- Create a new Vue application with ZITADEL integration from scratch by following the example at [ZITADEL Vue example application](https://github.com/zitadel/zitadel-vue/blob/main/README.md).

## Features

`@zitadel/vue` is a thin Vue 3 wrapper around the actively maintained [oidc-client-ts](https://github.com/authts/oidc-client-ts) library. `vue` and `vue-router` are declared as peer dependencies, so the package adds essentially nothing on top of `oidc-client-ts` apart from:

- Reactive auth state (`isAuthenticated`, `user`, `userProfile`) backed by Vue's `reactive()`.
- Sensible defaults for ZITADEL: PKCE code flow, automatic silent renewal, user info enrichment.
- A convenience helper `hasRole(role)` for the project roles claim.
- A drop-in `vue-router` navigation guard via `useRouter(router)` that redirects unauthenticated users for routes with `meta.requiresAuth`.

## Installation

```sh
npm install @zitadel/vue vue vue-router
```

`oidc-client-ts` ships transitively as a regular dependency of `@zitadel/vue`, so you do not need to install it yourself.

## Usage

```typescript
import { createZITADELAuth } from "@zitadel/vue";

const zitadelAuth = createZITADELAuth({
  issuer: `${myZITADELInstancesOrigin}`,
  client_id: `${myApplicationsClientID}`,
  project_resource_id: `${myApplicationsProjectResourceID}`,
  org_id: `${myApplicationsOrganizationID}`, // optional
});
```

The following defaults apply:
- The OIDC Code Flow with PKCE is used for authentication at ZITADEL.
- ZITADELs user info endpoint is called to enrich the user profile.
- The access token is refreshed automatically before it expires.
- If you specify a *project_resource_id*, the scopes for retrieving the users roles from the user info endpoint are added automatically.
  You can conveniently use `zitadelAuth.hasRole("someRoleKey")`.

Optional:
- add an `org_id` to register and login users directly in the organization scope.
- pass a second argument to `createZITADELAuth` to override any [`UserManagerSettings`](https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html) from `oidc-client-ts`.

### Bootstrapping the app

```typescript
// src/main.ts
import { createApp } from "vue";
import { startup } from "@zitadel/vue";
import App from "./App.vue";
import router from "./router";
import zitadelAuth from "./services/zitadelAuth";

startup(zitadelAuth).then((ok) => {
  if (!ok) return;
  const app = createApp(App);
  app.use(router);
  app.config.globalProperties.$zitadel = zitadelAuth;
  app.mount("#app");
});
```

### Handling the callback

Add a route at `/auth/callback` whose component calls `handleCallback(auth)` and routes back to `state.returnTo`:

```vue
<script lang="ts">
import { defineComponent } from "vue";
import { handleCallback } from "@zitadel/vue";
import zitadelAuth from "@/services/zitadelAuth";

export default defineComponent({
  async mounted() {
    const user = await handleCallback(zitadelAuth);
    const returnTo = (user.state as { returnTo?: string })?.returnTo ?? "/";
    this.$router.push(returnTo);
  },
});
</script>
```

### Protecting routes

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import zitadelAuth from "@/services/zitadelAuth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/auth/callback", component: () => import("@/views/CallbackView.vue") },
    { path: "/protected", component: () => import("@/views/ProtectedView.vue"), meta: { requiresAuth: true } },
  ],
});

zitadelAuth.useRouter(router);
export default router;
```

## API

```typescript
interface ZITADELAuth {
  readonly userManager: UserManager;             // the underlying oidc-client-ts UserManager
  readonly isAuthenticated: boolean;             // reactive
  readonly user: User | null;                    // reactive
  readonly userProfile: Record<string, unknown>; // reactive — id_token claims
  signIn(): Promise<void>;                       // calls signinRedirect
  signOut(): Promise<void>;                      // calls signoutRedirect
  hasRole(role: string): boolean;                // checks the project roles claim
  useRouter(router: Router): void;               // installs a beforeEach navigation guard
}

function createZITADELAuth(
  config: ZITADELConfig,
  oidcOverrides?: Partial<UserManagerSettings>,
): ZITADELAuth;

function handleCallback(auth: ZITADELAuth): Promise<User>;
function handleSignoutCallback(auth: ZITADELAuth): Promise<void>;
function startup(auth: ZITADELAuth): Promise<boolean>;
```
