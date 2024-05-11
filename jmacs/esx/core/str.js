if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";


  esx.toPrimitiveString = function( val ){

    var obj = (typeof Object === "object" && Object !== null) ? Object : {} ;
    var objProto = obj.prototype || obj.__proto__ || obj;
    var toString = objProto.toString || function(){ return this + "" };
    return toString.call( val );

  };

  
  esx.split = function( str, substr ){

    str += "";
    substr += "";

    var pieces = [];
    
    if( substr === "" ){
      
      var i;
      for( i=0; i<str.length; i++ ){
        pieces[ pieces.length ] = str[i]
      }

    }else{

      var piece;
      while( str.length ){
        if( str.indexOf(substr) === -1 ){
          pieces[ pieces.length ] = str;
          break;
        }
        piece = this.slice( str, 0, str.indexOf(substr) );
        pieces[ pieces.length ] = piece;
        str = this.slice( str, str.indexOf(substr) + substr.length );
      }

    }

    return pieces;

  };


  esx.padStart = function( str, maxLen, ch ){
    str += "";
    ch += "";
    ch = ch[0];
    while( str.length < maxLen ){
      str = ch + str;
    }
    return str;
  };


  esx.padEnd = function( str, maxLen, ch ){
    str += "";
    ch += "";
    ch = ch[0];
    while( str.length < maxLen ){
      str += ch;
    }
    return str;
  };

  /* this uses the nature of whitespace strings returning 0 when multiplied by 1 instead of NaN to get whitespace */
  esx.trim = function( str ){

    str += "";
    var sliceStart, sliceEnd;
    var i, acc="", ch;
    for( i=0; i<str.length; i++ ){
      ch = str[i];
      if( ch === "0" ){
        break;
      }
      if( (acc + ch) * 1 !== 0 ){
        break;
      }
      acc += ch;
    }
    sliceStart = acc.length;
    acc = "";
    for( i=str.length-1; i>=0; i-- ){
      ch = str[i];
      if( ch === "0" ){
        break;
      }
      if( (ch + acc) * 1 !== 0 ){
        break;
      }
      acc = ch + acc;
    }
    sliceEnd = -acc.length;

    return this.slice( str, sliceStart, sliceEnd );

  };


  /* check if a string can be coerced to a number and be Finite */
  esx.canBeNum = function( str ){

    str += "";

    return this.isFinite( str * 1 );

  };


  /* check if a string starts with a substring that can be converted to a number */
  esx.canStartWithNum = function( str ){

    str += "";

    var i, acc="", results=[];
    for( i=0; i<str.length; i++ ){
      if( acc.length && this.canBeNum(acc) ){
        this.push( results, acc );
      }
      acc += str[i];
    }

    return this.pop( results ) || false;
    
  };


  esx.canEndWithNum = function( str ){

    str += "";

    var i, acc="", results=[];
    for( i=str.length-1; i>=0; i-- ){
      if( acc.length && this.canBeNum(acc) ){
        this.push( results, acc );
      }
      acc = str[i] + acc;
    }

    return this.pop( results ) || false;

  };




  /* only lowercase */
  esx.randomId = function(){

    return this.slice( Math.random().toString(36), 2 );

  };



  /* lowercase and uppercase chars, A-Z, a-z, and 0-9 */
  esx.randomId2 = function(){

    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var i, ch, out="";
    for( i=0; i<8; i++ ){
      ch = this.randomItem( chars );
      out += ch;
    }

    return out;

  };

  
  /* for get requests, add a random param to prevent caching */
  esx.randomParam = function(){

    return this.randomId() + "=" + this.randomId();

  };




  esx.repeat = function( str, times ){

    str += "";

    var i, out="";
    for( i=0; i<times; i++ ){
      out += str;
    }

    return out;

  };


  esx.replaceFirst = function( str, substringToReplace, substitute ){

    str += "";

    var start = str.indexOf( substringToReplace );

    if( start > -1 ){
      var end = start + substringToReplace.length;
      var before = this.slice( str, 0, start );
      var after = this.slice( str, end );
      return before + substitute + after;
    }else{
      return str;
    }

  };


  esx.replaceAll = function( str, substringToReplace, substitute ){

    str += "";

    var i, ch, j, out="";
    outer : for( i=0; i<str.length; i++ ){
      ch = str[i];
      if( ch === substringToReplace[0] ){
        for( j=0; j<substringToReplace.length; j++ ){
          if( str[i+j] !== substringToReplace[j] ){
            out += ch;
            continue outer;
          }
        }
        out += substitute;
        i += substringToReplace.length-1;
        continue;
      }else{
        out += ch;
      }
    }

    return out;
    
  };
  

}()