!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

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


}()