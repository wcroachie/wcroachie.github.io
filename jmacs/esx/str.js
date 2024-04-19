!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  /* split a string by a single character */
  esx.splitAtCh = function( str, ch, omitEmptyStrings ){

    var pieces=[], piece="";

    for( var i=0; i<str.length; i++ ){
      if( str[i] === ch ){
        this.push( pieces, [piece] );
        piece = "";
      }else{
        piece += str[i];
      }
    }

    this.push( pieces, [piece] );
    
    if( omitEmptyStrings ){
      var pieces2 = [];
      for( var i=0; i<pieces.length; i++ ){
        if( pieces[i] !== "" ){
          this.push( pieces2, [pieces[i]] );
        }
      }
      return pieces2;
    }

    return pieces;

  };

  esx.padStart = function( str, maxLen, char ){
    while( str.length < maxLen ){
      str = char + str;
    }
    return str;
  };


  /* trims the space character from beginning and end, space character (0x20) ONLY */
  esx.trimSpace = function( str ){
    while( str[0] === " " ){
      str = this.slice( str, 1 );
    }
    while( str[ str.length - 1 ] === " "){
      str = this.slice( str, 0, -1 );
    }
    return str;
  };



  /* check if a string can be coerced to a number without being NaN */
  esx.canBeNum = function( str ){
    return !isNaN( str * 1 );
  };


  /* check if a string starts with a substring that can be converted to a number */
  esx.canStartWithNum = function( str ){
    var acc="", results=[];
    for( var i=0; i<str.length; i++ ){
      if( acc.length && this.canBeNum(acc) ){
        this.push( results, [acc] );
      }
      acc += str[i];
    }
    return this.pop( results ) || false;
  };



  /* only lowercase */
  esx.randomId = function(){
    return this.slice( Math.random().toString(36), 2 );
  };

  /* for get requests, add a random param to prevent cachine */
  esx.randomParam = function(){
    return this.randomId() + "=" + this.randomId();
  };

  /* lowercase and uppercase chars, A-Z, a-z, and 0-9 */
  esx.randomId2 = function(){
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var out = "";
    for( var i=0; i<8; i++ ){
      var ch = this.randomItem( chars );
      out += ch;
    }
    return out;
  };

  esx.replaceAll = function( str, substringToReplace, substitute ){
    var out = "";
    outer : for( var i=0; i<str.length; i++ ){
      var ch = str[i];
      if( ch === substringToReplace[0] ){
        for( var j=0; j<substringToReplace.length; j++ ){
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