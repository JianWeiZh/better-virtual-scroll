<template>
  <div class="graphic-head">
    <header class="head">
      <span>{{ isRoomState ? $t("图文直播") : $t("图文回放") }}</span>
      <span></span>
      <span>{{ $t("共") + sumMsg + $t("条图文") }}</span>
    </header>
  </div>
</template>
<script>
export default {
  name: "header",
  props: {
    sumMsg: {
      type: Number,
      required: true,
    },
    isRoomState: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.graphic {
  &-head {
    padding: 0 20px 0 24px;
    // background-color: #1a1a1a;
    background: url(../images/header.png);
    background-repeat: no-repeat;
    background-size: cover;
    border-bottom: 1px solid #323232;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;
      span:nth-child(1) {
        display: inline-block;
        font-size: 16px;
        color: #c7000b;
        font-weight: 500;
        padding: 0 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #c7000b;
      }
      span:nth-child(3) {
        font-size: 12px;
        color: #b3b3b3;
      }
    }
  }
}
</style>
