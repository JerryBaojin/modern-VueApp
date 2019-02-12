/*
 * vuejs 	过滤器
 * time 	2018年6月6日 14:52:54
 */

import Vue from 'vue';
/**
  * 格式化时间
  * @param value 		传进来的时间戳
  * @param format	 	需要展示的格式
  * @param return 
*/
Vue.filter( 'time' , function(value,format) {
  if(value){
     if(value.toString().length == 10){
          value = value*1000
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
                format = format.replace(RegExp.$1, RegExp.$1.length == 1? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
       }
       return format;
  }
}); 

/**
  * 格式化数字
  * @param value    传进来的数字
  * @param return 
*/
Vue.filter( 'number' , function(value){
    var num = parseInt(value);
    if(num > 999 ){
        return (num/1000).toFixed(2)+'K'
    }else if(num < (-999)){
        return (num/1000).toFixed(2)+'K'
    }else{
        return value
    }
}); 