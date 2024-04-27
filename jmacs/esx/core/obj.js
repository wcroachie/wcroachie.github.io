if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  esx.shallowCopyObj = function( obj ){
    var obj2 = {};
    for( var key in obj ){
      obj2[key] = obj[key];
    }
    return obj2;
  };

}()