// pages/changename/changename.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: "",
  },

  onShow: function(options)
  {
    this.setData({
      username: app.globalData.UserName,     
    })
  },

  //改昵称
  changename: function(e)
  {
    console.log(e.detail.value);
    var that = this;
    var name = e.detail.value;
    if(! name.trim())
    {
      wx.showModal({
        title: "提示",
        content: "没有输入昵称，请重新填写",
        showCancel: false,
      })
    }else{
      wx.request({
        url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=003',
        header:{
          'Content-Type': 'application/josn'
        },
        data:{
          Id: app.globalData.UserId,
          phoneNumber: app.globalData.UserPhoneNumber,
          name: name,
        },
        success: function(res)
        {
          console.log(res.data);
          if(res.data.result == 1)
          {
            app.globalData.UserName = res.data.username;
            wx.showLoading({
              title: '加载中',
              success: function()
              {
                wx.navigateBack({
                  delta: 1,
                })
              }
            })            
          }
          if(res.data.result == 3)
          {
            wx.showModal({
              title: "提示",
              content: "昵称中含有非法字符",
              showCancel: false,
            })
          }
          if(res.data.result == 0)
          {
            wx.showModal({
              title: "提示",
              content: "未知错误，请重试",
              showCancel: false,              
            })
          }
        }
      })
    }
  },

})