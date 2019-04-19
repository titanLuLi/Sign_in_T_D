
var fun_base64 = require('../../utils/base64.js');
var util = require('../../utils/util.js');
var obj_base64 = new fun_base64.Base64();
const db = wx.cloud.database();

const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
  },
  openClassDate: function (){
    wx.showToast({
      title: '读取中......',
      icon: 'loading',
      mask: true,
      duration: 5000
    });
    var openDate = util.formatDate (new Date);  
    db.collection('OpenDate').where({
      openDate: openDate
    }).count({
      success(res) {
        if (res.total == 0 ) {
          db.collection('OpenDate').add({
            data: {
              openDate: openDate,
              createdDate: util.formatTime(new Date())
            }
          });
        }else{
          console.log('Open date ' + openDate + ' was created' );
        }
      }
    });    
  },
  signIn: function(cry_data) {
    var o_data = obj_base64.decode(cry_data);
    console.log('o_data : ' + o_data);
    var vals = o_data.split('+');
    var id = util.hashCode(vals[0] + vals[1]);
    db.collection('Students').where({
      id: id
    }).count({
      success(res) {
        if (res.total == 0) {
          wx.showModal({
            title: '提示',
            content: vals[0]+'小朋友还没注册,请先注册!'
          })
        } else {
          db.collection('Classes').add({
            data: {
              id: id,
              name: vals[0],
              signedPname: vals[2],
              signInDate: util.formatDate(new Date()),
              createdDate: util.formatTime(new Date())
            }
          }).then(res => {
            console.log(res);
            var message = res.errMsg.split(':');        
            wx.showModal({
              title: vals[0] + ' 签到',
              content: message[1]
            })
          });
        }
      }
    });
  },

  signInOnClick: function() {   
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        that.openClassDate ();
        that.signIn(res.result, true);
      }
    })
  },

  onLoad: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onGetOpenid: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  studentsOnClick: function() {
    wx.navigateTo({
      url: '../students/studentRegister'
    })
  },
  classOnClick: function () {
    wx.navigateTo({
      url: '../classroom/classroom'
    })
  },
  checkPayOnClick : function () {
    wx.showModal({
      title: '提示',
      content: 'coming soon'
    })
    },
})