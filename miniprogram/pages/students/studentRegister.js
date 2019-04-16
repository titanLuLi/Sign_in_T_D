var version = 'version1';
var fun_base64 = require('../../utils/base64.js');
var util = require('../../utils/util.js');
var obj_base64 = new fun_base64.Base64();
Page({
  data: {
    id: '',
    name: '',
    birth: '',
    p1name: '',
    p2name: '',
    createdDate : '',
    registeredDate: ''
  },

  confirmOnClick() {
    var validation = true;
    if (this.data.id == '' || this.data.p1name == '') {
      wx.showModal({
        title: '提示',
        content: '信息不全 查看（*）',
        success: function(sm) {
          console.log('用户点击')
        }
      })
      console.log(this.data);
      validation = false;
    }
    if (true) {
      var Lmessage = '小朋友 名: ' + this.data.name + ' 家长1: ' + this.data.p1name +
        ' 家长2: ' + this.data.p2name + ' 确定要添加吗？';
      console.log('data before save : ' + this.data.id + ' createdDate: ' + this.data.createdDate + ' registeredDate: '+ this.data.registeredDate);

      wx.showModal({
        title: '提示',
        content: Lmessage,
        success: function(sm) {
          if (sm.confirm) {
            console.log('用户点击Save')
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })      
    }
  },
  bindKeyInputP1(e) {
    this.setData({
      p1name: e.detail.value
    })
  },
  bindKeyInputP2(e) {
    this.setData({
      p2name: e.detail.value
    })
  },
  bindScanId: function() {
    wx.showToast({
      title: '读取中...',
      icon: 'loading',
      mask: true,
      duration: 5000
    });
    wx.scanCode({
      onlyFromCamera: true,
      success: res => {
        var cry_data = res.result;
        console.log(cry_data);
        var o_data = obj_base64.decode(cry_data);
        console.log(o_data);
        var vals = o_data.split('+');
        this.setData({
          id: util.hashCode(vals[0] + vals[1]),
          name: vals[0],
          birth: vals[1],
          p1name: vals[2],
          createdDate: new Date(),
          registeredDate: new Date()
        })
      }
    })
    var st = setTimeout(function () {
      wx.hideToast();
      clearTimeout(st);
    }, 5000)
  },

  onLoad: function(options) {},

  onReady: function() {
    console.log("onReady: "+this.data);
  },

  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});

function sendFunction(data) {
  console.log('Sned')
};
