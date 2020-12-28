<!-- 投稿一覧 -->
<template>
  <div>
    <!-- ローディング -->
    <div v-show="isLoading" class="text-center">
      <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
    </div>

    <!-- 非ローディング -->
    <div v-show="!isLoading">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <!-- サムネイル表示切り替え -->
            <v-checkbox v-model="showsMovieThumbnails" label="サムネイル表示"></v-checkbox>
          </v-col>
          <v-col
            class="pa-1 pa-sm-3"
            v-for="(post, key) in postType"
            :key="key"
            cols="12"
            xs="12"
            sm="6"
            md="4"
            lg="4"
          >
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card :elevation="hover ? 15 : 3" color="blue-grey lighten-5">
                  <router-link
                    style="text-decoration: none"
                    :to="{ name: 'DetailPostPage', params: { postId: post.id } }"
                    class="black--text"
                  >
                    <!-- タイトル -->
                    <v-card-title class="primary--text font-weight-bold">{{ post.title }}</v-card-title>

                    <!-- 発言者 -->
                    <v-card-subtitle class="font-weight-bold">{{ post.speaker }}</v-card-subtitle>
                  </router-link>

                  <!-- 動画 -->
                  <iframe
                    v-if="showsMovieThumbnails && post.embed_movie_url"
                    width="100%"
                    height="300px"
                    :src="post.embed_movie_url"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>

                  <v-card-text>
                    <!-- 投稿日 -->
                    <div>{{ post.created_at | moment }}</div>
                  </v-card-text>

                  <v-card-actions>
                    <v-list-item class="grow">
                      <!-- 投稿者 -->
                      <router-link
                        :to="{
                          name: 'DetailUserPage',
                          params: { userId: post.user_id },
                        }"
                      >
                        <v-list-item-avatar color="grey darken-3">
                          <v-img class="elevation-6" :src="baseURL + post.user_image_file_path"></v-img>
                        </v-list-item-avatar>
                      </router-link>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{
                          post.user_name
                          }}
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-row align="center" justify="end">
                        <!-- コメント件数 -->
                        <v-icon class="mr-1">mdi-comment</v-icon>
                        <span class="subheading mr-2">{{ post.comment_count }}</span>

                        <!-- お気に入り -->
                        <span v-if="isLoggedIn">
                          <v-btn v-if="post.is_favorite" text @click="deleteFavorite(post)">
                            <v-icon>mdi-star</v-icon>
                          </v-btn>
                          <v-btn v-else text @click="createFavorite(post)">
                            <v-icon>mdi-star-outline</v-icon>
                          </v-btn>
                        </span>
                      </v-row>
                    </v-list-item>
                  </v-card-actions>

                  <!-- 投稿者 = ログインユーザーである場合、編集、削除ボタン表示 -->
                  <div v-if="post.user_id === loginUserId">
                    <v-card-actions v-if="post.user_id === loginUserId">
                      <v-btn
                        text
                        style="text-decoration: none"
                        :to="{
                          name: 'UpdatePostPage',
                          params: { postId: post.id },
                        }"
                      >
                        <v-icon>mdi-pencil</v-icon>編集
                      </v-btn>
                      <v-btn text @click.stop="onDelete(post)">
                        <v-icon>mdi-delete</v-icon>削除
                      </v-btn>
                    </v-card-actions>

                    <!-- 削除確認ダイアログ -->
                    <v-dialog
                      v-model="showsDeleteDialog"
                      v-if="deleteTargetPost"
                      activator
                      max-width="600px"
                    >
                      <v-card class="pa-2">
                        <v-card-title>削除確認</v-card-title>
                        <v-card-text>
                          投稿：{{
                          deleteTargetPost.title
                          }}を削除します。よろしいですか？
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="showsDeleteDialog = false">キャンセル</v-btn>
                          <v-btn
                            color="blue-grey lighten-3"
                            @click="deletePost(deleteTargetPost.id)"
                            class="ml-4"
                          >OK</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </div>
                </v-card>
              </template>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import api from "@/services/api";

export default {
  props: ["postType", "isLoading"],
  data() {
    return {
      showsDeleteDialog: false,
      deleteTargetPost: null, // 削除対象投稿
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
      showsMovieThumbnails: true,
    };
  },
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "isLoggedIn",
      loginUserId: "id",
    }),
  },
  methods: {
    // 削除ボタンのイベントハンドラ
    onDelete(post) {
      this.deleteTargetPost = post;
      this.showsDeleteDialog = true;
    },
    // 投稿削除
    deletePost(postId) {
      this.showsDeleteDialog = false;
      this.$emit("deletePost", postId); // イベント発行
    },
    // お気に入り登録
    async createFavorite(post) {
      const postData = {
        user_id: this.loginUserId,
      };
      await api
        .post("/posts/" + post.id + "/favorites", postData)
        .then(() => {
          post.is_favorite = true;
        })
        .catch((error) => {
          console.log("お気に入り登録エラー");
          console.log(error);
        });
    },
    // お気に入り削除
    async deleteFavorite(post) {
      await api
        .delete("/posts/" + post.id + "/favorites/" + this.loginUserId)
        .then(() => {
          post.is_favorite = false;
        })
        .catch((error) => {
          console.log("お気に入り削除エラー");
          console.log(error);
        });
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>
