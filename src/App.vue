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
        <v-btn v-show="!isLoggedIn" text to="/signup">
          <v-icon color="white">mdi-account-plus</v-icon>ユーザー登録
        </v-btn>
        <v-btn v-show="isLoggedIn" text v-on:click="clickLogout">
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

    <v-footer color="primary" dark app>&copy; {{ new Date().getFullYear() }} Kazuya Kobayashi</v-footer>
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
    deleteCookie: function () {
      document.cookie = "token=;max-age=0";
      document.cookie = "userId=;max-age=0";
      document.cookie = "authenticated=;max-age=0";
      window.location.href = "/";
    },
    // ログアウトリンク押下
    clickLogout: function () {
      sessionStorage.clear();
      this.$store.dispatch("auth/logout");
      this.$store.dispatch("user/logout");
      this.$store.dispatch("message/setSuccessMessage", {
        message: "ログアウトしました",
      });
      this.$router.replace("/login");
    },
    // 動作確認用ログイン
    simpleLogin() {
      this.$store
        .dispatch("auth/login", {
          email: process.env.VUE_APP_LOGIN_EMAIL,
          password: process.env.VUE_APP_LOGIN_PASSWORD,
        })
        .then(() => {
          if (this.isLoggedIn) {
            this.$store.dispatch("message/setSuccessMessage", {
              message: "ログインしました",
            });
            this.$store
              .dispatch("user/load", { id: this.userId })
              .catch((error) => {
                if (process.env.NODE_ENV !== "production") {
                  console.log(error);
                }
              });
            // クエリ文字列に「next」がなければ、ホーム画面へ
            const next = this.$route.query.next || "/";
            this.$router.push(next).catch(() => {});
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
    ...mapGetters("auth", {
      userId: "id",
    }),
    isLoggedIn: function () {
      return this.$store.getters["auth/isLoggedIn"];
    },
  },
};
</script>
