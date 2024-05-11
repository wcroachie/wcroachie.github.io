if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  /* create an upload element to use for uploading any files for this session with the upload() method below*/
  /**
   * https://stackoverflow.com/a/47665517
   * - to work on mobile safari:
   * - input must be part of the DOM
   * - must use event listener, not onchange
   **/
  var uploader = document.createElement("input");

  uploader.type = "file";
  uploader.style.display = "none";
  uploader.onclick = function(e){ return e.stopImmediatePropagation() };
  document.documentElement.appendChild( uploader );

  esx.upload = function( options ){

    var _this = this;

    if( "multiple" in options ){
      uploader.multiple = options.multiple;
    }

    if( "accept" in options ){
      uploader.accept = options.accept;
    }

    var resolve, reject;

    /* use the event handler instead of an event listener to override any old pending event listeners */
    uploader.oninput = function(e){
      
      delete uploader.oninput;
      delete uploader.multiple;
      delete uploader.accept;

      if( uploader.multiple ){

        var files = [];

        for( var i=0; i<e.target.files.length; i++ ){
          _this.push( files, e.target.files[i] );
        }
        
        try{
          resolve( files );
        }catch(e){
          reject(e);
        }
        
      }else{

        try{
          resolve( e.target.files[0] );
        }catch(e){
          reject(e);
        }
        
      }

    };

    uploader.click();

    return new this.PromiseLike(function(res,rej){
      resolve = res;
      reject = rej;
    });

  };

}()