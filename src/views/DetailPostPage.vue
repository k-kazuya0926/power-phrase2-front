<template>
  <div>
    <!-- ローディング -->
    <div v-show="isLoading" class="text-center">
      <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
    </div>

    <div v-show="!isLoading">
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

      <v-container fluid>
        <v-row justify="center" align-content="center">
          <v-col class="py-0">
            <v-card elevation="5" color="blue-grey lighten-5" class="mx-auto" max-width="600px">
              <div>
                <v-row justify="center">
                  <!-- 投稿詳細エリア -->
                  <v-col cols="12">
                    <!--タイトル-->
                    <v-card-title
                      class="float-left text-lg-h4 text-xs-caption font-weight-bold"
                    >{{ post.title }}</v-card-title>
                    <div class="text-right">
                      <!--投稿者-->
                      <v-btn
                        class="px-0"
                        v-if="post.user_id"
                        text
                        :to="{ name: 'DetailUserPage', params: { userId: post.user_id } }"
                        style="text-transform: none; text-decoration: none"
                      >
                        <v-avatar size="36px" class="ma-2">
                          <img :src="baseURL + post.user_image_file_path" />
                        </v-avatar>
                        <span class="text-lg-h6">{{ post.user_name }}</span>
                      </v-btn>

                      <!--投稿日-->
                      <div>
                        <span>{{ post.created_at | moment }}</span>
                      </div>
                    </div>

                    <!-- 発言者 -->
                    <v-card-subtitle id="post_content" class="font-weight-bold">{{ post.speaker }}</v-card-subtitle>

                    <!-- 詳細 -->
                    <v-card-text
                      style="white-space:pre-wrap; word-wrap:break-word;"
                    >{{ post.detail }}</v-card-text>

                    <!-- 動画 -->
                    <!-- <v-card-text> -->
                    <iframe
                      v-if="post.embed_movie_url"
                      width="100%"
                      height="300px"
                      :src="post.embed_movie_url"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                    <!-- </v-card-text> -->
                  </v-col>

                  <v-divider class="mx-4 my-0"></v-divider>

                  <!-- コメントエリア -->
                  <v-col cols="12">
                    <div>
                      <div>
                        <div>
                          <form @submit.prevent="createComment()">
                            <div>
                              <div class="mb-5">
                                <v-textarea
                                  class="ma-0 pa-0"
                                  solo
                                  rows="3"
                                  v-model="commentBody"
                                  placeholder="コメントを入力してください"
                                  hide-details
                                ></v-textarea>
                                <v-btn
                                  type="submit"
                                  block
                                  class="mt-1"
                                  dark
                                  color="blue-grey darken-1"
                                >
                                  <v-icon>mdi-send</v-icon>登録
                                </v-btn>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div v-if="comments == ''">
                      <p id="none_message">まだコメントがありません</p>
                    </div>
                    <div v-else>
                      <div class="logbox">
                        <!-- コメント一覧 -->
                        <ul style="list-style:none">
                          <li v-for="comment in comments" :key="comment.id">
                            <article tabindex="-1">
                              <header>
                                <div>
                                  <!-- コメント登録ユーザー -->
                                  <v-btn
                                    class="px-0 float-left"
                                    v-if="comment.user_id"
                                    text
                                    :to="{
                                    name: 'DetailUserPage',
                                    params: { userId: comment.user_id },
                                  }"
                                    style="
                                    text-transform: none;
                                    text-decoration: none;
                                  "
                                  >
                                    <v-avatar size="36px" class="ma-2">
                                      <img :src="baseURL + comment.user_image_file_path" />
                                    </v-avatar>
                                    <span class="text-lg-h6">{{ comment.user_name }}</span>
                                  </v-btn>

                                  <!-- コメント登録日時 -->
                                  <div class="text-right text-body-2">
                                    <span>{{ comment.created_at | moment }}</span>
                                  </div>
                                </div>
                              </header>

                              <!-- コメント本文 -->
                              <div>
                                <div>{{ comment.body }}</div>
                              </div>

                              <!-- コメント削除 -->
                              <div class="text-right" v-if="comment.user_id == loginUserId">
                                <v-btn text icon @click.stop="onClickDeleteCommentBtn(comment)">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>

                                <v-dialog
                                  v-model="showsDeleteCommentDialog"
                                  v-if="deleteTargetComment"
                                  activator
                                  max-width="600px"
                                >
                                  <v-card class="pa-2">
                                    <v-card-title>削除確認</v-card-title>
                                    <v-card-text>
                                      コメント：{{
                                      deleteTargetComment.body
                                      }}を削除します。よろしいですか？
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn @click="showsDeleteCommentDialog = false">キャンセル</v-btn>
                                      <v-btn
                                        color="blue-grey lighten-3"
                                        @click="deleteComment(deleteTargetComment.id)"
                                        class="ml-4"
                                      >OK</v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </div>
                            </article>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import api from "@/services/api";
import { mapGetters } from "vuex";

export default {
  name: "DetailPostPage",
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
  props: ["postId"],
  data() {
    return {
      comments: [],
      post: {},
      isLoading: true,
      showsDeleteCommentDialog: false,
      deleteTargetComment: null,
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
      commentBody: "",
    };
  },
  computed: {
    ...mapGetters("user", {
      loginUserId: "id",
    }),
  },
  mounted() {
    api.get("/posts/" + this.postId).then((response) => {
      this.post = response.data;
    });
    this.getComments();
  },
  methods: {
    // コメント一覧取得
    getComments() {
      api
        .get("/posts/" + this.postId + "/comments?limit=100&page=1")
        .then((response) => {
          this.comments = response.data.comments;
          this.isLoading = false;
        });
    },
    // コメント削除ボタンのイベントハンドラ
    onClickDeleteCommentBtn(comment) {
      this.deleteTargetComment = comment;
      this.showsDeleteCommentDialog = true;
    },
    // コメント削除
    deleteComment(comment_id) {
      this.showsDeleteCommentDialog = false;
      api.delete("/comments/" + comment_id).then(this.getComments);
    },
    // 1つ前へ戻る
    back() {
      this.$router.back();
    },
    // コメント登録
    createComment: function () {
      if (this.commentBody) {
        api
          .post("/posts/" + this.post.id + "/comments", {
            user_id: this.loginUserId,
            body: this.commentBody,
          })
          .then(() => {
            this.getComments();
          })
          .catch((error) => {
            console.log("response: ", error.response.data);
          });
        // 入力後、フォーム内の文字列をクリア
        this.commentBody = "";
      }
    },
  },
};
</script>

<style scoped>
</style>
