<template>
  <div>
    <!-- SP用、投稿登録ボタン-->
    <v-btn
      class="mx-2 d-flex d-sm-none"
      fab
      large
      fixed
      right
      bottom
      dark
      color="blue-grey lighten-2"
      to="/posts/create"
      v-if="isLoggedIn"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>

    <!-- タブ -->
    <v-tabs color="blue-grey lighten-2" centered show-arrows>
      <v-tab to="/">
        <v-icon left>mdi-history</v-icon>
        <span>新着投稿</span>
      </v-tab>
    </v-tabs>

    <div class="content">
      <transition appear>
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "isLoggedIn",
    }),
  },
};
</script>

<style scoped>
</style>
