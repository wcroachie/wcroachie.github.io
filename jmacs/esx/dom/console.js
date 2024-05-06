if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";
  
  /* get a unique date */
  var now = Date.now();
  for( ;; ){
    if( Date.now() > now ){
      break;
    }
  }
  var wrapperId = "_-" + Date.now();

  /**
   * dont add it to the dom yet. need to wait a little
   * before adding it to DOM in case we are using nocache.js
   * to interrupt parser
   **/
  var wrapper = document.createElement("div");
  var iframe = wrapper.appendChild( document.createElement("iframe") );
  var style = document.documentElement.appendChild( document.createElement("style") );

  var iframeLoaded = false;

  iframe.src = "esx/dom/console.html";

  wrapper.id = wrapperId;

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
    +   "background-color:lightgray;"
    +   "border-radius:15px;"
    // +   "box-shadow:0 0 10px black;"
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
    +   "border:1px solid;"
    +   "border-radius:10px;"
    + "}"
    + ""
    + "#" + wrapperId + "[data-dragging]{"
    +   "opacity:0.5;"
    + "}"
  ;

  esx.addEventListener(window,"message",handler);

  function handler(e){
    if( iframe.isConnected && iframe.contentWindow && e.source === iframe.contentWindow ){
      if( !iframeLoaded ){
        iframeLoaded = true;
        console.info("iframe loaded");
      }else{
        console.log( e.data + "" );
        console.log( eval( e.data ) );
      }
    }
  }

  esx.setTimeout(function(){
    if( !iframeLoaded ){
      console.warn("iframe load timed out");
      iframeLoaded = true;
      esx.removeEventListener(window,"message",handler);
    }
  },2000);
  
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

  var queue = [];

  var linesToTakeOff = esx.split( esx.GLOBAL_SCOPE_ERROR_STACK, "\n" ).length;

  function addEntry( args, className ){
    var div = document.createElement("div");
    div.classList.add( className );
    var stack = esx.generateStackTrace();
    stack = esx.split( stack, "\n" );
    var lineToGet = stack[ linesToTakeOff + 2 ] || "";
    var line = esx.parseStackLine( lineToGet );
    div.textContent += line.filename + ":" + line.lineno + ":" + line.colno + " > ";
    if( args.length > 1 ){
      var i;
      for( i=0; i<args.length; i++ ){
        div.textContent += "\n  " + args[i];
      }
    }else{
      div.textContent += args[0];
    }
    esx.push( queue, div.outerHTML );
  }

  onerror = function(){
    var message = arguments[0];
    var source = arguments[1];
    var lineno = arguments[2];
    var colno = arguments[3];
    var error = arguments[4] || {};
    var obj = {
      message : message,
      source : source,
      lineno : lineno,
      colno : colno,
      error : error instanceof DOMException ? esx.cloneException( error ) : esx.cloneError( error )
    };
    console.error( JSON.stringify(obj,null,"  ") + "\nstack:\n\n" + (obj.error || {}).stack );
  };

  // wrapper.style.width = "512px";
  // wrapper.style.height = "512px";
  wrapper.style.maxWidth = "100%";
  wrapper.style.maxHeight = "100%";
  

  document.documentElement.appendChild( wrapper );

  /* every frame, check and empty the queue */
  /**
   * @todo - also send data for esx.blob memory and event handlers status etc
   * @todo - also send data for esx.blob memory and event handlers status etc
   * @todo - also send data for esx.blob memory and event handlers status etc
   * @todo - also send data for esx.blob memory and event handlers status etc
   * @todo - also send data for esx.blob memory and event handlers status etc
   */




  esx.setInterval( function(){
    
    if( iframeLoaded ){

      var msg;
      while( queue.length ){
        msg = esx.shift( queue );
        iframe.contentWindow.postMessage( msg, "*" );
      }

    }

  }, Math.floor(1000/60) );


  
  esx.when(function(){
    return typeof esx.makeDraggable === "function" 
  }).then(function(){
    /* update the wrapper's position at 60 fps */
    esx.makeDraggable( wrapper, Math.floor(1000/60) );
    var testdiv = document.body.appendChild( document.createElement("div") );
    testdiv.style.position = "absolute";
    testdiv.style.display = "block";
    testdiv.style.width = "100px";
    testdiv.style.height = "100px";
    testdiv.style.backgroundColor = "gray";
    esx.makeDraggable( testdiv );
  });

  
  esx.when(function(){ return iframeLoaded }).then(function(){
    iframe.contentWindow.postMessage({"add-link":esx.getLocalParentPath() + "style/font/necap3/init.css"},"*");
    esx.when(function(){ return "NEED_TIMES_NEW_ROMAN" in esx }).then(function(){
      if( esx.NEED_TIMES_NEW_ROMAN ){
        iframe.contentWindow.postMessage({"add-link":esx.getLocalParentPath() + "style/font/timesnr/init.css"},"*");
      }
    });
  });

}()