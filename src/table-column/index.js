Component({
  options: {
    virtualHost: true,
  },

  relations: {
    '../table/index': {
      type: 'parent',
      linked(target) {
        this.table = target
      },
    }
  },

  table: null,

  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    label: String,
    prop: String,
    flex: Number,
    width: String,
    minWidth: String,
    disabled: Boolean,
    autoHeight: Boolean,
    inputType: {
      type: String,
      value: 'text'
    },
    maxlength: {
      type: Number,
      value: -1
    },
    align: String,
    color: String,
    button: Array,
    customStyle: String,
    showSummary: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  observers: {
    '**': function () {
      if (!this.table) return
      this.table.updateColumns(this)
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
