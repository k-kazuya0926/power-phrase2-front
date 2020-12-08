<!-- TODO 削除 -->
<template>
  <v-container>
    <v-form ref="updatePostsForm">
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
            :rules="[valueRequired, limitLengthSpeaker]"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea v-model="detail" color="teal" outlined :rules="[limitLengthDetail]">
            <template v-slot:label>
              <div>本文(255字以下)</div>
            </template>
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="8">
          <v-text-field
            v-model="movieUrl"
            label="YouTube動画URL(https://www.youtube.com/watch?v=・・・)"
            :rules="[urlCheck]"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="text-right">
      <v-btn class="ma-2 white--text" color="blue" v-on:click="updatePosts">投稿を編集</v-btn>
    </div>
  </v-container>
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";

export default {
  name: "UpdatePost",
  data: () => ({
    title: "",
    speaker: "",
    detail: "",
    movieUrl: "",
    valueRequired: (value) => !!value || "必ず入力してください",
    limitLengthTitle: (value) =>
      value.length <= 100 || "100字以内にしてください",
    limitLengthSpeaker: (value) =>
      value.length <= 100 || "100字以内にしてください",
    limitLengthDetail: (counter) =>
      counter.length <= 255 || "255字以内にしてください",
    urlCheck: (value) =>
      !value || /https?:/.test(value) || "URLを入力してください",
  }),
  mounted: async function () {
    let axios = createAxios();
    const config = {
      headers: {
        Authorization: "Bearer " + getCookieDataByKey("token"),
      },
    };
    let self = this;

    await axios
      .get("/posts/" + this.$route.params.postId, config, {})
      .then(function (response) {
        self.title = response.data.title;
        self.speaker = response.data.speaker;
        self.detail = response.data.detail;
        self.movieUrl = response.data.movie_url;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    updatePosts: function () {
      let self = this;
      let axios = createAxios();
      const config = {
        headers: {
          Authorization: "Bearer " + getCookieDataByKey("token"),
        },
      };
      const postData = {
        title: this.title,
        speaker: this.speaker,
        detail: this.detail,
        movie_url: this.movieUrl,
      };
      let postId = this.$route.params.postId;

      axios
        .put("/posts/" + postId, postData, config)
        .then(function () {
          self.$router.push("/posts/" + postId);
        })
        .catch((err) => {
          console.log("err:", err.response.data);
          this.message = err.response.data;
        });
    },
  },
};
</script>
