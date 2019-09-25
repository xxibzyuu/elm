export function formatDate(date,fmt){
	// 以y开头，一个或多个y
	if (/(y+)/.test(fmt)) {
		// RegExp.$1匹配了y+,为4个y，再替换为字符串
		fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
	}
	let o = {
		'M+':date.getMonth()+1,
		'd+':date.getDay(),
		'h+':date.getHours(),
		'm+':date.getMinutes(),
		's+':date.getSeconds()
	};
	for(let k in o){
		// 将对象构造成正则表达式
		if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1) ? str : padLeftZero(str))
		} else{
			
		}
	}
	return fmt;
}

function padLeftZero(str){
	return('00'+str).substr(str.length);
}