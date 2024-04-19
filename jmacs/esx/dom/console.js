!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  var now = Date.now();
  for( ;; ){
    if( Date.now() > now ){
      break;
    }
  }
  var wrapperId = "_-" + Date.now();

  var wrapper = document.documentElement.appendChild( document.createElement("div") );
  wrapper.id = wrapperId;
  var iframe = wrapper.appendChild( document.createElement("iframe") );
  var style = document.head.appendChild( document.createElement("style") );
  style.textContent =
    ""
    + "#" + wrapperId + "{"
    +   "position:fixed;"
    +   "display:block;"
    +   "left:0;"
    +   "top:0;"
    +   "width:300px;"
    +   "height:150px;"
    +   "box-sizing:border-box;"
    +   "border:1px solid blue;"  
    + "}"
    + ""
    + "#" + wrapperId + " > iframe{"
    + "position:absolute;"
    +   "display:block;"
    +   "left:2px;"
    +   "top:20px;"
    +   "width:calc(100% - 4px);"
    +   "height:calc(100% - 30px);"
    +   "box-sizing:border-box;"
    +   "border:1px solid red;"
    + "}"
  ;
  
  var iframeLoaded = false;

  addEventListener("message",function(e){
    if( e.source === iframe.contentWindow ){
      if( !iframeLoaded ){
        iframeLoaded = true;
      }else{
        var value = e.data;
        console.log( value );
        console.log( this.eval(value ) )
      }
    }
  });
  
  setTimeout(function(){
    if( !iframeLoaded ){
      console.warn("iframe load timed out");
      iframeLoaded = true;
    }
  },1000);
  
  iframe.src = "esx/dom/console.html";

  /* hook console methods */
  for( var key in console ){
    !function( key ){
      var value = console[key];
      if( typeof value === "function" ){
        console[key] = function(){
          addEntry( arguments, key );
          return value.apply( this, arguments );
        };
        console["_"+key] = value;
      }
    }( key );
  }

  function addEntry( args, className ){
    var div = document.createElement("div");
    div.classList.add( className );
    div.textContent = ">" + esx.join( args, "\n" );
    if( iframeLoaded ){
      iframe.contentWindow.postMessage( div.outerHTML, "*" );
    }else{
      console._log("waiting...");
      setTimeout(function(){
        addEntry( args, className );
      })
    }
  }

  onerror = function(){
    console.error.apply( console, arguments );
  };

  addEventListener("error",function(e){
    var proto = e.__proto__;
    var clone = {};
    for( var key in proto ){
      clone[key] = e[key] + "";
    }
    console.error( e, JSON.stringify(clone,null,"  ") );
  });

  wrapper.style.width = "512px";
  wrapper.style.height = "512px";

  setTimeout( function(){

    /* update the wrapper's position at 60 fps */
    esx.makeDraggable( wrapper, Math.floor(1000/60) );

  }, 200 );


}()