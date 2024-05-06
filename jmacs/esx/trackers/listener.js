if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  
  "use strict";
  
  esx.EVENT_LISTENER_REGISTRY = [];
  esx.MAX_SAFE_EVENT_LISTENERS = 16;

  esx.addEventListener = function( target, type, handler ){
    if( this.EVENT_LISTENER_REGISTRY.length === this.MAX_SAFE_EVENT_LISTENERS ){
      throw "cannot safely add event listener due to insufficient memory";
    }
    var obj = {
      target : target,
      type : type,
      handler : handler
    };
    this.push( this.EVENT_LISTENER_REGISTRY, obj );
    return target.addEventListener( type, handler );
  };


  esx.removeEventListener = function( target, type, handler ){
    var i, obj;
    var before, after;
    for( i=0; i<this.EVENT_LISTENER_REGISTRY.length; i++ ){
      obj = this.EVENT_LISTENER_REGISTRY[i];
      if(
        obj.target === target &&
        obj.type === type &&
        obj.handler === handler
      ){
        before = this.slice( this.EVENT_LISTENER_REGISTRY, 0, i );
        after = this.slice( this.EVENT_LISTENER_REGISTRY, i + 1 );
        this.EVENT_LISTENER_REGISTRY = this.concat( before, after );

        /* only remove one! so break here. */
        break;
      }
    }
    return target.removeEventListener( type, handler );
  };


}()