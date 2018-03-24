let store = require("../store/store")
Page({
    data: {
        pageDatas: [],
        pageShows: [],
        pageChick: [],//每个字对应着相应的点击与否
        pageHint: "",
        chicks: false
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
        var tmpChicks = [];
        for(var i=0; i<showDataArr.length;i++){//初始化被点击的状态
          tmpChicks.push(false);
        }

        this.setData({
          pageDatas: tmpDatas,
          pageShows: showDataArr,
          pageChick: tmpChicks
        })
        this.setData({
          pageHint: this.data.pageDatas[0].explain
        })

        console.log(this.data.pageDatas);
        console.log(this.data.pageShows);
    },
    onInputClick: function(e) {
      var indexId = e.target.dataset.index
      var tmpChick = this.data.pageChick;
      tmpChick[indexId] = !this.data.pageChick[indexId];
      this.setData({
        pageChick: tmpChick
      })
    },
    prompt:function () {
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        })
    }
})