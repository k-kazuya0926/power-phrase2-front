<template>
  <div>
    <v-btn class="mx-2 d-none d-sm-flex" @click="$router.back()" fab fixed dark small>
      <v-icon dark>mdi-arrow-left</v-icon>
    </v-btn>

    <div class="content">
      <div v-show="isLoading" class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>

      <div v-show="!isLoading">
        <v-card class="mb-2">
          <v-row no-gutters>
            <!-- アイコン -->
            <v-col cols="6" lg="3" sm="3" xs="3">TODO アイコン</v-col>

            <v-col cols="6" lg="4" md="3" sm="9" xs="3" class="pa-md-3">
              <!-- TODO 本人である場合 -->
              <v-card-title
                v-if="true"
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h3 pa-2 pa-sm-4"
              >
                {{ login_username }}
                <!-- TODO 編集ボタン -->
                <v-btn
                  v-if="true"
                  style="text-decoration: none"
                  fab
                  x-small
                  class="ml-4"
                  color="indigo lighten-4"
                  to="/profile_edit"
                >
                  <v-icon>mdi-account-edit</v-icon>
                </v-btn>
              </v-card-title>
            </v-col>
          </v-row>
        </v-card>

        <!-- タブ -->
        <v-tabs centered show-arrows>
          <v-tab :to="{ name: 'DetailUser', params: { userId: userId } }">
            <v-icon left>mdi-history</v-icon>
            <!-- <v-badge :content="previousPostsNum" :value="previousPostsNum">
              <span>これまでの投稿</span>
            </v-badge>-->
          </v-tab>
        </v-tabs>

        <!-- 投稿一覧-->
        <!-- <div class="content">
          <transition appear>
            <router-view @deletePost="get_previous_posts" />
          </transition>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
// import api from "@/services/api";

export default {
  props: ["userId"],
  data() {
    return {
      loaded: true, // TODO false
      previousPostsNum: 0,
      Person: {},
      previousPosts: [], // これまでの投稿
      login_user_icon_image: this.$store.getters["user/image_file_path"],
      login_username: this.$store.getters["user/name"],
      isLoading: false, // TODO true
    };
  },
  // computed: {
  //   ...mapGetters("user", {
  //     login_user_id: "id",
  //   }),
  //   isLoggedIn() {
  //     return this.$store.getters["auth/isLoggedIn"];
  //   },
  // },
  // watch: {
  //   userId() {
  //     this.setPerson();
  //     this.loaded = false;
  //     this.get_previous_posts();
  //   },
  // },
  // craeted() {
  //   console.log("created");
  //   this.get_previous_posts();
  // },
  // async mounted() {
  //   console.log("mouted");
  //   this.setPerson();
  //   this.loaded = false;
  //   await api
  //     .get("/posts?limit=4&page=1&user_id=" + this.userId)
  //     .then((response) => {
  //       this.previousPosts = response.data.posts;
  //     });
  // },
  // methods: {
  //   get_previous_posts() {
  //     console.log("get_previous_posts");
  //     api
  //       .get("/posts?limit=4&page=1&user_id=" + this.userId)
  //       .then((response) => {
  //         this.previousPosts = response.data.posts;
  //         this.previousPostsNum = response.data.totalCount;
  //       });
  //   },
  //   async setPerson() {
  //     await api.get("/users/" + this.userId + "/").then((response) => {
  //       this.Person = response.data;
  //     });
  //     this.isLoading = false;
  //   },
  // },
};
</script>

<style>
</style>
