!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  esx.shallowCopyObj = function( obj ){
    var obj2 = {};
    for( var key in obj ){
      obj2[key] = obj[key];
    }
    return obj2;
  };

}()