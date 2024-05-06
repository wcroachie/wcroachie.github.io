if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  
  "use strict";
  
  esx.INTERVAL_REGISTRY = [];
  esx.MAX_SAFE_INTERVALS = 8;

  function unregisterInterval( iv ){
    var i, n;
    var before, after;
    for( i=0; i<esx.INTERVAL_REGISTRY.length; i++ ){
      n = esx.INTERVAL_REGISTRY[i];
      if( n === iv ){
        before = esx.slice( esx.INTERVAL_REGISTRY, 0, i );
        after = esx.slice( esx.INTERVAL_REGISTRY, i + 1 );
        esx.INTERVAL_REGISTRY = esx.concat( before, after );
        /* only remove 1! so break here */
        break;
      }
    }
  }

  esx.setInterval = function( func, delayInMs ){
    if( this.INTERVAL_REGISTRY.length === this.MAX_SAFE_INTERVALS ){
      throw "cannot safely set interval due to insufficient memory";
    }
    var iv = setInterval( func, delayInMs );
    this.push( this.INTERVAL_REGISTRY, iv );
    return iv;
  };

  esx.clearInterval = function( iv ){
    unregisterInterval( iv );
    clearInterval( iv );
  };

}()