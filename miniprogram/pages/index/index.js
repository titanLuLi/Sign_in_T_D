//index.js
var base64 = require('../../utils/base64.js')
var obj_base64 = new base64.Base64();
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
   
  },
  studentsOnClick: function () {
    wx.navigateTo({
      url: '../students/studentRegister'
    })
  },
  signInOnClick: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res.result);
        var o_data = obj_base64.decode(res.result);
        console.log("o_data : " + o_data);
      }
    })
  },

  onLoad: function() {
    const db = wx.cloud.database ();
    db.collection('Students').get({
      success(res) {
        console.log(res);
      }
    });
    // 获取用户信息
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
    // 调用云函数
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
})
