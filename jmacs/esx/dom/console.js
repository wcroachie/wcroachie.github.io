!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }


  var wrapper = document.documentElement.appendChild( document.createElement("div") );
  var wrapperStyle = 
      "position:fixed;"
    + "display:block;"
    + "left:0;"
    + "top:0;"
    + "width:300px;"
    + "height:150px;"
    + "box-sizing:border-box;"
    + "border:1px solid blue;"
  ;

  wrapper.style = wrapperStyle;
  wrapper.setAttribute("style", wrapperStyle ); /* ie fix */


  var iframe = wrapper.appendChild( document.createElement("iframe") );
  var iframeStyle = 
      "position:absolute;"
    + "display:block;"
    + "left:2px;"
    + "top:20px;"
    + "width:calc(100% - 4px);"
    + "height:calc(100% - 30px);"
    + "box-sizing:border-box;"
    + "border:1px solid red;"
  ;
  iframe.style = iframeStyle;
  iframe.setAttribute( "style", iframeStyle ); /* ie fix */

  iframe.src = "esx/dom/console.html";
  iframe.setAttribute("src", iframe.src);
  var iframeLoaded = false;
  
  iframe.contentWindow.addEventListener("load",function(){
    iframeLoaded = true;
  });

  setTimeout(function(){
    console.warn("iframe load timed out");
    iframeLoaded = true;
  },1000);
  



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


  setTimeout( function(){

    /* update the wrapper's position at 60 fps */
    esx.makeDraggable( wrapper, Math.floor(1000/60) );

  }, 200 );

  // var test = document.body.appendChild( document.createElement("div"));
  // test.style = "position:fixed;left:0;top:0;width:100px;height:100px;border:1px solid gray;z-index:999999999;"
  // esx.makeDraggable( test );
  // test.textContent = "akjsahflkjds"


}()