<template>
  <Loading v-if="loading"></Loading>
  <!-- <v-container class="top" fluid fill-height v-else> -->
  <v-container class="top" v-else>
    <!-- <v-row class="lighten-4" style="height: 200px;" justify="center" align-content="center">
      <v-col md="4">
        <v-text-field v-model="searchTitle" label="タイトル検索" outlined></v-text-field>
      </v-col>
      <v-col md="12">
        <v-layout justify-center>
          <v-btn class="white--text" color="blue" @click="searchTitles">
            <v-icon color="white">mdi-book-search</v-icon>検索
          </v-btn>
        </v-layout>
      </v-col>
      <v-col md="12">
        <v-layout class="red--text" justify-center>{{ noDataMessage }}</v-layout>
      </v-col>
    </v-row>-->
    <!-- <v-pagination
      v-model="page"
      :length="length"
      :total-visible="10"
      class="my-4"
      @input="showPage"
    ></v-pagination>-->
    <!-- <v-row dense class="mb-6" justify="center"> -->
    <v-row dense class="mb-6">
      <!-- <v-col class="pt-10" v-model="posts" v-for="post in posts" :key="post.id" cols="12" md="8">
        <v-card>
          <router-link :to="{name: 'DetailPost', params: {postId: post.id}}">
            <v-img
              :src="post.photoUrl"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="400px"
            >
              <v-card-title v-text="post.title"></v-card-title>
              <v-row>
                <v-col cols="8">
                  <v-card-text>
                    <v-icon color="white">mdi-heart</v-icon>
                    {{ showLikes(post.likes) }}
                  </v-card-text>
                </v-col>
              </v-row>
            </v-img>
          </router-link>
        </v-card>
      </v-col>-->
      <v-col class="pt-10" v-model="posts" v-for="post in posts" :key="post.ID" cols="4">
        <v-card>
          <router-link :to="{name: 'DetailPost', params: {postId: post.ID}}">
            <!-- <v-img
              :src="post.photoUrl"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="400px"
            >
              <v-card-title v-text="post.title"></v-card-title>
              <v-row>
                <v-col cols="8">
                  <v-card-text>
                    <v-icon color="white">mdi-heart</v-icon>
                    {{ showLikes(post.likes) }}
                  </v-card-text>
                </v-col>
              </v-row>
            </v-img>-->
            <v-card-title>{{ post.Title }}</v-card-title>
            <v-card-subtitle>{{ post.Speaker }}</v-card-subtitle>
            <v-card-text>
              {{ post.Detail }}
              <!-- <iframe
                :src="post.MovieURL"
                width="100%"
                height="100%"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>-->
            </v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://randomuser.me/api/portraits/men/28.jpg" alt />
                </v-list-item-avatar>

                <v-list-item-content>
                  <!-- TODO -->
                  <v-list-item-title>ユーザー名 {{ post.CreatedAt | moment }}</v-list-item-title>
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
      if (response.data.length != undefined) {
        length = Math.ceil(response.data.length / params["limit"]);
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
      limit: 3,
      searchTitle: "",
      noDataMessage: "",
      loading: true,
    };
  },
  mounted() {
    this.params = { limit: this.limit, offset: this.page };
    getPosts(this.page, this.params).then((data) => {
      this.posts = data.posts;
      this.length = data.length;
      this.loading = false;
    });
  },
  methods: {
    showPage: function () {
      this.params["offset"] = this.page;
      getPosts(this.page, this.params).then((data) => {
        this.posts = data.posts;
        this.length = data.length;
      });
    },
    showLikes: function (likes) {
      if (likes == undefined) {
        return 0;
      }
      return likes;
    },
    searchTitles: function () {
      this.noDataMessage = "";
      this.params["title"] = this.searchTitle;
      getPosts(this.page, this.params).then((data) => {
        if (data.length == 0) {
          this.noDataMessage = "検索結果は0件です";
          return;
        }
        this.posts = data.posts;
        this.length = data.length;
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
