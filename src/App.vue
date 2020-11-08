<template>
  <v-app>
    <v-app-bar clipped-left app color="primary" dark>
      <v-toolbar-title>
        <a href="/">
          <span class="hidden-sm-and-down white--text">Power Phrase</span>
        </a>
      </v-toolbar-title>
      <!-- TODO 検索 -->
      <!-- <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        class="hidden-sm-and-down"
      ></v-text-field>-->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/">Topに戻る</v-btn>
        <v-btn v-show="!isAuthenticated" text to="/Login">
          <v-icon color="white">mdi-login</v-icon>ログイン
        </v-btn>
        <v-btn v-show="!isAuthenticated" text v-on:click="clickSimpleLogin">
          <v-icon color="white">mdi-login</v-icon>簡易ログイン
        </v-btn>
        <v-btn v-show="!isAuthenticated" text to="/users/create">
          <v-icon color="white">mdi-account</v-icon>ユーザー登録
        </v-btn>
        <v-btn v-show="isAuthenticated" text v-on:click="deleteCookie">
          <v-icon color="white">mdi-logout</v-icon>ログアウト
        </v-btn>
        <v-btn v-show="isAuthenticated" text to="/posts/create">
          <v-icon color="white">mdi-pencil-box</v-icon>投稿作成
        </v-btn>
        <v-btn v-if="isAuthenticated" text :to="{name: 'DetailUser', params: {userId: userId}}">
          <v-icon color="white">mdi-account</v-icon>ユーザ画面
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main color="blue" dark>
      <router-view></router-view>
    </v-main>

    <v-footer color="primary" dark app>&copy; {{ new Date().getFullYear() }} Kazuya Kobayashi</v-footer>
  </v-app>
</template>

<script>
import loginUser from "@/js/auth.js";
import getCookieDataByKey from "@/js/getCookieData.js";

export default {
  data: () => ({
    userId: 0,
  }),
  mounted: function () {
    this.userId = getCookieDataByKey("userId");
  },
  methods: {
    deleteCookie: function () {
      document.cookie = "token=;max-age=0";
      document.cookie = "userId=;max-age=0";
      document.cookie = "authenticated=;max-age=0";
      window.location.href = "/";
    },
    clickSimpleLogin: function () {
      loginUser(
        process.env.VUE_APP_LOGIN_EMAIL,
        process.env.VUE_APP_LOGIN_PASSWORD
      );
    },
  },
  computed: {
    isAuthenticated: function () {
      let authenticated = getCookieDataByKey("authenticated");
      if (authenticated == "True") {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
