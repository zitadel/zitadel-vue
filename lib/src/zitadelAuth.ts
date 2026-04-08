import { UserManager, WebStorageStateStore, User } from "oidc-client-ts";
import type { UserManagerSettings } from "oidc-client-ts";
import { reactive, markRaw } from "vue";
import type { Router } from "vue-router";

export interface ZITADELConfig {
  client_id: string;
  issuer: string;
  project_resource_id?: string;
  org_id?: string;
}

export interface ZITADELAuth {
  readonly userManager: UserManager;
  readonly isAuthenticated: boolean;
  readonly user: User | null;
  readonly userProfile: Record<string, unknown>;
  signIn(): Promise<void>;
  signOut(): Promise<void>;
  hasRole(role: string): boolean;
  useRouter(router: Router): void;
}

export function createZITADELAuth(
  zitadelConfig: ZITADELConfig,
  oidcOverrides?: Partial<UserManagerSettings>,
): ZITADELAuth {
  const scope =
    "openid profile email offline_access" +
    (zitadelConfig.project_resource_id
      ? ` urn:zitadel:iam:org:project:id:${zitadelConfig.project_resource_id}:aud` +
        " urn:zitadel:iam:org:projects:roles"
      : "") +
    (zitadelConfig.org_id
      ? ` urn:zitadel:iam:org:id:${zitadelConfig.org_id}`
      : "");

  const settings: UserManagerSettings = {
    authority: zitadelConfig.issuer,
    client_id: zitadelConfig.client_id,
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: "code",
    scope,
    loadUserInfo: true,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    ...oidcOverrides,
  };

  const userManager = new UserManager(settings);

  const state = reactive<{
    isAuthenticated: boolean;
    user: User | null;
    userProfile: Record<string, unknown>;
  }>({
    isAuthenticated: false,
    user: null,
    userProfile: {},
  });

  function updateState(user: User | null) {
    // markRaw prevents Vue from deep-proxying the oidc-client-ts User class
    // instance (which has getters/setters and methods like toStorageString()).
    state.user = user ? markRaw(user) : null;
    state.isAuthenticated = user != null && !user.expired;
    state.userProfile = user?.profile ?? {};
  }

  userManager.events.addUserLoaded(updateState);
  userManager.events.addUserUnloaded(() => updateState(null));
  userManager.events.addSilentRenewError(() => updateState(null));
  userManager.events.addAccessTokenExpired(() => updateState(null));

  const auth: ZITADELAuth = {
    userManager,

    get isAuthenticated() {
      return state.isAuthenticated;
    },

    get user() {
      return state.user;
    },

    get userProfile() {
      return state.userProfile;
    },

    async signIn() {
      await userManager.signinRedirect();
    },

    async signOut() {
      await userManager.signoutRedirect();
    },

    hasRole(role: string): boolean {
      if (!zitadelConfig.project_resource_id) {
        return false;
      }
      const roles =
        state.userProfile[
          `urn:zitadel:iam:org:project:${zitadelConfig.project_resource_id}:roles`
        ];
      if (!roles) {
        return false;
      }
      if (Array.isArray(roles)) {
        return roles.some(
          (r: Record<string, unknown>) => r[role] !== undefined,
        );
      }
      return Object.keys(roles as Record<string, unknown>).includes(role);
    },

    useRouter(router: Router) {
      router.beforeEach(async (to) => {
        if (to.meta.requiresAuth && !state.isAuthenticated) {
          try {
            await userManager.signinRedirect({
              state: { returnTo: to.fullPath },
            });
          } catch (err) {
            console.error("Failed to redirect to login", err);
          }
          return false;
        }
        return true;
      });
    },
  };

  return auth;
}

export async function handleCallback(auth: ZITADELAuth): Promise<User> {
  const user = await auth.userManager.signinRedirectCallback();
  return user;
}

export async function handleSignoutCallback(
  auth: ZITADELAuth,
): Promise<void> {
  await auth.userManager.signoutRedirectCallback();
}

export async function startup(auth: ZITADELAuth): Promise<boolean> {
  try {
    // getUser() loads the user silently (no event). Re-raise the userLoaded
    // event so the reactive state in createZITADELAuth picks it up. This sets
    // up an additional access-token-expiring timer, which is harmless once at
    // startup.
    const user = await auth.userManager.getUser();
    if (user && !user.expired) {
      await auth.userManager.events.load(user);
    }
    return true;
  } catch {
    return false;
  }
}
