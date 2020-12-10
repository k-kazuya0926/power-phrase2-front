<!-- 新着投稿 -->
<template>
  <div>
    <PostList
      :postType="latestPosts"
      :isLoading="isLoading"
      :postURL="postURL"
      :sessionKey="sessionKey"
      @deletePost="deletePost"
    />
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import api from "@/services/api";
import { clearSession } from "@/mixins/utility";

export default {
  components: {
    PostList,
  },
  mixins: [clearSession],

  data() {
    return {
      page: 1,
      latestPosts: [],
      isLoading: true,
      postURL: "/posts?limit=9&page=1",
      sessionKey: "infinitePage_latest",
    };
  },
  async mounted() {
    this.getPosts();
  },
  methods: {
    // 投稿一覧取得
    async getPosts() {
      await api.get(this.postURL).then((response) => {
        this.latestPosts = response.data.posts;
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
