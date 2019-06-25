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
export default{
    compare
}