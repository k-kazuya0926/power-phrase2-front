<template>
  <div>
    <form @submit.prevent="submitText()" @click="post_comment">
      <div>
        <div class="mb-5">
          <v-textarea
            class="ma-0 pa-0"
            solo
            rows="2"
            v-model="body"
            placeholder="コメントを入力してください"
            hide-details
          ></v-textarea>
          <v-btn type="submit" block class="mt-1" dark color="blue-grey darken-1">
            <v-icon>mdi-send</v-icon>送信
          </v-btn>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import api from "@/services/api";

export default {
  props: ["post"],
  data() {
    return {
      body: "",
      userId: this.$store.getters["user/id"],
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters["user/isLoggedIn"];
    },
  },
  methods: {
    submitText: function () {
      if (this.body) {
        api
          .post("/posts/" + this.post.id + "/comments", {
            user_id: this.userId,
            body: this.body,
          })
          .then(() => {
            // 親コンポーネントでCommentGetメソッドを実行
            this.$emit("CommentGet");
          })
          .catch((error) => {
            console.log("response: ", error.response.data);
          });
        // 入力後、フォーム内の文字列をクリア
        this.body = "";
      }
    },
    post_comment() {
      if (this.isLoggedIn == false) {
        this.$store.dispatch("message/setInfoMessage", {
          message: "ログインが必要です",
        });
        this.$router.replace("/login");
      }
    },
  },
};
</script>
