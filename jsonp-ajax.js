const $ = {
    ajax(options) {
        let url = options.url; //url
        let type = options.type; //请求方式
        let dataType = options.dataType; //json、jsonp
        
        //判断是否同源
        let targetProtocol = "" ; //协议
        let targetHost = ""; //host 包括了域名和端口
        
        //如果url不带有http或者https那么就是相对路径，一定是同源的，例如localhost
        if(url.indexOf("http://") !== -1 || url.indexOf("https://") !== -1) {
            //跨域
            let targetUrl = new URL(url);
            targetProtocol = targetUrl.protocol;
            targetHost = targetUrl.host;
        } else {
            //同源
            targetProtocol = location.protocol;
            targetHost = location.host;
        }

        //判断是否是jsonp类型
        if(dataType === "jsonp") {
            //判断是否跨域，如果同源直接进行普通的ajax请求
            if(targetProtocol === location.protocol && targetHost === location.host) {
                //同源
            } else {
                let callback = "cb" + Math.floor(Math.random() * 1000000);
                //window上添加一个方法
                window[callback] = options.success;
                let script = document.createElement("script");
                //判断url是否有参数
                if(url.indexOf("?")){
                    //有参数
                    script.src = url + "&callback=" + callback;
                } else {
                    script.src = url + "?callback=" + callback;
                }
                script.id = callback;
                document.head.appendChild(script);
            }
        }
    }
}

$.ajax({
    url:"http://open.duyiedu.com/api/student/findAll?appkey=Drama67_1602512135000",
    type: "get",
    dataType: "jsonp",
    success(res) {
        console.log(res);
    }
})

//封装ajax
// let xml = new XMLHttpRequest();
// xml.open("请求方法","请求地址");
// xml.setRequestHeader("Content-Type","application/json");
// xml.send();
// xml.onreadystatechange = function() {
//     if(xml.readyState === 4 && xml.status === 200) {
//         let data = xml.responseText;
//         console.log(data);
//     }
// }

//jsonp
// function jsonp(url) {
//     let script = document.createElement("script");
//     script.src = url;
//     document.body.appendChild(script);
//     script.onload = function() {
//         script.remove();
//     }
// }

// function callback(data) {
//     console.log(data);
// }