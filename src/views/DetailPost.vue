<template>
  <Loading v-if="loading"></Loading>
  <v-card max-width="800" class="mx-auto" color="white" v-else>
    <v-container>
      <v-row align="center" class="spacer" no-gutters>
        <v-col cols="12" md="1">
          <router-link :to="{name: 'DetailUser', params: {userId: userId}}">
            <v-avatar size="60px" :to="{name: 'DetailUser', params: {userId: user.id}}">
              <v-img :src="baseURL + user.image_file_path" alt />
            </v-avatar>
          </router-link>
        </v-col>
        <v-col classs="ml-3 subtitle-1" cols="12" md="10">
          <v-card-title class="headline">{{ post.user_name }} {{ post.created_at | moment }}</v-card-title>
        </v-col>
        <v-col cols="12" md="12">
          <v-card-title class=".font-weight-bold">{{ post.title }}</v-card-title>
          <v-card-subtitle class=".font-weight-bold">{{ post.speaker }}</v-card-subtitle>
          <v-card-text
            class=".font-weight-bold"
            style="white-space:pre-wrap; word-wrap:break-word;"
          >{{ post.detail }}</v-card-text>
          <v-card-text>
            <iframe
              v-if="post.embed_movie_url"
              width="100%"
              height="400px"
              :src="post.embed_movie_url"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              v-show="sameUser"
              :to="{name: 'UpdatePost', params: {postId: post.id}}"
              color="blue"
            >
              <v-icon color="white">mdi-update</v-icon>投稿を編集
            </v-btn>
            <v-btn v-show="sameUser" @click.stop="dialog = true" color="blue">
              <v-icon color="white">mdi-delete</v-icon>投稿を削除
            </v-btn>
          </v-card-actions>
          <v-dialog v-model="dialog" max-width="290">
            <v-card>
              <v-card-title class="headline">本当に削除しますか？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">キャンセル</v-btn>

                <v-btn color="green darken-1" text @click="deletePost">削除</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="12" md="12"></v-col>
      </v-row>

      <v-divider class="white my-10"></v-divider>

      <v-layout justify-center>
        <v-card-title>コメント</v-card-title>
      </v-layout>
      <v-pagination
        v-model="page"
        :length="length"
        :total-visible="10"
        class="my-4"
        v-show="commentsVisible"
        @input="showComments"
      ></v-pagination>
      <v-row dense class="mb-6" justify="center" v-show="commentsVisible">
        <v-col
          class="pt-10"
          v-model="comments"
          v-for="comment in comments"
          :key="comment.id"
          cols="12"
          md="8"
        >
          <v-card>
            <v-card-actions>
              <v-list-item class="grow">
                <router-link :to="{name: 'DetailUser', params: {userId: comment.user_id}}">
                  <v-list-item-avatar color="grey darken-3">
                    <v-img :src="baseURL + comment.user_image_file_path" alt />
                  </v-list-item-avatar>
                </router-link>
                <v-list-item-content>
                  <v-list-item-title>{{ comment.user_name }} {{ comment.created_at | moment }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card-actions>

            <v-card-text
              class=".font-weight-bold"
              style="white-space:pre-wrap; word-wrap:break-word;"
            >{{ comment.body }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-form ref="createCommentForm">
        <v-textarea
          v-model="commentBody"
          color="teal"
          outlined
          :rules="[counterRequired, limitLengthContent]"
        >
          <template v-slot:label>
            <div>コメント作成(100字以下)</div>
          </template>
        </v-textarea>
      </v-form>
      <div class="text-right">
        <v-btn class="ma-2 white--text" color="blue" v-on:click="createComment">コメント作成</v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";
import Loading from "@/components/Loading";
import moment from "moment";

export default {
  name: "DetailPost",
  data: () => ({
    post: {},
    user: {},
    userId: 0,
    clickLike: false,
    likeId: null,
    sameUser: false,
    loading: true,
    dialog: false,
    commentsVisible: false,
    comments: [],
    page: 1,
    length: 0,
    limit: 10,
    commentBody: "",
    baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    counterRequired: (counter) => !!counter || "必ず入力してください",
    limitLengthContent: (counter) =>
      counter.length <= 100 || "100字以内にしてください",
  }),
  components: { Loading },
  mounted: async function () {
    let axios = createAxios();
    const config = {
      headers: {
        Authorization: "Bearer " + getCookieDataByKey("token"),
      },
    };
    let self = this;
    let userId = getCookieDataByKey("userId");

    await axios
      .get("/posts/" + this.$route.params.postId, config, {})
      .then(function (response) {
        self.post = response.data;
        self.userId = response.data.user_id;
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .get("/users/" + this.userId, config, {})
      .then(function (response) {
        self.user = response.data;
      })
      .catch((err) => {
        console.log("err:", err);
      });

    config.params = { limit: self.limit, page: self.page };
    await axios
      .get("/posts/" + this.post.id + "/comments", config, {})
      .then(function (response) {
        self.comments = response.data.comments;
        if (response.data.totalCount != undefined) {
          self.length = Math.ceil(response.data.totalCount / self.limit);
          self.commentsVisible = true;
        } else {
          self.length = 0;
        }
      })
      .catch((err) => {
        console.log("err:", err);
      });

    if (this.userId == userId) {
      this.sameUser = true;
    }

    this.loading = false;
  },
  methods: {
    deletePost: function () {
      let axios = createAxios();
      const config = {
        headers: {
          Authorization: "Bearer " + getCookieDataByKey("token"),
        },
      };
      axios
        .delete("/posts/" + this.post.id, config)
        .then(function () {
          window.location.href = "/";
        })
        .catch((err) => {
          console.log("err:", err.response.data);
          this.message = err.response.data;
        });
    },
    // コメント一覧取得
    showComments: async function () {
      let axios = createAxios();
      const config = {
        headers: {
          Authorization: "Bearer " + getCookieDataByKey("token"),
        },
      };
      let self = this;

      config.params = { limit: self.limit, page: self.page };
      await axios
        .get("/posts/" + this.post.id + "/comments", config, {})
        .then(function (response) {
          self.comments = response.data.comments;
          if (response.data.totalCount != undefined) {
            self.length = Math.ceil(response.data.totalCount / self.limit);
            self.commentsVisible = true;
          } else {
            self.length = 0;
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },
    createComment: async function () {
      if (!this.$refs.createCommentForm.validate()) {
        return;
      }

      var axios = createAxios();
      const config = {
        headers: {
          Authorization: "Bearer " + getCookieDataByKey("token"),
        },
      };
      const postData = {
        body: this.commentBody,
        user_id: Number(getCookieDataByKey("userId")),
      };
      axios
        .post("/posts/" + this.post.id + "/comments", postData, config)
        .then(function () {
          location.reload();
        })
        .catch((err) => {
          console.log("err:", err.response.data);
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
