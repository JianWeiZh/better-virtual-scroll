<template>
  <div class="null">
    <img src="../images/null.png" width="60" height="56" alt="">
    <p>{{ $t('还没有发布图文') }}</p>
  </div>
</template>
<style lang="less" scoped>
.null {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b8b8b8;
  font-size: 14px;
  flex-direction: column;
  img {
    margin-top: -16px;
  }
  p {
    margin-top: 16px;
  }
}
</style>
