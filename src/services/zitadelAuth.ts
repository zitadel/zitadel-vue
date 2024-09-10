import { createZITADELAuth } from "@zitadel/vue";
import { User } from "oidc-client";
import type { OidcAuth } from 'vue-oidc-client/vue3';

const zitadelAuth: { oidcAuth: OidcAuth; hasRole: (role: string) => any } = createZITADELAuth({
    project_resource_id: import.meta.env.VITE_ZITADEL_PROJECT_RESOURCE_ID,
    client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
    issuer: import.meta.env.VITE_ZITADEL_ISSUER,
})

// handle events
zitadelAuth.oidcAuth.events.addAccessTokenExpiring(function() {
  // eslint-disable-next-line no-console
  console.log('access token expiring')
})

zitadelAuth.oidcAuth.events.addAccessTokenExpired(function() {
  // eslint-disable-next-line no-console
  console.log('access token expired')
})

zitadelAuth.oidcAuth.events.addSilentRenewError(function(err: Error) {
  // eslint-disable-next-line no-console
  console.error('silent renew error', err)
})

zitadelAuth.oidcAuth.events.addUserLoaded(function(user: User) {
  // eslint-disable-next-line no-console
  console.log('user loaded', user)
})

zitadelAuth.oidcAuth.events.addUserUnloaded(function() {
  // eslint-disable-next-line no-console
  console.log('user unloaded')
})

zitadelAuth.oidcAuth.events.addUserSignedOut(function() {
  // eslint-disable-next-line no-console
  console.log('user signed out')
})

zitadelAuth.oidcAuth.events.addUserSessionChanged(function() {
  // eslint-disable-next-line no-console
  console.log('user session changed')
})

export default zitadelAuth
