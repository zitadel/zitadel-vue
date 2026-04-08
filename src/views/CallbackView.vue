<template>
  <div class="callback">
    <p>Signing in...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { handleCallback } from "@zitadel/vue";
import zitadelAuth from "@/services/zitadelAuth";

export default defineComponent({
  async mounted() {
    try {
      const user = await handleCallback(zitadelAuth);
      // Fall back to "/" rather than "/login" — "/login" is itself a
      // protected route, so defaulting to it would bounce the user back
      // through signinRedirect in an infinite loop on a stateless callback.
      const returnTo = (user.state as { returnTo?: string })?.returnTo ?? "/";
      this.$router.push(returnTo);
    } catch (err) {
      console.error("Sign-in callback failed", err);
      this.$router.push("/");
    }
  },
});
</script>
