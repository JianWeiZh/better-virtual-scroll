<template>
  <div ref="app" id="app">
    <div class="list" :style="style">
      <item
        v-for="item in sourceList"
        :key="item.msg_id"
        :ref="item.msg_id"
        :source="item"
        :isRoomState="true"
        graphicName="主播"
      >
      </item>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Pullup from '@better-scroll/pull-up'
import Virtual from './components/vue-virtual-scroll-list/src/index.js'
// import qs from 'qs'
import Item from './components/graphic-live/components/item.vue'
import Data from './assets/index.js'
export default {
  name: 'App',
  data () {
    return {
      currPage: 1,
      pageSize: 50,
      style: {'paddingTop': 0, 'paddingBottom': 0},
      keeps: 20,
      range: null,
      sourceList: [],
      list: [],
      scroll: null,
      y: null,
      timer: null
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.setList()
      let scrollBox = this.$refs.app
      BScroll.use(Pullup)
      let scroll = this.scroll = new BScroll(scrollBox, {
        deceleration: 0.0085,
        autoEndDistance: 40,
        probeType: 3,
        click: true,
        scrollX: false,
        pullUpLoad: true
      })
      const Params = {
        keeps: this.keeps,
        buffer: this.keeps / 4,
        updataSource: this.updataSource
      }
      this.virtual = new Virtual(Params)
      this.virtual.updataVirtual(this.list)
      scroll.refresh()
      
      scroll.on('scroll', (pos) => {
        this.virtual.uploadScroll(pos.y)
      })
      scroll.on('scrollEnd', () => {
        this.$nextTick(() => {
          scroll.refresh()
        })
      })
      scroll.on('pullingUp', async () => {
        this.currPage++
        await this.setList()
        this.virtual.updataVirtual(this.list)
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      })
    })
  },
  methods: {
    updataSource (list, style) {
      this.sourceList = list
      this.style = style
      this.$nextTick(() => {
        this.virtual.setHeight((item) => {
          const ItemDom = this.$refs[item.msg_id][0].$el
          const h = ItemDom ? ItemDom.getBoundingClientRect().height : 0
          return [item.msg_id, h]
        })
        const scroll = this.scroll
        scroll && scroll.refresh()
      })
    },
    setList () {
      return new Promise((resolve) => {
        const i = (this.currPage - 1) * this.pageSize;
        const list = Data.slice(i, i + this.pageSize)
        this.list = [...this.list, ...list]
        resolve()
      })
    }
  },
  components: {
    Item
  },
  beforeDestroy () {
    this.scroll.destroy()
    this.virtual.destroy()
  }
}
</script>

<style>
html,body{
  margin: 0;
  padding: 0;
}
#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.list{
  overflow: hidden;
}
.list p{
  box-sizing: border-box;
  margin: 0;
  padding: 10px 0;
}
</style>
