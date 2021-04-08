// pages/shop/shop.js

var amapFile = require("../../libs/amap-wx.js")   //引入高德js
var config = require("../../libs/config.js")      //引入配置文件
var time = require("../../utils/util.js");
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: " ",
    longitude: " ",
    select: false,
    acuracy: "4",
    orders: [],
    images: [],
    user_id:' ',
  },

  //展示下拉框
  showselect: function()
  {
    var that = this;
    that.setData({
      select: true,
    })
  },

  //下拉框选项
  select1: function()
  {
    var that = this;
    that.setData({
      acuracy: "6",
      select: false, 
    })
    that.onLoad();
    console.log(that.data.acuracy);
  },

  select2: function()
  {
    var that = this;
    that.setData({
      acuracy: "5",
      select: false, 
    })
    that.onLoad();
    console.log(that.data.acuracy);
  },
  
  select3: function()
  {
    var that = this;
    that.setData({
      acuracy: "4",
      select: false, 
    })
    that.onLoad();
    console.log(that.data.acuracy);
  },

  //跳转详情页
  todetails: function(e)
  {
    var that = this;
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var order = that.data.orders[index];
    console.log(order);
    var selectorder = JSON.stringify(order);
    wx.navigateTo({
      url:  '/pages/details/details?selectorder=' + selectorder,
    })      
  },

  //跳转到发布订单页
  torelease: function()
  {
    if(this.data.user_id == ' ')
    {
      wx.showToast({
        title: '未登录,该功能不能使用',
        icon: 'none',
      })
    }else{
      wx.navigateTo({
        url: '/pages/release/release',
      })      
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var key = config.config.key;
    var myAmapFun = new amapFile.AMapWX({key: key });
    
    //获取当前位置
    myAmapFun.getRegeo({
      success: function(data)
      {
        console.log(data);
        that.setData({
          longitude: data[0].longitude,
          latitude: data[0].latitude
        })

        //获取当前位置周围订单信息
        wx.request({
          url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=007',
          header:{
            "content-type" : "application/json;charset=utf-8",
          },
          data:{
            latitude: that.data.latitude,
            longtitude: that.data.longitude,
            acuracy: that.data.acuracy,
          },
          success: function(res)
          {
            console.log(res);
            console.log(res.data.length);
            var i = 0;
            for(i; i<res.data.length; i++)
            {
              var s = that.getDistance(that.data.latitude,that.data.longitude,res.data[i].latitude,res.data[i].longitude);
              res.data[i].distance = s;
              var t = time.transTime(res.data[i].time);
              res.data[i].time = t;
            }
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
              orders: res.data,
            })
            console.log(that.data.orders);
          }
        })
      }
    })

  },

  //计算距离
// 计算距离函数
  Rad(d) {
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance(lat1, lng1, lat2, lng2) {
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1) + 'km' //保留两位小数
    return s
  },


  //生命周期函数--监听页面显示
  onShow: function () {
    this.onLoad();
    this.setData({
      user_id: app.globalData.UserId,
    })
  },



  //获取订单信息
  getorder: function()
  {
    var that = this;
    var key = config.config.key;
    var myAmapFun = new amapFile.AMapWX({key: key });
    

    //获取当前位置
    myAmapFun.getRegeo({
      success: function(data)
      {
        console.log(data);
        that.setData({
          longitude: data[0].longitude,
          latitude: data[0].latitude
        })

        wx.showNavigationBarLoading();

        //获取当前位置周围订单信息
        wx.request({
          url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=007',
          header:{
            "content-type" : "application/json;charset=utf-8",
          },
          data:{
            latitude: that.data.latitude,
            longtitude: that.data.longitude,
            acuracy: that.data.acuracy,
          },
          success: function(res)
          {
            console.log(res);
            console.log(res.data.length);
            var i = 0;
            for(i; i<res.data.length; i++)
            {
              var s = that.getDistance(that.data.latitude,that.data.longitude,res.data[i].latitude,res.data[i].longitude);
              res.data[i].distance = s;
              var t = time.transTime(res.data[i].time);
              res.data[i].time = t;
            }
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
              orders: res.data,
            })
            console.log(that.data.orders);
          },
          complete: function()
          {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh()
          }
        })
      }
    })
  },


  //页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    this.getorder();
  },


})