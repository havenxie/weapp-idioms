let store = require("../store/store")
Page({
    data: {
        pageDatas: [],//没有打乱之前的原始数据，用来做对比
        pageShows: [],//存放打乱后的随机字
        pageChick: [],//每个字的点击状态
        pageHidden: [],//每个字的显示或隐藏状态
        pageHint: "",//【提示】的消息
        inputIndex: [],//选择的字对应的索引
        rightTimes: 0//答对次数
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
          pageHidden: tmpHidden
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
        console.log(inputStr)
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
        pageChick: tmpChick,
        pageHidden: tmpHidden,
        inputIndex: tmpInputIndex,
        rightTimes: tmpRightTimes,
      }) 
      if(tmpRightTimes < 10){
        this.setData({//更新点击数据
          pageHint: this.data.pageDatas[tmpRightTimes].explain
        })
      }else {
        wx.showModal({
          title: '第一关结束',
          content: '暂时先写到这里',
        })
       
      }
    },
    prompt:function () {
        wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
        })
    }
})