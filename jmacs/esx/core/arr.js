if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";

  esx.shallowCopyArr = function( arr ){
    var arr2 = [];
    for( var i=0; i<arr.length; i++ ){
      if( i in arr ){
        arr2[i] = arr[i];
      }
    }
    return arr2;
  };

  esx.indexOf = function( arr, item ){
    if( typeof arr === "string" ){
      throw "if looking for index in a string, please use String.indexOf"
    }
    var index = -1;
    for( var i=0; i<arr.length; i++ ){
      if( arr[i] === item ){
        index = i;
        break;
      }
    }
    return index;
  };

  esx.pop = function( arr ){
    var item = arr[arr.length - 1];
    delete arr[arr.length - 1];
    arr.length = Math.max( arr.length - 1, 0 );
    return item;
  };
  
  esx.shift = function( arr ){
    arr.reverse();
    var item = this.pop( arr );
    arr.reverse();
    return item;
  };

  esx.push = function( arr, itemsArr ){
    for( var i=0; i<itemsArr.length; i++ ){
      arr[ arr.length ] = itemsArr[ i ];
    }
    return arr.length;
  };

  esx.unshift = function( arr, itemsArr ){
    itemsArr.reverse();
    arr.reverse();
    this.push( arr, itemsArr );
    itemsArr.reverse();
    arr.reverse();
    return arr.length;
  };

  esx.compareArrs = function( arrs ){
    if( arrs.length <= 1 ){
      return true;
    }
    /* shallow copy so as not to change the original when shifting next */
    arrs = this.shallowCopyArr( arrs );
    var arr0 = this.shift( arrs );
    var arr;
    for( var i=0; i<arrs.length; i++ ){
      arr = arrs[i];
      if( arr.length !== arr0.length ){
        return false;
      }
      for( var j=0; j<arr0.length; j++ ){
        if( (j in arr) !== (j in arr0) ){
          return false;
        }
        if( arr[j] !== arr0[j] ){
          return false;
        }
      }
    }
    return true;
  };

  /* break an array into chunks equal to maxChunkLength or less and greater than zero */
  esx.chunk = function( arr, maxChunkLength ){
    var chunks = [[]];
    var counter = 0;
    for( var i=0; i<arr.length; i++ ){
      this.push( chunks[chunks.length - 1], [arr[i]] );
      counter ++;
      if( counter === maxChunkLength ){
        this.push( chunks, [[]] );
        counter = 0;
      }
    }
    /* if last chunk length is 0, pop it off */
    if( !chunks[chunks.length-1].length ){
      this.pop( chunks );
    }
    return chunks;
  };

  /* combine an array of arrays. returns a new arr ay. */
  esx.combine = function( arrs ){
    var out = [];
    for( var i=0; i<arrs.length; i++ ){
      var arr = arrs[i];
      for( var j=0; j<arr.length; j++ ){
        var item = arr[j];
        this.push( out, [item] );
      }
    }
    return out;
  };


  /* join an array of items by a string. coerces items to strings. */
  esx.join = function( arr, string ){
    var out = "";
    for( var i=0; i<arr.length; i++ ){
      out += arr[i] + string;
    }
    out = this.slice( out, 0, -string.length );
    return out;
  };


  /* callback args - (e,n,a) - e=item, n=index, a=array */
  esx.filter = function( arr, callback ){
    var out = [];
    for( var i=0; i<arr.length; i++ ){
      var item = arr[i];
      var keep = !!callback( item, i, arr );
      if( keep ){
        this.push( out, [item] );
      }
    }
    return out;
  };

  esx.sum = function( arr ){
    var acc = 0;
    for( var i=0; i<arr.length; i++ ){
      acc += arr[i];
      if( !isFinite(acc) ){
        break;
      }
    }
    return acc;
  };

  esx.map = function( arr, callback ){
    var out = [];
    for( var i=0; i<arr.length; i++ ){
      var item = arr[i];
      var result = callback( item, i, arr );
      this.push( out, [result] );
    }
    return out;
  };

  /* for both arrays and strings */
  esx.slice = function( arrOrStr, istart, iend ){
      
    istart = istart * 1;
    iend = iend * 1;

    if( isNaN(istart) ){
      istart = 0;
    }

    if( isNaN(iend) || iend > arrOrStr.length ){
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

    for( var i=istart; i<iend; i++ ){
      if( typeof arrOrStr === "string" ){
        out += arrOrStr[i];
      }else{
        this.push( out, [arrOrStr[i]] );
      }
    }

    return out;

  };


  esx.randomIndex = function( arrOrStr ){
    return Math.floor( Math.random() * arrOrStr.length );
  };

  esx.randomItem = function( arrOrStr ){
    var index = this.randomIndex( arrOrStr );
    return arrOrStr[index];
  };


}()