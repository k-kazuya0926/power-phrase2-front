<template>
  <div>
    <!-- 戻るボタン -->
    <v-btn
      class="mx-2 d-none d-sm-flex"
      @click="$router.back()"
      fab
      fixed
      dark
      small
      color="blue-grey lighten-2"
    >
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>

    <div class="content">
      <!-- loading -->
      <div v-show="isLoading" class="text-center">
        <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
      </div>

      <div v-show="!isLoading">
        <v-card class="mb-2" color="blue-grey lighten-5">
          <v-row no-gutters>
            <!--アイコン-->
            <v-col cols="6" sm="3">
              <v-img
                v-if="user.image_file_path"
                eager
                :src="baseURL + user.image_file_path"
                width="200px"
                height="200px"
              ></v-img>
            </v-col>

            <v-col cols="6" sm="9" class="pa-md-3">
              <!--本人である場合-->
              <v-card-title
                v-if="userId == loginUserId"
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h3 pa-2 pa-sm-4"
              >
                {{ loginUserName }}
                <!--編集ボタン-->
                <v-btn
                  v-if="userId == loginUserId"
                  style="text-decoration: none"
                  fab
                  x-small
                  class="ml-4"
                  color="indigo lighten-4"
                  to="/update_user"
                >
                  <v-icon>mdi-account-edit</v-icon>
                </v-btn>
              </v-card-title>

              <!--本人でない場合-->
              <v-card-title v-else class="text-h5 text-sm-h4 text-md-h4 text-lg-h3">{{ user.name }}</v-card-title>
            </v-col>
          </v-row>
        </v-card>

        <!--投稿一覧-->
        <div class="content">
          <v-layout justify-center>全{{ totalPostsCount }}件</v-layout>
          <PostList :postType="posts" @deletePost="deletePost" :isLoading="isLoading" />
          <div v-if="posts == ''" v-show="!isLoading">
            <p id="none_message">まだ投稿がありません</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import api from "@/services/api";

export default {
  props: ["userId"],
  components: {
    PostList,
  },
  data() {
    return {
      isLoading: true,
      limit: 100,
      page: 1,
      posts: [],
      totalPostsCount: 0,
      user: {},
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  computed: {
    ...mapGetters("user", {
      loginUserId: "id",
      loginUserName: "name",
    }),
    isLoggedIn() {
      return this.$store.getters["user/isLoggedIn"];
    },
  },

  watch: {
    userId() {
      this.getUser();
      this.getPosts();
    },
  },
  created() {
    this.getUser();
    this.getPosts();
  },
  methods: {
    // ユーザー取得
    async getUser() {
      await api.get("/users/" + this.userId).then((response) => {
        this.user = response.data;
      });
    },
    // 投稿一覧取得
    async getPosts() {
      let url =
        "/posts?limit=" +
        this.limit +
        "&page=" +
        this.page +
        "&user_id=" +
        this.userId;
      await api.get(url).then((response) => {
        this.posts = response.data.posts;
        this.totalPostsCount = response.data.totalCount;
      });
      this.isLoading = false;
    },
    // 投稿削除
    async deletePost(postId) {
      await api.delete("/posts/" + postId).then(this.getPosts);
      this.$emit("deletePost");
    },
  },
};
</script>

<style scoped>
</style>
