<template>
  <div>
    <div v-show="isLoading" class="text-center">
      <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
    </div>

    <div v-show="!isLoading">
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

      <v-row justify="center">
        <v-col justify="center">
          <v-card
            elevation="5"
            shaped
            color="blue-grey lighten-5"
            class="mx-auto"
            max-width="800px"
          >
            <div class="pa-6">
              <h3 v-if="postId" class="text-center">投稿編集</h3>
              <h3 v-else class="text-center">新規投稿</h3>

              <ValidationObserver v-slot="{ invalid }">
                <form @submit.prevent="submitPost()">
                  <v-row>
                    <v-col cols="12">
                      <!-- タイトル -->
                      <ValidationProvider
                        mode="aggressive"
                        name="タイトル"
                        rules="required|max:100"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          label="タイトル"
                          v-model="title"
                          :counter="100"
                          :error-messages="errors"
                          required
                          hint="100文字以下"
                          persistent-hint
                        ></v-text-field>
                      </ValidationProvider>

                      <!-- 発言者 -->
                      <ValidationProvider
                        mode="aggressive"
                        name="発言者"
                        rules="required|max:100"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          label="発言者"
                          v-model="speaker"
                          :counter="100"
                          :error-messages="errors"
                          required
                          hint="100文字以下"
                          persistent-hint
                        ></v-text-field>
                      </ValidationProvider>

                      <!-- 詳細 -->
                      <ValidationProvider
                        mode="aggressive"
                        name="詳細"
                        rules="max:500"
                        v-slot="{ errors }"
                      >
                        <v-textarea
                          label="詳細"
                          rows="10"
                          :error-messages="errors"
                          v-model="detail"
                          :counter="200"
                          hint="500文字以下"
                          persistent-hint
                        ></v-textarea>
                      </ValidationProvider>

                      <!-- YouTube動画URL -->
                      <ValidationProvider
                        mode="aggressive"
                        name="YouTube動画URL"
                        rules="max:100"
                        v-slot="{ errors }"
                      >
                        <v-text-field
                          label="YouTube動画URL"
                          v-model="movieUrl"
                          :counter="100"
                          :error-messages="errors"
                          placeholder="例）https://www.youtube.com/watch?v=・・・"
                          hint="100文字以下"
                          persistent-hint
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                  </v-row>

                  <!-- 投稿、保存ボタン -->
                  <v-btn
                    large
                    block
                    elevation="2"
                    class="mr-4 mt-4"
                    type="submit"
                    :disabled="invalid"
                    color="blue-grey lighten-2"
                  >
                    <span v-if="postId">
                      <v-icon>mdi-content-save</v-icon>変更を保存
                    </span>
                    <span v-else>
                      <v-icon>mdi-send-outline</v-icon>投稿
                    </span>
                  </v-btn>
                </form>
              </ValidationObserver>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import api from "@/services/api";

// vee-validate
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from "vee-validate";
import ja from "vee-validate/dist/locale/ja.json";
import { required, max, min, email, image } from "vee-validate/dist/rules";

extend("required", required);
extend("max", max);
extend("min", min);
extend("email", email);
extend("image", image);
localize("ja", ja);

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: ["postId"],
  data() {
    return {
      title: "",
      speaker: "",
      detail: "",
      movieUrl: "",
      isLoading: true,
    };
  },
  methods: {
    submitPost() {
      const postData = {
        user_id: this.$store.getters["user/id"],
        title: this.title,
        speaker: this.speaker,
        detail: this.detail,
        movie_url: this.movieUrl,
      };
      if (this.postId) {
        // 更新
        api.put("/posts/" + this.postId, postData).then(() => {
          this.$router.replace("/");
        });
      } else {
        // 新規登録
        api.post("/posts", postData).then(() => {
          this.$router.replace("/");
        });
      }
    },
  },
  created() {
    // 編集モードである場合
    if (this.postId) {
      api.get("/posts/" + this.postId).then((response) => {
        this.title = response.data.title;
        this.speaker = response.data.speaker;
        this.detail = response.data.detail;
        this.movieUrl = response.data.movie_url;
      });
    }

    this.isLoading = false;
  },
};
</script>

<style scoped>
</style>
