// pages/examples/table/table.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      list: [],
      renderData: false,
      border: false,
      stripe: false,
      center: false,
      hideSex: false,
      height: 0,
      showSummary: false,
      sumText: '合计',
      emptyText: '暂无数据',
      editable: false,
      size: '',
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.handleRenderData();
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
  
    },
  
    handleSetHeight(event) {
      let val = event.detail.value;
      this.setData({
        height: Number(val) || val
      })
    },
  
    handleSetSumText(event) {
      this.setData({
        sumText: event.detail.value
      })
    },
  
    handleSetEmptyText(event) {
      this.setData({
        emptyText: event.detail.value
      })
    },
  
    handleSwitchChange(event) {
      const prop = event.currentTarget.dataset.prop;
      const bool = event.detail.value;
      this.setData({
        [`${prop}`]: bool,
      }, () => {
        if (prop === 'renderData') {
          bool ? this.handleRenderData() : this.handleClearData();
        }
      })
    },
  
    handleRenderData() {
      let result = [];
      for (let i = 0; i < 5; i++) {
        result.push({
          id: i,
          name: `小明克隆人${i}号`,
          age: 26 + i,
          sex: i % 2 === 0 ? '女' : '男',
          disabled: i % 2 === 0,
        })
      }
      result[0].checked = true;
      this.setData({
        list: result
      })
    },
  
    handleChangeTabelSize(event) {
      const size = event.currentTarget.dataset.size || '';
      this.setData({
        size
      })
    },
  
    handleClearData() {
      this.setData({
        list: []
      })
    },
  
    handleSelectionChange(event) {
      console.log(event.detail);
    },
  })