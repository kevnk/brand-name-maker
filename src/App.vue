<template>
  <div id="app">
    <h1>Brand Name Maker</h1>
    Based off this
    <a
      href="http://blog.pieratt.com/post/77293289254/a-3-step-process-for-naming-a-projectproduct"
      target="_blank"
      rel="noopener"
      >3-step naming process</a
    >. <br /><small>Read it first.</small> <BrandNameMaker />
  </div>
</template>

<script>
import BrandNameMaker from "./components/BrandNameMaker.vue";

export default {
  name: "app",
  components: {
    BrandNameMaker,
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  small {
    opacity: 0.5;
  }
}
</style>
