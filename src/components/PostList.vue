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
                  >
                    <!-- タイトル -->
                    <v-card-title class="font-weight-bold">{{ post.title }}</v-card-title>

                    <!-- 発言者 -->
                    <v-card-subtitle class="font-weight-bold">{{ post.speaker }}</v-card-subtitle>

                    <!-- 動画 -->
                    <iframe
                      v-if="post.embed_movie_url"
                      width="100%"
                      height="300px"
                      :src="post.embed_movie_url"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>

                    <!-- 投稿者 -->
                    <router-link
                      style="text-decoration: none"
                      :to="{
                          name: 'DetailUserPage',
                          params: { userId: post.user_id },
                        }"
                    >
                      <v-btn text class="px-2" style="text-transform: none; text-decoration: none">
                        <v-avatar size="24px">
                          <img :src="baseURL + post.user_image_file_path" />
                        </v-avatar>
                        <span class="text-h6">
                          {{
                          post.user_name
                          }}
                        </span>
                      </v-btn>
                    </router-link>

                    <v-card-text class="px-2 pt-0">
                      <!-- 投稿日 -->
                      <div
                        class="px-0 text-caption text-sm-body-2"
                        style="color: #263238"
                      >{{ post.created_at | moment }}</div>
                    </v-card-text>
                  </router-link>

                  <!-- 投稿者 = ログインユーザーである場合、編集、削除ボタン表示 -->
                  <div v-if="post.user_id === loginUserId">
                    <v-divider class="mx-4 my-0"></v-divider>
                    <v-card-actions>
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

export default {
  props: ["postType", "isLoading"],
  data() {
    return {
      showsDeleteDialog: false,
      deleteTargetPost: null, // 削除対象投稿
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  computed: {
    ...mapGetters("user", {
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
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>
