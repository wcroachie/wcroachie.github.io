!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  esx.params2obj = function( paramStr ){
    paramStr = paramStr + "";
    if( paramStr[0] === "?" ){
      paramStr = this.slice( paramStr, 1 );
    }
    paramStr = this.replaceAll( paramStr, "+", "%20" );
    var pieces = this.splitAtCh( paramStr, "&" );
    var obj = {};
    for( var i=0; i<pieces.length; i++ ){
      var piece = pieces[i];
      var key = this.splitAtCh( piece, "=" )[0];
      var value = this.slice( piece, key.length + 1);
      obj[key] = this.decodeURIComponent( value );
    }
    return obj;
  };

  esx.obj2params = function( obj ){
    var params = "";
    for( var key in obj ){
      var encodedKey = this.encodeURIComponent(key);
      var encodedValue = this.encodeURIComponent(obj[key]);
      var encodedKeyWithPlusSpaces = this.replaceAll( encodedKey, "%20", "+" );
      var encodedValueWithPlusSpaces = this.replaceAll( encodedValue, "%20", "+" );
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
    var scheme = this.splitAtCh( url, ":" )[0];
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
    for( var i=1; i<scheme.length; i++ ){
      var ch = scheme[i];
      if( tokensToMatch.indexOf(ch) === -1 ){
        throw "invalid url"
      }
    }
    return scheme + ":";
  };

  esx.getUrlHash = function( url ){
    url = url + "";
    if( url.indexOf("#") > -1 ){
      var beforeHash = this.splitAtCh(url,"#")[0];
      return this.slice( url, beforeHash.length );
    }else{
      return null;
    }
  };

  esx.getUrlSearch = function( url ){
    url = url + "";
    if( url.indexOf("#") > -1 ){
      url = this.splitAtCh(url,"#")[0];
    }
    if( url.indexOf("?") > -1 ){
      var beforeQuestionMark = this.splitAtCh( url, "?" )[0];
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
      url = this.splitAtCh( url, "/" )[0];
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
      var beforeFirstSlash = this.splitAtCh( url, "/" )[0];
      url = this.slice( url, beforeFirstSlash.length );
      return url;
    }else{
      return "";
    }
  };

  esx.getPathFilename = function( path ){
    var betweenSlashes = this.splitAtCh( path, "/" );
    return this.pop( betweenSlashes );
  };

  esx.getPathParentpath = function( path ){
    var filename = this.getPathFilename( path );
    var beforeFilename = this.slice( path, 0, -filename.length );
    return beforeFilename;
  };

  esx.getFilenameExtension = function( filename ){
    var betweenPeriods = this.splitAtCh( filename, "." );
    return this.pop( betweenPeriods );
  };

  esx.getFilenameName = function( filename ){
    var ext = this.getFilenameExtension( filename );
    return this.slice( filename, 0, -ext.length - 1 );
  };
  

}()