// pages/recording/recording.js

//引入插件
const plugin = requirePlugin("WechatSI");
//获取全局唯一的语音识别管理器
const manager = plugin.getRecordRecognitionManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordState: false,
    recordText: "",
    isTouch: false,
    show: false,
    searchList: [],
  },
  
  //识别
  initRecord: function() {
    var that = this;
    manager.onStart = function(res)
    {
      console.log("开始");
    }

    manager.onStop = function(res)
    {
      //console.log(res);
      console.log(res.result.length);
      if(res.result.length == 0)
      {
        wx.showToast({
          title: '我没有听清您说了什么',
          icon: "none"
        })
        return;
      }
      res.result = res.result.substr(0, res.result.length-1);
      var result = res.result;
      that.setData({
        recordText: result,
        show: true,
      }) 
    }
  },

  //按住说话
  touchStart: function()
  {
    var that = this;
    that.setData({
      recordState: true,
    })
    manager.start({
      lang: 'zh_CN',
    })
    that.setData({
        isTouch: true,
    })
  },

  //松开结束
  touchEnd: function()
  {
    this.setData({
      recordState: false,
    })
    manager.stop();
    this.setData({
      isTouch: false
    })
  },
  
  //
  onLoad: function(options)
  {
    this.initRecord();
  },

  //清空
  cancel : function()
  {
    this.setData({
      recordText: "",
      show: false,
    })
  },

  //查找
  search: function()
  {
    if(this.data.recordText.length > 0)
    {
      wx.request({
        url: 'https://api.tianapi.com/txapi/lajifenlei/index',
        header:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data:{
          key:"b5058ccd403dbf6c24d29f1e69fab30d",
          word: this.data.recordText
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
  }
})