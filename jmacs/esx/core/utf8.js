if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  esx.str2utf8 = function( str ){

    /* mimic behavior of TextEncoder */
    if( typeof str === "undefined" ){
      str = "";
    }else{
      str += "";
    }
    
    /**
     * utf8 encoding method adapted from - https://gist.github.com/pascaldekloe/62546103a1576803dade9269ccf76330
     * further guidance - https://unpkg.com/lzutf8@0.6.3/build/production/lzutf8.js
     **/
    
    var i = 0;
    var bytes = [];
    
    var ci, c, c2;
    
    for( ci=0; ci!=str.length; ci++ ){
      
      c = str.charCodeAt(ci);
      
      if(c < 128){
        bytes[i++] = c;
        continue;
      }

      if(c < 2048){
        bytes[i++] = c >> 6 | 192;
      }else{
        if (c > 0xd7ff && c < 0xdc00) {
          if (++ci >= str.length){
            throw "incomplete surrogate pair";
          }
          c2 = str.charCodeAt(ci);
          if (c2 < 0xdc00 || c2 > 0xdfff){
            throw "2nd surrogate char 0x" + c2.toString(16) + " at index " + ci + " out of range";
          }
          c = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
          bytes[i++] = c >> 18 | 240;
          bytes[i++] = c >> 12 & 63 | 128;
        } else {
          bytes[i++] = c >> 12 | 224;
        }
        bytes[i++] = c >> 6 & 63 | 128;
      }

      bytes[i++] = c & 63 | 128;

    }

    return this.slice( bytes, 0, i );

  };

  esx.utf82str = function( utf8 ){
    
    var i = 0, str = "";
    var c;

    while (i < utf8.length) {
      c = utf8[i++];
      if (c > 127) {
        if (c > 191 && c < 224) {
          if (i >= utf8.length){
            throw "incomplete 2-byte sequence";
          }
          c = (c & 31) << 6 | utf8[i++] & 63;
        } else if (c > 223 && c < 240) {
          if (i + 1 >= utf8.length){
            throw "incomplete 3-byte sequence";
          }
          c = (c & 15) << 12 | (utf8[i++] & 63) << 6 | utf8[i++] & 63;
        } else if (c > 239 && c < 248) {
          if (i + 2 >= utf8.length){
            throw "incomplete 4-byte sequence";
          }
          c = (c & 7) << 18 | (utf8[i++] & 63) << 12 | (utf8[i++] & 63) << 6 | utf8[i++] & 63;
        } else {
          throw "unknown multibyte start 0x" + c.toString(16) + " at index " + (i - 1);
        }
      }
      if (c <= 0xffff) {
        str += String.fromCharCode(c);
      }else if (c <= 0x10ffff) {
        c -= 0x10000;
        str += String.fromCharCode(c >> 10 | 0xd800)
        str += String.fromCharCode(c & 0x3FF | 0xdc00)
      } else{
        throw "code point 0x" + c.toString(16) + "exceeds utf16 reach";
      }
    }

    return str;

  };

}()