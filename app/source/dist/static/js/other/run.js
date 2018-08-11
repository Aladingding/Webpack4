// 2017-05-25 v1.1.0
(function(){
    var ms = {};
    
    ms.appCache = (function(){
        var appCache = {};
        appCache.ob = window.applicationCache;
        appCache.isAppCache = function(){
            return !!this.ob;
        };
        appCache.addEvent = function(eventType,callback,boolean){
            this.ob.addEventListener(eventType,callback,boolean);
        };
        return appCache;
    })();

    ms.isOldIE = function(){  // 判断浏览器是否为IE5~8浏览器
        return '\v' === 'v';
    };

    ms.checkBrowser = function(){
        if(ms.isOldIE()){
            alert('很抱歉，您的浏览器版本过低，为了获得更好的用户体验，请升级您的IE浏览器（可前往微软官网进行下载更新），不便之处请您谅解！');
            location.href = 'http://windows.microsoft.com/zh-cn/internet-explorer/download-ie';
        }
    };

    window.ms = ms;
})();