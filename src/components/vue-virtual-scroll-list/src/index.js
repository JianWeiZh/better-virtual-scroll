import Virtual from './virtual'
/**
 * 虚拟滚动实现
 * 只支持纵向滚动
 * 列表每个块不允许有margin，不然影响计算
 */
export default class Vir {
  constructor (params) {
    /**
     * params data
     * keeps：虚拟列表渲染个数
     * buffer：滚动列表时动态更新渲染列表的个数，最好取keeps的四分之一或三分之一的整数
     * updataSource：type Function 更新数据 params：list（渲染的列表） style（padding-top/bottom高度）
     */
    this.params = params
    this.list = []
    this.virtual = null
    this.sourceList = null
    this.style = null
    this.installVirtual()
  }
  /**
   * 初始化虚拟滚动函
   * return 虚拟滚动实例对象
   */
  installVirtual () {
    this.virtual = new Virtual({
      slotHeaderSize: 0,
      slotFooterSize: 0,
      keeps: this.params.keeps || 20,
      estimateSize: 18,
      buffer: this.params.buffer || 5, // recommend for a third of keeps
      uniqueIds: this.getUniqueIdFromDataSources()
    }, this.onRangeChanged.bind(this))
    return this.virtual
  }
  uploadScroll (y) {
    this.virtual.handleScroll(Math.abs(y))
  }
  /**
   * 更新列表数据
   * @param {*} list 
   */
  updataVirtual (list) {
    this.list = list
    this.virtual.updateParam('uniqueIds', this.getUniqueIdFromDataSources())
    this.virtual.handleDataSourcesChange()
  }
  /**
   * 
   * @param {*} fn 
   * 获取列表每一项的高度的方法，
   * 返回一个数组，第一个为唯一ID，第二个为dom高度 
   * 入参为当前被渲染列表的每一项
   */
  setHeight(fn) {
    const list = this.sourceList
    for(let i = 0; i<list.length; i++) {
      const res = fn(list[i])
      this.virtual.saveSize(...res)
    }
  }

  getUniqueIdFromDataSources () {
    const list = this.list.map(item => item.msg_id)
    return list
  }

  onRangeChanged (range) {
    this.style = {'paddingTop': range.padFront + 'px', 'paddingBottom': range.padBehind + 'px'}
    this.sourceList = this.list.slice(range.start, range.start + this.params.keeps)

    this.params.updataSource(this.sourceList, this.style)
  }

  destroy () {
    this.virtual.destroy()
  }
}