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

    <v-btn
      class="mx-2 d-flex d-sm-none"
      fab
      large
      fixed
      right
      bottom
      dark
      color="blue-grey lighten-2"
      to="/newpostpage"
    >
      <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <div class="content">
      <!--loading-->
      <div v-show="isLoading" class="text-center">
        <v-progress-circular indeterminate color="blue-gray"></v-progress-circular>
      </div>

      <div v-show="!isLoading">
        <v-card class="mb-2" color="blue-grey lighten-5">
          <v-row no-gutters>
            <!--アイコン-->
            <v-col cols="6" lg="3" md="3" sm="3" xs="3">
              <v-img v-if="Person.image_file_path" eager :src="baseURL + Person.image_file_path"></v-img>
            </v-col>

            <v-col cols="6" lg="4" md="3" sm="9" xs="3" class="pa-md-3">
              <!--本人である場合-->
              <v-card-title
                v-if="userId == login_user_id"
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h3 pa-2 pa-sm-4"
              >
                {{ login_user_username }}
                <!--編集ボタン-->
                <v-btn
                  v-if="userId == login_user_id"
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
              <v-card-title
                v-else
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h3"
              >{{ Person.name }}</v-card-title>
            </v-col>
          </v-row>
        </v-card>

        <!--投稿一覧-->
        <v-tabs color="blue-grey lighten-2" centered show-arrows>
          <v-tab :to="{ name: 'DetailUserPage', params: { userId: userId } }">
            <v-icon left>mdi-history</v-icon>
            <v-badge
              color="blue-grey darken-1"
              :content="previousPostsNum"
              :value="previousPostsNum"
            >
              <span>これまでの投稿</span>
            </v-badge>
          </v-tab>
        </v-tabs>

        <!--投稿一覧-->
        <div class="content">
          <transition appear>
            <router-view @deletePost="get_previous_posts" />
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
      loaded: false,
      previousPostsNum: 0,
      Person: {},
      previousPosts: [], // これまでの投稿
      login_user_icon_image: this.$store.getters["user/image_file_path"],
      login_user_username: this.$store.getters["user/name"],
      isLoading: true,
      baseURL: process.env.VUE_APP_STATIC_FILE_ENDPOINT,
    };
  },
  computed: {
    ...mapGetters("user", {
      login_user_id: "id",
    }),
    isLoggedIn() {
      return this.$store.getters["user/isLoggedIn"];
    },
  },

  watch: {
    userId() {
      this.setPerson();
      this.loaded = false;
      this.get_previous_posts();
    },
  },
  created() {
    this.get_previous_posts();
  },
  async mounted() {
    this.setPerson();
    this.loaded = false;
    // TODO 必要か？
    // await api.get("/posts/mini/?author=" + this.userId).then((response) => {
    //   this.previousPosts = response.data;
    //   this.options.animation.animateRotate = true;
    //   // this.set_category_data();
    //   this.options.animation.animateRotate = false;
    // });
  },
  methods: {
    get_previous_posts() {
      // TODO 件数
      api
        .get("/posts?limit=100&page=1&user_id=" + this.userId)
        .then((response) => {
          this.previousPosts = response.data.posts;
          this.previousPostsNum = response.data.totalCount;
        });
    },
    async setPerson() {
      await api.get("/users/" + this.userId).then((response) => {
        this.Person = response.data;
      });
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
@import "../assets/common.css";

.v-tabs {
  border-bottom: 1px solid rgb(223, 211, 211);
}

.v-tabs a {
  text-decoration: none;
}

.v-tab span {
  font-size: 16px;
}

.content {
  margin: 20px auto;
  max-width: 1200px;
  font-size: 20px;
}

.chart {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
