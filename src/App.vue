<template>
  <v-app>
    <v-app-bar clipped-left app color="primary" dark>
      <v-toolbar-title class="pl-0 pl-sm-5">
        <router-link to="/" id="title">
          <span class="white--text">Power Phrase - 心に残る言葉 -</span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- PC用 -->
      <v-toolbar-items class="d-none d-sm-flex">
        <v-btn text to="/">
          <v-icon color="white">mdi-home</v-icon>Top
        </v-btn>
        <v-btn v-if="!isLoggedIn" text to="/login">
          <v-icon color="white">mdi-login</v-icon>ログイン
        </v-btn>
        <v-btn v-if="!isLoggedIn" text v-on:click="simpleLogin">
          <v-icon color="white">mdi-login</v-icon>動作確認用ログイン
        </v-btn>
        <v-btn v-if="!isLoggedIn" text to="/users/create">
          <v-icon color="white">mdi-account-plus</v-icon>ユーザー登録
        </v-btn>
        <v-btn v-if="isLoggedIn" text v-on:click="logout">
          <v-icon color="white">mdi-logout</v-icon>ログアウト
        </v-btn>
        <v-btn v-if="isLoggedIn" text to="/posts/create">
          <v-icon color="white">mdi-pencil</v-icon>投稿作成
        </v-btn>
        <v-btn v-if="isLoggedIn" text :to="{name: 'DetailUserPage', params: {userId: userId}}">
          <v-icon color="white">mdi-account</v-icon>マイページ
        </v-btn>
      </v-toolbar-items>

      <!-- SP用 -->
      <v-toolbar-items class="d-sm-none">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <!-- ハンバーガーメニュー -->
            <v-btn text v-bind="attrs" v-on="on" style="text-transform: none">
              <v-icon size="40px">mdi-menu</v-icon>
            </v-btn>
          </template>
          <!-- ドロップダウン -->
          <v-card class="mx-auto">
            <v-list>
              <v-list-item-group>
                <v-list-item to="/">
                  <v-list-item-icon>
                    <v-icon>mdi-home</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Top</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!isLoggedIn" to="/login">
                  <v-list-item-icon>
                    <v-icon>mdi-login</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>ログイン</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!isLoggedIn" v-on:click="simpleLogin">
                  <v-list-item-icon>
                    <v-icon>mdi-login</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>動作確認用ログイン</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="!isLoggedIn" to="/users/create">
                  <v-list-item-icon>
                    <v-icon>mdi-account-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>ユーザー登録</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item v-if="isLoggedIn" v-on:click="logout">
                  <v-list-item-icon>
                    <v-icon>mdi-logout</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>ログアウト</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-if="isLoggedIn"
                  :to="{name: 'DetailUserPage', params: {userId: userId}}"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>マイページ</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
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
