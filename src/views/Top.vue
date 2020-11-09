<template>
  <Loading v-if="loading"></Loading>
  <v-container class="top" v-else>
    <v-row class="lighten-4" style="height: 150px;" justify="center" align-content="center">
      <v-col md="4">
        <v-text-field
          v-model="keyword"
          label="検索"
          outlined
          @keyup.enter="search"
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col md="12">
        <v-layout justify-center>{{ totalCount }}件</v-layout>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="pageLength"
      :total-visible="10"
      class="my-0"
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
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";
import Loading from "@/components/Loading";
import moment from "moment";

async function getPosts(page, params) {
  let axios = createAxios();
  let posts = [];
  let pageLength = 0;

  await axios
    .get("/posts", { params: params })
    .then(function (response) {
      posts = response.data;
      if (response.data.posts.totalCount != undefined) {
        pageLength = Math.ceil(
          response.data.posts.totalCount / params["limit"]
        );
      } else {
        pageLength = 0;
      }
    })
    .catch((err) => {
      console.log("err:", err.response);
    });
  let data = { posts: posts, pageLength: pageLength };
  return data;
}

export default {
  name: "top",
  components: { Loading },
  data() {
    return {
      posts: [],
      page: 1,
      pageLength: 0,
      limit: 4, // TODO 共通化
      keyword: "",
      totalCount: 0,
      loading: true,
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  mounted() {
    this.params = { limit: this.limit, page: this.page };
    getPosts(this.page, this.params).then((data) => {
      this.posts = data.posts.posts;
      this.totalCount = data.posts.totalCount;
      this.pageLength = Math.ceil(this.totalCount / this.limit);
      this.loading = false;
    });
  },
  methods: {
    showPage: function () {
      this.params["page"] = this.page;
      getPosts(this.page, this.params).then((data) => {
        this.posts = data.posts.posts;
        this.totalCount = data.posts.totalCount;
        this.pageLength = Math.ceil(this.totalCount / this.limit);
      });
    },
    search: function () {
      this.params["keyword"] = this.keyword;
      getPosts(this.page, this.params).then((data) => {
        this.totalCount = data.posts.totalCount;
        this.posts = data.posts.posts;
        this.pageLength = Math.ceil(data.posts.totalCount / this.limit);
      });
    },
  },
  computed: {
    isAuthenticated: function () {
      let authenticated = getCookieDataByKey("authenticated");
      if (authenticated == "True") {
        return true;
      }
      return false;
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
