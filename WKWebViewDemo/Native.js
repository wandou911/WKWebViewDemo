//JS响应OC的调用
function OCCallJS(msg){
    document.getElementById('div1').innerText = msg ? msg : '收到了来自OC的调用'
    return 'JS收到了OC的调用，并返回了我'
}

function responseCallHandler(response){
    
}

function btnClick() {
    /**
     * JS 调用 OC，同样也需要现在OC注册方法名，然后才能在JS中调用
     * 原型：window.webkit.messageHandlers.<name>.postMessage(<messageBody>)
     */
    window.webkit.messageHandlers.JSCallOC.postMessage('JS主动调用OC')
}
