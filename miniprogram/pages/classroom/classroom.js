var util = require('../../utils/util.js');
const db = wx.cloud.database();
Page({
  data: {
    selectorData: {},
    showData: {},
    index: 0,
    disabled: true
  },
  bindPickerChange: function(e) {
    console.log('picker value:', e.detail.value)
    this.setData({
      index: e.detail.value,
      showData: {}
    })
  },
  searchOnClick: function() {
    let that = this;
    let selected = that.data.selectorData[this.data.index];
    console.log(selected);
    db.collection('Classes').orderBy('createdDate', 'asc').where({
      signInDate: selected
    }).field({
      id: true,
      createdDate: true,
      name: true,
      signedPname: true,
      _id: false
    }).get({
      success: res => {
        console.log(res);
        keepTime(res.data, that);
      },
      fail: res => {
        console.log(res);
      }
    });
  },

  onLoad: function(options) {
    selectOpenClassDate(this);
  }
});

function selectOpenClassDate(that) {
  db.collection('OpenDate').orderBy('openDate', 'desc').field({
    openDate: true,
    _id: false
  }).get({
    success: res => {
      console.log(res);
      makeDateArray(res.data, that);
      that.setData({
        disabled: false,
      });
    }
  });
};

function keepTime(objects, that) {
  var len = objects.length;
  if (len > 0) {
    var l_array = [];
    for (var i = 0; i < len; i++) {
      var l_o = objects[i];
      l_o.createdDate = util.removeDate(l_o.createdDate);
      l_array[i] = l_o;
    }
    that.setData({
      showData: l_array
    })
  } else {
    wx.showModal({
      title: '提示',
      content: '没有记录'
    })
  }
}

function makeDateArray(objects, that) {
  var len = objects.length;
  var l_array = [];
  for (var i = 0; i < len; i++) {
    l_array[i] = objects[i].openDate;
  }
  that.setData({
    selectorData: l_array
  })
}

module.exports = {
  selectOpenClassDate: selectOpenClassDate,
  makeDateArray: makeDateArray
}