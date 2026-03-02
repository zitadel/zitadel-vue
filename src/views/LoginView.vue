<template>
  <div class="userinfo">
    <div>
      <h1>This is a login-protected page</h1>
      <h2>
        The following profile data is extended by information from ZITADELs
        userinfo endpoint.
      </h2>
      <div>
        <ul class="claims">
          <li v-for="c in claims" :key="c.key">
            <strong>{{ c.key }}</strong
            >: {{ c.value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    user() {
      return this.$zitadel.oidcAuth.userProfile;
    },
    claims() {
      if (this.user) {
        return Object.keys(this.user).map((key) => ({
          key,
          value: this.user[key],
        }));
      }
      return [];
    },
  },
});
</script>
<style>
@media (min-width: 1024px) {
  .userinfo {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
