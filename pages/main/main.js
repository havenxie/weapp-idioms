let store = require("../store/store")
Page({
    data: {
        pageDatas: [],
        pageShows: [],
        pageHint: ""
    },

    onLoad: function (options) {
        this.stepIndex(0)       
    },

    stepIndex: function (index) {
        var tmpDatas = [];
        var showDataStr = "";
        var showDataArr = [];
        var backupsArr = [];
        store.steps[index].forEach(function (item, i){
          tmpDatas.push(store.idoims[item]);
          showDataStr += store.idoims[item].idiom;
        });
        showDataArr = showDataStr.split(""); 
        showDataArr.sort(function () {
          return .5 - Math.random();
        });
        this.setData({
          pageDatas: tmpDatas
        })
        this.setData({
          pageShows: showDataArr
        })
        this.setData({
          pageHint: this.data.pageDatas[0].explain
        })
        console.log(this.data.pageDatas);
        console.log(this.data.pageShows);
    },

    prompt:function () {
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        })
    }
})