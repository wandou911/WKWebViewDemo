//这部分是固定的
var iosBridge = function (callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

//用 iosBridge 接收
iosBridge(function (bridge){
    //js 注册 oc 需要调用的方法，并接收OC传递的值
    /**
     * OC调用JS中的注册方法，JS有两种响应方式
     * 1. JS接收到OC的调用请求，需要通过回调把一些数据给OC的
     * 2. JS接收到OC的调用请求，无需回调传值的
    */

    /**
     * 1. JS接收到OC的调用请求，需要通过回调把一些数据给OC的
     * JS 方法原型：bridge.registerHandler("handlerName", function(data,responseData) { ... })
     * @first param: 'OCCallJS', 是OC调用JS的方法名，需要事先注册
     * @second param: 回调函数，其中data 是OC通过 ‘OCCallJS’ 方法，传过来的值， ’responseCallBack‘ 是JS回调给OC的方法，通过’responseCallBack‘可以给OC传递一个值
    */
     bridge.registerHandler('OCCallJS2', function(data,responseCallBack){
            console.log('js is called by oc,data from oc:' + data)
            document.getElementById('div1').innerText = data + 'JS回复OC一个橘子'
            responseCallBack('JS回复OC一个橘子')
     })
    /**
     * 上述方法必须对应OC中的方法，如果OC没有callback，JS端会报错
     * OC方法原型：[bridge callHandler:(NSString*)handlerName data:(id)data responseCallback:(WVJBResponseCallback)callback]
     * @first param: 'OCCallJS', 是OC调用的JS方法名
     * @second param data: 是需要通过OCCallJS方法，传递给JS的数据
     * @third param responseCallback: JS 收到调用之后，回调给OC的值
     * [self.bridge callHandler:@"OCCallJS" data:@"Objective-C主动给JS一个苹果" responseCallback:^(id responseData) {
     *       NSLog(@"Objective-C给JS一个苹果后，%@",responseData);
     *       self.label.text = [NSString stringWithFormat:@"Objective-C给JS一个苹果后，%@",responseData];
     * }];
     */



    /**
     * 2. JS接收到OC的调用请求，无需回调传值的,分为需要传参，和不需要传参两种，当然你也可以直接把不需要的部分传nil
     * JS 方法原型：bridge.registerHandler("handlerName", function(responseData) { ... })
     * @first param: 'OCCallJS', 是OC调用JS的方法名，需要事先注册
     * @second param: 回调函数，其中data 是OC通过 ‘OCCallJS’ 方法，传过来的值,可能为null
    */ 
    bridge.registerHandler('OCCallJS', function (data){
        document.getElementById('div1').innerText = data ? data : 'Objective-C主动给JS一个苹果，并且不要回报'
    })
    /**
     * 此方法对应OC中下面两个方法
     * OC方法原型：[bridge callHandler:(NSString*)handlerName data:(id)data] or [bridge callHandler:(NSString*)handlerName]
     * [self.bridge callHandler:@"OCCallJS" data:@"Objective-C主动给JS一个苹果，并且不要回报"]; 或者[self.bridge callHandler:@"OCCallJS"];
     * 如果是前者 则对应的JS回调函数data中有值，后者，则为null 
    */

    
})

function btnClick() {
    /**
     * JS 调用 OC，同样也需要现在OC注册方法名，然后才能在JS中调用
     */
    /**
     * 调用原型方法有三种
     * 
     * bridge.callHandler("handlerName", data) or bridge.callHandler("handlerName")
     * bridge.callHandler("handlerName", data, function responseCallback(responseData) { ... })
     */
    

    iosBridge(function (bridge){
        // bridge.callHandler('JSCallOC')
        // bridge.callHandler('JSCallOC','JS主动给Objective-C一个橘子')
        bridge.callHandler('JSCallOC','JS主动给Objective-C一个橘子',function(responseData){
            document.getElementById('div1').innerText = 'JS主动给Objective-C一个橘子，' + responseData
        })

        /**
         * [self.bridge registerHandler:@"JSCallOC" handler:^(id data, WVJBResponseCallback responseCallback) {
         *      self.label.text = [NSString stringWithFormat:@"%@,并准备向Objective-C要一个苹果",data];
         *      responseCallback(@"并向Objective-C要了一个苹果");
         * }];
         */
    })
}
