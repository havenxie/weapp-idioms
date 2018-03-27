let store = require("../store/store")
Page({

    data: {
        pageDatas: [],//没有打乱之前的原始数据
        pageShows: [],//存放打乱的成语
        pageHidden: [],//每个字的显示或隐藏状态
        pageChick: [],//每个字的点击状态
        pageHint: "",//【提示】的消息
        inputIndex: [],//选择的字对应的索引
        rightTimes: 0,//答对次数
        Checkpoint: 0 //关卡
    },

    onLoad: function (options) {
        this.stepIndex(this.data.Checkpoint);
    },

    stepIndex: function (index) {
        var tmpDatas = [];
        var showDataStr = "";
        var showDataArr = [];
        var backupsArr = [];
        store.steps[index].forEach(function (item, i) {
            tmpDatas.push(store.idoims[item]);
            showDataStr += store.idoims[item].idiom;
        });
        showDataArr = showDataStr.split("");
        showDataArr.sort(function () {
            return .5 - Math.random();
        });
        var tmpChicks = [];
        var tmpHidden = [];
        for (var i = 0; i < showDataArr.length; i++) {
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
          pageHint: "【提示】：" + this.data.pageDatas[0].explain

        })

        console.log(this.data.pageDatas);
        console.log(this.data.pageShows);
        console.log(store.steps.length);
    },

    onInputClick: function (e) {
        var indexId = e.target.dataset.index;
        var tmpChick = this.data.pageChick;
        var tmpHidden = this.data.pageHidden;
        var tmpInputIndex = this.data.inputIndex;
        var tmpRightTimes = this.data.rightTimes;
        tmpChick[indexId] = !this.data.pageChick[indexId];
        if (tmpChick[indexId]) {//点击
            tmpInputIndex.push(indexId);
        } else {//取消点击
            tmpInputIndex.pop(indexId);
        }
        if (tmpInputIndex.length == 4) {//输入满了4个字
            var inputStr = "";
            var that = this;
            this.data.inputIndex.forEach(function (item, index) {
                inputStr += that.data.pageShows[item];
            })
            console.log(inputStr)
            if (inputStr == that.data.pageDatas[tmpRightTimes].idiom) {//ok
                tmpInputIndex.forEach(function (item, index) {
                    tmpHidden[item] = true;
                })
                tmpRightTimes++;
            } else {
                tmpInputIndex.forEach(function (item, index) {//fail
                    tmpChick[item] = false;
                })
            }
            tmpInputIndex = [];
        }
        this.setData({//更新页面数据
          pageChick: tmpChick,
          pageHidden: tmpHidden,
          inputIndex: tmpInputIndex,
          rightTimes: tmpRightTimes
        })
        if (tmpRightTimes < this.data.pageDatas.length) {
            this.setData({//更新提示数据
              pageHint: "【提示】：" + this.data.pageDatas[tmpRightTimes].explain
            })
        } else { // 下一关开始
            var index = this.data.Checkpoint + 1;
            var gameCheckpoint = '第' + (parseInt(index) + 1) + '关';
            this.setData({
                Checkpoint: index,
                rightTimes: 0,
                inputIndex: [],
                pageHint: ''
            })
            console.log(this.data.Checkpoint)
            if (this.data.Checkpoint == store.steps.length) {

                wx.showToast({
                    title: '恭喜您！通关啦',
                    image: '../../asstes/zan.png',
                    duration: 2000,
                    success: () => {
                        setTimeout(() => {
                            wx.redirectTo({
                                url: '../index/index'
                            })
                        }, 2000)
                    }
                })

            } else {
                wx.showModal({
                    content: '进入下一关',
                    duration: 3000,
                    success: (res) => {
                        if (res.confirm) {

                            this.stepIndex(this.data.Checkpoint);

                            wx.setNavigationBarTitle({//关卡显示
                                title: gameCheckpoint
                            })

                        } else if (res.cancel) {
                            wx.redirectTo({
                                url: '../index/index'
                            })
                        }
                    }
                })
            }
        }
    },
  //【提示】：
    orderReset: function () {

        let reset = [];
        if (this.data.rightTimes >= 0) {
            this.data.pageHidden.forEach(function (item, index) {
                item = false;
                reset.push(item)
            })

            this.setData({
                pageHidden: reset,
                pageChick: reset,
                rightTimes: 0,
                pageHint: "【提示】：" + this.data.pageDatas[0].explain
            })
        }
        let orderResult = this.data.pageShows.sort(function () {
            return .5 - Math.random();
        })
        this.setData({
            pageShows: orderResult
        })
    },

    prompt: function () {

        wx.showToast({
            title: this.data.pageDatas[this.data.rightTimes].idiom,
            image: '../../asstes/prompt.png',
            duration: 1500
        })
    }
})