<template>
  <div class="big-img">
    <div class="cnt">
      <span @click="closeBigImg"></span>
      <div class="bgc-wrap">
        <!-- <img class="bgc" :src="bigImg" alt="" /> -->
        <div class="bgc" :style="{ backgroundImage: `url(${bigImg})` }">
          <div v-show="isCar">
            <button
              type="button"
              class="el-carousel__arrow el-carousel__arrow--left"
              @click="carImg(0)"
            >
              <i class="el-icon-arrow-left"></i>
            </button>
            <button
              type="button"
              class="el-carousel__arrow el-carousel__arrow--right"
              @click="carImg(1)"
            >
              <i class="el-icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "big-img",
  props: {
    bigImg: {
      type: String,
      required: true,
    },
    isCar: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeBigImg() {
      this.$emit("closeBigImg");
    },
    carImg(type) {
      this.$emit("carImg", type);
    },
  },
};
</script>
<style lang="less" scoped>
.big-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  .cnt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    .bgc-wrap {
      width: 100%;
      height: 100%;
      .bgc {
        width: 66%;
        height: 66%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 4px;
        transform: translate(25%, 25%);
        position: relative;
        .el-carousel__arrow {
          border: none;
          outline: none;
          padding: 0;
          margin: 0;
          height: 50px;
          width: 50px;
          cursor: pointer;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff;
          position: absolute;
          top: 50%;
          z-index: 10;
          transform: translateY(-50%);
          text-align: center;
          font-size: 24px;
          &--left {
            left: -50px;
          }
          &--right {
            right: -50px;
          }
        }
      }
    }
  }
  // .cnt {
  //   position: absolute;
  //   width: 518px;
  //   height: 290px;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  // }
  span {
    position: absolute;
    width: 30px;
    height: 30px;
    background: url(../images/close.png);
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    top: 5%;
    right: 10%;
  }
}
</style>