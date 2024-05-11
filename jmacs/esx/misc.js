if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";

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
        typeof resolveCallback === "function" && resolveCallback( val );
      }
    }

    function reject( val ){
      if( !errored ){
        errored = true;
        typeof rejectCallback === "function" ? rejectCallback( val ) : console.error("unhandled promiselike rejection: ",val);
      }
    }

    /* needs to be at least 1 event cycle to run then and catch, otherwise throws an error! */
    esx.setTimeout(function(){
      callback( resolve, reject );
    });

  };


  esx.ms2hhmmssmmm = function( ms ){

    var neg = false;
  
    ms *= 1;
    
    if( !this.isFinite(ms) ){
      throw "the argument 'ms' must be either absent, falsy, or a value that is coerced to a finite Number when multiplied by 1";
    }
  
    if( ms < 0 ){
      neg = true;
      ms = ms * -1;
    }
  
    /**
     * do not use bitwise operators on high
     * numbers in javascript, use Math.floor
     * instead
     **/
  
    var
      mx = Math.floor( ms % 1000 ) + "",
      s = Math.floor( (ms/1000) % 60 ) + "",
      m = Math.floor( (ms/(1000*60)) % 60 ) + "",
      h = Math.floor( (ms/(1000*60*60)) ) + ""
    ;
  
    h = this.padStart( h, 2, "0" );
    m = this.padStart( m, 2, "0" );
    s = this.padStart( s, 2, "0" );
    mx = this.padStart( mx, 3, "0" );
  
    return ( neg ? "-" : "" ) + h + ":" + m + ":" + s + "." + mx;
  
  };


  esx.humanReadableDuration = function( ms ){
    var str = this.ms2hhmmssmmm( ms );
    var mx = this.pop( this.splitAtCh( str, ".", true ) );
    var beforeMx = this.slice( str, 0, -mx.length - 1 );
    var values = this.splitAtCh( beforeMx, ":", true );
    this.push( values, mx );
    values = this.map( values, function(e,n,a){
      return e * 1;
    });
    return (
      ( values[0] ? (values[0] + " hours, ") : "" )
      +
      ( values[1] ? (values[1] + " minutes, and ") : "" )
      +
      values[2] + " seconds"
    );
  };

  esx.humanReadableSize = function( value, useMetric ){
    if( useMetric ){
      return (
        value < 1000 ? value + " bytes" :
        value < 1000000 ? ( Math.round((value/1000)*100)/100 ) + " kB" : 
        value < 1000000000 ? ( Math.round((value/1000000)*100)/100 ) + " mB" :
        ( Math.round((value/1000000000 )*100)/100 ) + " gB"
      );
    }else{
      return (
        value < 1024 ? value + " bytes" :
        value < 1048576 ? ( Math.round((value/1024)*100)/100 ) + " kiB" :
        value < 1073741824 ? ( Math.round((value/1048576)*100)/100 ) + " miB" :
        ( Math.round((value/1073741824 )*100)/100 ) + " giB"
      );
    }
  };



  /* blocks the thread it is executed in for n ms */
  /* ms must be either falsy or coerced to be a number */
  esx.sleep = function( ms ){
    ms = ms || 0;
    ms *= 1;
    if( !this.isFinite(ms) ){
      throw "the argument 'ms' must be either absent, falsy, or a value that is coerced to a finite Number when multiplied by 1";
    }
    var start = Date.now();
    for( ;; ){
      if( Date.now() > (start + ms) ){
        return;
      }
    }
  };

  /* gets a unique date */
  esx.getUniqueDate = function(){
    this.sleep();
    return new Date();
  };


  esx.when = function( conditionCallback, intervalInMs ){
    if( typeof intervalInMs === "undefined" ){
      intervalInMs = 0;
    }
    var _this = this;
    return new this.PromiseLike(function(res,rej){
      !function wait(){
        if( conditionCallback() ){
          res();
        }else{
          _this.setTimeout( wait, intervalInMs );
        }
      }();
    })
  }

  /* evaluates globally, circumvents call stack */
  // esx.evalFromJSUrl = function( str ){
  //   var _this = this;
  //   return new this.PromiseLike(function(res,rej){
  //     var id = _this.randomId();
  //     var a = document.createElement("a");
  //     a.href = "javascript:void(" + _this.encodeURIComponent( "window['" + id + "'] = " + str + ")" );
  //     _this.when( function(){ return id in window } ).then( function(){
  //       var result = window[id];
  //       delete window[id];
  //       res( result );
  //     });
  //     a.click();
  //   });
  // };



  esx.makeFileLike = function( datas, name, options ){

    var fileLike;

    try{

      fileLike = new File( datas, name, options );

    }catch(e){

      /* doesnt support File constructor, probably ie */
      console.warn( e, "could not create File, trying to create Blob with name instead..." );

      fileLike = new Blob( datas, options );

      fileLike.name = name;

      if( "lastModified" in options ){
        
        var lastModified = options.lastModified;
        
        lastModified *= 1;
        
        if( !this.isFinite(lastModified) ){
          lastModified = 0;
        }
        
        if( fileLike.lastModified !== lastModified ){
          fileLike.lastModified = lastModified;
        }

      }

    }
    
    return fileLike;

  };




  




  

  esx.ui82bytes = function( ui8 ){
    var byteArr = [];
    var i;
    for( i=0; i<ui8.length; i++ ){
      this.push( byteArr, ui8[i] );
    }
    return byteArr;
  };

  esx.buf2bytes = function( buf ){
    var ui8 = new Uint8Array( buf );
    return this.ui82bytes( ui8 );
  };


  /**
   * 
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Sending_and_Receiving_Binary_Data
   * https://web.archive.org/web/20071103070418/http://mgran.blogspot.com/2006/08/downloading-binary-streams-with.html
   * 
   **/
  esx.url2bytes = function( url ){
    
    var xhr = new XMLHttpRequest();

    xhr.open( "GET", url, false );
    xhr.overrideMimeType("text/plain; charset=x-user-defined");
    xhr.send();
    
    var resp = xhr.response;
    var byteArr = [];

    var i, code, byte;
    for( i=0; i<resp.length; i++ ){
      code = resp.charCodeAt( i );
      byte = code & 0xff;
      this.push( byteArr, byte );
    }

    return byteArr;

  };



  esx.blob2bytes = function( blob ){
    var url = this.createObjectURL( blob );
    var byteArr = this.url2bytes( url );
    this.revokeObjectURL( blob );
    return byteArr;
  };


  esx.bytes2b64 = function( byteArr ){
    var bin = "";
    var i;
    for( i=0; i<byteArr.length; i++ ){
      bin += String.fromCharCode( byteArr[i] );
    }
    var b64 = this.btoa( bin );
    return b64;
  };

  esx.bytes2dataurl = function( byteArr, type ){
    if( typeof type === "undefined" ){
      type = "application/octet-stream";
    }
    var b64 = this.bytes2b64( byteArr );
    return "data:" + type + ";base64," + b64;
  };

  esx.blob2dataurl = function( blob ){
    var byteArr = this.blob2bytes( blob );
    var type = blob.type;
    var dataurl = this.bytes2dataurl( byteArr, type );
    return dataurl;
  };




  esx.blob2dataurlAsync = function( blob ){

    var reader = new FileReader();

    var handle = {
      onprogress : null,
      onload : null,
      abort : function(){
        reader.abort()
      }
    };
    
    reader.onerror = function(e){
      var err = e.target.error || "file reader error";
      throw err;
    };

    reader.onprogress = function(e){
      if( typeof handle.onprogress === "function" ){
        var loaded = e.loaded || 0;
        var total = e.total || Infinity;
        handle.onprogress({
          loaded : loaded,
          total : total
        });
      }
    };

    reader.onload = function(e){
      if( typeof handle.onload === "function" ){
        handle.onload( e.target.result );
      }
    };

    reader.readAsDataURL( blob );

    return handle;

  };




  esx.url2bytesAsync = function( url ){

    var _this = this;

    var xhr = new XMLHttpRequest();

    var handle = {
      onprogress : null,
      onload : null,
      abort : function(){
        xhr.abort()
      }
    };

    xhr.onerror = function(e){
      var status = e.target.status;
      throw "xhr error, http status " + status + ". error requesting content from " + url;
    };

    xhr.onprogress = function(e){
      if( typeof handle.onprogress === "function" ){
        var loaded = e.loaded || 0;
        var total = e.total || Infinity;
        handle.onprogress({
          loaded : loaded,
          total : total
        });
      }
    };

    xhr.onload = function(e){
      if( typeof handle.onload === "function" ){
        var buf = e.target.response;
        var byteArr = _this.buf2bytes( buf );
        handle.onload( byteArr );
      }
    };

    xhr.open( "GET", url, true );
    xhr.responseType = "arraybuffer";
    xhr.send();

    return handle;

  };




  esx.blob2bytesAsync = function( blob ){

    var _this = this;

    var reader = new FileReader();

    var handle = {
      onprogress : null,
      onload : null,
      abort : function(){
        reader.abort()
      }
    };
    
    reader.onerror = function(e){
      var err = e.target.error || "file reader error";
      throw err;
    };

    reader.onprogress = function(e){
      if( typeof handle.onprogress === "function" ){
        var loaded = e.loaded || 0;
        var total = e.total || Infinity;
        handle.onprogress({
          loaded : loaded,
          total : total
        });
      }
    };

    reader.onload = function(e){
      if( typeof handle.onload === "function" ){
        var buf = e.target.result;
        var byteArr = _this.buf2bytes( buf );
        handle.onload( byteArr );
      }
    };

    reader.readAsArrayBuffer( blob );

    return handle;

  };




}()