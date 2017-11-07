//audio.js
//音频详情页面
import { IP_ADDRESS, signDatas } from '../../utils/util.js'

var api_audio_detail = '/express/getAudioDetail'
var currentPage = '1';
var timer;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cover: '',
    audio_id:'0',
    audio_play_btn_img:'/images/audio/audio_play.png',
    is_playing: 0,
    audio: {},
    user_height: '70px',
    full_text_img:'/images/audio/full_text.png',
    is_fulltext: 0,
    starttime:'00:00',
    audio_offset: '0',
    duration: '00:00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cover);
    this.setData({
      cover: options.cover,
      audio_id: options.audio_id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var self = this;
    self.getAudioDetail();
    wx.setNavigationBarTitle({
      title: '专家音频',
    });
    // this.audioCtx = wx.createAudioContext('expert_audio')
    
    /** 
     * 监听音乐播放 
     */
    wx.onBackgroundAudioPlay(function () {
      console.log('onBackgroundAudioPlay')
      timer = setInterval(() => {
        wx.getBackgroundAudioPlayerState({
          success: function (res) {
            //调用需要更新的
            console.log(res);
            self.audioTimeUpdate(res);
          }
        });
      }, 1000);
      self.setData({
        audio_play_btn_img: '/images/audio/audio_stop.png',
        is_playing: 1,
      });
    });

    /** 
     * 监听音乐暂停 
     */
    wx.onBackgroundAudioPause(function () {
      console.log('onBackgroundAudioPause')
      self.setData({
        audio_play_btn_img:'/images/audio/audio_play.png',
        is_playing: 0,
      });
    });

    /** 
     * 监听音乐停止 
     */
    wx.onBackgroundAudioStop(function () {
      console.log('onBackgroundAudioStop')
      self.setData({
        audio_play_btn_img: '/images/audio/audio_play.png',
        is_playing: 0,
      });
    });

    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent
        console.log('res audio');
        console.log(res);
        console.log(currentPosition);
        console.log(duration);
        console.log(downloadPercent);
      }
    });
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
    
  },

  /*
  *  监听slider滑动改变
  */
  audioSliderChanged: function (e) {
    console.log(e);
  },

  /**
   * 点击音频播放按钮
   */
  audioBtnClick: function (e) {
    console.log(this.data.is_playing);
    // this.data.is_playing === 0 ? this.audioCtx.play() : this.audioCtx.pause();
    this.data.is_playing == 0 
    ? wx.playBackgroundAudio({
      dataUrl: this.data.audio.audio.mp3_url,
      title: this.data.audio.audio.title,
      coverImgUrl: this.data.audio.audio.user.cover_url,
    }) 
    : wx.pauseBackgroundAudio(); 
  },

  /**
   * 显示全文按钮
   */
  fullText: function(e) {
    this.setData({
      full_text_img: (this.data.is_fulltext === 0) ? '/images/audio/hide_text.png' : '/images/audio/full_text.png',
      is_fulltext: (this.data.is_fulltext === 0) ? 1 : 0,
      user_height: (this.data.is_fulltext === 0) ? '100%' : '70px',
    });
  },

  getAudioDetail: function () {
    let datas = new Object;
    datas.audio_id = this.data.audio_id+'';
    datas.page = currentPage + '';
    let self = this
    wx.request({
      url: IP_ADDRESS + api_audio_detail,
      data: signDatas(datas),
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        console.log(res)
        self.configureAudio(res, false)
      },
    })
  },

  configureAudio: function (res, save) {
    let data = res.data.data;
    if (data) {
      this.setData({
        audio: data,
        cover: data.audio.user.cover_url,
      });
      };
      wx.setNavigationBarTitle({
        title: this.data.audio.audio.title ? this.data.audio.audio.title : '专家音频',
      })
      // console.log('audio');
      // console.log(this.data.audio.audio.mp3_url);
      // this.audioCtx.setSrc(this.data.audio.audio.mp3_url)
    
      let duration = this.formatTime(this.data.audio.audio.duration);
      this.setData({
        duration: duration,
      });
    }, 

  //时间秒数格式化
  formatTime: function(second) {
    return [parseInt(second / 60 % 60), second % 60].join(":")
      .replace(/\b(\d)\b/g, "0$1");
  },

  /**
   * @desc 播放进度触发
   * 
   */
  audioTimeUpdate: function (e) {
    console.log(e.status)
    if (parseInt(e.status) === 1) {
      var offset = e.currentPosition;
      var currentTime = parseInt(e.currentPosition);
      // var min = parseInt(currentTime / 60);
      var max = parseInt(e.duration);
      // var sec = currentTime % 60;
      // var starttime = min + ':' + sec;
      var duration = e.duration;
      var offset = parseFloat(currentTime / duration) * 100;

      // console.log(offset);
      // console.log(currentTime);

      var that = this;
      var duration = that.formatTime(max);
      var start = that.formatTime(currentTime);

      that.setData({
        audio_offset: offset,
        starttime: start,
        duration: duration
      });
    }
  },

  previewImage: function(e) {
    wx.previewImage({
      urls: this.data.audio.audio.user.qrcode_url.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    }) 
  }
})