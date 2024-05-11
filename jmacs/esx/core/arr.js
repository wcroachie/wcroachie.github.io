if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";


  esx.shallowCopyArr = function( arr ){

    if( arr instanceof Array === false ){
      throw "arg must be instanceof Array"
    }
  
    var arr2 = [];

    var i;
    for( i=0; i<arr.length; i++ ){
      if( i in arr ){ /* only define non-empty slots */
        arr2[i] = arr[i];
      }
    }
  
    return arr2;
  
  };


  esx.indexOf = function( arr, item ){

    if( typeof arr === "string" ){
      throw "if looking for index in a string, please use String.indexOf"
    }
    
    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var index = -1;
    
    var i;
    for( i=0; i<arr.length; i++ ){
      if( arr[i] === item ){
        index = i;
        break;
      }
    }

    return index;

  };


  esx.pop = function( arr ){

    if( arr instanceof Array === false ){
      throw "arg must be instanceof Array"
    }

    var item = arr[arr.length - 1];

    delete arr[arr.length - 1];
    arr.length = Math.max( arr.length - 1, 0 );

    return item;

  };
  

  esx.shift = function( arr ){

    if( arr instanceof Array === false ){
      throw "arg must be instanceof Array"
    }

    var item = arr[0];

    var i;
    for( i=0; i<arr.length; i++ ){
      arr[i] = arr[i+1];
    }

    delete arr[arr.length - 1];
    arr.length = Math.max( arr.length - 1, 0 );
    
    return item;

  };

  


  esx.push = function( arr, itemN ){

    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var i, item;
    for( i=1; i<arguments.length; i++ ){
      item = arguments[i];
      arr[ arr.length ] = item;
    }

    return arr.length;

  };



  esx.unshift = function( arr, itemN ){

    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var offset = arguments.length-1;

    var i;
    for( i=arr.length+offset-1; i>=0; i-- ){
      arr[i] = arr[i - offset];
    }

    for( i=0; i<offset; i++ ){
      arr[i] = arguments[i+1];
    }

    return arr.length;

  };




  

  esx.compareArrsStrict = function( arr0, arrN ){

    if( arguments.length <= 1 ){
      return true;
    }

    var i, arr, j;

    /* first check to make sure all args are arrays, and throw early if not */
    for( i=0; i<arguments.length; i++ ){
      arr = arguments[i];
      if( arr instanceof Array === false ){
        throw "all args must be instanceof Array"
      }
    }

    /* now actually begin comparing */
    for( i=1; i<arguments.length; i++ ){
      if( arr === arr0 ){
        continue;
      }
      if( arr.length !== arr0.length ){
        return false;
      }
      for( j=0; j<arr0.length; j++ ){
        /* undefined vs empty slot */
        if( (j in arr) !== (j in arr0) ){
          return false;
        }
        /* okay, actually compare the value */
        if( arr[j] !== arr0[j] ){
          return false;
        }
      }
    }

  };




  /* break an array into chunks equal to maxChunkLength or less and greater than zero */
  esx.chunk = function( arr, maxChunkLength ){

    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var chunks = [[]];
    var counter = 0;

    var i;
    for( i=0; i<arr.length; i++ ){
      this.push( chunks[chunks.length - 1], arr[i] );
      counter ++;
      if( counter === maxChunkLength ){
        this.push( chunks, [] );
        counter = 0;
      }
    }

    /* if last chunk length is 0, pop it off */
    if( !chunks[chunks.length-1].length ){
      this.pop( chunks );
    }

    return chunks;

  };



  /* concatenate 2 or more arrays. returns a new array */
  esx.concat = function( arrN ){

    var out = [];

    var i, arr, j, item;

    /* first check to make sure all args are arrays, and throw early if not */
    for( i=0; i<arguments.length; i++ ){
      arr = arguments[i];
      if( arr instanceof Array === false ){
        throw "all args must be instanceof Array"
      }
    }

    for( i=0; i<arguments.length; i++ ){
      arr = arguments[i];
      for( j=0; j<arr.length; j++ ){
        item = arr[j];
        this.push( out, item );
      }
    }

    return out;

  };


  /* combine an array of arrays into a single array (like concat but uses a single arg for convenience). returns a new array. */
  esx.combine = function( arrs ){

    if( arrs instanceof Array === false ){
      throw "arg must be instanceof Array"
    }

    var out = [];

    var i, arr, j, item;

    /* first check to make sure all args are arrays, and throw early if not */
    for( i=0; i<arrs.length; i++ ){
      arr = arrs[i];
      if( arr instanceof Array === false ){
        throw "all items in this Array must be instanceof Array"
      }
    }

    for( i=0; i<arrs.length; i++ ){
      arr = arrs[i];
      for( j=0; j<arr.length; j++ ){
        item = arr[j];
        this.push( out, item );
      }
    }
    
    return out;

  };


  /* join an array of items by a string. coerces items to strings. */
  esx.join = function( arr, string ){

    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var out = "";
    
    var i;
    for( i=0; i<arr.length; i++ ){
      out += arr[i] + string;
    }

    out = this.slice( out, 0, -string.length );

    return out;

  };


  /* callback args - (e,n,a) - e=item, n=index, a=array */
  esx.filter = function( arr, callback ){
    
    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var out = [];

    var i, item, keep;
    for( i=0; i<arr.length; i++ ){
      item = arr[i];
      keep = !!callback( item, i, arr );
      if( keep ){
        this.push( out, item );
      }
    }

    return out;

  };

  /* naive sum of all items in the array. if acc becomes NaN or infinite it exits early. */
  esx.sum = function( arr ){

    if( arr instanceof Array === false ){
      throw "arg must be instanceof Array"
    }

    var acc = 0;

    var i;
    for( i=0; i<arr.length; i++ ){
      acc += arr[i];
      if( !this.isFinite(acc) ){
        break;
      }
    }

    return acc;

  };


  esx.map = function( arr, callback ){

    if( arr instanceof Array === false ){
      throw "first arg must be instanceof Array"
    }

    var out = [];

    var i, item, result;
    for( i=0; i<arr.length; i++ ){
      item = arr[i];
      result = callback( item, i, arr );
      this.push( out, result );
    }

    return out;

  };


  /* for both arrays and strings */
  esx.slice = function( arrOrStr, istart, iend ){

    if( arrOrStr instanceof Array === false && typeof arrOrStr !== "string" ){
      throw "first arg must be instanceof Array or typeof string"
    }

    istart *= 1;
    iend *= 1;

    if( !this.isFinite(istart) ){
      istart = 0;
    }

    if( !this.isFinite(iend) || iend > arrOrStr.length ){
      iend = arrOrStr.length;
    }

    istart = parseInt( istart );
    iend = parseInt( iend );

    if( istart >= arrOrStr.length ){
      if( typeof arrOrStr === "string" ){
        return "";
      }else{
        return [];
      }
    }

    if( istart < -arrOrStr.length ){
      istart = 0;
    }

    if( istart < 0 ){
      istart = arrOrStr.length + istart;
    }

    if( iend < 0 ){
      iend = arrOrStr.length + iend;
    }

    if( iend <= istart ){
      if( typeof arrOrStr === "string" ){
        return "";
      }else{
        return [];
      }
    }

    var out;

    if( typeof arrOrStr === "string" ){
      out = "";
    }else{
      out = [];
    }

    var i;
    for( i=istart; i<iend; i++ ){
      if( typeof arrOrStr === "string" ){
        out += arrOrStr[i];
      }else{
        this.push( out, arrOrStr[i] );
      }
    }

    return out;

  };


  esx.randomIndex = function( arrOrStr ){

    if( arrOrStr instanceof Array === false && typeof arrOrStr !== "string" ){
      throw "first arg must be instanceof Array or typeof string"
    }

    return Math.floor( Math.random() * arrOrStr.length );

  };

  esx.randomItem = function( arrOrStr ){

    if( arrOrStr instanceof Array === false && typeof arrOrStr !== "string" ){
      throw "first arg must be instanceof Array or typeof string"
    }

    var index = this.randomIndex( arrOrStr );

    return arrOrStr[index];

  };


}()