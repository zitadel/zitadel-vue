import { createZITADELAuth } from "@zitadel/vue";

const zitadelAuth = createZITADELAuth({
  project_resource_id: import.meta.env.VITE_ZITADEL_PROJECT_RESOURCE_ID,
  client_id: import.meta.env.VITE_ZITADEL_CLIENT_ID,
  issuer: import.meta.env.VITE_ZITADEL_ISSUER,
});

export default zitadelAuth;
