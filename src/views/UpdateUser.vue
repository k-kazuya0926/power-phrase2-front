<template>
  <Loading v-if="loading"></Loading>
  <v-container v-else>
    <v-form ref="updateUsersForm">
      <v-row>
        <v-col cols="12" sm="8">
          <v-text-field v-model="name" label="ユーザー名(20字以下)" :rules="userNameRules"></v-text-field>
        </v-col>
        <v-col cols="12" sm="8">
          <v-text-field v-model="email" label="email" :rules="emailRules"></v-text-field>
        </v-col>
        <!-- TODO パスワード -->
        <!-- <v-col cols="12" sm="8">
          <v-file-input @change="selectedFile" show-size counter multiple label="写真ファイル"></v-file-input>
        </v-col>-->
      </v-row>
    </v-form>
    <div class="text-right">
      <v-btn class="ma-2 white--text" color="blue" v-on:click="createUsers">ユーザ情報更新</v-btn>
    </div>
  </v-container>
</template>

<script>
import createAxios from "@/js/createAxios.js";
import getCookieDataByKey from "@/js/getCookieData.js";
// import uploadFile from "@/js/upload.js";
import Loading from "@/components/Loading";

export default {
  name: "CreateUsers",
  data: () => ({
    name: "",
    email: "",
    file: null,
    photoUrl: null,
    message: "",
    loading: true,
    userId: getCookieDataByKey("userId"),
    valueRequired: (value) => !!value || "必ず入力してください",
    userNameRules: [
      (value) => !!value || "必ず入力してください",
      (value) => value.length <= 20 || "20字以下にしてください",
    ],
    emailRules: [
      (value) => !!value || "必ず入力してください",
      (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      },
    ],
  }),
  components: { Loading },
  mounted: async function () {
    let axios = createAxios();
    const config = {
      headers: {
        Authorization: getCookieDataByKey("token"),
      },
    };
    let self = this;

    await axios
      .get("/users/" + self.userId, config, {})
      .then(function (response) {
        self.name = response.data.name;
        self.email = response.data.email;
        self.loading = false;
      })
      .catch((err) => {
        console.log("err:", err);
      });
  },
  methods: {
    createUsers: function () {
      if (!this.$refs.updateUsersForm.validate()) {
        return;
      }

      // uploadFile(this.file)
      //   .then((url) => {
      let self = this;
      var axios = createAxios();
      const config = {
        headers: {
          Authorization: getCookieDataByKey("token"),
        },
      };

      // TODO
      // let photoUrl = url;
      // if (url == null) {
      // photoUrl = self.photoUrl;
      // }
      // const postData = { name: this.name, photoUrl: photoUrl };
      const postData = { name: this.name };

      axios
        .put("/users/" + self.userId, postData, config)
        .then(function () {
          window.location.href = "/users/" + self.userId;
        })
        .catch((err) => {
          console.log("err:", err.response.data);
          this.message = err.response.data;
        });
      // })
      // .catch((err) => {
      //   console.log(err);
      // });
    },
    // selectedFile: function (e) {
    //   let file = e[0];
    //   this.file = file;
    // },
  },
};
</script>
