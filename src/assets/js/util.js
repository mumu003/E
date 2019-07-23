var compare = function (prop) {
    

    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if(prop=='gmtModified')
        {
           val1=new Date(val1).getTime();
           val2=new Date(val2).getTime();
          
        }
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
}
var compare1 = function (prop) {
    

    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if(prop=='gmtModified')
        {
           val1=new Date(val1).getTime();
           val2=new Date(val2).getTime();
          
        }
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 

}
// 处理检索时间
function getcreatedTime(createdTime,beginTime,endTime) {
    // Array [ "2019-07-20", "2019-08-14" ]
    beginTime=createdTime[0]
    endTime=createdTime[1]
    var a='00:00:00'
    var b='23:59:59'
    beginTime=beginTime+" "+a
    endTime=endTime+" "+b
    return{
        beginTime,
        endTime
    }
  }





export default{
    compare,
    compare1,
    getcreatedTime
}