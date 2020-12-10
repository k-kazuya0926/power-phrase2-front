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
            max-width="1200px"
          >
            <div class="pa-6">
              <h3 v-if="postId" class="text-center">投稿編集</h3>
              <h3 v-else class="text-center">新規投稿</h3>
              <ValidationObserver v-slot="{ invalid }">
                <form @submit.prevent="submitPost()">
                  <v-row>
                    <v-col cols="12" md="10">
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
                        rules="required"
                        v-slot="{ errors }"
                      >
                        <v-textarea label="詳細" rows="4" :error-messages="errors" v-model="detail"></v-textarea>
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
                    block
                    large
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
import { clearSession } from "@/mixins/utility";

extend("required", required);
extend("max", max);
extend("min", min);
extend("email", email);
extend("image", image);
localize("ja", ja);

export default {
  mixins: [clearSession],
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: ["postId"],
  data() {
    return {
      loginUserId: this.$store.getters["user/id"],
      title: "",
      speaker: "",
      detail: "",
      movieUrl: "",
      isLoading: true,
    };
  },
  watch: {
    $route() {
      (this.loginUserId = this.$store.getters["user/id"]),
        (this.title = ""),
        (this.speaker = ""),
        (this.detail = ""),
        (this.movieUrl = "");
    },
  },
  methods: {
    submitPost() {
      const postData = {
        user_id: this.loginUserId,
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
    this.clearSession();
    // 編集モードである場合
    if (this.postId) {
      api.get("/posts/" + this.postId).then((response) => {
        this.title = response.data.title;
        this.speaker = response.data.speaker;
        this.detail = response.data.detail;
        this.movieUrl = response.data.movie_url;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
@import "../assets/common.css";

#form_custom {
  width: 540px;
  background-color: rgb(255, 255, 255);
  border: 2px solid #ccc;
}

#form_custom:hover {
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.uk-placeholder {
  padding-top: 75%;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.camera-choice {
  width: 180px;
  position: absolute;
  top: 50%;
  left: 50%;
  display: table-cell;
  vertical-align: middle;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

#preview {
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0px;
  top: 0px;
  z-index: 100;
  pointer-events: none;
}
#preview_image {
  width: 100%;
  height: 100%;
}
.uk-modal-body {
  border-radius: 5px;
}

.uk-modal-dialog {
  position: relative;
  box-sizing: border-box;
  margin: 0 auto;
  width: 1000px;
  max-width: calc(100% - 0.01px) !important;
  background: rgb(240, 240, 240);
  transform: translateY(-100px);
  transition: 0.3s linear;
  transition-property: opacity, transform;
}

#select_way {
  font-size: 14px;
  color: rgb(145, 91, 56);
}
.v-application ul,
.v-application ol {
  padding-left: 0px;
}
.location_form {
  margin-top: 15px;
}
</style>
