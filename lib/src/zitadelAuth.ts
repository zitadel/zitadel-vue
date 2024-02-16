import { createOidcAuth, SignInType, LogLevel } from 'vue-oidc-client/vue3'
import { UserManagerSettings, Logger } from 'oidc-client'

export interface ZITADELConfig {
    client_id: string
    issuer: string
    project_resource_id?: string
}

export function createZITADELAuth(
    zitadelConfig: ZITADELConfig,
    authName: string = "zitadel",
    defaultSignInType: SignInType = SignInType.Window,
    appUrl: string = `${window.location.origin}/`,
    oidcConfig?: UserManagerSettings,
    logger: Logger = console,
    logLevel: LogLevel = LogLevel.Error,
) {

    const cfg: UserManagerSettings = {
        response_type: 'code',
        scope: 'openid profile email offline_access' +
            (zitadelConfig.project_resource_id ?
            ` urn:zitadel:iam:org:project:id:${zitadelConfig.project_resource_id}:aud` +
            ' urn:zitadel:iam:org:projects:roles'
            : ''),
        authority: zitadelConfig.issuer,
        client_id: zitadelConfig.client_id,
        loadUserInfo: true,
        automaticSilentRenew: true,
        ...oidcConfig, // everything can be overridden!
    }

    const oidcAuth =  createOidcAuth(
        authName,
        defaultSignInType,
        appUrl,
        cfg,
        logger,
        logLevel
    )

    return {
        oidcAuth,
        hasRole: (role: string) => {
            if (!zitadelConfig.project_resource_id) {
                throw new Error('projectResourceID is required for hasRole')
            }
            const roles = oidcAuth.userProfile[`urn:zitadel:iam:org:project:${zitadelConfig.project_resource_id}:roles`] as Array<any>
            if (!roles) {
                return false
            }
            return roles.find(r => r[role])
        }
    }
}
