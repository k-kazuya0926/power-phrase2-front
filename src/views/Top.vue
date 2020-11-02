<template>
  <Loading v-if="loading"></Loading>
  <v-container class="top" v-else>
    <v-row class="lighten-4" style="height: 200px;" justify="center" align-content="center">
      <v-col md="4">
        <v-text-field v-model="keyword" label="検索" outlined></v-text-field>
      </v-col>
      <v-col md="12">
        <v-layout justify-center>
          <v-btn class="white--text" color="blue" @click="search">
            <v-icon color="white">mdi-book-search</v-icon>検索
          </v-btn>
        </v-layout>
      </v-col>
      <v-col md="12">
        <v-layout class="red--text" justify-center>{{ noDataMessage }}</v-layout>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="length"
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
                v-if="post.movie_url"
                width="100%"
                height="300px"
                :src="post.movie_url"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <!--TODO アバター-->
                  <v-img src="https://randomuser.me/api/portraits/men/28.jpg" alt />
                </v-list-item-avatar>

                <v-list-item-content>
                  <!-- TODO ユーザー名 -->
                  <v-list-item-title>{{post.user_name}} {{ post.created_at | moment }}</v-list-item-title>
                  <!-- TODO いいね -->
                  <!-- <v-list-item-subtitle>
                    <v-icon color="black">mdi-heart</v-icon>10
                  </v-list-item-subtitle>-->
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
  let length = 0;

  await axios
    .get("/posts", { params: params })
    .then(function (response) {
      posts = response.data;
      if (response.data.posts.totalCount != undefined) {
        length = Math.ceil(response.data.posts.totalCount / params["limit"]);
      } else {
        length = 0;
      }
    })
    .catch((err) => {
      console.log("err:", err.response);
    });
  let data = { posts: posts, length: length };
  return data;
}

export default {
  name: "top",
  components: { Loading },
  data() {
    return {
      posts: [],
      page: 1,
      length: 0,
      limit: 4,
      keyword: "",
      noDataMessage: "",
      loading: true,
    };
  },
  mounted() {
    this.params = { limit: this.limit, page: this.page };
    getPosts(this.page, this.params).then((data) => {
      this.posts = data.posts.posts;
      this.length = Math.ceil(data.posts.totalCount / this.limit);
      this.loading = false;
    });
  },
  methods: {
    showPage: function () {
      this.params["page"] = this.page;
      getPosts(this.page, this.params).then((data) => {
        this.posts = data.posts.posts;
        this.length = Math.ceil(data.posts.totalCount / this.limit);
      });
    },
    showLikes: function (likes) {
      if (likes == undefined) {
        return 0;
      }
      return likes;
    },
    search: function () {
      this.noDataMessage = "";
      this.params["keyword"] = this.keyword;
      getPosts(this.page, this.params).then((data) => {
        if (data.posts.totalCount == 0) {
          this.noDataMessage = "検索結果は0件です";
          return;
        }
        this.posts = data.posts.posts;
        this.length = Math.ceil(data.posts.totalCount / this.limit);
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
