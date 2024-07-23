import { createZITADELAuth } from "@zitadel/vue";
import { User } from "oidc-client";
import type { OidcAuth } from 'vue-oidc-client/vue3';

const zitadelAuth: { oidcAuth: OidcAuth; hasRole: (role: string) => any } = createZITADELAuth({
    project_resource_id: '277221006874026147',
    client_id: "277221059168673955",
    issuer: "http://localhost:8080/",
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
