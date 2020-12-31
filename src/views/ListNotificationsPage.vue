<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card
          elevation="5"
          color="blue-grey lighten-5"
          class="mx-auto mb-5"
          max-width="600px"
          v-for="i in 2"
          :key="i"
        >
          <div class="pl-2 pt-2">
            <v-icon v-if="i === 1" color="yellow darken-4">mdi-star</v-icon>
            <v-icon v-else>mdi-comment</v-icon>
            <v-avatar class="ml-2">
              <v-img
                class="elevation-6"
                :src="baseURL + 'images/20201218205639_3217ac0b0c402abbda34013c549ada75a7b6f7b4.png'"
              ></v-img>
            </v-avatar>
          </div>
          <v-card-title>
            Aさんがあなたの投稿
            <span v-if="i === 1">をお気に入りに登録</span>
            <span v-else>にコメント</span>しました。
          </v-card-title>

          <v-card-subtitle>ヨット理論</v-card-subtitle>

          <v-card-text>{{ "2020-12-31 10:30:00" | moment }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
// import api from "@/services/api";
import { mapGetters } from "vuex";

export default {
  name: "ListNotificationsPage",
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
  // props: ["postId"],
  data() {
    return {
      notifications: [],
      //     post: { user_id: 0 },
      //     isLoading: true,
      //     showsDeleteCommentDialog: false,
      //     deleteTargetComment: null,
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
      //     commentBody: "",
    };
  },
  computed: {
    ...mapGetters("user", {
      loginUserId: "id",
      isLoggedIn: "isLoggedIn",
    }),
  },
  // mounted() {
  //   api
  //     .get("/posts/" + this.postId + "?login_user_id=" + this.loginUserId)
  //     .then((response) => {
  //       this.post = response.data;
  //     });
  //   this.getComments();
  // },
  // methods: {
  //   // コメント一覧取得
  //   getComments() {
  //     api
  //       .get("/posts/" + this.postId + "/comments?limit=100&page=1")
  //       .then((response) => {
  //         this.comments = response.data.comments;
  //         this.isLoading = false;
  //       });
  //   },
  //   // コメント削除ボタンのイベントハンドラ
  //   onClickDeleteCommentBtn(comment) {
  //     this.deleteTargetComment = comment;
  //     this.showsDeleteCommentDialog = true;
  //   },
  //   // コメント削除
  //   deleteComment(comment_id) {
  //     this.showsDeleteCommentDialog = false;
  //     api.delete("/comments/" + comment_id).then(this.getComments);
  //   },
  //   // 1つ前へ戻る
  //   back() {
  //     this.$router.back();
  //   },
  //   // コメント登録
  //   createComment: function () {
  //     if (this.commentBody) {
  //       api
  //         .post("/posts/" + this.post.id + "/comments", {
  //           user_id: this.loginUserId,
  //           body: this.commentBody,
  //         })
  //         .then(() => {
  //           this.getComments();
  //         })
  //         .catch((error) => {
  //           console.log("response: ", error.response.data);
  //         });
  //       // 入力後、フォーム内の文字列をクリア
  //       this.commentBody = "";
  //     }
  //   },
  //   // お気に入り登録
  //   async createFavorite(post) {
  //     const postData = {
  //       user_id: this.loginUserId,
  //     };
  //     await api
  //       .post("/posts/" + post.id + "/favorites", postData)
  //       .then(() => {
  //         post.is_favorite = true;
  //         post.favorite_count++;
  //       })
  //       .catch((error) => {
  //         console.log("お気に入り登録エラー");
  //         console.log(error);
  //       });
  //   },
  //   // お気に入り削除
  //   async deleteFavorite(post) {
  //     await api
  //       .delete("/posts/" + post.id + "/favorites/" + this.loginUserId)
  //       .then(() => {
  //         post.is_favorite = false;
  //         post.favorite_count--;
  //       })
  //       .catch((error) => {
  //         console.log("お気に入り削除エラー");
  //         console.log(error);
  //       });
  //   },
  // },
};
</script>

<style scoped>
</style>
