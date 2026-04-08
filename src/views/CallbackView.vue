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
      const returnTo =
        (user.state as { returnTo?: string })?.returnTo ?? "/login";
      this.$router.push(returnTo);
    } catch (err) {
      console.error("Sign-in callback failed", err);
      this.$router.push("/");
    }
  },
});
</script>
