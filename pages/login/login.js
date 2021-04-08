// pages/login/login.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    isshow: true,
    phonenumber:" ",
    sms_id:" ",
    phonelength:"0",
    code:" ",
    user_name: " ",
    Id: " ",
    score: " ",
    userphonenumber: " ",
  },

  //获取手机号
  getphonenum:function (e)
  {
    var that = this;
    var num_length = e.detail.value.length;
    //console.log(e.detail.value.length)
    if(num_length == 11)
    {
      that.setData({
        show: false,
        phonenumber: e.detail.value,
        phonelength: num_length
      })
      console.log(that.data.phonenumber)
    }
    if(num_length < 11)
    {
      that.setData({
        show: true,
      })
    }
  },

  //获取验证码
  getverification: function()
  {
    var that = this;
      wx.request({
        url: 'https://site.maple.today/RubbishSeparator/SMS?requestCode=001',
        header:{
          'Content-Type': 'application/json'
        },
        data:{
          phoneNumber: that.data.phonenumber,
        },
        success: function(res)
        {
          console.log(res.data)
          if(res.data.result == 1)
          {
            that.setData({
              sms_id: res.data.sms_id,
            })            
          }
          if(res.data.result == 0)
          {
            wx.showToast({
              title: '验证码发送失败',
              icon: 'none',
              duration: 2000
            })
          }
          if(res.data.result == 2)
          {
            wx.showToast({
              title: '请求次数过多，请1分钟后再尝试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
  },

  //验证码输入
  verificate: function(e)
  {
    var that = this;
    var codelength = e.detail.value.length; 
    //console.log(e.detail.value)
    if(codelength==4 && that.data.phonelength==11)
    {
      that.setData({
        isshow: false,
        code: e.detail.value,
      })
    }
  },

  //验证码注册
  userlogin: function()
  {
    var that = this;
      wx.request({
        url: 'https://site.maple.today/RubbishSeparator/SMS?requestCode=002',
        header:{
          'Content-Type': 'application/json'
        },
        data:{
          phoneNumber: that.data.phonenumber,
          code: that.data.code,
          sms_id: that.data.sms_id,
        },
        success: function(res)
        {
          console.log(res);
          var id = res.data.user_id;
          console.log(id);
          if(res.data.result == 1)
          {
            that.peoplelogin(id,that.data.phonenumber);
          }
          if(res.data.result == 2)
          {
            wx.showToast({
              title: '短信超时或验证码错误，请再次尝试',
              icon: "none",
              duration: 2000
            })
          }
        }   
      })
  },

  //phoneNumber与id登录
  peoplelogin: function(a,b)
  {
    var that = this;
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=002',
      header:{
        'Content-Type':  'application/json'
      },
      data:{
        Id: a,
        phoneNumber: b,
      },
      success: function(res)
      {
        if(res.data.result == 1)
        {
          console.log(res.data);
          that.setData({
            user_name: res.data.username,
            Id: res.data.Id,
            userphonenumber: res.data.phoneNumber,
            score: res.data.score,
          })
          app.globalData.UserName = res.data.username;
          app.globalData.UserPhoneNumber = res.data.phoneNumber;
          app.globalData.UserId = res.data.Id;
          app.globalData.UserScore = res.data.score;
          app.globalData.UserHead = res.data.headstate;
          //console.log(app.globalData.UserName);
          wx.navigateBack({
            delta: 1,
          })
        }
        if(res.data.result == 0)
        {
          wx.showToast({
          title: '登陆失败，请再次尝试',
          icon: 'none',
          duration: 2000
          })
        }
      },
    })
  },

})