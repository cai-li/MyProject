/*
*参数date:Thu Jul 21 2016 08:46:04 GMT+0800 (中国标准时间)
*返回：“yyyy-MM-dd hh:mm:ss”
*/
export function DateToString(date,fmt){
    if(/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1));
    }
    let o = {
        'M+':date.getMonth()+1,
        'd+':date.getDate(),
        'h+':date.getHours(),
        'm+':date.getMinutes(),
        's+':date.getSeconds()
    }
    for(let key in o){
        if(new RegExp(`(${key})`).test(fmt)){
           let str =o[key]+'';
           fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1) ? str : padLeftZero(str))
        }
    }
    return fmt
}
//低于两位补零
function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

//添加localStorage
export function saveToLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
        }
    }
    seller[id][key] = value;
    window.localStorage.__seller__ = JSON.stringify(seller);
};
//读取localStorage
export function getToLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    let userKey = value
    if (!seller) {
        return userKey
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            return userKey
        }
        userKey = seller[id][key]
    }
    return userKey


};
