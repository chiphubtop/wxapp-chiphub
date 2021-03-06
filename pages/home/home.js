var util = require('../../utils/util.js')
var Api = require('../../utils/api.js')
Page({
  data:{
    // text:"这是一个页面"
    datas: [],
    hidden: true,
    logs:[],
    title: "话题列表",
    type: "recent",
    offset: 0,
    listMargin: 36, //todo
    recent: '#000000',
    popular: '#cbcccd',
    no_reply: '#cbcccd',
    excellent: '#cbcccd',
    flag_position: '0%',
    duration: 2000,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    scrollHeight: 300,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    wx.showLoading({
      title: '加载中',
    })
    this.fetchData({type: 'recent'});
    this.fetchAds();
  },

  fetchData: function (data) {
    var self = this;
    if (!data) data = {};
    if (!data.offset) {
      data.offset = 0;
      self.setData({
        offset: 0
      })
    }
    if (data.offset === 0) {
      self.setData({
        datas: []
      });
    }
    wx.request({
      url: Api.getTopics(data),
      success: function (res) {
        
        var topices = res.data.topics.map(function (item) {
          item.replies_count = parseInt(item.replies_count)
          item.created_at = util.getDateDiff(new Date(item.created_at));
          if (item.user.avatar_url.indexOf('https://chiphub') !== -1) {
          } else if (item.user.avatar_url.indexOf('chiphub') !== -1) {
            item.user.avatar_url = 'https:' + item.user.avatar_url;
          } else {
            item.user.avatar_url = 'https://chiphub.top/' + item.user.avatar_url;
          }
          return item;
        });
        topices = topices.filter(item => {
          return item.suggested_at === null
        })
        
        self.setData({
          datas: self.data.datas.concat(topices)
        }, () => {
          wx.hideLoading();
        });
      }
    });
  },

  fetchAds: function () {
    var self = this;
    wx.request({
      url: Api.getTopicAds(),
      success: function(res) {
        self.setData({
          banner: res.data.ads,
        });
      }
    });
  },
  bindViewTap: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },

  onTapTag: function (e) {
    var self = this;
    wx.showLoading({
      title: '加载中',
    })
    var tab = e.currentTarget.id;
    if (tab !== 'recent') {
      self.setData({
        listMargin: 36
      })
    }else {
      self.setData({
        listMargin: 36 //todo 
      })
    }
    self.setData({
      type: tab
    });
    self.setData({
        offest: 0,
        recent: '#cbcccd',
        popular: '#cbcccd',
        no_reply: '#cbcccd',
        excellent: '#cbcccd'
      });
    if (tab === 'recent') {
        self.setData({
            recent: '#000000',
            flag_position: '0%'
        });
    }
    if (tab === 'popular') {
        self.setData({
            popular: '#000000',
            flag_position: '25%'
        });
    }
    if (tab === 'no_reply') {
        self.setData({
            no_reply: '#000000',
            flag_position: '50%'
        });
    }
    if (tab === 'excellent') {
        self.setData({
            excellent: '#000000',
            flag_position: '75%'
        });
    }
    if (tab !== 'all') {
      this.fetchData({type: tab});
    } else {
      this.fetchData();
    }
  },


  pullDownRefresh: function () {
    var self = this;
    this.fetchData({type: self.data.type});
  },

  didSelectCell: function (e) {
    var id = e.currentTarget.id,
        url = '../detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },

  lower: function (e) {
    var self = this;
    self.setData({
      offset: self.data.offset + 20
    });
    wx.showLoading({
      title: '加载中',
    });
    this.fetchData({type: self.data.type, offset: self.data.offset});
  },
  scrolls: function(e) {
  }
})