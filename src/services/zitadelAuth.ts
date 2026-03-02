import { createZITADELAuth } from "@zitadel/vue";
import { User } from "oidc-client";
import type { OidcAuth } from "vue-oidc-client/vue3";

const zitadelAuth: { oidcAuth: OidcAuth; hasRole: (role: string) => boolean } =
  createZITADELAuth({
    project_resource_id: import.meta.env.VITE_ZITADEL_PROJECT_RESOURCE_ID,
    client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
    issuer: import.meta.env.VITE_ZITADEL_ISSUER,
  });

// handle events
zitadelAuth.oidcAuth.events.addAccessTokenExpiring(function () {
  console.log("access token expiring");
});

zitadelAuth.oidcAuth.events.addAccessTokenExpired(function () {
  console.log("access token expired");
});

zitadelAuth.oidcAuth.events.addSilentRenewError(function (err: Error) {
  console.error("silent renew error", err);
});

zitadelAuth.oidcAuth.events.addUserLoaded(function (user: User) {
  console.log("user loaded", user);
});

zitadelAuth.oidcAuth.events.addUserUnloaded(function () {
  console.log("user unloaded");
});

zitadelAuth.oidcAuth.events.addUserSignedOut(function () {
  console.log("user signed out");
});

zitadelAuth.oidcAuth.events.addUserSessionChanged(function () {
  console.log("user session changed");
});

export default zitadelAuth;
