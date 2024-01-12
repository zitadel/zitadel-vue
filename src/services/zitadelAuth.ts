import {createZITADELAuth} from "@zitadel/vue";
import {User} from "oidc-client";

const zitadelAuth = createZITADELAuth({
    project_resource_id: '249118459256900146',
    client_id: "249118590152804914@vue_example",
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
