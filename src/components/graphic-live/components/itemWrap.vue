<template>
  <div class="wrap">
    <graph-null v-if="isNull" />

    <graph-unread
      v-if="newGraphicMsg.length !== 0 && isUnReadVal"
      :newGraphicMsgLen="newGraphicMsg.length"
      @scrollTop="scrollTop"
    />

    <virtual-list
      v-if="!isNull"
      ref="wrap"
      class="wrap-virtual"
      :data-key="'msg_id'"
      :extra-props="{ graphicName, toBigImg, isRoomState }"
      :data-sources="messageList"
      :data-component="itemComponent"
      :keeps="pageNum"
      @tobottom="onScrollToBottom"
      @scroll="onScroll"
    >
      <div slot="footer" class="loading-spinner">
        <graph-footer v-if="isNoMore && !isLoading" />
        <div
          v-if="isLoading"
          style="height: 40px; background-color: rgba(0, 0, 0, 0)"
        >
          <p v-loading="!isNoMore"></p>
        </div>
      </div>
    </virtual-list>

    <!-- 回到顶部 -->
    <graph-top @scrollTop="scrollTop" v-if="isInView" />

    <!-- 图片放大 -->
    <big-img
      v-if="bigImg"
      :bigImg="bigImg"
      :isCar="imgs.length > 1"
      @closeBigImg="closeBigImg"
      @carImg="carImg"
    ></big-img>
  </div>
</template>
<script>
import VirtualList from "vue-virtual-scroll-list";
import Item from "./item.vue";
import GraphFooter from "./footer.vue";
import GraphNull from "./null.vue";
import GraphTop from "./top.vue";
import GraphUnread from "./unread.vue";
import BigImg from "./bigImg.vue";

export default {
  name: "graphicItemWrap",
  props: {
    ilId: {
      required: true,
    },
    isRoomState: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      itemComponent: Item,
      vm: this,
      isInView: false, // 是否出现回到顶部按钮（内容是否在视图内）
      isNull: false, // 暂无图文
      isNoMore: true, // 没有更多了
      messageList: [], // 图文直播数据
      pageSize: 1,
      pageNum: 87,
      pageAll: 0,
      graphicName: null, // 昵称
      bigImg: "", // 大图url
      imgIndex: "", // 图片index
      imgs: [], // 大图列表
      itemTotal: 10, // 记录一下当前已经加载了多少条数据
      scrollTopVal: 0, //
      newGraphicMsg: [], // 新消息
      isUnReadVal: false, // 是否展示未读消息
      msgSum: 0, // 图文消息总数
    };
  },
  components: {
    Item,
    GraphFooter,
    GraphNull,
    VirtualList,
    GraphTop,
    GraphUnread,
    BigImg,
  },
  watch: {
    "messageList.length": {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (newValue == 0) {
            this.isNull = true;
            this.isNoMore = false;
          } else {
            this.isNoMore = true;
          }
        }
      },
    },
  },
  mounted() {
    this.getMessageList(this.pageSize, this.pageNum);
    // 图文直播新消息
    this.watchDirectSend();
    // 图文直播撤回
    this.watchRetractConsole();
  },
  methods: {
    // 图文直播撤回
    watchRetractConsole() {
      this.$vhallEvent.$on("watch_retract-console", (msg) => {
        this.$emit("sumTotal", --this.msgSum);
        console.log(msg);
        console.log(this.messageList);
        let { draft_id } = msg.data.text_content;
        // 历史数据 && 消息数据
        let cntIndexDraft = this.messageList.findIndex(
          (item) => JSON.parse(item.data).text_content.draft_id == draft_id
        );

        console.log(this.newGraphicMsg);

        // 最新消息
        let newCntIndex = this.newGraphicMsg.findIndex(
          (item) => item.draft_id == draft_id
        );

        this.$nextTick(() => {
          if (cntIndexDraft !== -1) {
            this.messageList.splice(cntIndexDraft, 1);
          }

          if (newCntIndex !== -1) {
            this.newGraphicMsg.splice(newCntIndex, 1);
          }

          // 如果数据全部被撤回
          if (this.messageList.length === 0) {
            this.scrollTop(0);
          }

          // 解决偶尔会出现消息全部撤回后视图仍有残留的情况
          this.$forceUpdate();
        });

        // setTimeout(() => {
        //   this.messageList.splice(
        //     cntIndex === -1 ? cntIndexDraft : cntIndex,
        //     1
        //   );
        //   this.newGraphicMsg.splice(newCntIndex, 1);

        //   // 解决偶尔会出现消息全部撤回后视图仍有残留的情况
        //   this.$forceUpdate();
        // }, 0);
      });
    },
    // 图文直播新消息
    watchDirectSend() {
      // watch_direct-send
      this.$vhallEvent.$on("watch_direct-send", (msg) => {
        console.log(msg);
        this.$emit("sumTotal", ++this.msgSum);
        let cnt = msg.context;
        if (typeof cnt === "string") {
          cnt = JSON.parse(cnt);
        }

        let data = {
          draft_id: msg.data.text_content.draft_id,
          msg_id: msg.msg_id,
          date_time: msg.date_time,
          data: JSON.stringify(msg.data),
          context: cnt,
        };

        // 为 true 不自动滚动
        if (this.isInView) {
          this.newGraphicMsg.unshift(data);
          this.isUnReadVal = true;
        } else if (this.pageSize !== this.pageAll) {
          // setTimeout(() => {
          //   this.getMessageList(1, this.pageNum);
          // }, 300)
          // this.messageList.unshift(data);
          this.messageList = [data, ...this.messageList].slice(
            0,
            this.pageNum * this.pageSize
          );
          this.isNull = false;
        } else {
          this.messageList.unshift(data);
          this.isNull = false;
        }
      });
    },
    // 未读消息回到顶部
    goTop() {
      this.$refs.wrap && this.$refs.wrap.scrollToIndex(0);
    },
    closeBigImg() {
      this.bigImg = "";
    },
    // 大图左右切换
    carImg(type) {
      let len = this.imgs.length - 1;
      let i = this.imgIndex;

      // 0 left，1 right
      if (type === 0) {
        i = i - 1;
        this.toBigImg(i < 0 ? 0 : i);
      } else {
        i = i + 1;
        this.toBigImg(i > len ? len : i);
      }
    },
    toBigImg(i, imgs) {
      if (imgs) {
        this.imgs = imgs.map((img) => process.env.VUE_APP_STATIC_URL + img);
      }
      this.imgIndex = i;
      this.bigImg = this.imgs[i];
    },
    getMessageList(pageSize, pageNum) {
      let params = {
        // il_id: 6396 || this.ilId,
        il_id: this.ilId,
        curr_page: pageSize,
        page_size: pageNum,
        order_by: "desc",
      };
      this.$fetch("graphicMessageList", params)
        .then((res) => {
          console.log(res);
          if (res.code == 200 && res.data) {
            this.$emit("isLoading", false);
            this.graphicName = res.data.graphic_name;
            this.msgSum = res.data.total;
            this.pageAll = res.data.page_all;
            this.$emit("sumTotal", this.msgSum);
            this.isNoMore = true;

            if (res.data.total === 0) {
              this.isNull = true;
              this.isNoMore = false;
              return;
            }
            this.isNull = false;

            if (res.data.list.length === 0) {
              // this.isNoMore = true;
              this.isLoading = false;
              return;
            }
            this.messageList = this.messageList.concat(res.data.list);
            if (
              this.messageList.length > this.pageNum &&
              res.data.list.length !== 0
            ) {
              // this.isNoMore = false;
              this.isLoading = true;
            }
          }
        })
        .catch((e) => {
          console.error(e.msg);
        });
    },
    scrollTop(index) {
      if (this.newGraphicMsg.length !== 0) {
        // this.getMessageList(1, this.pageNum);
        this.messageList.unshift(...this.newGraphicMsg);
        this.newGraphicMsg = [];
      }
      setTimeout(() => {
        this.$refs.wrap && this.$refs.wrap.scrollToIndex(index);
      }, 200);
    },
    onScrollToBottom() {
      if (this.pageSize <= this.pageAll) {
        this.getMessageList(++this.pageSize, this.pageNum);
      }
    },
    // 添加防抖
    // 监听滚动事件，判断是否展示回到顶部
    // onScroll: debounce((vm) => {
    //   let offset = vm.$refs.wrap.getOffset();
    //   vm.isInView = offset > 800 ? true : false;
    // }, 200),
    onScroll(e) {
      let offset = this.$refs.wrap && this.$refs.wrap.getOffset();
      this.isInView = offset > 400 ? true : false;
      if (offset < 100) {
        this.isUnReadVal = false;
        if (this.newGraphicMsg.length !== 0) {
          // this.getMessageList(1, this.pageNum);
          this.messageList.unshift(...this.newGraphicMsg);
          this.newGraphicMsg = [];
        }
      }
      this.scrollTopVal = e.target.scrollTop;
    },
  },
  beforeDestroy() {
    this.$vhallEvent.$off("watch_direct-send");
    this.$vhallEvent.$off("watch_retract-console");
    // watch_retract-console
  },
};
</script>
<style lang="less" scoped>
.wrap {
  position: absolute;
  top: 40px;
  left: 0;
  bottom: 0;
  right: 0;
  padding-left: 16px;
  padding-bottom: 16px;
  padding-right: 4px;
  padding-top: 4px;
  &-virtual {
    height: 100%;
    overflow-y: auto;
    padding-top: 16px;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 6px;
      // background: rgba(0, 0, 0, 0.5);
      background-color: #121215;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      border-radius: 0px;
      background: rgba(0, 0, 0, 0);
    }
  }
}
</style>
