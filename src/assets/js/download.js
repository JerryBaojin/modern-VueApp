var andorWeixin = false;
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
var isChrome = u.indexOf("Chrome") !== -1;
var ifWeixin = u.indexOf("MicroMessenger") >= 0; // weixin
var baseScheme = "taobao://";
import config from './config'
import {Toast} from 'mint-ui'
export default {
    // 判断是否为IOS9版本
    isIOS9:function(){
        //获取固件版本
        var getOsv = function () {
            var reg = /OS ((\d+_?){2,3})\s/;
            if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
                var osv = reg.exec(navigator.userAgent);
                if (osv.length > 0) {
                    return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.');
                }
            }
            return '';
        };
        var osv = getOsv();
        var osvArr = osv.split('.');
        //初始化显示ios9引导
        if (osvArr && osvArr.length > 0) {
            if (parseInt(osvArr[0]) >= 9) {
                return true
            }
        }
        return false
    },
    // 创建一个iframe
    createIframe:function(){
        var iframe;
        return function(){
            if(iframe){
                return iframe;
            }else{
                iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                return iframe;
            }
        }
    },
    // 创建一个scheme
    createScheme:function(options){
        var urlScheme=baseScheme;
        for(var item in options){
            urlScheme=urlScheme+item + '=' + encodeURIComponent(options[item]) + "&";
        }
        urlScheme = urlScheme.substring(0, urlScheme.length - 1);
        // return encodeURIComponent(urlScheme);
        return urlScheme;
    },
    // 打开手机app
    openApp:function(){
        //生成你的scheme你也可以选择外部传入
        var localUrl=this.createScheme();
        var openIframe=this.createIframe();
        var iosUrl = config.iosUrl;
        var androidUrl = config.androidUrl;

        if(isiOS){
            //判断是否是ios,具体的判断函数自行百度
            if(this.isIOS9()){
                if(ifWeixin){
                    location.href = iosUrl
                    setTimeout(function () {
                        window.location.href = iosUrl;
                    }, 500);
                    return;
                }
                //判断是否为ios9以上的版本,跟其他判断一样navigator.userAgent判断,ios会有带版本号
                localUrl = this.createScheme();//代码还可以优化一下
                location.href = iosUrl;//实际上不少产品会选择一开始将链接写入到用户需要点击的a标签里
                return;
            }
            window.location.href = iosUrl;
            var loadDateTime = Date.now();
            setTimeout(function () {
                var timeOutDateTime = Date.now();
                if (timeOutDateTime - loadDateTime < 1000) {
                    window.location.href = iosUrl;
                }
            }, 25);
        }else if(isAndroid){
            if(ifWeixin){

                Toast({
                    message: '请在右上角选择在浏览器中打开',
                    duration: 3000,
                    position: 'bottom',
                    //iconClass: 'icon icon-success'
                });
                $('#isAndiro').css('display','block');
                return;
                andorWeixin = true;
            }
            //判断是否是android，具体的判断函数自行百度
            if (isChrome) {
                //chrome浏览器用iframe打不开得直接去打开，算一个坑
                window.location.href = androidUrl;
            } else {
                //抛出你的scheme
                openIframe.src = androidUrl;
            }
        }else{
            openIframe.src = androidUrl;
            setTimeout(function () {
                window.location.href = androidUrl;
            }, 500);
        }
    }
}
