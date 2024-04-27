if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  esx.runScript = function( src ){
    
    return new this.PromiseLike(function(res,rej){

      if( typeof document !== "object" ){
        
        try{
          importScripts( url );
          res();
        }catch(e){
          rej(e);
        }

        return;

      }

      var script = document.createElement("script");
      var done = false;

      function remove(){
        script.onload = null;
        script.onerror = null;
        script.parentElement.removeChild( script );
        done = true;
      }
    
      script.onload = function(){
        console.log("successfully loaded script from "+src+".");
        remove();
        res();
      };
    
      script.onerror = function(){
        remove();
        rej( "error loading script from "+src+"." );
      };
    
      /* timeout after 20 seconds */
      setTimeout( function(){
        if( !done ){
          remove();
          rej( "timeout for loading resource from "+src+"." );
        }
      }, 20000 );
    
      script.src = src;
    
      /* needs to be documentElement */
      document.documentElement.appendChild(script);

    });

  };
  
}()