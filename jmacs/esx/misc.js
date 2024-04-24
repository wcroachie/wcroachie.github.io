!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

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



  esx.ms2hhmmssmmm = function( ms ){

    var neg = false;
  
    ms = ms * 1;
  
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
    this.push( values, [mx] );
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
    ms = ms * 1;
    if( isNaN(ms) ){
      throw "the argument 'ms' must be either absent, falsy, or a value that is coerced to a valid Number when multiplied by 1";
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
    return new this.PromiseLike(function(res,rej){
      !function wait(){
        if( conditionCallback() ){
          res();
        }else{
          setTimeout( wait, intervalInMs );
        }
      }();
    })
  }

  /* evaluates globally, circumvents call stack */
  esx.evalFromJSUrl = function( str ){
    var _this = this;
    return new this.PromiseLike(function(res,rej){
      var id = _this.randomId();
      var a = document.createElement("a");
      a.href = "javascript:void(" + _this.encodeURIComponent( "window['" + id + "'] = " + str + ")" );
      _this.when( function(){ return id in window } ).then( function(){
        var result = window[id];
        delete window[id];
        res( result );
      });
      a.click();
    });
  };





  esx.generateStacks = function(){

    var _this = this;

    return new this.PromiseLike(function(res,rej){

      var id = _this.randomId();
      window[id] = {};

      /* regular */
      window[id].fromSourceScript = _this.generateStackTrace();

      /* using eval */
      window[id].fromEval = null;
      window[id].fromNestedEval = null;
      window[id].fromDoubleNestedEval = null;
      
      if( typeof eval === "function" ){
        window[id].fromEval = eval("(" + _this.generateStackTrace + ")()");
        window[id].fromNestedEval = eval( 'eval("(" + _this.generateStackTrace + ")()")' );
        window[id].fromDoubleNestedEval = eval("eval( 'eval(\"(\" + _this.generateStackTrace + \")()\")' )");
      }

      /* function constructor stuff */
      window[id].fromFunctionConstructor = null;
      window[id].fromGottenFunctionConstructor = null;

      if( typeof Function === "function" ){
        window[id].fromFunctionConstructor = new Function( "return (" + _this.generateStackTrace + ")()" )();
      }
      try{
        window[id].fromGottenFunctionConstructor = (function(){}).constructor("return (" + _this.generateStackTrace + ")()")()
      }catch(e){
        console.warn(e);
      }

      /* from a promise (async) */
      window[id].fromPromiseCallback = null;
      typeof Promise === "function" && new Promise(function(_res,_rej){
        window[id].fromPromiseCallback = _this.generateStackTrace();
        // res( window[id] );
      }).catch(function(e){
        console.warn(e);
      });


      /* from js url (async) */
      window[id].fromJsUrl = null;
      _this.evalFromJSUrl( "(" + _this.generateStackTrace + ")()" ).then(function(result){
        window[id].fromJsUrl = result;
      }).catch(function(e){
        console.warn(e);
      });

      function generateInlineScriptCode(key){
        return "window['" + id + "']['" + key + "'] = ( " + _this.generateStackTrace + " )()";
      }

      function generateWorkerCode(key){
        return "postMessage( { key : '" + key  + "', value : ( " + _this.generateStackTrace + " )() } )";
      }

      window[id].fromInlineScript = null;
      window[id].fromInlineScriptUtf8DataUrl = null;
      window[id].fromInlineScriptBase64DataUrl = null;
      window[id].fromInlineScriptBlobUrl = null;

      var script = document.createElement("script");
      script.textContent = generateInlineScriptCode("fromInlineScript");
      document.documentElement.appendChild( script );

      setTimeout(function(){
        script.parentElement.removeChild( script );
      });

      var inlineScriptUtf8DataUrl = "data:text/javascript;charset=utf-8," + _this.encodeURIComponent( generateInlineScriptCode("fromInlineScriptUtf8DataUrl") );
      var inlineScriptBase64DataUrl = "data:text/javascript;base64," + _this.btoa( generateInlineScriptCode("fromInlineScriptBase64DataUrl") );

      _this.runScript( inlineScriptUtf8DataUrl ).then(function(){
      }).catch(function(e){
        console.warn(e);
      });

      _this.runScript( inlineScriptBase64DataUrl ).then(function(){
      }).catch(function(e){
        console.warn(e);
      });

      try{
        var inlineScriptBlobUrl = URL.createObjectURL( new Blob([ generateInlineScriptCode("fromInlineScriptBlobUrl") ],{type:"text/javascript"}) );
        _this.runScript( inlineScriptBlobUrl ).then(function(){
          URL.revokeObjectURL( inlineScriptBlobUrl );
        }).catch(function(e){
          URL.revokeObjectURL( inlineScriptBlobUrl );
          console.warn(e);
        })
      }catch(e){
        try{
          URL.revokeObjectURL( inlineScriptBlobUrl );
        }catch(e){
          console.warn(e);
        }
        console.warn(e);
      }




      window[id].fromWorkerUtf8DataUrl = null;
      window[id].fromWorkerBase64DataUrl = null;
      window[id].fromWorkerBlobUrl = null;

      if( typeof Worker === "function" ){
        
        function generateWorkerCode(key){
          return "postMessage( { key : '" + key  + "', value : ( " + _this.generateStackTrace + " )() } )";
        }

        var workerUtf8DataUrl = "data:text/javascript;charset=utf-8," + _this.encodeURIComponent( generateWorkerCode("fromInlineScriptUtf8DataUrl") );
        var workerBase64DataUrl = "data:text/javascript;base64," + _this.btoa( generateWorkerCode("fromInlineScriptBase64DataUrl") );

        function onmessage(e){
          e.target.terminate();
          var key = e.data.key;
          var val = e.data.value;
          window[id][key] = val;
        }

        function onexception(e){
          e.target.terminate();
          console.warn(e);
        }

        var workerA = new Worker( workerUtf8DataUrl );
        var workerB = new Worker( workerBase64DataUrl );

        workerA.onmessage = onmessage;
        workerA.onerror = onexception;
        workerA.onmessageerror = onexception;

        workerB.onmessage = onmessage;
        workerB.onerror = onexception;
        workerB.onmessageerror = onexception;

        try{
          var workerBlobUrl = URL.createObjectURL( new Blob([ generateWorkerCode("fromWorkerBlobUrl") ],{type:"text/javascript"}) );
          var workerC = new Worker( workerBlobUrl );
          workerC.onmessage = onmessage;
          workerC.onerror = onexception;
          workerC.onmessageerror = onexception;
        }catch(e){
          try{
            URL.revokeObjectURL( workerBlobUrl );
          }catch(e){
            console.warn(e);
          }
          console.warn(e);
        }

      }




      setTimeout(function(){
        res( window[id] );
      },1000);

    });
  };



}()