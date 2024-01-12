import { SignInType, LogLevel } from 'vue-oidc-client/vue3';
import { UserManagerSettings, Logger } from 'oidc-client';
export interface ZITADELConfig {
    projectResourceID?: string;
    client_id: string;
    issuer: string;
}
export declare function createZITADELAuth(zitadelConfig: ZITADELConfig, authName?: string, defaultSignInType?: SignInType, appUrl?: string, oidcConfig?: UserManagerSettings, logger?: Logger, logLevel?: LogLevel): {
    oidcAuth: import("vue-oidc-client/vue3").OidcAuth;
    hasRole: (role: string) => any;
};
