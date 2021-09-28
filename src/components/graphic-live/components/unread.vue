<template>
  <div class="unread" @click="scrollTop">
    <span>{{ newGraphicMsgLen + $t("条图文未读消息") }}</span>
    <img src="../images/_top.png" alt="" />
  </div>
</template>
<script>
export default {
  name: "unread",
  props: {
    newGraphicMsgLen: {
      // index of current item
      type: Number,
    },
  },
  methods: {
    scrollTop() {
      this.$emit("scrollTop", 0);
    },
  },
};
</script>
<style lang="less" scoped>
.unread {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 124px;
  padding: 0 14px;
  height: 28px;
  background: #363636;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  cursor: pointer;
  span {
    font-size: 14px;
    color: #ffffff;
  }
  img {
    width: 12px;
    height: 6px;
    margin-left: 5px;
  }
}
</style>
