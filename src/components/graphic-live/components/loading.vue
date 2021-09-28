<template>
  <div class="loading">
    <div>
      <p v-loading="true"></p>
      <p style="margin-top: 42px;">{{ $t("正在切换至图文直播") }}</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b8b8b8;
  font-size: 14px;
  
}
</style>
