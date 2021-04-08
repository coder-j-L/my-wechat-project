// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    searchList:[],
    baidutoken:" ",
    imagedata: " ",
    resultList: [],
    imageurl: " ",
    appear: true,
    input: " ",
    userId: ' ',
  },

  //onload
  onLoad: function(options)
  {
      wx.authorize({
      scope: 'scope.userLocation',
      fail: function()
      {
        wx.showToast({
          title: '授权失败,部分功能将不能使用',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function()
      {
        wx.authorize({
          scope: 'scope.camera',
          fail: function()
          {
            wx.showToast({
              title: '授权失败,部分功能将不能使用',
              icon: 'none',
              duration: 2000
            })
          },
          complete: function()
          {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              fail: function()
              {
                wx.showToast({
                  title: '授权失败,部分功能将不能使用',
                  icon: 'none',
                  duration: 2000
                })                
              },
              complete: function()
              {
                wx.authorize({
                  scope: 'scope.record',
                  fail: function()
                  {
                    wx.showToast({
                      title: '授权失败,部分功能将不能使用',
                      icon: 'none',
                      duration: 2000
                    })
                  },
                })
              }
            })
          }          
        })
      }
    })
    this.gettoken();
  },

  //onshow
  onShow: function()
  {
    this.setData({
      userId: app.globalData.UserId,
    })
    console.log(this.data.userId);
  },

  //叉号
  cancelsearch: function(e)
  {
    console.log(e.detail.value);
    var value = e.detail.value;
    if(value.length > 0)
    {
      this.setData({
        appear: false,
      })
    }
    if(value.length == 0)
    {
      this.setData({
        appear: true,
      })
    }
  },

  //撤销查询
  cancel: function()
  {
    this.setData({
      input: '',
      appear: true
    })
  },

  //查询垃圾分类
  searchrubbish: function(e)
  {
      var inputvalue = e.detail.value
      console.log(inputvalue);
      if(!inputvalue.trim())
      {
      }else{
        wx.request({
          url: 'https://api.tianapi.com/txapi/lajifenlei/index',
          header:{
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data:{
            key:"b5058ccd403dbf6c24d29f1e69fab30d",
            word: inputvalue
          },
          success:res=>{
            console.log(res.data.newslist)
            if(res.data.newslist == undefined)
            {
              wx.navigateTo({
                url: '/pages/searcherror/searcherror',
              })
            }
            else{
              this.setData({
                searchList: res.data.newslist,
              })
              // console.log(this.data.searchList[0])
              var result = JSON.stringify(this.data.searchList)
              wx.navigateTo({
                url:  '/pages/result/result?result=' + result,
              })              
            }
          },
        })
      }
  },

  //获取百度token
  gettoken: function()
  {
    var that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Pvfhdtrkr9ZZaXChRIIIoqtS&client_secret=CIOgI4mGkK2RUDyEDVMT2bgYlkNqA1W4',
      method: "POST",
      dataType :"json",
      header: {
        "content-type" : "application/json;charset=utf-8",
      },
      success:res=>{
      //  console.log(res)
        that.setData({
          baidutoken: res.data.access_token,
        })
        console.log(that.data.baidutoken)
      }  
    })
  },

  //拍照搜索
  tookpicturesearch: function()
  {
    this.camera();
  },

  //拍照
  camera: function()
  {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],

      success (res) {
        that.setData({
          imageurl: res.tempFilePaths[0]
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: "base64",
          success:res=>{
            that.setData({
                imagedata: res.data
              })
              that.recognition();
          }
        })
      }
    })
  },

  //照片搜索
  usepicturesearch: function()
  {
    this.chooseImage();
    //this.recognition();
  },

  //选择图片
  chooseImage: function()
  {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],

      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imageurl: res.tempFilePaths[0]
        })
      //  console.log(tempFilePaths)
       //图片格式转化
       wx.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        encoding: "base64",
        success:res=>{
        //  console.log(res)
          that.setData({
            imagedata: res.data
          })
          that.recognition();
          //console.log(that.data.imagedata)          
        }
      })  
      }
    })  
  },

  //图片识别
  recognition: function()
  {
    var that = this;
    if(that.data.baidutoken)
    {
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=' + that.data.baidutoken,
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data:{
          image: that.data.imagedata
        },

        success: function(res)
        {
          //  console.log(that.data.imagedata)
          //  console.log(res.data.result);
            that.setData({
              resultList: res.data.result
            })
          //  console.log(that.data.resultList)
            var list = JSON.stringify(that.data.resultList);
            wx.navigateTo({
              url: '/pages/pictureResult/pictureResult?image=' + that.data.imageurl + "&list=" + list,
            })
        },
        fail:function(res){
          console.log("失败")
        },
      })
    }
  },

  //语音界面
  userecording: function()
  {
    wx.navigateTo({
      url: '/pages/recording/recording',
    })
  },

  //查看二维码
  seeqrcode: function()
  {
    if(this.data.userId == ' ')
    {
      wx.showToast({
        title: '未登录，该功能不能使用',
        icon: 'none',
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/qrcode/qrcode',
       })      
    }
  },

  //跳转
  Torecycle (){
    wx.navigateTo({
      url: '/pages/recycle_rubbish/recycle_rubbish',
    })
  },

  Toharmful (){
    wx.navigateTo({
      url: '/pages/harmful_rubbish/harmful_rubbish',
    })
  },

  Tokitchen (){
    wx.navigateTo({
      url: '/pages/kitchen_rubbish/kitchen_rubbish',
    })
  },

  Toother (){
    wx.navigateTo({
      url: '/pages/other_rubbish/other_rubbish',
    })
  }

})
