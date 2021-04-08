// pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: " ", 
    searchresult:[],
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var result = JSON.parse(options.result);
    // console.log(result);
    var i = 0;
    for(i; i<result.length; i++)
    {
      if(result[i].type == 0)
      {
        // that.setData({
        //   rubbishtype:"可回收垃圾",
        //   rubbishiconpath: "/pages/picture/recycle_icon.png",    
        // })
        result[i].type = "可回收垃圾"
        result[i].rubbishiconpath = "/pages/picture/recycle_icon.png"
      }
      if(result[i].type == 1)
      {
          // that.setData({
          //   rubbishtype:"有害垃圾",
          //   rubbishiconpath: "/pages/picture/harmful_icon.png",           
          // })
          result[i].type = "有害垃圾"
          result[i].rubbishiconpath = "/pages/picture/harmful_icon.png"
      }
      if(result[i].type == 2)
      {
          // that.setData({
          //   rubbishtype:"厨余垃圾",
          //   rubbishiconpath: "/pages/picture/kitchen_icon.png", 
          // })
          result[i].type = "厨余垃圾"
          result[i].rubbishiconpath = "/pages/picture/kitchen_icon.png"        
      }
      if(result[i].type == 3)
      {
          // that.setData({
          //   rubbishtype:"其他垃圾",
          //   rubbishiconpath: "/pages/picture/other_icon.png", 
          // })
          result[i].type = "其他垃圾"
          result[i].rubbishiconpath = "/pages/picture/other_icon.png"              
      }
    }
    that.setData({
      searchresult : result,
    })
    console.log(that.data.searchresult);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})