<template>
  <div>
    <v-container>
      <h3 class="h3 text-center pt-8">ユーザー登録</h3>
      <v-row justify="center">
        <v-col justify="center">
          <v-card elevation="5" color="blue-grey lighten-5" class="mx-auto" max-width="500px">
            <div class="pa-8">
              <ValidationObserver v-slot="{ invalid }">
                <form @submit.prevent="createUser()">
                  <ValidationProvider
                    mode="eager"
                    name="名前"
                    rules="required|max:20"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="username"
                      :counter="20"
                      :error-messages="errors"
                      required
                      label="名前"
                      hint="20文字以下"
                      persistent-hint
                      prepend-inner-icon="mdi-account"
                    ></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider
                    mode="lazy"
                    name="入力内容"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="email"
                      :error-messages="errors"
                      required
                      label="メールアドレス"
                      prepend-inner-icon="mdi-email"
                    ></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider
                    mode="lazy"
                    name="パスワード"
                    rules="required|min:8|password"
                    v-slot="{ errors }"
                    vid="password1"
                  >
                    <v-text-field
                      v-model="password1"
                      :append-icon="showsPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showsPassword1 ? 'text' : 'password'"
                      counter
                      :error-messages="errors"
                      required
                      label="パスワード"
                      hint="8文字以上（半角英小文字、数字を含む）"
                      persistent-hint
                      @click:append="showsPassword1 = !showsPassword1"
                      prepend-inner-icon="mdi-lock"
                    ></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider
                    mode="aggressive"
                    name="パスワード"
                    rules="required|confirmed:password1"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="password2"
                      :append-icon="showsPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showsPassword2 ? 'text' : 'password'"
                      counter
                      :error-messages="errors"
                      required
                      label="パスワード（確認）"
                      @click:append="showsPassword2 = !showsPassword2"
                      prepend-inner-icon="mdi-lock"
                    ></v-text-field>
                  </ValidationProvider>

                  <v-file-input
                    @change="imageFileSelected"
                    show-size
                    counter
                    :rules="[valueRequired]"
                    label="画像ファイル"
                  ></v-file-input>

                  <div class="text-center">
                    <v-btn
                      elevation="2"
                      class="mr-4 mt-4"
                      color="secondary"
                      type="submit"
                      :disabled="invalid"
                    >送信</v-btn>
                  </div>
                </form>
              </ValidationObserver>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/services/api";
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from "vee-validate";
import ja from "vee-validate/dist/locale/ja.json";
import { required, max, min, email, confirmed } from "vee-validate/dist/rules";

extend("required", required);
extend("max", max);
extend("min", min);
extend("email", email);
extend("password", (password1) => {
  if (password1.match(/\d/) && password1.match(/[a-z]/)) {
    return true;
  }
  return "半角英小文字、数字をそれぞれ1種類以上含めてください";
});
extend("confirmed", confirmed);
localize("ja", ja);

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      message: "",
      username: "",
      email: "",
      password1: "",
      password2: "",
      showsPassword1: false,
      showsPassword2: false,
      imageFile: null,
      valueRequired: (value) => !!value || "必ず入力してください",
    };
  },
  methods: {
    createUser() {
      // 画像アップロード
      const data = new FormData();
      data.append("ImageFile", this.imageFile);
      api
        .post("/users/images", data)
        .then((response) => {
          // ユーザー登録
          api
            .post("/users", {
              name: this.username,
              email: this.email,
              password: this.password1,
              image_file_path: response.data,
            })
            .then(() => {
              this.autoLogin();
            })
            .catch((error) => {
              console.log("ユーザー登録エラー");
              console.log("response: ", error);
            });
        })
        .catch((error) => {
          console.log("画像アップロードエラー");
          console.log(error);
        });
    },
    // 自動ログイン
    autoLogin: function () {
      this.$store
        .dispatch("user/login", {
          email: this.email,
          password: this.password1,
        })
        .then(() => {
          if (this.isLoggedIn) {
            this.$store.dispatch("message/setSuccessMessage", {
              message: "登録完了",
            });

            this.$router.push("/");
          } else {
            console.log("ログインエラー");
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.log(error);
          }
        });
    },
    imageFileSelected: function (imageFile) {
      this.imageFile = imageFile;
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
