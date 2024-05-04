if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  esx.params2obj = function( paramStr ){
    paramStr = paramStr + "";
    if( paramStr[0] === "?" ){
      paramStr = this.slice( paramStr, 1 );
    }
    paramStr = this.replaceAll( paramStr, "+", "%20" );
    var pieces = this.split( paramStr, "&" );
    var obj = {};
    var i, piece, key, value;
    for( i=0; i<pieces.length; i++ ){
      piece = pieces[i];
      key = this.split( piece, "=" )[0];
      value = this.slice( piece, key.length + 1);
      obj[key] = this.decodeURIComponent( value );
    }
    return obj;
  };

  esx.obj2params = function( obj ){
    var params = "";
    var key, encodedKey, encodedValue, encodedKeyWithPlusSpaces, encodedValueWithPlusSpaces;
    for( key in obj ){
      encodedKey = this.encodeURIComponent(key);
      encodedValue = this.encodeURIComponent(obj[key]);
      encodedKeyWithPlusSpaces = this.replaceAll( encodedKey, "%20", "+" );
      encodedValueWithPlusSpaces = this.replaceAll( encodedValue, "%20", "+" );
      params += "&" + encodedKeyWithPlusSpaces + "=" + encodedValueWithPlusSpaces;
    }
    params = this.slice( params, 1 );
    return params;
  };
  
  esx.getUrlScheme = function( url ){
    url = url + "";
    if( url.indexOf(":") === -1 ){
      throw "invalid url";
    }
    var scheme = this.split( url, ":" )[0];
    if( scheme === "" ){
      throw "invalid url";
    }
    scheme = scheme.toLowerCase();
    var tokensToMatch;  

    /* match first char of scheme */
    tokensToMatch = "abcdefghijklmnopqrstuvwxyz";
    if( tokensToMatch.indexOf( scheme[0] ) === -1 ){
      throw "invalid url"
    }
    /* match rest of scheme */
    tokensToMatch += "0123456789+.-";
    var i, ch;
    for( i=1; i<scheme.length; i++ ){
      ch = scheme[i];
      if( tokensToMatch.indexOf(ch) === -1 ){
        throw "invalid url"
      }
    }
    return scheme + ":";
  };

  esx.getUrlHash = function( url ){
    url = url + "";
    if( url.indexOf("#") > -1 ){
      var beforeHash = this.split(url,"#")[0];
      return this.slice( url, beforeHash.length );
    }else{
      return null;
    }
  };

  esx.getUrlSearch = function( url ){
    url = url + "";
    if( url.indexOf("#") > -1 ){
      url = this.split(url,"#")[0];
    }
    if( url.indexOf("?") > -1 ){
      var beforeQuestionMark = this.split( url, "?" )[0];
      return this.slice( url, beforeQuestionMark.length );
    }else{
      return null;
    }
  };

  esx.getUrlDomain = function( url ){
    url = url + "";
    var scheme = this.getUrlScheme( url );
    url = this.slice( url, scheme.length );
    if( url.indexOf("//") !== 0 ){
      throw "invalid url"
    }
    url = this.slice( url, 2 );
    if( url.indexOf("/") > -1 ){
      url = this.split( url, "/" )[0];
    }
    return url;
  };

  esx.getUrlPath = function( url ){
    url = url + "";
    var hash = this.getUrlHash( url );
    if( hash ){
      url = this.slice( url, 0,-hash.length);
    }
    var search = this.getUrlSearch( url );
    if( search ){
      url = this.slice( url, 0, -search.length );
    }
    var scheme = this.getUrlScheme( url );
    url = this.slice( url, scheme.length );
    if( url.indexOf("//") !== 0 ){
      throw "invalid url"
    }
    url = this.slice( url, 2 );
    if( url.indexOf("/") > -1 ){
      var beforeFirstSlash = this.split( url, "/" )[0];
      url = this.slice( url, beforeFirstSlash.length );
      return url;
    }else{
      return "";
    }
  };

  esx.getPathFilename = function( path ){
    var betweenSlashes = this.split( path, "/" );
    return this.pop( betweenSlashes );
  };

  esx.getPathParentpath = function( path ){
    if( path[path.length - 1] === "/" ){
      return path;
    }
    var filename = this.getPathFilename( path );
    var beforeFilename = this.slice( path, 0, -filename.length );
    return beforeFilename;
  };

  esx.getFilenameExtension = function( filename ){
    var betweenPeriods = this.split( filename, "." );
    return this.pop( betweenPeriods );
  };

  esx.getFilenameName = function( filename ){
    var ext = this.getFilenameExtension( filename );
    return this.slice( filename, 0, -ext.length - 1 );
  };
  

}()