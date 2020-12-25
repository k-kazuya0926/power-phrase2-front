<template>
  <v-container>
    <h3 class="h3 text-center pt-8">ログイン</h3>
    <v-row justify="center">
      <v-col justify="center">
        <v-card elevation="5" color="blue-grey lighten-5" class="mx-auto" max-width="500px">
          <div class="pa-8">
            <form @submit.prevent="login(email, password)">
              <v-text-field v-model="email" required label="メールアドレス" prepend-inner-icon="mdi-email"></v-text-field>

              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                required
                label="パスワード"
                @click:append="show1 = !show1"
                prepend-inner-icon="mdi-lock"
              ></v-text-field>

              <v-btn block elevation="2" class="mr-4 mt-4" type="submit">ログイン</v-btn>
            </form>

            <v-btn
              block
              color="blue-grey lighten-3"
              elevation="2"
              class="mr-4 mt-4"
              @click="login()"
            >動作確認用ログイン</v-btn>

            <div class="pa-4 text-center">
              登録していない方
              <router-link class="router-link" to="/users/create">ユーザー登録</router-link>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      show1: false,
    };
  },
  methods: {
    // ログイン
    login(
      email = process.env.VUE_APP_LOGIN_EMAIL,
      password = process.env.VUE_APP_LOGIN_PASSWORD
    ) {
      this.$store
        .dispatch("user/login", {
          email: email,
          password: password,
        })
        .then(() => {
          if (this.isLoggedIn) {
            this.$router.push("/").catch(() => {});
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
      isLoggedIn: "isLoggedIn",
      id: "id",
    }),
  },
};
</script>

<style>
</style>
