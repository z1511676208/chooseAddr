// model.js
/**
 * model.js 三级联动js
 * 模板默认是广东省广州市
 * @author $wp 2018-04-09 15:26
 */
var area = require('../utils/area.js')

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var value = [0,0,0];//数据位置下标

var info = {};
var vali=[];

function updateAreaData( that, status, e){
    //获取省份数据
    var getProvinceData = function (){
      var s;
      provinces = [];
      var num = 0;
      for (var i = 0; i < areaInfo.length; i++) {
        s = areaInfo[i];
        if (s.di == "00" && s.xian == "00") {
          provinces[num] = s;
          num++;
        }
      }

      //获取当前省份的索引值 广东省 可改成自己当前的省份
      provinces.some((item, index) => {
        if (item.name.indexOf("广东省") != -1) {
          vali[0] = index;
          return;
        }
      })
      //console.log(vali[0])

      //初始化调一次传递索引值，传递省城数据
      //获取地级市数据
      getCityArr(vali[0]);

      //获取当前城市的索引值 广州市 可改成自己当前的城市
      citys.some((item, index) => {
        if (item.name.indexOf( "广州市") != -1) {
          vali[1] = index;
          return;
        }
      })
      //console.log(vali[1])

      //获取区县数据
      getCountyInfo(vali[0], vali[1]);

      //赋值
      info = {
        item: {
          provinces: provinces,
          citys: citys,
          countys: countys,
          value: value
        }
      }

      animationEvents(that, 200, false, 0);
    }

    // 获取地级市数据
    var getCityArr = function (count = 0) {
      var c;
      citys = [];
      var num = 0;
      for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
          citys[num] = c;
          num++;
        }
      }
      if (citys.length == 0) {
        citys[0] = { name: '' };
      }
    }

    // 获取区县数据
    var getCountyInfo = function (column0 = 0, column1 = 0) {
      var c;
      countys = [];
      var num = 0;
      for (var i = 0; i < areaInfo.length; i++) {
        c = areaInfo[i];
        if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
          countys[num] = c;
          num++;
        }
      }
      if (countys.length == 0) {
        countys[0] = { name: '' };
      }
      value = [column0, column1, 0];
    }
    
    //滑动事件
    var valueChange = function(e,that){
      var val = e.detail.value
       console.log(e)
      //判断滑动的是第几个column
      //若省份column做了滑动则定位到地级市和区县第一位
      if (value[0] != val[0]) {
        val[1] = 0;
        val[2] = 0;
        getCityArr(val[0]);//获取地级市数据
        getCountyInfo(val[0], val[1]);//获取区县数据
      } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
        if (value[1] != val[1]) {
          val[2] = 0;
          getCountyInfo(val[0], val[1]);//获取区县数据
        }
      }
      value = val;

      assignmentData(that, that.data.item.show)

      console.log(val);
      
      //回调
      //callBack(val);

    }
   
    if (status == 0){
      area.getAreaInfo(function (arr) {
        areaInfo = arr;
        //获取省份数据
        getProvinceData();

      });  
    }
    //滑动事件
    else{
      valueChange(e,that);
    }
    
}

//动画事件
function animationEvents(that, moveY, show, duration) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: duration,
    timingFunction: "ease",
    delay: 0
  })
  that.animation.translateY(moveY + 'vh').step()
  //赋值
  assignmentData(that,show)

}

//赋值
function assignmentData(that, show) {
  that.setData({
    item: {
      animation: that.animation.export(),
      show: show,
      provinces: provinces,
      citys: citys,
      countys: countys,
      value: value
    }
  })
}

module.exports = {
  updateAreaData: updateAreaData,
  animationEvents: animationEvents
}
