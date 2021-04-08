// pages/pictureResult/pictureResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl:" ",
    resultlist:[],
    searchList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var list = JSON.parse(options.list);
    //console.log(list);
    that.calculate(list);
    that.setData({
      imageurl: options.image,
      resultlist: list
    })
  //  console.log(that.data.imageurl);
    console.log(that.data.resultlist)
 
  },

  //算概率函数
  calculate: function(e)
  {
    var that = this;
    var i = 0; 
    if(e.length>0)
    {
      for(i;i<e.length;i++)
      {
        e[i].score = e[i].score*100;   
        e[i].score = e[i].score.toFixed(2);
      }

    }
  },

  //查询垃圾分类
  toresult: function(e)
  {
    console.log(e.currentTarget.dataset.item);
    var picturename = e.currentTarget.dataset.item;
    var that = this;
      wx.request({
        url: 'https://api.tianapi.com/txapi/lajifenlei/index',
        header:{
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data:{
          key:"b5058ccd403dbf6c24d29f1e69fab30d",
          word: picturename
        },
        success:res=>{
          console.log(res.data.newslist)
          if(res.data.newslist == undefined)
          {
            console.log("失败");
            wx.navigateTo({
              url: '/pages/searcherror/searcherror',
            })
          }
          else{
          that.setData({
            searchList: res.data.newslist
          })
            // console.log(this.data.searchList[0])
            var result = JSON.stringify(this.data.searchList)
          wx.navigateTo({
            url:  '/pages/result/result?result=' + result,
          })            
          }
        },
        fail:res=>{
          console.log("shibai")
        }
      })
  },

  //生命周期函数--监听页面初次渲染完成

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})