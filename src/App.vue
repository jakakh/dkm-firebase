<template>
  <router-view v-title="currentTitle"></router-view>
</template>

<script>
export default {
  computed: {
    currentTitle() {
      return this.$app.AppNameShort + ' - ' + this.$route.meta.title;
    },
  },
  
}
</script>
