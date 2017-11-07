/**
 * 专家页
 */
import { fullUrl, signDatas } from '../../utils/util.js'

var api_expert_type = '/express/getTypes'
var api_expert_country = '/express/getCountries'
var api_expert_hot = '/express/getHot'
var api_expert_audiolist = '/express/getAudioLists'
var currentPage = 1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: ["地区", "分类", "热门"],
    types:[],
    countries:[],
    hots:[],
    selectedType:'0',
    selectedCountry:'所有',
    selectedHot:'0',
    audioArr: [],
    isRefreshing: false,
    audios: {},
    loadingHidden: false,
    nomoreData: false,
    srollHeight: 300,
    headerHeight:145,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.getStorage({
      key: api_expert_type,
      success: function (res) {
        self.configureType(res.data);
      },
    });
    var self = this;
    wx.getStorage({
      key: api_expert_country,
      success: function (res) {
        self.configureCountries(res.data);
      },
    });
    var self = this;
    wx.getStorage({
      key: api_expert_hot,
      success: function (res) {
        self.configureHots(res.data);
      },
    });
    var self = this;
    wx.getStorage({
      key: api_expert_audiolist,
      success: function (res) {
        if (parseInt(res.data.data.data.length) > 0) {
          self.configureAudios(res.data, false);
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getExpertType();
    this.getExpertCountry();
    this.getExpertHot();
    currentPage = 1;
    this.getExpertAudiolist();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight - that.data.headerHeight;   //headerpannelheight为顶部组件的高度
        console.log(height);
        that.setData({
          srollHeight: height + '',
        });
      },
    });
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
    
  },

  /**
   * 获取分类
   */
  getExpertType: function () {
    let datas = new Object;
    let self = this
    wx.request({
      url: fullUrl(api_expert_type),
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        // console.log(res)
        self.configureType(res);
        self.cacheData(res, api_expert_type);
      },
    })
  },

  /**
   * 获取国家
   */
  getExpertCountry: function () {
    let datas = new Object;
    let self = this
    wx.request({
      url: fullUrl(api_expert_country),
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        // console.log(res);
        self.configureCountries(res);
        self.cacheData(res, api_expert_country);
      },
    })
  },

  /**
   * 获取热门
   */
  getExpertHot: function () {
    let datas = new Object;
    let self = this
    wx.request({
      url: fullUrl(api_expert_hot),
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        // console.log(res)
        self.configureHots(res);
        self.cacheData(res, api_expert_hot);
      },
    })
  },

  /**
   * 获取音频列表
   */
  getExpertAudiolist: function () {
    let datas = new Object;
    datas.country = this.data.selectedCountry + '';
    datas.pro_type = this.data.selectedType + '';
    datas.hot = this.data.selectedHot + '';
    datas.page = currentPage + '';
    let self = this
    wx.request({
      url: fullUrl(api_expert_audiolist),
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        // console.log(res)
        self.configureAudios(res, false);
        self.cacheData(res, api_expert_audiolist);
      },
    })
  },

  cacheData: function (res, store_key) {
    wx.setStorage({
      key: store_key,
      data: res,
    });
    // console.log('cache success');
  },

  configureType: function(res) {
    this.setData({
      types: res.data.data.types,
    });
  },

  configureCountries: function (res) {
    this.setData({
      countries: res.data.data.countries,
    });
  },

  configureHots: function (res) {
    this.setData({
      hots: res.data.data.types,
    });
  },

  configureAudios: function (res, save) {
    let data = res.data.data;
    if (data) {
      this.setData({
        audios: res,
      });
      currentPage = Number(res.data.data.current_page) + 1;
      let datas = [];
      console.log('ppp ' + parseInt(res.data.data.current_page) + ' ' + this.data.audioArr.length);
      if (parseInt(res.data.data.current_page) !== 1 && this.data.audioArr.length > 0) {
        datas = datas.concat(this.data.audioArr);
      }
      datas = datas.concat(res.data.data.data);
      this.setData({
        isRefreshing: false
      });
      this.setData({
        audioArr: datas,
        loadingHidden: true,
        nomoreData: (datas.length>0) ? false : true,
      })
      // console.log('ppp ' + parseInt(res.data.data.current_page) + ' ' + this.data.audioArr.length);
    }
  },

  selectedType: function(options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    console.log(options)
    //设置当前样式
    that.setData({
      'selectedType': id
    });
    currentPage = 1;
    that.getExpertAudiolist();
  },

  selectedCountry: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    console.log(options)
    //设置当前样式
    that.setData({
      'selectedCountry': id
    });
    currentPage = 1;
    that.getExpertAudiolist();
  },

  selectedHot: function (options) {
    var that = this
    var id = options.currentTarget.dataset.id;
    console.log(options)
    //设置当前样式
    that.setData({
      'selectedHot': id
    });
    currentPage = 1;
    that.getExpertAudiolist();
  },

  scrollToLower:  function(e) {
    console.log('scroll to lower');
    this.getExpertAudiolist();
  },
})