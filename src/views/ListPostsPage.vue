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
      to="/newpostpage"
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
export default {
  computed: {
    // 不使用
    isLoggedIn() {
      return this.$store.getters["auth/isLoggedIn"];
    },
  },
};
</script>

<style scoped>
@import "../assets/common.css";
.v-tabs {
  border-bottom: 1px solid rgb(223, 211, 211);
}
.v-tabs a {
  text-decoration: none;
}
.v-tab span {
  font-size: 16px;
}

.content {
  margin: 10px auto 20px;
  max-width: 1200px;
  padding: 0px 15px;
}

@media (max-width: 640px) {
  .content {
    margin: 5px auto 10px;
    padding: 5px 5px;
  }
}
</style>
