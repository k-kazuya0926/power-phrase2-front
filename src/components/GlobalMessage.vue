<template>
  <div>
    <v-alert
      dense
      type="success"
      class="message"
      border="left"
      elevation="8"
      dark
      show
      v-if="message.success"
    >{{ message.success }}</v-alert>

    <v-alert
      dense
      type="info"
      class="message"
      border="left"
      elevation="8"
      dark
      show
      v-if="message.info"
    >{{ message.info }}</v-alert>

    <v-alert
      dense
      type="warning"
      class="message"
      border="left"
      elevation="8"
      dark
      show
      v-if="message.warnings"
    >{{ message.warnings }}</v-alert>

    <v-alert
      dense
      type="error"
      class="message"
      border="left"
      elevation="8"
      dark
      show
      v-if="message.error"
    >{{ message.error }}</v-alert>
  </div>
</template>

<script>
export default {
  computed: {
    message: function () {
      return this.$store.state.message;
    },
  },
};
</script>

<style>
</style>
