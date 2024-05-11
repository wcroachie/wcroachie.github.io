if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";

  esx.shallowCopyObj = function( obj ){

    var obj2 = {};
    var key;

    for( key in obj ){
      obj2[key] = obj[key];
    }

    return obj2;

  };

  esx.getKeys = function( obj ){

    var keys = [];
    var key;
    
    for( key in obj ){
      this.push( keys, key );
    }

    return keys;

  };

  esx.getValues = function( obj ){

    var vals = [];
    var key, val;

    for( key in obj ){
      val = obj[ key ];
      this.push( vals, val );
    }

    return vals;

  };

  esx.compareObjs = function( obj0, objN ){

    if( arguments.length <= 1 ){
      return true;
    }

    var obj0Keys = this.getKeys( obj0 );
    var obj0Vals = this.getValues( obj0 );

    var i, obj, objKeys, objVals;
    for( i=1; i<arguments.length; i++ ){
      
      obj = arguments[i];

      objKeys = this.getKeys( obj );

      if( !this.compareArrsStrict( objKeys, obj0Keys ) ){
        return false
      }

      objVals = this.getValues( obj );
      
      if( !this.compareArrsStrict( objVals, obj0Vals ) ){
        return false;
      }
      
    }

    return true;

  };

}()