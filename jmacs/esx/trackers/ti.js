if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  
  "use strict";
  
  esx.TIMEOUT_REGISTRY = [];
  esx.MAX_SAFE_TIMEOUTS = 8;

  function unregisterTimeout( ti ){
    var i, n;
    var before, after;
    for( i=0; i<esx.TIMEOUT_REGISTRY.length; i++ ){
      n = esx.TIMEOUT_REGISTRY[i];
      if( n === ti ){
        before = esx.slice( esx.TIMEOUT_REGISTRY, 0, i );
        after = esx.slice( esx.TIMEOUT_REGISTRY, i + 1 );
        esx.TIMEOUT_REGISTRY = esx.concat( before, after );
        /* only remove 1! so break here */
        break;
      }
    }
  }

  esx.setTimeout = function( callback, delayInMs ){
    if( this.TIMEOUT_REGISTRY.length === this.MAX_SAFE_TIMEOUTS ){
      throw "cannot safely set timeout due to insufficient memory";
    }
    var ti = setTimeout( function(){
      callback();
      unregisterTimeout( ti );
    }, delayInMs );
    this.push( this.TIMEOUT_REGISTRY, ti );
    return ti;
  };

  esx.clearTimeout = function( n ){
    clearTimeout( n );
    unregisterTimeout( n );
  };
  
}()