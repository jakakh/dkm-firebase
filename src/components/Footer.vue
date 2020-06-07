<template>
  <div class="footer">
      <a :href="this.$app.Web"> {{ this.$app.AppName + ' ' + this.$app.Version }}</a>
      <span> &copy; {{ this.$app.Year }}.</span>
      <span> Powered by</span>
      <a :href="this.$app.TagWeb"> {{ this.$app.Tag }}</a>
  </div>
</template>

<script>
  export default {
    name: "Footer"
  };
</script>
