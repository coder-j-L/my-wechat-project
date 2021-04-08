// pages/myorders/myorders.js

const app = getApp()
var time = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myorders: [],
    images: [],
    show: false,
  },

  //跳转详情页
  todetails: function(e)
  {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var order = that.data.myorders[index];
    console.log(order);
    var selectorder = JSON.stringify(order);
    wx.navigateTo({
      url:  '/pages/details/details?selectorder=' + selectorder,
    })      
  },

  //将订单设为已完成
  completeorder: function(e)
  {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var order_id = that.data.myorders[index].Id;
    console.log(order_id);

    //修改状态
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=012',
      header: {
        "content-type": "application/json"
      },
      data:{
        Id: app.globalData.UserId,
        order_id: order_id,
      },
      success: function(res)
      {
        console.log(res);
      },
      fail: function()
      {
        console.log('失败');
      }
    })

    //获取订单信息
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=011',
      header: {
        "content-type": "application/json"
      },
      data:{
        Id: app.globalData.UserId,
      },
      success: function(res)
      {
        console.log(res);

        //转时间戳
        var i = 0;
        for(i; i<res.data.length; i++)
        {
          var t = time.transTime(res.data[i].time);
          res.data[i].time = t;
        }

        //转图片
        var j = 0;
        for(j; j<res.data.length; j++)
        {
          var str = res.data[j].images;
          var cut = "$";
          that.setData({
            images: str.split(cut),
          })
          res.data[j].images = that.data.images;
        }
        that.setData({
          myorders: res.data,
        })
        that.onLoad();
      },
      fail: function(res)
      {
        console.log('失败');
      },
    })
    
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.UserId);
    //获取订单信息
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=011',
      header: {
        "content-type": "application/json"
      },
      data:{
        Id: app.globalData.UserId,
      },
      success: function(res)
      {
        console.log(res);

        //转时间戳
        var i = 0;
        for(i; i<res.data.length; i++)
        {
          var t = time.transTime(res.data[i].time);
          res.data[i].time = t;
        }

        //转图片
        var j = 0;
        for(j; j<res.data.length; j++)
        {
          var str = res.data[j].images;
          var cut = "$";
          that.setData({
            images: str.split(cut),
          })
          res.data[j].images = that.data.images;
        }
        that.setData({
          myorders: res.data,
        })

        if(that.data.myorders.length == 0)
        {
          console.log('无订单');
          that.setData({
            show: true,
          })
        }

      },
      fail: function(res)
      {
        console.log('失败');
      },
    })
  },

})