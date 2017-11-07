//index.js
//获取应用实例
const app = getApp()
import { fullUrl, signDatas } from '../../utils/util.js'

var api_audio = '/express/getAudioLists'
var currentPage = 1

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    audioArr: [],
    isRefreshing: false,
    audios: {},
    loadingHidden: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var self = this;
    wx.getStorage({
      key: api_audio,
      success: function(res) {
        self.configureAudios(res.data, false);
      },
    });
  },

  /**
     * 生命周期函数--监听页面初次渲染完成
     */
  onReady: function () {
    currentPage = 1;
    this.getAudioList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取音频列表
   */
  getAudioList: function () {
    let datas = new Object;
    datas.sort = '1';
    datas.page = currentPage + '';
    let self = this
    wx.request({
      url: fullUrl(api_audio),
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        self.configureAudios(res, false);
        self.cacheData(res);
      },
    })
  },

  cacheData: function(res) {
    wx.setStorage({
      key: api_audio,
      data: res,
    });
    // console.log('cache success');
  },

  configureAudios: function(res, save) {
    let data = res.data.data;
    if (data) {
      this.setData({
        audios: res,
      });
      currentPage = Number(res.data.data.current_page) + 1;
      let datas = [];
      // console.log('ppp ' + parseInt(res.data.data.current_page)+' '+this.data.audioArr.length);
      if (parseInt(res.data.data.current_page) !== 1 && this.data.audioArr.length > 0) {
        datas = datas.concat(this.data.audioArr);
      }
      datas = datas.concat(res.data.data.data);
      console.log(datas)
      this.setData({
        isRefreshing: false
      });
      if (datas.length > 0) {
        this.setData({
          audioArr: datas,
          loadingHidden: true
        })
      }
      // console.log('ppp ' + parseInt(res.data.data.current_page)+' '+this.data.audioArr.length);
      // if (save === true) this.saveData(api_audio, res);
    }
  },
})
