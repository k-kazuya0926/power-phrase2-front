<template>
  <div>
    <!-- SP用、投稿作成ボタン -->
    <v-btn
      class="mx-2 d-flex d-sm-none"
      fab
      large
      fixed
      right
      bottom
      dark
      color="blue-grey lighten-2"
      to="/posts/create"
      v-if="isLoggedIn"
    >
      <v-icon dark>mdi-pencil</v-icon>
    </v-btn>

    <v-container>
      <v-row class="lighten-4" style="height: 80px;" justify="center">
        <v-col cols="12" sm="6">
          <!-- 検索 -->
          <v-text-field
            v-model="keyword"
            label="検索"
            @keyup.enter="getPosts"
            clearable
            prepend-inner-icon="mdi-magnify"
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- ページネーション -->
      <v-row justify="center">全{{ totalPostsCount }}件</v-row>
      <v-pagination v-model="page" :length="pageLength" :total-visible="10" @input="getPosts"></v-pagination>
    </v-container>

    <!-- 投稿一覧 -->
    <div class="content">
      <PostList :postType="posts" :isLoading="isLoading" @deletePost="deletePost" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PostList from "@/components/PostList";
import api from "@/services/api";

export default {
  components: {
    PostList,
  },
  data() {
    return {
      isLoading: true,
      limit: 100,
      page: 1,
      keyword: "",
      posts: [],
      totalPostsCount: 0,
    };
  },
  async mounted() {
    this.getPosts();
  },
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "isLoggedIn",
      loginUserId: "id",
    }),
    pageLength: function () {
      return Math.ceil(this.totalPostsCount / this.limit);
    },
  },
  methods: {
    // 投稿一覧取得
    async getPosts() {
      let url =
        "/posts?limit=" +
        this.limit +
        "&page=" +
        this.page +
        "&login_user_id=" +
        this.loginUserId;
      if (this.keyword) {
        url += "&keyword=" + this.keyword;
      }
      await api.get(url).then((response) => {
        this.posts = response.data.posts;
        this.totalPostsCount = response.data.totalCount;
      });
      this.isLoading = false;
    },
    // 投稿削除
    async deletePost(postId) {
      await api
        .delete("/posts/" + postId)
        .then(this.getPosts)
        .catch((error) => {
          console.log("投稿削除エラー");
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
</style>
