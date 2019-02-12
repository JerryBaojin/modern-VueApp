//获取浏览器的参数
function getQueryString(name) {
  return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
}
var platform = getQueryString('type');
//console.log(platform);
var isH5 = getQueryString('h5');
//如果地址上有就从地址取并存储
if(platform){
    platform = platform.toLowerCase();
    localStorage.platform = platform;
}else{
    //地址没传并且存储也没有就传h5
    if(!localStorage.platform){
        platform = "h5";
    }else{
        if(isH5){
            platform = localStorage.platform;
        }else{
            platform = "h5";
        }
    }
}

module.exports = {
    isH5:isH5,
    platform:platform,
    dev: '',//测试环境下的API地址
    build: "", //生产环境公共请求地址
    iosUrl:"", //ios下载地址
    androidUrl:"" //安卓下载地址
}
