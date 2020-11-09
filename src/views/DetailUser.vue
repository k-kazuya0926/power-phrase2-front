<template>
  <Loading v-if="loading"></Loading>
  <v-card class="mx-auto" v-else>
    <v-container>
      <v-row align="center" class="spacer" no-gutters>
        <v-col cols="6" md="2">
          <v-avatar size="100px">
            <v-img :src="baseURL + user.image_file_path" alt />
          </v-avatar>
        </v-col>
        <v-col classs="ml-3 subtitle-1" cols="6" md="9">
          <v-card-title class="headline">{{ user.name }}</v-card-title>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-show="sameUser"
          class="white--text"
          :to="{name: 'UpdateUser', params: {userId: user.id}}"
          color="blue"
        >
          <v-icon color="white">mdi-update</v-icon>ユーザ情報を更新
        </v-btn>
      </v-card-actions>

      <v-layout justify-center>
        <v-card-title>ユーザの投稿一覧({{ totalCount }}件)</v-card-title>
      </v-layout>
      <v-pagination
        v-model="page"
        :length="pageLength"
        :total-visible="10"
        class="my-4"
        @input="showPage"
      ></v-pagination>
      <v-row dense class="mb-6">
        <v-col class="pt-10" v-model="posts" v-for="post in posts" :key="post.id" cols="6">
          <v-card>
            <router-link :to="{name: 'DetailPost', params: {postId: post.id}}">
              <v-card-title>{{ post.title }}</v-card-title>
              <v-card-subtitle>{{ post.speaker }}</v-card-subtitle>
              <v-card-text>
                <iframe
                  v-if="post.embed_movie_url"
                  width="100%"
                  height="300px"
                  :src="post.embed_movie_url"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img :src="baseURL + post.user_image_file_path" alt />
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{post.user_name}} {{ post.created_at | moment }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </router-link>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";
import Loading from "@/components/Loading";
import moment from "moment";

export default {
  name: "DetailUser",
  components: { Loading },
  data: () => ({
    posts: [],
    user: { photoUrl: "" },
    userId: 0,
    page: 1,
    pageLength: 0,
    totalCount: 0,
    loading: true,
    sameUser: false,
    baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
  }),
  mounted: async function () {
    let self = this;
    let axios = createAxios();
    let limit = 4; // TODO 共通化
    const config = {
      headers: {
        Authorization: "Bearer " + getCookieDataByKey("token"),
      },
    };
    self.userId = self.$route.params.userId;

    await axios
      .get("/posts", {
        params: { limit: limit, page: self.page, user_id: self.userId },
      })
      .then(function (response) {
        self.posts = response.data.posts;
        self.pageLength = Math.ceil(response.data.totalCount / limit);
        self.totalCount = response.data.totalCount;
      })
      .catch((err) => {
        console.log("err:", err.response);
      });

    await axios
      .get("/users/" + this.userId, config, {})
      .then(function (response) {
        self.user = response.data;
        self.loading = false;

        if (self.user.id == getCookieDataByKey("userId")) {
          self.sameUser = true;
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });
  },
  methods: {
    showPage: async function () {
      let self = this;
      let axios = createAxios();
      let limit = 4; // TODO 共通化
      await axios
        .get("/posts", {
          params: { limit: limit, page: self.page, user_id: self.userId },
        })
        .then(function (response) {
          self.posts = response.data.posts;
          self.pageLength = Math.ceil(response.data.totalCount / limit);
          self.totalCount = response.data.totalCount;
        })
        .catch((err) => {
          console.log("err:", err.response);
        });
    },
  },
  filters: {
    // TODO 共通化
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>

<style>
a {
  text-decoration: none;
}
</style>
