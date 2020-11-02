<template>
  <v-container>
    <v-form ref="createPostsForm" dark>
      <v-row>
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="title"
            label="タイトル(100字以下)"
            :rules="[valueRequired, limitLengthTitle]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="speaker"
            label="発言者(100字以下)"
            :rules="[valueRequired, limitLengthTitle]"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="detail"
            color="teal"
            outlined
            :rules="[counterRequired, limitLengthDetail]"
          >
            <template v-slot:label>
              <div>詳細(255字以下)</div>
            </template>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="8">
          <v-text-field v-model="movieUrl" label="動画URL" :rules="[urlCheck]"></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="text-right">
      <v-btn class="ma-2 white--text" color="blue" v-on:click="createPosts">投稿作成</v-btn>
    </div>
  </v-container>
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";

export default {
  data: () => ({
    title: "",
    speaker: "",
    detail: "",
    movieUrl: "",
    message: "",
    valueRequired: (value) => !!value || "必ず入力してください",
    counterRequired: (counter) => !!counter || "必ず入力してください",
    limitLengthTitle: (value) =>
      value.length <= 100 || "100字以内にしてください",
    limitLengthSpeaker: (value) =>
      value.length <= 100 || "100字以内にしてください",
    limitLengthDetail: (counter) =>
      counter.length <= 255 || "255字以内にしてください",
    urlCheck: (value) =>
      !value || /https?:/.test(value) || "URLを入力してください",
  }),
  methods: {
    createPosts: async function () {
      if (!this.$refs.createPostsForm.validate()) {
        return;
      }

      var axios = createAxios();
      const config = {
        headers: {
          Authorization: getCookieDataByKey("token"),
        },
      };
      const postData = {
        user_id: Number(getCookieDataByKey("userId")),
        title: this.title,
        speaker: this.speaker,
        detail: this.detail,
        movie_url: this.movieUrl,
      };

      axios
        .post("posts", postData, config)
        .then(function () {
          window.location.href = "/";
        })
        .catch((err) => {
          console.log("err:", err.response.data);
          this.message = err.response.data;
        });
    },
  },
};
</script>
