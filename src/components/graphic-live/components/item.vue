<template>
  <div class="graphic-item">
    <img class="img" width="30" height="30" src="../images/avatar.png" alt="" />
    <div class="wrap">
      <div class="header">
        <p class="nickname">
          <span>{{ graphicName }}</span>
          <!-- 仅直播中时展示，回放不展示 -->
          <img
            v-if="index === 0 && isRoomState"
            src="../images/new.png"
            alt=""
          />
        </p>
        <p class="timer">
          <span>{{ _time | forMetaTime }}</span>
        </p>
      </div>
      <div class="content">
        <p class="cnt" v-if="content">
          {{ content }}
        </p>
        <div
          class="cnt-img"
          v-if="source.context.images.length"
          style="font-size: 0px"
        >
          <!-- height: _height, -->
          <div
            class="bgc"
            v-for="(img, i) in source.context.images"
            :key="i"
            :style="{
              marginTop: content ? '10px' : '',
              backgroundImage: `url(${_process + img})`,
              height: _height || sessionHeight,
            }"
            @click="toBigImg(i, source.context.images)"
          >
            <!-- <img
              :src="_process + img + _resize"
              alt=""
              @click="toBigImg(img)"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "item",
  props: {
    index: {
      // index of current item
      type: Number,
    },
    source: {
      // here is: {uid: 'unique_1', text: 'abc'}
      type: Object,
      default() {
        return {};
      },
    },
    graphicName: String,
    toBigImg: Function,
    isRoomState: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      sessionHeight: "",
    };
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this._height =
  //       document.querySelector(".bgc").getBoundingClientRect().width /
  //         1.7777778 +
  //       "px";

  //     // 响应式失效，需要强制更新
  //     this.$forceUpdate();
  //   });
  // },
  mounted() {
    setTimeout(() => {
      let getHeight = sessionStorage.getItem("bgcHeight");
      let domHeight = document.querySelector(".bgc").getBoundingClientRect().width / 1.7777778 + "px";
      if (getHeight || domHeight) {
        this.sessionHeight = getHeight || domHeight;
      }
    }, 500);

    window.addEventListener("resize", () => {
      sessionStorage.removeItem("bgcHeight");
    });
  },
  computed: {
    _height() {
      // let getHeight = sessionStorage.getItem('bgcHeight')
      // if (getHeight) {
      //   return getHeight
      // }
      let bgcDom = document.querySelector(".bgc");
      if (bgcDom) {
        let getHeight = bgcDom.getBoundingClientRect().width / 1.7777778 + "px";
        sessionStorage.setItem("bgcHeight", getHeight);
        return getHeight;
      }
    },
    _process() {
      return ''
    },
    _resize() {
      // return process.env.VUE_APP_IMG_CUT_STR + "m_fixed,h_73,w_130";
      return process.env.VUE_APP_IMG_CUT_STR;
    },
    _time() {
      return (
        new Date(this.source.date_time.replace(/-/g, "/")).getTime() +
        this.cutTime
      );
    },
    content() {
      if (typeof this.source.data === "string") {
        let text = JSON.parse(this.source.data).text_content;
        if (Object.prototype.toString.call(text) === "[object Object]") {
          return text.con;
        } else {
          return text;
        }
      }
    },
  },
  created() {
    // 时区兼容
    this.setCutTime();
  },
  filters: {
    forMetaTime(val) {
      // 处理 0
      function addZero(val) {
        return val < 10 ? "0" + val : val;
      }
      const time = new Date(val);
      const Y = time.getFullYear();
      const M = time.getMonth() + 1;
      const D = time.getDate();
      const h = time.getHours();
      const m = time.getMinutes();
      const s = time.getSeconds();
      return `${Y}-${addZero(M)}-${addZero(D)} ${addZero(h)}:${addZero(
        m
      )}:${addZero(s)}`;
    },
  },
  methods: {
    // 时区兼容
    setCutTime() {
      const oDate = new Date();
      const nTimezone = -oDate.getTimezoneOffset() / 60 - 8;
      this.cutTime = nTimezone * 60 * 60 * 1000;
    },
  },
};
</script>

<style scoped>
.graphic-item {
  position: relative;
  padding-bottom: 10px;
  color: #333;
}
.graphic-item .img {
  position: absolute;
  left: 0px;
}
.graphic-item .wrap .header {
  font-size: 14px;
  margin-left: 38px;
}
.graphic-item .wrap .header .nickname {
  display: flex;
  align-items: center;
  color: #333;
  margin-bottom: 5px;
}
          .graphic-item .wrap .header .nickname span:nth-child(1) {
            color: #333;
          }
          .graphic-item .wrap .header .nickname img {
            margin-left: 5px;
            width: 16px;
            height: 14px;
          }
        .graphic-item .wrap .header .timer {
          color: #999999;
        }
      .graphic-item .wrap .content {
        font-size: 14px;
        color: #333;
        margin-left: 14px;
        border-left: 1px solid #565656;
        padding: 14px 16px 10px 22px;
        margin-top: -5px;}
        .graphic-item .wrap .content .cnt {
          word-break: break-word;}
        .graphic-item .wrap .content .cnt-img {
            font-size: 0;}
          .graphic-item .wrap .content .cnt-img .bgc {
              display: inline-flex;
              width: calc(25% - 10px);
              margin-right: 10px;
              cursor: pointer;
              background-color: #0a1421;
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center;
              border-radius: 4px;
              box-sizing: border-box;
            }
</style>
