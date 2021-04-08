// pages/map/map.js

var amapFile = require("../../libs/amap-wx.js")   //引入高德js
var config = require("../../libs/config.js")      //引入配置文件

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: " ",
    latitude: " ",
    markers: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("成功")
    var that = this;
    var key = config.config.key;
    var myAmapFun = new amapFile.AMapWX({key: key });
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userLocation"] === false) {// 有权限询问记录 但没有允许开启授权
          wx.showModal({
            title: '提示！',
            confirmText: '去设置',
            showCancel: true,
            content: "该功能需要授权位置信息",
            success: function (res) {
              if (res.confirm) {//用户同意打开授权设置页面
                //******打开权限设置页面
                wx.openSetting({
                  success(res) {
                    //进行地理位置授权完成后的逻辑操作(如果在权限设置页面没有打开权限 后续需要授权的操作会失败)
                    myAmapFun.getRegeo({
                      success: function(data)
                      {
                        console.log(data);
                        that.setData({
                          longitude: data[0].longitude,
                          latitude: data[0].latitude
                        })
                      }
                    })
                  }
                })
              } else if (res.cancel) {//用户拒绝打开授权设置页面
                wx.showToast({
                  title: '授权失败,该功能不能使用',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
        else if (res.authSetting["scope.userLocation"] === true) {// 有权限询问记录 且当前已开启授权
          //进行地理位置授权完成后的逻辑操作
          myAmapFun.getRegeo({
            success: function(data)
            {
              console.log(data);
              that.setData({
                longitude: data[0].longitude,
                latitude: data[0].latitude
              })
              that.getRubbishcan(data[0].longitude,data[0].latitude);
            }
          })
        }
      }
    })
},

  //获取当前位置垃圾桶信息
  getRubbishcan: function(a,b)
  {
    var that = this;
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=001&longitude=118.83951&latitude=31.953195',
      header:{
        'Content-Type': 'application/json'
      },
      data:{
        longitude: a,
        latitude: b
      },
      success: function(res)
      {
        console.log(res);
        //将周围垃圾桶信息放入markers数组
        var i = 0;
        var markers = [];
        for(i=0; i<res.data.length; i++)
        {
          let marker = that.CreateMarker(res.data[i]);
          markers.push(marker);
        }
        that.setData({
          markers: markers,
        })
        console.log(that.data.markers);
        that.getcaninformation();
      }
    }) 
  },

  //创建markers对象
  CreateMarker: function(point)
  {
    let marker = {
      iconPath: "/pages/picture/biaoji.png",
      id: point.Id,
      title: point.name,
      latitude: point.latitude,
      longitude: point.longitude,
      width: 30,
      height: 30,
    }
    return marker;
  },

  //获取垃圾桶信息
  getcaninformation: function()
  {
    var that = this;
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=004',
      header:{
        'Content-Type': 'application/json'
      },
      data:{
        can_id: that.data.markers[0].id
      },
      success:function(res)
      {
        console.log(res);
      },
    })
  }
})