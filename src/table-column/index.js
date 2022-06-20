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
    clickable: {
      type: Boolean,
      value: true
    },
    formatter: null,
    formatterProp: String,
    disabled: Boolean,
    autoHeight: Boolean,
    inputType: {
      type: String,
      value: 'text'
    },
    align: String,
    confirmText: {
      type: String,
      value: '确定'
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    /**
     * switch 配置属性
     */
    // activeValue: {
    //   type: Boolean,
    //   optionalTypes: [String, Number],
    //   value: true
    // },
    // inactiveValue: {
    //   type: Boolean,
    //   optionalTypes: [String, Number],
    //   value: false
    // },
    // activeText: {
    //   type: String,
    //   value: '开'
    // },
    // inactiveText: {
    //   type: String,
    //   value: '关'
    // },
    // activeColor: String,
    // inactiveColor: String,

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
