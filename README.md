# chooseArea
#微信小程序三级联动封装
#通过微信小程序里的WXML模板（template）对代码进行了封装
#model文件就是封装的模板，可以进行引用
#index没有通过模板引用使用
#utils里的area.js,地区数据



#一 模板的引用   

#1 wxml里：

<import src="../../model/model.wxml"/>

<view class="infoText">{{province}} {{city}} {{county}}</view>

<button class="animation-button" bindtap="translate">选择城市</button>

<template is="areaData" data="{{...item}}"/>


#1.1 import把模板引用
#1.2 template调用，通过data把数据传进去
#1.3 button触发弹出
#1.4 view显示

#2 
记住 把model.js加进来，里面是滑动选中数据的一些处理 var model = require('../../model/model.js')
js里大概看一下就可以了，就是传入数据，显示隐藏




最后一个就是把css引入
@import '../../model/model.wxss'




默认进入程序是不调用模板操作








