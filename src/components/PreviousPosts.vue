<template>
  <div>
    <PostList :postType="posts" @deletePost="deletePost" :isLoading="isLoading" />
    <div v-if="posts == ''" v-show="!isLoading">
      <p id="none_message">まだ投稿がありません</p>
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
      postNum: 0,
      page: 1,
      isLoading: true,
      posts: [],
    };
  },
  computed: {
    postURL() {
      // TODO 件数
      return "/posts?limit=100&page=1&user_id=" + this.loginUserId;
    },
    ...mapGetters("user", {
      loginUserId: "id",
    }),
  },
  watch: {
    $route() {
      this.getPosts();
    },
  },
  async mounted() {
    this.getPosts();
  },
  methods: {
    async getPosts() {
      // TODO 件数
      await api
        .get("/posts?limit=100&page=1&user_id=" + this.userId)
        .then((response) => {
          this.posts = response.data.posts;
        });
      this.isLoading = false;
    },
    async deletePost(postId) {
      await api.delete("/posts/" + postId).then(this.getPosts);
      this.$emit("deletePost");
    },
  },
};
</script>

<style>
</style>
