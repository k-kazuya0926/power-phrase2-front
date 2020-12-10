<template>
  <div>
    <PostList
      :postType="previousPosts"
      :user_id="auth_id"
      @parentPostDelete="parentPostDelete"
      :isLoading="isLoading"
      :postURL="postURL"
      :sessionKey="sessionKey"
    />
    <div v-if="previousPosts == ''" v-show="!isLoading">
      <p id="none_message">まだ投稿がありません</p>
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import api from "@/services/api";
import { clearSession } from "@/mixins/utility";

export default {
  props: ["userId"],
  components: {
    PostList,
  },
  mixins: [clearSession],
  data() {
    return {
      auth_id: this.$store.getters["user/id"],
      postNum: 0,
      page: 1,
      isLoading: true,
      previousPosts: [],
      sessionKey: "infinitePage_previous",
    };
  },
  computed: {
    postURL() {
      // TODO 件数
      return "/posts?limit=100&page=1&user_id=" + this.auth_id;
    },
  },
  watch: {
    $route() {
      this.getPosts();
    },
    isLoading() {
      this.$nextTick(() => {
        var positionY = sessionStorage.getItem("positionY");
        // console.log(positionY);
        scrollTo(0, positionY);
        setTimeout(function () {
          scrollTo(0, positionY);
        });
      });
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
          this.previousPosts = response.data.posts;
        });
      this.isLoading = false;
    },
    async parentPostDelete(post_id) {
      await api.delete("/posts/" + post_id).then(this.getPosts);
      this.$emit("deletePost");
    },
  },
};
</script>

<style>
@import "../assets/common.css";
</style>
