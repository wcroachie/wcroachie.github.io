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
        // script.remove();
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

      var stacks = {};
      var counter = 0;

      _this.when( function(){
        return counter === 14
      }).then( function(){
        res( stacks )
      });

      stacks["from a normal script"] = _this.generateStackTrace();
      counter ++;

      typeof Promise === "function" ? new Promise(function(res,rej){
        stacks["from inside a promise callback"] = _this.generateStackTrace();
        counter ++;
      }) : function(){
        stacks["from inside a promise callback"] = null;
        counter ++;
      }();
        
      if( typeof eval === "function" ){
        stacks["from inside eval"] = eval("_this.generateStackTrace()");
        stacks["from inside nested eval"] = eval("eval('_this.generateStackTrace()')");
        stacks["from inside double nested eval"] = eval("eval('eval(\"_this.generateStackTrace()\")')");
      }else{
        stacks["from inside eval"] = null;
        stacks["from inside nested eval"] = null;
        stacks["from inside double nested eval"] = null;
      }

      counter += 3;

      if( typeof Function === "function" ){
        stacks["from a Function constructor"] = new Function("return (" + _this.generateStackTrace + ")()" )();
      }else{
        try{
          stacks["from a Function constructor"] = (function(){}).constructor("return (" + _this.generateStackTrace + ")()")();
        }catch(e){
          console.warn(e);
          stacks["from a Function constructor"] = null;
        }
      }

      counter ++;

      _this.evalFromJSUrl( "(" + _this.generateStackTrace + ")()" ).then(function(result){
        stacks["from inside a javascript: url"] = result;
        counter ++;
      });

      var script = document.createElement("script");
      var id = _this.randomId();
      script.textContent = "window['" + id + "'] = (" + _this.generateStackTrace + ")()";
      document.documentElement.appendChild( script );

      _this.when(function(){ return id in window }).then(function(){
        // script.remove();
        script.parentElement.removeChild( script );
        stacks["from an inline script"] = window[id];
        delete window[id];
        counter++;

        id = _this.randomId();
        var scriptCode = "window['" + id + "'] = ( " + _this.generateStackTrace + " )()";

        var utf8DataUrl = "data:text/javascript;utf-8," + _this.encodeURIComponent( scriptCode );
        var base64DataUrl = "data:text/javascript;base64," + _this.btoa( scriptCode );
        var blobUrl = URL.createObjectURL( new Blob([scriptCode],{type:"text/javascript"}));

        var utf8DataUrlHandled = false;
        var base64DataUrlHandled = false;
        var blobUrlHandled = false;

        _this.runScript( utf8DataUrl ).then(function(){
          stacks["from a utf-8 dataurl script"] = window[id];
          delete window[id];
          counter++;
          utf8DataUrlHandled = true;
        }).catch(function(e){
          console.warn(e);
          stacks["from a utf-8 dataurl script"] = null;
          counter++;
          utf8DataUrlHandled = true;
        });

        _this.when(function(){return utf8DataUrlHandled}).then(function(){
          _this.runScript( base64DataUrl ).then(function(){
            stacks["from a base-64 dataurl script"] = window[id];
            delete window[id];
            counter++;
            base64DataUrlHandled = true;
          }).catch(function(e){
            console.warn(e);
            stacks["from a base-64 dataurl script"] = null;
            counter++;
            base64DataUrlHandled = true;
          });
        });

        _this.when(function(){return base64DataUrlHandled}).then(function(){
          _this.runScript( blobUrl ).then(function(){
            stacks["from a bloburl script"] = window[id];
            delete window[id];
            counter++;
            URL.revokeObjectURL( blobUrl );
            blobUrlHandled = true;
          }).catch(function(e){
            console.warn(e);
            stacks["from a bloburl script"] = null;
            counter++;
            URL.revokeObjectURL( blobUrl );
            blobUrlHandled = true;
          });
        });

        _this.when(function(){return blobUrlHandled}).then(function(){

          if( typeof Worker !== "function" ){
            console.warn("environment does not support Worker constructor");
            stacks["from a utf-8 dataurl worker"] = null;
            stacks["from a base-64 dataurl worker"] = null;
            stacks["from a bloburl worker"] = null;
            counter += 3;
            return;
          }

          scriptCode = "postMessage( (" + _this.generateStackTrace + ")() )";
          utf8DataUrl = "data:text/javascript;utf-8," + _this.encodeURIComponent( scriptCode );
          base64DataUrl = "data:text/javascript;base64," + _this.btoa( scriptCode );
          blobUrl = URL.createObjectURL( new Blob([scriptCode],{type:"text/javascript"}));

          var worker;

          try{
            worker = new Worker( utf8DataUrl );
          }catch(e){
            console.warn(e);
            worker = {terminate:function(){}};
            setTimeout( function(){ worker.onmessage({data:null}) } );
          }

          worker.onmessage = function(e){
            stacks["from a utf-8 dataurl worker"] = e.data;
            worker.terminate();
            counter++;

            try{
              worker = new Worker( base64DataUrl );
            }catch(e){
              console.warn(e);
              worker = {terminate:function(){}};
              setTimeout( function(){ worker.onmessage({data:null}) } );
            }

            worker.onmessage = function(e){
              stacks["from a base-64 dataurl worker"] = e.data;
              worker.terminate();
              counter++;

              try{
                worker = new Worker( blobUrl );
              }catch(e){
                console.warn(e);
                worker = {terminate:function(){}};
                setTimeout( function(){ worker.onmessage({data:null}) } );
              }
              
              worker.onmessage = function(e){
                stacks["from a bloburl worker"] = e.data;
                worker.terminate();
                counter++;

                URL.revokeObjectURL( blobUrl );
              }
            };
          };
  
        });

      });

    });
  };



}()