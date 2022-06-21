import {
  debounce
} from './throttle-debounce'

Component({
  options: {
    pureDataPattern: /^_/,
    virtualHost: true,
    multipleSlots: true,
  },

  relations: {
    '../table-column/index': {
      type: 'child',
      linked() {
        this.debounceUpdateColumns()
      },
      unlinked() {
        this.debounceUpdateColumns()
      },
    }
  },

  externalClasses: ['custom-class', 'header-class', 'cell-class'],

  /**
   * 组件的属性列表
   */
  properties: {
    data: Array, // 显示的数据
    border: Boolean, // 是否带有纵向边框
    align: String, // 文本对齐方式
    size: String, // Table 的尺寸 medium / small / mini
    showHeader: {
      type: Boolean,
      value: true
    }, // 显示头部
    height: {
      type: String,
      optionalTypes: [Number]
    }, // 高度
    maxHeight: {
      type: String,
      optionalTypes: [Number]
    }, // 最大高度
    stripe: Boolean, // 是否为斑马纹 table
    rowHover: Boolean, // 行hover态
    emptyText: {
      type: String,
      value: '暂无数据'
    }, // 空数据时显示的文本内容
    showSummary: Boolean, // 是否在表尾显示合计行
    /**
     * 自定义的合计计算方法
     * Function({ columns, data })
     */
    summaryMethod: null,
    sumText: {
      type: String,
      value: '合计'
    }, // 合计行第一列的文本
    customStyle: String,
    inputDelay: {
      type: Number,
      value: 300
    },
    dataset: {
      type: Object,
      value: {}
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    _focus: false,
    _focusTimer: null,
    scrollableY: false,
    columns: [],
    sums: [],
    optional: [], // 可选列表
    multipleSelection: [], // 已选列表
  },

  observers: {
    data(data) {
      if (!data || data.length === 0) {
        return this.setData({
          optional: [],
          multipleSelection: [],
        })
      }
      return this.setData({
        optional: data.filter(item => !item.disabled),
        multipleSelection: data.filter(item => item.checked && !item.disabled),
      })
    },
    // 列数据
    columns(columns) {
      const data = this.data.data
      columns.forEach(column => {
        const formatter = column.formatter
        const prop = column.prop
        if (typeof formatter === 'function' && prop) {
          data.forEach((row, index) => {
            row[prop] = formatter(row, index)
            // console.log(row);
          })
        }
      })
      this.setData({
        data,
      })
    },
    // 合计行第一列文本
    sumText(sumText) {
      if (this.data.sums.length > 0) {
        this.setData({
          'sums[0]': sumText
        })
      }
    },
    // 合计行
    'data, columns, showSummary': function (data, columns, showSummary) {
      if (!data || !data.length) return
      if (!columns || !columns.length) return
      if (!showSummary) return
      let sums = []
      const {
        sumText,
        summaryMethod
      } = this.data
      if (typeof summaryMethod === 'function') {
        sums = summaryMethod({
          columns,
          data,
        })
      } else {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = sumText
            return
          }
          const values = data.map(item => Number(item[column.property]))
          const precisions = []
          let notNumber = true
          values.forEach(value => {
            if (!Number.isNaN(value)) {
              notNumber = false
              const decimal = ('' + value).split('.')[1]
              precisions.push(decimal ? decimal.length : 0)
            }
          })
          const precision = Math.max.apply(null, precisions)
          if (!notNumber) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return parseFloat((prev + curr).toFixed(Math.min(precision, 20)))
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        })
      }
      this.setData({
        sums,
      })
    },
    // 表格开启滚动
    'data, height, maxHeight': function (data, height, maxHeight) {
      this.setData({
        scrollableY: Boolean(data.length && (height || maxHeight)),
      })
    },
  },

  lifetimes: {
    created() {
      const _ = this
      _.debounceUpdateColumns = debounce(300, (column) => _.updateColumns(column))
    },
    ready() {
      const _ = this
      _.debouncedHandleInputChange = debounce(_.data.inputDelay, (event) => _.handleInputChange(event))
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleStopBubbling() {},

    updateColumns(column = null) {
      let columns = []
      if (column) {
        columns = this.data.columns
        const i = columns.findIndex(t => t.__wxExparserNodeId__ === column.__wxExparserNodeId__)
        const oldColumn = columns.find(t => t.__wxExparserNodeId__ === column.__wxExparserNodeId__)
        if (!oldColumn) return
        const newColumn = Object.assign(oldColumn, {
          property: column.properties.prop,
          ...column.properties,
        })
        this.setData({
          [`columns[${i}]`]: newColumn,
        })
        return
      }
      const nodes = this.getRelationNodes('../table-column/index')
      nodes.forEach(item => {
        const property = item.properties.prop
        columns.push({
          __wxExparserNodeId__: item.__wxExparserNodeId__,
          property,
          ...item.properties,
        })
      })
      this.setData({
        columns,
      })
    },

    handleHeaderClick(event) {
      const {
        column
      } = event.currentTarget.dataset
      this.triggerEvent('header-click', {
        column,
        event,
      })
    },

    // row、cell 点击
    handleClick(event) {
      if (this.data._focus) return // input 事件期间不执行 click 事件
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
        column,
      } = event.currentTarget.dataset
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, '', 'click')
    },

    // row、cell 长按
    handleLongPress(event) {
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
        column,
      } = event.currentTarget.dataset
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, '', 'long-press')
    },

    // 键盘输入时触发
    handleInputChange(event) {
      const {
        value
      } = event.detail
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
      } = event.currentTarget.dataset
      const column = this.data.columns[cellIndex]
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, value, 'input')
    },

    // 点击完成按钮时触发
    handleInputConfirm(event) {
      const {
        value
      } = event.detail
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
      } = event.currentTarget.dataset
      const column = this.data.columns[cellIndex]
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, value, 'input-confirm')
    },

    // 输入框聚焦时触发
    handleInputFocus(event) {
      clearTimeout(this.data._focusTimer) // blur 后再 focus 必须清除该定时器操作
      this.data._focus = true
      const {
        value
      } = event.detail
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
        column,
      } = event.currentTarget.dataset
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, value, 'input-focus')
    },

    // 输入框失去焦点时触发
    handleInputBlur(event) {
      const {
        value
      } = event.detail
      const {
        row,
        rowIndex,
        cell,
        cellIndex,
        column,
      } = event.currentTarget.dataset
      this.handleEvent(event, row, rowIndex, cell, cellIndex, column, value, 'input-blur')
      clearTimeout(this.data._focusTimer)
      this.data._focusTimer = setTimeout(() => {
        this.setData({
          _focus: false,
        })
      }, 300)
    },

    // row、cell 事件代理
    handleEvent(event, row, rowIndex, cell, cellIndex, column, value, type) {
      if (column && column.__wxExparserNodeId__) delete column.__wxExparserNodeId__
      const detail = {
        event,
        row,
        rowIndex,
        cell,
        cellIndex,
        column,
        value,
      }
      detail.dataset = this.data.dataset
      if (type === 'click' || type === 'long-press') delete detail.value
      this.triggerEvent(`cell-${type}`, detail)
      this.triggerEvent(`row-${type}`, detail)
    },

    // 多选
    handleSelectionChange(event) {
      const values = event.detail.value
      const {
        data,
        optional,
        multipleSelection,
      } = this.data
      if (values) {
        for (let i = 0, lenI = data.length; i < lenI; ++i) {
          data[i].checked = false
          for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (i === Number(values[j])) {
              data[i].checked = true
              break
            }
          }
        }
      } else {
        data.forEach(item => {
          item.checked = item.disabled ? item.checked : !(optional.length === multipleSelection.length)
        })
      }
      this.setData({
        data,
      }, () => {
        this.triggerEvent('selection-change', this.data.multipleSelection)
      })
    },

    // 按钮
    handleButtonClick(event) {
      const {
        index,
        openType,
        row,
        rowIndex,
        column,
        triggerEvent,
      } = event.currentTarget.dataset
      const detail = {
        index,
        row,
        rowIndex,
        column,
      }
      if (openType) return
      if (column && column.__wxExparserNodeId__) delete column.__wxExparserNodeId__
      detail.dataset = this.data.dataset
      if (triggerEvent) {
        this.triggerEvent(triggerEvent, detail)
        return
      }
      this.triggerEvent('click', detail)
    },
  }
})
