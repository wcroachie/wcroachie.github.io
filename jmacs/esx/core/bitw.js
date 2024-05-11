if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";


  /**
   * get the bit depth used for bitwise
   * calculations in this environment.
   **/
  esx.BITWISE_BIT_DEPTH = (-1 >>> 0).toString(2).length;


  /**
   * count number of bits taken up by the
   * unsigned binary form of an integer
   * i.e. a "bit word"
   * 
   * 001001 => 4 bits (1001)
   * 
   * note that this will always start with the max
   * bit depth used for bitwise operations and shift
   * right until it encounters the first 1
   **/
  esx.getBitDepth = function( bitWord ){

    if( !this.isInt(bitWord) ){
      throw "arg must be an integer";
    }

    var i;
    for( i=0; i<this.BITWISE_BIT_DEPTH; i++ ){
      if( bitWord >>> i === 1 ){
        return i + 1;
      }
    }

  };
  


  /**
   * "decompose" any bit word into n-bit words.
   * little-endian by default. in other words,
   * it inserts the next-most significant bits
   * in the next index in the resulting array
   * of words.
   * if seqLength is undefined, the resulting
   * sequence will not be padded. if it is, the
   * sequence will be padded on the end with 0's
   * until it reaches the seqLenght. if the bit
   * depth is too high to represent the sequence
   * with the provided seqLength and word length,
   * it will throw before the sequence is generated.
   * newWordLength is 8 by default
   * isBigEndian is false by default
   **/
  esx.decompose = function( bitWord, seqLength, newWordLength, isBigEndian ){
    
    if( !this.isInt(bitWord) ){
      throw "first arg must be an integer";
    }

    if( typeof seqLength !== "undefined" ){
      if( !this.isInt(seqLength) ){
        throw "third arg must be an integer or undefined"
      }
    }

    if( typeof newWordLength === "undefined" ){
      newWordLength = 8;
    }

    if( !this.isInt(newWordLength) ){
      throw "second arg must be an integer or undefined (defaults to 8)";
    }


    if( typeof isBigEndian === "undefined" ){
      isBigEndian = false;
    }

    if( typeof isBigEndian !== "boolean" ){
      throw "fourth arg must be a boolean or undefined (defaults to false)";
    }

    var bitDepth = this.getBitDepth( bitWord );

    if( typeof seqLength !== "undefined" ){
      /* see if bit depth when divided by newWordLength fits beneath seqLength */
      var wordCount;
      if( bitDepth % newWordLength === 0 ){
        wordCount = bitDepth / newWordLength;
      }else{
        var wordCount = (bitDepth - (bitDepth % newWordLength) + newWordLength)/newWordLength;
      }
      if( wordCount > seqLength ){
        throw "bit depth is too high for the provided bit-word sequence length"
      }
    }

    /**
     * create a bit mask, this will be used to
     * continually grab the n least significant
     * bits to get each word
     **/
    var mask = 0;
    var i;
    for( i=0; i<newWordLength; i++ ){
      mask = mask << 1 | 1;
    }

    var words = [];
    var bitOffset, word;
    for( bitOffset=0; bitOffset<bitDepth; bitOffset+=newWordLength ){
      word = bitWord >> bitOffset & mask;
      this.push( words, word );
    }

    if( typeof seqLength !== "undefined" ){
      /* if less than sequence length, pad with zeros */
      while( words.length < seqLength ){
        this.push( words, 0 );
      }
    }

    if( isBigEndian ){
      words.reverse();
    }

    return words;

  };






  /* hex color to rgb or rgba color */

  esx.hex2rgb = function( hexStr ){

    if( hexStr[0] === "#" ){
      hexStr = this.slice( hexStr, 1 );
    }

    var color = parseInt( hexStr, 16 );
    
    var r,g,b,a;

    switch( hexStr.length ){
      
      /* 0xf  = 0b1111      = 15  */
      /* 0xff = 0b11111111  = 255 */

      /* #RGB */
      case 3:{
        r = color >> 8;
        g = color >> 4 & 0xf;
        b = color & 0xf;
        break;
      }

      /* #RGBA */
      case 4:{
        r = color >> 12;
        g = color >> 8 & 0xf;
        b = color >> 4 & 0xf;
        a = color & 0xf;
        break;
      }

      /* #RRGGBB */
      case 6:{
        r = color >> 16;
        g = color >> 8 & 0xff;
        b = color & 0xff;
        break;
      }

      /* #RRGGBBAA */
      case 8:{
        r = color >> 24;
        g = color >> 16 & 0xff;
        b = color >> 8 & 0xff;
        a = color & 0xff;
        break;
      }

      default:{
        throw "invalid string length provided for hex color. must be either #RGB, #RGBA, #RRGGBB, or #RRGGBBAA";
      }

    }

    /* for 16 bit color, repeat the 4 bits to get each byte */
    if( hexStr.length <= 4 ){
      r |= r << 4;
      g |= g << 4;
      b |= b << 4;
      if( a ){
        a |= a << 4;
      }
    }
    
    if( a ){
      a /= 255;
      return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    }else{
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    
  };


  
}()