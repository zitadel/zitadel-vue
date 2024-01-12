import { createOidcAuth, SignInType, LogLevel } from 'vue-oidc-client/vue3';
export function createZITADELAuth(zitadelConfig, authName = "zitadel", defaultSignInType = SignInType.Window, appUrl = `${window.location.origin}/`, oidcConfig, logger = console, logLevel = LogLevel.Error) {
    const cfg = {
        response_type: 'code',
        scope: 'openid profile email offline_access' +
            (zitadelConfig.projectResourceID ?
                ` urn:zitadel:iam:org:project:id:${zitadelConfig.projectResourceID}:aud` +
                    ' urn:zitadel:iam:org:projects:roles'
                : ''),
        authority: zitadelConfig.issuer,
        client_id: zitadelConfig.client_id,
        loadUserInfo: true,
        automaticSilentRenew: true,
        ...oidcConfig, // everything can be overridden!
    };
    console.info('OIDC Config', cfg);
    const oidcAuth = createOidcAuth(authName, defaultSignInType, appUrl, cfg, logger, logLevel);
    return {
        oidcAuth,
        hasRole: (role) => {
            if (!zitadelConfig.projectResourceID) {
                throw new Error('projectResourceID is required for hasRole');
            }
            const roles = oidcAuth.userProfile[`urn:zitadel:iam:org:project:${zitadelConfig.projectResourceID}:roles`];
            if (!roles) {
                return false;
            }
            return roles.find(r => r[role]);
        }
    };
}
