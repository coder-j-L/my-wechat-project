// pages/person/person.js

const app = getApp()
 
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    login: false,
    islogin: true,
    username: " ",
    headsrc: " ",
    phoneNumber: " ",
  },

  onShow: function()
  {
    console.log(app.globalData.UserName);
    console.log(this.data.headsrc);
    if(app.globalData.UserName.length > 0)
    {
      this.setData({
        login: true,
        islogin: false,  
      })
    }
    
    this.setData({
      username: app.globalData.UserName,
      headsrc: app.globalData.UserHead,
      phoneNumber: app.globalData.UserPhoneNumber,
    })
  },

//去往登陆页面
  tologin: function()
  {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //上传头像
  changeicon: function()
  {
    var that = this;
    var newDateTime=new Date().getTime();
    //console.log(newDateTime);
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths[0]);
        wx.uploadFile({
          filePath: tempFilePaths[0],
          name: 'file',
          url: 'https://site.maple.today/RubbishSeparator/upload/uploadfile.htm',
          formData: {
            Id: app.globalData.UserId,
            filename: newDateTime + '.jpg',
          },
          success: function(res)
          {
            that.changeHeadstate(newDateTime);
          }
        })
      }
    })
  },

  //修改头像
  changeHeadstate: function(time)
  {
    var that = this;
    console.log(app.globalData.UserId);
    console.log(app.globalData.UserPhoneNumber);
    console.log(that.data.headsrc);
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=006',
      header: {
        "content-type": "application/json"
      }, 
      data:{
        Id: app.globalData.UserId,
        phoneNumber: app.globalData.UserPhoneNumber,
        headstate: "https://site.maple.today/cloud/separator/user" + app.globalData.UserId + "/" + time + ".jpg",
      },
      success: function(res)
      {
        console.log(res);
        app.globalData.UserHead = res.data.headstate;
        console.log(app.globalData.UserHead);
        that.setData({
          headsrc: app.globalData.UserHead,
        })
      },
    })
  },

  //修改用户名
  changename: function()
  {
    wx.navigateTo({
      url: '/pages/changename/changename',
    })
  },


  //退出登录
  logout: function()
  {
    app.globalData.UserId = " ";
    app.globalData.UserName = "";
    app.globalData.UserPhoneNumber = "0";
    app.globalData.UserScore = "0";
    app.globalData.UserHead = "/pages/picture/head.png";
    this.setData({
      username: app.globalData.UserName,
      headsrc: app.globalData.UserHead,
      phoneNumber: app.globalData.UserPhoneNumber,
      login: false,
      islogin: true,
    })
  },

  //去我的订单页
  tomyorders: function()
  {
    if(this.data.phoneNumber == '0')
    {
      wx.showToast({
        title: '未登录,该功能不能使用',
        icon: 'none',
      })
    }else{
      wx.navigateTo({
        url: '/pages/myorders/myorders',
      })      
    }
  },

  //查看二维码
  toqrcode: function()
  {
    wx.navigateTo({
      url: '/pages/qrcode/qrcode',
    })
  }

}) 