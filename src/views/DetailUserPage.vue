<template>
  <div>
    <!-- 戻るボタン -->
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

    <div class="content">
      <!-- loading -->
      <div v-show="isLoading" class="text-center">
        <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
      </div>

      <div v-show="!isLoading">
        <v-card class="mb-2" color="blue-grey lighten-5">
          <v-row no-gutters>
            <!--アイコン-->
            <v-col cols="6" lg="3" md="3" sm="3" xs="3">
              <v-img v-if="user.image_file_path" eager :src="baseURL + user.image_file_path"></v-img>
            </v-col>

            <v-col cols="6" lg="4" md="3" sm="9" xs="3" class="pa-md-3">
              <!--本人である場合-->
              <v-card-title
                v-if="userId == loginUserId"
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h3 pa-2 pa-sm-4"
              >
                {{ loginUserName }}
                <!--編集ボタン-->
                <v-btn
                  v-if="userId == loginUserId"
                  style="text-decoration: none"
                  fab
                  x-small
                  class="ml-4"
                  color="indigo lighten-4"
                  to="/update_user"
                >
                  <v-icon>mdi-account-edit</v-icon>
                </v-btn>
              </v-card-title>

              <!--本人でない場合-->
              <v-card-title v-else class="text-h5 text-sm-h4 text-md-h4 text-lg-h3">{{ user.name }}</v-card-title>
            </v-col>
          </v-row>
        </v-card>

        <!--投稿一覧-->
        <v-tabs color="blue-grey lighten-2" centered show-arrows>
          <v-tab :to="{ name: 'DetailUserPage', params: { userId: userId } }">
            <v-icon left>mdi-history</v-icon>
            <v-badge color="blue-grey darken-1" :content="postsNum" :value="postsNum">
              <span>投稿一覧</span>
            </v-badge>
          </v-tab>
        </v-tabs>
        <div class="content">
          <transition appear>
            <router-view @deletePost="getPosts" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/services/api";

export default {
  props: ["userId"],
  data() {
    return {
      postsNum: 0,
      user: {},
      posts: [], // これまでの投稿
      isLoading: true,
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  computed: {
    ...mapGetters("user", {
      loginUserId: "id",
      loginUserName: "name",
    }),
    isLoggedIn() {
      return this.$store.getters["user/isLoggedIn"];
    },
  },

  watch: {
    userId() {
      this.getUser();
      this.getPosts();
    },
  },
  created() {
    this.getPosts();
    this.getUser();
  },
  methods: {
    getPosts() {
      // TODO 件数
      api
        .get("/posts?limit=100&page=1&user_id=" + this.userId)
        .then((response) => {
          this.posts = response.data.posts;
          this.postsNum = response.data.totalCount;
        });
    },
    async getUser() {
      await api.get("/users/" + this.userId).then((response) => {
        this.user = response.data;
      });
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
</style>
