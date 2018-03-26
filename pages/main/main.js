let store = require("../store/store")
Page({
    data: {
        pageDatas: [],//没有打乱之前的原始数据，用来做对比
        pageShows: [],//存放打乱后的随机字
        pageChick: [],//每个字的点击状态
        pageHidden: [],//每个字的显示或隐藏状态
        pageHint: "",//【提示】的消息
        inputIndex: [],//选择的字对应的索引
        rightTimes: 0,//答对次数，
        rightMatch: 0//第几关
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
        var tmpHidden = [];
        for(var i=0; i<showDataArr.length;i++){//初始化被点击的状态
          tmpChicks.push(false);
          tmpHidden.push(false);
        }

        this.setData({
          pageDatas: tmpDatas,
          pageShows: showDataArr,
          pageChick: tmpChicks,
          pageHidden: tmpHidden,
          inputIndex: [],//选择的字对应的索引
          rightTimes: 0,//答对次数
          rightMatch: index
        })
        this.setData({
          pageHint: this.data.pageDatas[0].explain
        })

        //console.log(this.data.pageDatas);
        //console.log(this.data.pageShows);
        //console.log(store.steps.length)
    },
    onInputClick: function(e) {
      var indexId = e.target.dataset.index
      var tmpChick = this.data.pageChick;
      var tmpHidden = this.data.pageHidden;
      var tmpInputIndex = this.data.inputIndex;
      var tmpRightTimes = this.data.rightTimes;
      tmpChick[indexId] = !this.data.pageChick[indexId];
      if(tmpChick[indexId]){//点击
        tmpInputIndex.push(indexId);
      }else{//取消点击
        tmpInputIndex.pop(indexId);
      }
      if (tmpInputIndex.length == 4) {//输入满了4个字
        var inputStr = "";
        var that = this;
        this.data.inputIndex.forEach(function(item, index){
          inputStr += that.data.pageShows[item];
        })
        //console.log(inputStr)
        if (inputStr == that.data.pageDatas[tmpRightTimes].idiom) {//ok
          tmpInputIndex.forEach(function(item, index){
            tmpHidden[item] = true;
          })
          tmpRightTimes++;
        }else {
          tmpInputIndex.forEach(function (item, index) {//fail
            tmpChick[item] = false;
          })
        }
        tmpInputIndex = [];
      }
      this.setData({//更新点击数据

      }) 
      if (tmpRightTimes < this.data.pageDatas.length){//本关没结束
        this.setData({//更新提示信息
          pageChick: tmpChick,
          pageHidden: tmpHidden,
          inputIndex: tmpInputIndex,
          rightTimes: tmpRightTimes,
          pageHint: this.data.pageDatas[tmpRightTimes].explain
        })
      }else {//本关结束
        var tmprightMatch = this.data.rightMatch < store.steps.length - 1 ? (this.data.rightMatch + 1) : this.data.rightMatch
        this.setData({//设置游戏关数
          rightMatch: tmprightMatch
        })
        wx.showToast({
          title: '进入下一关',
          duration: 3000
        })
        this.stepIndex(tmprightMatch)
      }
    },
    prompt:function () {
        wx.showToast({
          title: this.data.pageDatas[this.data.rightTimes].idiom,
          icon: "none",
          duration: 1000
        })
    },
    reinit:function() {
      this.stepIndex(this.data.rightMatch)
    }
})