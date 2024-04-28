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

  esx.compareObjs = function( objs ){
    if( objs.length <= 1 ){
      return true;
    }
    /* shallow copy so as not to change the original when shifting next */
    objs = this.shallowCopyArr( objs );
    var obj0 = this.shift( objs );
    var obj0Keys = [];
    var obj0Vals = [];
    for( var key in obj0 ){
      this.push( obj0Keys, [key] );
      this.push( obj0Vals, [obj0[key]] );
    }
    var obj;
    for( var i=0; i<objs.length; i++ ){
      obj = objs[i];
      var objKeys = [];
      for( var key in obj ){
        this.push( objKeys, [key] );
      }
      var sameKeys = this.compareArrs([
        obj0Keys, objKeys
      ]);
      if( !sameKeys ){
        return false;
      }
      for( var key in obj ){
        if( obj[key] !== obj0[key] ){
          return false;
        }
      }
    }
    return true;
  };

}()