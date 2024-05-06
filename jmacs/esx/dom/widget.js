if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";



  /* src is the src of the iframe relative to the top window */
  /* promise only resolves when iframe loads */
  esx.makeSubframe = function( src ){

    /* get a unique date */
    var now = Date.now();
    for( ;; ){
      if( Date.now() > now ){
        break;
      }
    }

    var id = "_-" + Date.now();
    var iframe = document.createElement("iframe");

    // var iframe = wrapper.appendChild( document.createElement("iframe") );
    // var style = document.documentElement.appendChild( document.createElement("style") );

    // var iframeLoaded = false;
    // wrapper.id = wrapperId;

    // style.textContent = ""
    //   + "#" + wrapperId + "{"
    //   +   "position:fixed;"
    //   +   "display:block;"
    //   +   "left:0;"
    //   +   "top:0;"
    //   +   "width:300px;"
    //   +   "height:150px;"
    //   +   "box-sizing:border-box;"
    //   +   "border:1px solid;"
    //   + "}"
    //   + "#" + wrapperId + " > iframe{"
    //   +   "position:absolute;"
    //   +   "display:block;"
    //   +   "left:0;"
    //   +   "top:0;"
    //   +   "width:100%;"
    //   +   "height:100%;"
    //   +   "box-sizing:border-box;"
    //   +   "border:1px solid;"
    //   + "}"
    // ;
    
    // function handler(e){
    //   if( iframe.isConnected && iframe.contentWindow && e.source === iframe.contentWindow ){
    //     if( !iframeLoaded ){
    //       iframeLoaded = true;
    //       console.info("iframe loaded");
    //     }else{
    //       console.log( e.data + "" );
    //       console.log( eval( e.data ) );
    //     }
    //   }
    // }

    // // esx.setTimeout(function(){
    // //   if( !iframeLoaded ){
    //   //     console.warn("iframe load timed out");
    //   //     iframeLoaded = true;
    //   //     esx.removeEventListener(window,"message",handler);
    //   //   }
    //   // },2000);
    // esx.addEventListener(window,"message",handler);

    // iframe.src = src;

  };

}()