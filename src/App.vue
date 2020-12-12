<template>
  <v-app>
    <v-app-bar clipped-left app color="primary" dark>
      <v-toolbar-title class="pl-0 pl-sm-5">
        <router-link to="/" id="title">
          <span class="hidden-sm-and-down white--text">Power Phrase - 心に残る言葉 -</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text to="/">Top</v-btn>
        <v-btn v-show="!isLoggedIn" text to="/Login">
          <v-icon color="white">mdi-login</v-icon>ログイン
        </v-btn>
        <v-btn v-show="!isLoggedIn" text v-on:click="simpleLogin">
          <v-icon color="white">mdi-login</v-icon>動作確認用ログイン
        </v-btn>
        <v-btn v-show="!isLoggedIn" text to="/users/create">
          <v-icon color="white">mdi-account-plus</v-icon>ユーザー登録
        </v-btn>
        <v-btn v-show="isLoggedIn" text v-on:click="logout">
          <v-icon color="white">mdi-logout</v-icon>ログアウト
        </v-btn>
        <v-btn v-show="isLoggedIn" text to="/posts/create">
          <v-icon color="white">mdi-pencil-box</v-icon>投稿作成
        </v-btn>
        <v-btn v-if="isLoggedIn" text :to="{name: 'DetailUserPage', params: {userId: userId}}">
          <v-icon color="white">mdi-account</v-icon>マイページ
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <GlobalMessage />

    <v-main color="blue" dark>
      <router-view></router-view>
    </v-main>

    <v-footer color="primary" dark app>&copy; Kazuya Kobayashi</v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
import GlobalMessage from "@/components/GlobalMessage";

export default {
  components: {
    GlobalMessage,
  },
  methods: {
    // ログアウト
    logout: function () {
      sessionStorage.clear();
      this.$store.dispatch("user/logout");
      this.$router.go({ path: "/", force: true }).catch(() => {});
    },
    // 動作確認用ログイン
    simpleLogin() {
      this.$store
        .dispatch("user/login", {
          email: process.env.VUE_APP_LOGIN_EMAIL,
          password: process.env.VUE_APP_LOGIN_PASSWORD,
        })
        .then(() => {
          if (this.isLoggedIn) {
            // 編集ボタン、削除ボタンを表示させるため、リロード
            this.$router.go({ path: "/", force: true }).catch(() => {});
          } else {
            console.log("ログイン失敗");
            this.$store.dispatch("message/setErrorMessage", {
              message: "ユーザー名、もしくはパスワードが間違っています",
            });
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") console.log(error);
        });
    },
  },
  computed: {
    ...mapGetters("user", {
      userId: "id",
      isLoggedIn: "isLoggedIn",
    }),
  },
};
</script>
