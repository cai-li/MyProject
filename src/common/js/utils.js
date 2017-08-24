/*
*解析url参数
*url参数：?id=12312&a=b
*返回：{id:12312,a:b}
*/
export function analyzeUrlParam(){
    let urlParam = window.location.search;
    let retObj = {}
    let reg = /[?&][^?&]+=[^?&]+/g
    let arr = urlParam.match(reg);
    if(arr){
        arr.forEach((item)=>{
            //item :'?id=12312'
            let ItemArr = item.substring(1).split('=');
            let key = decodeURIComponent(ItemArr[0]);
            let value = decodeURIComponent(ItemArr[1]);
            retObj[key] = value;
        })
    }
    
    return retObj;
}