<template>
  <div class="top" @click="scrollTop"></div>
</template>
<script>
export default {
  name: "top",
  methods: {
    scrollTop() {
      this.$emit("scrollTop", 0);
    },
  },
};
</script>
<style lang="less" scoped>
.top {
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 28px;
  right: 20px;
  background-image: url(../images/top.png);
  background-repeat: no-repeat;
  background-size: cover;
  // border-radius: 50%;
  cursor: pointer;
}
</style>
