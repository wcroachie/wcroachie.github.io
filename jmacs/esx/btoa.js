!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  /* https://base64.guru/developers/javascript/examples/polyfill */

  var ascii = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  esx.btoa = function( str ){

    str = str + "";

    var
      len = str.length - 1,
      i = -1,
      b64 = ""
    ;

    while( i < len ){
      var code = str.charCodeAt(++i) << 16 | str.charCodeAt(++i) << 8 | str.charCodeAt(++i);
      b64 += ascii[(code >>> 18) & 63] + ascii[(code >>> 12) & 63] + ascii[(code >>> 6) & 63] + ascii[code & 63];
    }

    var pads = str.length % 3;

    if( pads > 0 ){
      b64 = this.slice( b64, 0, pads - 3 );
      while( b64.length % 4 ){
        b64 += "=";
      }
    }

    return b64;
    
  };


  esx.atob = function( b64 ){
    
    b64 = b64 + "";

    var indices = {};
    
    for( var i=0; i<ascii.length; i++ ){
      var ch = ascii[i];
      indices[ch] = i;
    }

    var
      pos = b64.indexOf("="),
      padded = pos > -1,
      len = padded ? pos : b64.length,
      i = -1,
      str = ""
    ;

    while (i < len) {
      var code = indices[b64[++i]] << 18 | indices[b64[++i]] << 12 | indices[b64[++i]] << 6 | indices[b64[++i]];
      if(code){
        str += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255);
      }
    }

    if (padded) {
      str = this.slice( str, 0, pos - b64.length );
    }

    return str;

  };

}()