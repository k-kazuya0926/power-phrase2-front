<!--投稿一覧-->
<template>
  <div>
    <!--ローディング-->
    <div v-show="isLoading" class="text-center">
      <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
    </div>

    <!--非ローディング-->
    <div v-show="!isLoading">
      <v-container>
        <v-row>
          <v-col
            class="pa-1 pa-sm-2"
            v-for="(post, key) in postType"
            :key="key"
            cols="6"
            lg="4"
            md="4"
            sm="6"
            xs="3"
          >
            <v-hover>
              <template v-slot:default="{ hover }">
                <v-card :elevation="hover ? 15 : 3" color="blue-grey lighten-5">
                  <router-link
                    style="text-decoration: none"
                    :to="{ name: 'DetailPostPage', params: { postId: post.id } }"
                  >
                    <!-- タイトル -->
                    <v-card-title>{{ post.title }}</v-card-title>

                    <!-- 発言者 -->
                    <v-card-subtitle>{{ post.speaker }}</v-card-subtitle>

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
                    <v-card-title class="pa-1 pa-sm-4">
                      <router-link
                        style="text-decoration: none"
                        :to="{
                          name: 'DetailUserPage',
                          params: { userId: post.user_id },
                        }"
                      >
                        <v-btn
                          text
                          class="px-0"
                          style="text-transform: none; text-decoration: none"
                        >
                          <v-avatar size="24px" class="mr-2">
                            <img :src="baseURL + post.user_image_file_path" />
                          </v-avatar>
                          <span class="text-body-2 text-sm-h6">
                            {{
                            post.user_name
                            }}
                          </span>
                        </v-btn>
                      </router-link>
                    </v-card-title>

                    <v-card-actions class="px-2 py-0 px-sm-4 py-sm-2">
                      <!-- 投稿日 -->
                      <div class="px-0 text-caption text-sm-body-2" style="color: #263238">
                        <span class="px-1 px-sm-2">
                          {{
                          post.created_at | moment
                          }}
                        </span>
                      </div>

                      <v-spacer></v-spacer>

                      <!--PC用-->
                      <div class="d-none d-sm-flex">
                        <!-- TODO コメント -->
                        <!-- <v-icon medium class="pr-1">mdi-message-text</v-icon>
                        <span style="color: #263238">
                          {{
                          post.comments_count
                          }}
                        </span>-->

                        <!-- TODO いいね -->
                        <!-- <v-icon medium class="ml-2 pr-1">mdi-heart-outline</v-icon>
                        <span style="color: #263238">
                          {{
                          post.likes_count
                          }}
                        </span>-->
                      </div>
                      <!--SP用-->
                      <div class="d-flex d-sm-none">
                        <!-- TODO コメント -->
                        <!-- <v-icon small class="pr-0">mdi-message-text</v-icon>
                        <span style="color: #263238">
                          {{
                          post.comments_count
                          }}
                        </span>-->
                        <!-- TODO いいね -->
                        <!-- <v-icon small class="ml-1 pr-0">mdi-heart-outline</v-icon>
                        <span style="color: #263238">
                          {{
                          post.likes_count
                          }}
                        </span>-->
                      </div>
                    </v-card-actions>
                  </router-link>

                  <!-- TODO 投稿者 = ログインユーザーである場合、編集、削除ボタン表示 -->
                  <div v-if="post.user_id == user_id">
                    <v-divider class="mx-4 my-0"></v-divider>
                    <v-card-actions>
                      <v-btn
                        text
                        style="text-decoration: none"
                        :to="{
                          name: 'post_edit',
                          params: { post_id: post.id },
                        }"
                      >
                        <v-icon>mdi-pencil</v-icon>編集
                      </v-btn>
                      <v-btn text @click.stop="onClickBtn(post)">
                        <v-icon>mdi-delete</v-icon>削除
                      </v-btn>
                    </v-card-actions>

                    <!--削除確認ダイアログ-->
                    <v-dialog v-model="dialog" v-if="currentPost" activator max-width="600px">
                      <v-card class="pa-2">
                        <v-card-title>削除確認</v-card-title>
                        <v-card-text>
                          投稿：{{
                          currentPost.title
                          }}を削除します。よろしいですか？
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="dialog = false">キャンセル</v-btn>
                          <v-btn
                            color="blue-grey lighten-3"
                            @click="DestroyPost(currentPost.id)"
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

      <!--無限スクロール-->
      <!-- <div v-if="nextPage">
        <infinite-loading spinner="spiral" @infinite="infiniteHandler">
          <span slot="no-more"></span>
          <span slot="no-results"></span>
        </infinite-loading>
      </div>-->
    </div>
  </div>
</template>

<script>
import moment from "moment";
import api from "@/services/api";
import { watchScrollPosition, clearSession } from "@/mixins/utility";

export default {
  props: [
    "postType",
    "user_id",
    "isLoading",
    "nextPage",
    "postURL",
    "sessionKey",
  ],
  data() {
    return {
      page: 1,
      dialog: false, // 削除確認ダイアログを表示するか
      currentPost: null, // 削除対象投稿
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  mixins: [watchScrollPosition, clearSession],

  methods: {
    DestroyPost(post_id) {
      this.dialog = false;
      this.clearSession(); // 無限スクロール関連をsessionStorageから削除
      this.$emit("parentPostDelete", post_id); // TODO 不明
    },
    infiniteHandler($state) {
      this.page += 1;
      sessionStorage.setItem(this.sessionKey, this.page);
      api
        .get(this.postURL, {
          params: {
            page: this.page,
          },
        })
        .then(({ data }) => {
          setTimeout(() => {
            if (data.results.length) {
              if (data.next === null) {
                this.postType.push(...data.results);
                $state.complete();
              } else {
                this.postType.push(...data.results);
                $state.loaded();
              }
            }
          }, 500);
        });
    },
    onClickBtn(post) {
      // 削除ボタンのイベントハンドラ
      this.currentPost = post;
      this.dialog = true;
    },
  },
  filters: {
    moment: function (date) {
      return moment(date).format("YYYY/MM/DD HH:mm");
    },
  },
};
</script>
