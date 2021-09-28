/**
 * virtual list core calculating center
 */

const DIRECTION_TYPE = {
  FRONT: 'FRONT', // scroll up or left
  BEHIND: 'BEHIND' // scroll down or right
}
const CALC_TYPE = {
  INIT: 'INIT',
  FIXED: 'FIXED',
  DYNAMIC: 'DYNAMIC'
}
const LEADING_BUFFER = 2

export default class Virtual {
  constructor (param, callUpdate) {
    this.init(param, callUpdate)
  }

  init (param, callUpdate) {
    // param data
    this.param = param
    this.callUpdate = callUpdate
    // size data
    this.sizes = new Map()
    this.firstRangeTotalSize = 0
    this.firstRangeAverageSize = 0
    this.lastCalcIndex = 0
    this.fixedSizeValue = 0
    this.calcType = CALC_TYPE.INIT

    // scroll data
    this.offset = 0
    this.direction = ''

    // range data
    this.range = Object.create(null)
    if (param) {
      this.checkRange(0, param.keeps - 1)
    }
  }

  destroy () {
    this.init(null, null)
  }

  // return current render range
  getRange () {
    const range = Object.create(null)
    range.start = this.range.start
    range.end = this.range.end
    range.padFront = this.range.padFront
    range.padBehind = this.range.padBehind
    return range
  }

  isBehind () {
    return this.direction === DIRECTION_TYPE.BEHIND
  }

  isFront () {
    return this.direction === DIRECTION_TYPE.FRONT
  }

  // return start index offset
  getOffset (start) {
    return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize
  }

  updateParam (key, value) {
    if (this.param && (key in this.param)) {
      // if uniqueIds change, find out deleted id and remove from size map
      if (key === 'uniqueIds') {
        this.sizes.forEach((v, key) => {
          if (!value.includes(key)) {
            this.sizes.delete(key)
          }
        })
      }
      this.param[key] = value
    }
  }

  // save each size map by id
  saveSize (id, size) {
    this.sizes.set(id, size)
  }

  // in some special situation (e.g. length change) we need to update in a row
  // try goiong to render next range by a leading buffer according to current direction
  handleDataSourcesChange () {
    let start = this.range.start

    if (this.isFront()) {
      start = start - LEADING_BUFFER
    } else if (this.isBehind()) {
      start = start + LEADING_BUFFER
    }

    start = Math.max(start, 0)

    this.updateRange(this.range.start, this.getEndByStart(start))
  }

  // when slot size change, we also need force update
  handleSlotSizeChange () {
    this.handleDataSourcesChange()
  }

  // calculating range on scroll
  handleScroll (offset) {
    this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND
    // this.offset = offset
    if (!this.param) {
      return
    }

    if (this.direction === DIRECTION_TYPE.FRONT) {
      this.handleFront(offset)
    } else if (this.direction === DIRECTION_TYPE.BEHIND) {
      this.handleBehind(offset)
    }
    this.offset = offset
  }

  // ----------- public method end -----------

  handleFront () {
    const overs = this.getScrollOvers()
    // should not change range if start doesn't exceed overs
    if (overs > this.range.start) {
      return
    }

    // move up start by a buffer length, and make sure its safety
    const start = Math.max(overs - this.param.buffer, 0)
    this.checkRange(start, this.getEndByStart(start))
  }

  handleBehind () {
    const overs = this.getScrollOvers()
    // range should not change if scroll overs within buffer
    if (overs !== 0 && overs < this.range.start + this.param.buffer) {
      return
    }

    this.checkRange(overs, this.getEndByStart(overs))
  }

  // return the pass overs according to current scroll offset
  getScrollOvers () {
    // if slot header exist, we need subtract its size
    const offset = this.offset - this.param.slotHeaderSize
    if (offset <= 0) {
      return 0
    }
    // if is fixed type, that can be easily
    if (this.isFixedType()) {
      return Math.floor(offset / this.fixedSizeValue)
    }

    let low = 0
    let middle = 0
    let middleOffset = 0
    let high = this.param.uniqueIds.length
    while (low <= high) {
      // this.__bsearchCalls++
      middle = low + Math.floor((high - low) / 2)
      middleOffset = this.getIndexOffset(middle)
      if (middleOffset === offset) {
        return middle
      } else if (middleOffset < offset) {
        low = middle + 1
      } else if (middleOffset > offset) {
        high = middle - 1
      }
    }

    return low > 0 ? --low : 0
  }

  // return a scroll offset from given index, can efficiency be improved more here?
  // although the call frequency is very high, its only a superposition of numbers
  getIndexOffset (givenIndex) {
    if (!givenIndex) {
      return 0
    }

    let offset = 0
    let indexSize = 0
    for (let index = 0; index < givenIndex; index++) {
      // this.__getIndexOffsetCalls++
      indexSize = this.sizes.get(this.param.uniqueIds[index])
      offset = offset + (typeof indexSize === 'number' ? indexSize : this.getEstimateSize())
    }

    // remember last calculate index
    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1)
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex())

    return offset
  }

  // is fixed size type
  // 是否是固定大小的类型
  isFixedType () {
    return this.calcType === CALC_TYPE.FIXED
  }

  // 获取列表最后一个下标
  getLastIndex () {
    return this.param.uniqueIds.length - 1
  }

  // 检测开始和结束下标是否在正常范围内（检测边界值）
  checkRange (start, end) {
    const keeps = this.param.keeps
    const total = this.param.uniqueIds.length

    // datas less than keeps, render all
    if (total <= keeps) {
      start = 0
      end = this.getLastIndex()
    } else if (end - start < keeps - 1) {
      // if range length is less than keeps, corrent it base on end
      start = end - keeps + 1
    }
    if (this.range.start !== start) {
      this.updateRange(start, end)
    }
  }

  // 更新range参数
  updateRange (start, end) {
    this.range.start = start
    this.range.end = end
    this.range.padFront = this.getPadFront()
    this.range.padBehind = this.getPadBehind()
    this.callUpdate(this.getRange())
  }

  // 获取结束下标
  getEndByStart (start) {
    const theoryEnd = start + this.param.keeps - 1
    const truelyEnd = Math.min(theoryEnd, this.getLastIndex())
    return truelyEnd
  }

  // 获取头部padding高度
  getPadFront () {
    const list = Array.from(this.sizes).slice(0, this.range.start)
    let num = 0
    list.map(item => {
      num += item[1]
    })
    return num
  }

  // 获取底部padding高度
  getPadBehind () {
    const end = this.range.end
    const lastIndex = this.getLastIndex()
    let num = 0
    const list = Array.from(this.sizes).slice(end, lastIndex)
    list.map(item => {
      num += item[1]
    })
    return num
  }

  // get the item estimate size
  getEstimateSize () {
    return this.isFixedType() ? this.fixedSizeValue : (this.firstRangeAverageSize || this.param.estimateSize)
  }
}
