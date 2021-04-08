// pages/qrcode/qrcode.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ' ',
    name: ' ',
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      id: app.globalData.UserId,
      name: app.globalData.UserName,
    })
  },

})