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
    width: String,
    minWidth: String,
    disabled: Boolean,
    autoHeight: Boolean,
    inputType: {
      type: String,
      value: 'text'
    },
    align: String,
    color: String,
    button: Array,
    customStyle: String,
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
