<template>
  <div>
    <!-- 戻るボタン -->
    <v-btn
      class="mx-2 d-sm-flex"
      @click="$router.back()"
      fab
      fixed
      dark
      small
      color="blue-grey lighten-2"
    >
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>

    <v-container>
      <h3 class="h3 text-center pt-8">アカウント変更</h3>

      <v-row justify="center">
        <v-col justify="center">
          <v-card elevation="5" color="blue-grey lighten-5" class="mx-auto" max-width="500px">
            <div class="pa-8">
              <span v-if="disabled" style="color: red">※動作確認用ユーザーは変更および削除ができません。</span>

              <ValidationObserver v-slot="{ invalid }">
                <form @submit.prevent="updateUser()">
                  <v-row>
                    <v-col cols="12">
                      <ValidationProvider
                        mode="eager"
                        name="名前"
                        rules="required|max:20"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          :disabled="disabled"
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
                          :disabled="disabled"
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
                        rules="min:8|password"
                        v-slot="{ errors }"
                        vid="password1"
                      >
                        <v-text-field
                          :disabled="disabled"
                          v-model="password1"
                          :append-icon="showsPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showsPassword1 ? 'text' : 'password'"
                          counter
                          :error-messages="errors"
                          label="パスワード"
                          hint="8文字以上（半角英小文字,数字を含む）"
                          persistent-hint
                          @click:append="showsPassword1 = !showsPassword1"
                          prepend-inner-icon="mdi-lock"
                        ></v-text-field>
                      </ValidationProvider>

                      <ValidationProvider
                        mode="aggressive"
                        name="パスワード"
                        rules="confirmed:password1"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          :disabled="disabled"
                          v-model="password2"
                          :append-icon="showsPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showsPassword2 ? 'text' : 'password'"
                          counter
                          :error-messages="errors"
                          label="パスワード（確認）"
                          @click:append="showsPassword2 = !showsPassword2"
                          prepend-inner-icon="mdi-lock"
                        ></v-text-field>
                      </ValidationProvider>

                      <v-file-input @change="imageFileSelected" show-size counter label="画像ファイル"></v-file-input>

                      <v-btn
                        block
                        large
                        elevation="2"
                        class="mr-4 mt-4"
                        type="submit"
                        :disabled="invalid || disabled"
                      >変更を保存する</v-btn>
                    </v-col>
                  </v-row>

                  <!-- アカウント削除 -->
                  <v-row no-gutters>
                    <v-col class="text-right">
                      <v-dialog v-model="showsDeleteAccountDialog" max-width="600">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            small
                            elevation="2"
                            color="red accent-1"
                            v-bind="attrs"
                            v-on="on"
                            :disabled="disabled"
                          >アカウント削除</v-btn>
                        </template>
                        <v-card class="pa-2">
                          <div>
                            <v-card-title class="headline font-weight-bold">アカウント削除確認</v-card-title>

                            <v-card-text>アカウントを削除します。よろしいですか？</v-card-text>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn @click="showsDeleteAccountDialog = false">キャンセル</v-btn>
                              <v-btn
                                color="blue-grey lighten-3"
                                @click="deleteAccount"
                                class="ml-4"
                              >OK</v-btn>
                            </v-card-actions>
                          </div>
                        </v-card>
                      </v-dialog>
                    </v-col>
                  </v-row>
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
  computed: {
    ...mapGetters("user", {
      id: "id",
    }),
    disabled: function () {
      // 動作確認用ユーザーである場合
      return this.email === process.env.VUE_APP_LOGIN_EMAIL;
    },
  },
  data() {
    return {
      imageFileBefore:
        process.env.VUE_APP_STATIC_FILE_ENDPOINT +
        this.$store.getters["user/imageFilePath"],
      selectedImageFile: "", // 選択された画像
      previewImage: "",
      username: this.$store.getters["user/name"],
      email: this.$store.getters["user/email"],
      password1: "",
      password2: "",
      showsPassword1: false,
      showsPassword2: false,
      showsDeleteAccountDialog: false,
    };
  },
  methods: {
    // 画像選択
    imageFileSelected: function (imageFile) {
      this.selectedImageFile = imageFile;
    },
    // ユーザー更新
    updateUser: function () {
      // 画像ファイルが選択されていない場合
      if (!this.selectedImageFile) {
        this.doUpdateUser();
        return;
      }

      // 画像アップロード
      const data = new FormData();
      data.append("ImageFile", this.selectedImageFile);
      api
        .post("/users/images", data)
        .then((response) => {
          this.doUpdateUser(response.data);
        })
        .catch((error) => {
          console.log("画像アップロードエラー");
          console.log(error);
        });
    },
    // ユーザー更新
    doUpdateUser: function (imageFilePath = "") {
      const postData = {
        name: this.username,
        email: this.email,
      };
      if (this.password1) {
        postData.password = this.password1;
      }
      if (imageFilePath) {
        postData.image_file_path = imageFilePath;
      }
      api.put("/users/" + this.id, postData).then(async () => {
        this.$store.dispatch("message/setSuccessMessage", {
          message: "更新完了",
        });
        // storeのユーザー情報を更新
        await this.$store.dispatch("user/load", {
          id: this.id,
        });
        this.$router.replace("/users/" + this.id);
      });
    },
    // アカウント削除
    async deleteAccount() {
      this.showsDeleteAccountDialog = false;
      await api
        .delete("/users/" + this.id)
        .then(
          this.$store.dispatch("message/setSuccessMessage", {
            message: "アカウントを削除しました",
          })
        )
        .catch((error) => {
          console.log(error);
        });
      this.$store.dispatch("user/logout");
      this.$router.replace("/");
    },
    back() {
      // 1つ前へ
      this.$router.back();
    },
  },
};
</script>
<style scoped>
</style>
