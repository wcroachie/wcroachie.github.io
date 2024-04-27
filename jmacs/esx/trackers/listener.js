if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";
  
  esx.EVENT_LISTENER_REGISTRY = [];
  esx.ACTIVE_EVENT_LISTENERS_LIMIT = 256;

  esx.addEventListener = function( target, type, handler ){
    
    if( this.EVENT_LISTENER_REGISTRY.length === this.ACTIVE_EVENT_LISTENERS_LIMIT ){
      throw "cannot safely add event listener due to insufficient memory";
    }

    var obj = {
      target : target,
      type : type,
      handler : handler
    };

    this.push( this.EVENT_LISTENER_REGISTRY, [obj] );

    return target.addEventListener( type, handler );

  };

  esx.removeEventListener = function( target, type, handler ){

    for( var i=0; i<this.EVENT_LISTENER_REGISTRY.length; i++ ){
      var obj = this.EVENT_LISTENER_REGISTRY[i];
      if(
        obj.target === target &&
        obj.type === type &&
        obj.handler === handler
      ){
        this.EVENT_LISTENER_REGISTRY[i] = null;
        this.EVENT_LISTENER_REGISTRY = this.filter( this.EVENT_LISTENER_REGISTRY, function(e,n,a){
          return e !== null
        });
        /* only remove one! so break here. */
        break;
      }
    }

    return target.removeEventListener( type, handler );

  };

}()