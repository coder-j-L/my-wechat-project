// pages/release/release.js

var amapFile = require("../../libs/amap-wx.js")   //引入高德js
var config = require("../../libs/config.js")      //引入配置文件

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    isshow: true,
    imageUrl: [],
    phoneNumber: " ",
    Id: " ",
    ordertitle: " ",
    orderprice: " ",
    orderdescription: " ",
    longitude: " ",
    latitude: " ",
  },

  //发布订单
  release: function()
  {
    //上传图片
    var that = this;
    console.log(that.data.imageUrl);
    var myimg = this.data.imageUrl;
    var newDateTime=new Date().getTime();
    var str = '';
    var length = myimg.length;
    var i = 0;
   
    for(i; i<length; i++)
    {
      str = str + "https://site.maple.today/cloud/separator/user" + app.globalData.UserId + "/" + newDateTime + 'p' + i +".jpg" + '$';
      console.log(str);
      wx.uploadFile({
        filePath: myimg[i],
        name: 'file',
        url: 'https://site.maple.today/RubbishSeparator/upload/uploadfile.htm',
        formData: {
          Id: app.globalData.UserId,
          filename: newDateTime + 'p' + i + '.jpg',
        },
        success: function(res)
        {
          console.log('成功')
        }
      })
    }     
    console.log(i);
    if(i == length)
    {
      str = str.substring( 0, str.length-1 );
      console.log(str);

      wx.showModal({
        cancelColor: 'cancelColor',
        title: '是否发布',
        success: function(res)
        { 
          if(res.confirm)
          {
            that.uploadorder(str);

          }    
        }
      })
    }
    
  },

  //上传订单
  uploadorder: function(str)
  { 
    var that = this;
    console.log(that.data.Id);
    console.log(that.data.ordertitle);
    console.log(that.data.orderdescription);
    console.log(that.data.latitude);
    console.log(that.data.longitude);
    console.log(that.data.orderprice);
    console.log(that.data.phoneNumber);
    console.log(str);
    wx.request({
      url: 'https://site.maple.today/RubbishSeparator/MainMobile?requestCode=005',
      header: {
        "content-type": "application/json"
      },
      data:{
        user_id : that.data.Id,
        title : that.data.ordertitle,
        description : that.data.orderdescription,
        images : str,
        latitude : that.data.latitude,
        longitude : that.data.longitude,
        price : that.data.orderprice,
        phoneNumber : that.data.phoneNumber,
      },
      success: function(res)
      {
        console.log(res.data);
        wx.navigateBack({
          delta: 1,
        })
      },
      fail: function(res)
      {
        console.log("失败");
      }
    })
  
  },


  //获取订单名称
  gettitle: function(e)
  {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      ordertitle: e.detail.value,
    })
  },

  //获取订单价格
  getprice: function(e)
  {
    var that = this;
    console.log(e.detail.value);
    that.setData({
      orderprice: e.detail.value,
    })
  },

  //获取订单描述
  getdescription: function(e)
  {
    var that = this;
    console.log(e.detail);
    that.setData({
      orderdescription: e.detail.value,
    })
  },

  //选择照片
  chooseimage: function()
  {
    var that = this;

    wx.chooseImage({
      count: 10 - that.data.imageUrl.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        
        if(tempFilePaths.length > 0)
        {
          that.setData({
            show: false,
          })
        }

        var images = that.data.imageUrl;

        if(tempFilePaths.length + images.length > 9)
        {
          wx.showToast({
            title: "最多只能上传9张",
            icon: 'none'
          })
          return;
        }

        if(tempFilePaths.length + images.length == 9)
        {
          that.setData({
            isshow: false,
          })
          
          //把每次选择的图push进数组
          let img_url = that.data.imageUrl;
          for(let i = 0; i < tempFilePaths.length; i++) 
          {
            img_url.push(tempFilePaths[i])
          }
          that.setData({
            imageUrl: img_url
          })
        }

        if(tempFilePaths.length + images.length < 9 && tempFilePaths.length + images.length > 0)
        {
          that.setData({
            isshow: true,
          })
          
          //把每次选择的图push进数组
          let img_url = that.data.imageUrl;
          for(let i = 0; i < tempFilePaths.length; i++) 
          {
            img_url.push(tempFilePaths[i])
          }
          that.setData({
            imageUrl: img_url
          })  
        }

      }
    })

  },

  //预览图片
  previewImg: function(e)
  {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imageUrl;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //删除图片
  deletepicture: function(e)
  {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var images = that.data.imageUrl;
    console.log(images);
    console.log(index);
    wx.showModal({
      title: '提示',
      content: '确认要删除该图片吗?',
      success: function(res) {
        if(res.confirm) 
        {
          console.log("点击确定了");
          images.splice(index,1);
          console.log(images);
        } 
        else if (res.cancel) {
          console.log("点击取消了");
          return false;
        }
        that.setData({
          imageUrl: images,
        })
      }
    })
  },

  //生命周期函数--监听页面显示

  onShow: function () {
    console.log(app.globalData.UserPhoneNumber);
    this.setData({
      phoneNumber: app.globalData.UserPhoneNumber,
      Id: app.globalData.UserId,
    })
    console.log(this.data.Id);
  },

  onLoad: function(options)
  {
    var that = this;
    var key = config.config.key;
    var myAmapFun = new amapFile.AMapWX({key: key });
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
  },

})