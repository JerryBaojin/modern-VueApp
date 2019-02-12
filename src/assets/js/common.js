require('assets/css/reset.css');
require('assets/css/common.css');
import axios from 'axios'
import config from './config'
import './filter'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
//ie兼容
import "babel-polyfill"
//处理移动端click事件300毫秒延迟
import  './fastclick.js'

import Vue from 'vue';
Vue.use(MintUI)

import {
  Toast
} from 'mint-ui'

!(function(win, doc){
    function setFontSize() {
        // 获取window 宽度
        // var winWidth =  $(win).width();
        var winWidth = document.documentElement.clientWidth;
        // 750宽度以上进行限制 需要css进行配合
        var size = (winWidth / 750) * 100;
        var newSize = parseInt(size < 100 ? size : 100) + 'px';
        doc.documentElement.style.fontSize = newSize;
        localStorage.setItem('font',newSize);
    }
    var evt = 'onorientationchange' in win ? 'orientationchange' : 'resize';
    var timer = null;
    win.addEventListener(evt, function () {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 0);
    }, false);
    win.addEventListener("pageshow",function(e) {
        if (e.persisted) {
            clearTimeout(timer);
            timer = setTimeout(setFontSize,0);
        }
    }, false);
    // 初始化
	if(!localStorage.font){
        setFontSize();
    }else{
       doc.documentElement.style.fontSize = localStorage.font;
    }
    window.setFontSize =  setFontSize;
}(window, document));

window.addEventListener("load",function(){
    setTimeout(function(){
        var fontSize = document.documentElement.style.fontSize;
        if(fontSize=="100px"){
            window.setFontSize();
        }
    }, 1000);
});

//从app来的网页做清除处理
if (!config.isH5) {
  //token清除 解决被其他设备登录过进入会报登录过期问题
  localStorage.token = '';
}
function getQueryString (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

window.addEventListener("load",function(){
    setTimeout(function(){
        var fontSize = document.documentElement.style.fontSize;
        if(fontSize=="100px"){
            window.setFontSize();
        }
    }, 1000);
});
export default {
  // 七牛云固定地址
  qiUrl: '',
  platform: config.platform,
  /**
   * 封装axios，减少学习成本，参数基本跟jq ajax一致
   * @param {String} type			请求的类型，默认post
   * @param {String} url				请求地址
   * @param {String} time			超时时间
   * @param {Object} data			请求参数
   * @param {String} dataType		预期服务器返回的数据类型，xml html json ...
   * @param {Object} headers			自定义请求headers
   * @param {Function} success		请求成功后，这里会有两个参数,服务器返回数据，返回状态，[data, res]
   * @param {Function} error		发送请求前
   * @param return
   */
  ajax: function (opt) {
    //alert(config.platform);
    return new Promise((resolve, reject) => {
      var opts = opt || {};
      if (!opts.url) {
        this.errMessage('请填写接口地址');
        return false;
      }
      if (localStorage.token) {
        this.requestFun(opts, localStorage.token, resolve, reject);
      } else {
        if (config.platform == "android") {
          var t = window.user;
          if (t) {
            localStorage.token = t.getToken();
            this.requestFun(opts, t.getToken(), resolve, reject);
          } else {
            localStorage.token = '';
            this.requestFun(opts, '', resolve, reject);
          }
        } else if (config.platform == "ios") {
          var _this = this;
          window['getToken'] = (str) => {
            _this.requestFun(opts, str, resolve, reject);
            localStorage.token = str;
          }
        } else {
          //网页调试使用死token 打包时去掉
          var str = '';
          localStorage.token = str;
          this.requestFun(opts, str, resolve, reject);
        }
      }
    });
  },
  requestFun: function (opts, token, resolve, reject) {
    // 如果还没有token 从url拿
    token = token ? token : getQueryString('token')
    var api = '';
    //根据域名判断是使用正式接口还是测试接口
    if (location.hostname == '' || location.hostname == '') {
      api = config.build;
    } else {
      api = config.dev;
    }
    opts.type = opts.type ? opts.type.toUpperCase() : 'POST'
    let options = {
      method: opts.type,
      url: opts.url,
      params: opts.type === 'POST' || !opts.data ? {} : opts.data,
      timeout: opts.time || 30 * 1000,
      responseType: opts.dataType || 'json',
      headers: {
        'Authorization': token,
        'Platform': config.platform
      },
      baseURL: opts.base == "h5" ? config.h5 : api
    }
    if (opts.type === 'POST') {
      options.data = opts.data
    }
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios(options).then((res) => {
      resolve(res.data);
    }).catch((error) => {
      if (error.response) {
        //错误回调
        if (reject) {
          reject(error.response);
        }
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if (error.response.data.info) {
          this.errMessage(error.response.data.info);
        }
      } else {
        this.errMessage('好多人在访问呀，请重新试试');
      }
    });
  },
  //公共处理请求错误信
  errMessage: function (errorInfo) {
    //弹出错误信息弹框
    this.confirm(errorInfo);
  },
  adjustScreen:function(){
          //移动端按钮兼容
          let str=[".my-btn"];
          if (arguments.length>=1) {
            str.push(arguments[0]);
          }

          var h = window.innerHeight;
  				window.onresize=function(){
  					if(h>window.innerHeight){
  						$(str.join(",")).hide()
  					}else{
  					$(str.join(",")).show()
  					}

  				}
        },
        debounce:function(handler){
          //防抖函数
          let time=null;
          return function(){
            if (time !==null)clearTimeout(time);
            time=setTimeout(handler,500)
          }
        },
        pageBack:function(){
          window.history.pushState("", "", location.href);
          $(window).bind('popstate', function() {
              // -2可以促使ios返回的页面刷新
              history.go(-2);
          });
            history.go(-2);
        },
  // 金额千位切割
  spliceMoney(num) {
    if (num) {
        var res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
               return $1+",";
             });
       })
       return res;
    }
    return 0
  },
  //统一提示信息弹框
  confirm: function (error) {
    Toast({
      message: error,
      duration: 3000,
      position: 'bottom',
      //iconClass: 'icon icon-success'
    });
  },
  //获取浏览器的参数
  getQueryString,
  //将对象元素转换成字符串以作比较
  obj2key(obj, keys) {
    var n = keys.length,
      key = [];
    while (n--) {
      key.push(obj[keys[n]]);
    }
    return key.join('|');
  },
  //去重操作
  uniqeByKeys(array, keys) {
    var arr = [];
    var hash = {};
    for (var i = 0, j = array.length; i < j; i++) {
      var k = this.obj2key(array[i], keys);
      if (!(k in hash)) {
        hash[k] = true;
        arr.push(array[i]);
      }
    }
    return arr;
  },
  compare(prop, sort = 'asc') {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (sort == "asc") {
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (val1 > val2) {
          return -1;
        } else if (val1 < val2) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  },
  timeFormat(value, format) {
    if (value) {
      if (value.toString().length == 10) {
        value = value * 1000
      }
      var dateObj = new Date(value);
      var date = {
        "Y+": dateObj.getYear(),
        "M+": dateObj.getMonth() + 1,
        "d+": dateObj.getDate(),
        "h+": dateObj.getHours(),
        "m+": dateObj.getMinutes(),
        "s+": dateObj.getSeconds(),
        "q+": Math.floor((dateObj.getMonth() + 3) / 3),
        "S+": dateObj.getMilliseconds()
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
      }
      return format;
    }
  },
  //随机字符串七牛上传使用
  getUUId() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = ""; //去掉"-"
    var uuid = s.join("");
    return uuid;
  }
}

//阻止整个网页内容被选中
document.body.onselectstart = function () {
  return false;
}
/*
 *时间格式化
 *fmt:格式化的类型 例如yyyy-MM-dd
 */
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours() + 1, // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
//删除数组指定索引的值并返回新数组
Array.prototype.delete = function (delIndex) {
  var temArray = [];
  for (var i = 0; i < this.length; i++) {
    if (i != delIndex) {
      temArray.push(this[i]);
    }
  }
  return temArray;
}
