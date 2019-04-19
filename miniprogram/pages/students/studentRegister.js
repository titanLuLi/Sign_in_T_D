
var fun_base64 = require('../../utils/base64.js');
var util = require('../../utils/util.js');
var obj_base64 = new fun_base64.Base64();
const db = wx.cloud.database();

Page({
  data: {
    id: '',
    name: '',
    birth: '',
    p1name: '',
    p2name: '',
    disabled: true
  },
  insertSave(that) {
    db.collection('Students').where({
      id: that.data.id
    }).count({
      success(res) {
        console.log(res.total);
        if (res.total == 0) {
          db.collection('Students').add({
            data: {
              id: that.data.id,
              name: that.data.name,
              birth: that.data.birth,
              p1name: that.data.p1name,
              p2name: that.data.p2name,
              createdDate: util.formatTime(new Date()),
              registeredDate: util.formatDate(new Date())
            }
          }).then(res => {
            console.log(res);
            var message = res.errMsg.split(':');
            wx.showModal({
              title: '提示',
              content: message
            })
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '注册成功'
          })
        }
      }
    });
  },
  cancelOnClick() {
    this.setData({
      id: '',
      name: '',
      birth: '',
      p1name: '',
      p2name: '',
      disabled: true
    })
  },
  confirmOnClick() {
    if (this.data.id == '' || this.data.p1name == '') {
      wx.showModal({
        title: '提示',
        content: '信息不全 查看（*）',
        success: function(sm) {
          console.log('用户点击')
        }
      })
    } else {
      var Lmessage = '小朋友 名: ' + this.data.name + ' 家长1: ' + this.data.p1name +
        ' 家长2: ' + this.data.p2name;
      console.log('data before save : ' + Lmessage);
      let thatL1 = this;
      wx.showModal({
        title: '确定要添加吗？',
        content: Lmessage,
        success: function(sm) {
          if (sm.confirm) {
            wx.showToast({
              title: '保存中...',
              icon: 'loading',
              mask: true,
              duration: 2000
            });
            let that = thatL1;
            that.insertSave(that);
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      });
    }
    this.setData({
      disabled: true,
    })
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
          disabled: false
        })
      }
    })
    /* var st = setTimeout(function() {
       wx.hideToast();
       clearTimeout(st);
     }, 5000)*/
  },

  onLoad: function(options) {},
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
});
