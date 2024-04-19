!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  esx.PromiseLike = function( callback ){

    var resolveCallback, rejectCallback;

    this["then"] = function( cb ){
      resolveCallback = cb;
      return this;
    };

    this["catch"] = function( cb ){
      rejectCallback = cb;
      return this;
    };

    var errored = false;

    function resolve( val ){
      if( !errored ){
        resolveCallback( val );
      }
    }

    function reject( val ){
      if( !errored ){
        errored = true;
        rejectCallback( val );
      }
    }

    callback( resolve, reject );

  };

}()