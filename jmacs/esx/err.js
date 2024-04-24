/* note - the following code MUST **NOT** BE IN A CLOSURE */

/**
 * some parsers add an extra line of information at the
 * beginning of every error stack, others do not do this.
 * the following is an attempt to mitigate this problem
 * by throwing an error in the scope this script is ran
 * in (globally, ideally), counting the lines in the stack,
 * and removing that many lines from the beginning of every
 * error thrown within esx.generateStackTrace. note that
 * esx.generateStackTrace must be defined in the same scope
 * as the error thrown in, due to safari adding an extra
 * line for the usual closure esx methods are defined in,
 * so there is no closure here.
 */


if( typeof esx === "undefined" ){
  esx = {};
}



/**
 * purposefully throw an error by trying to
 * access a property from null. assuming there
 * may not be access to a global Error constructor.
 * in all versions of JS that use try...catch,
 * this should generate an error or exception-like
 * object that should have a stack. if there is
 * no stack property, the caught value is coerced
 * to a string.
 **/

try{
  null.$
}catch(e){
  if( typeof e === "object" && e !== null && "stack" in e ){
    esx.GLOBAL_SCOPE_STACK = e.stack;
  }else{
    esx.GLOBAL_SCOPE_STACK = e;
  }
}

/* coerce to string */
esx.GLOBAL_SCOPE_STACK = esx.GLOBAL_SCOPE_STACK + "";

esx.generateStackTrace = function(){
  var stack;
  try{
    null.$
  }catch(e){
    if( typeof e === "object" && e !== null && "stack" in e ){
      stack = e.stack;
    }else{
      stack = e;
    }
  }
  /* coerce to string */
  stack = stack + "";
  return stack;
};



/**
 * now that that is done, any additional methods can
 * exist within the usual closure, ran below.
 */

!function(){

  esx.parseStackLine = function( line ){

    var originalLine = line;

    line = this.trimWhitespace( line );
    
    if( line[line.length - 1] === ")" ){
      line = this.slice( line, 0, -1 );
    }

    var betweenColons  = this.splitAtCh( line, ":" );
    
    var columnNumber = this.pop( betweenColons );
    var lineNumber = this.pop( betweenColons );
    
    var filename = line;

    if(
      typeof columnNumber === "string" &&
      typeof lineNumber === "string" &&
      columnNumber.length &&
      lineNumber.length &&
      this.canBeNum(columnNumber) &&
      this.canBeNum(lineNumber)
    ){
      filename = this.slice( filename, 0, -columnNumber.length - 1 - lineNumber.length - 1 );
      columnNumber = columnNumber * 1;
      lineNumber = lineNumber * 1;
    }else{
      columnNumber = null;
      lineNumber = null;
    }

    if( filename.indexOf("@") !== -1 ){
      var beforeFirstAt = this.splitAtCh(filename,"@")[0];
      filename = this.slice( filename, beforeFirstAt.length + 1 );
    }
    
    if( filename.indexOf(" ") > -1 ){
      filename = this.pop( this.splitAtCh( filename, " ", true ) );
    }
    // if( filename.indexOf("[native code]") === -1 ){
      
    //   filename = this.pop( this.splitAtCh( filename, "@", true ) );
    //   if( filename[0] === "(" ){
    //     filename = this.slice( filename, 1 );
    //   }
    // }else{
    //   // filename = this.slice( filename, 0, -14 );
    //   filename = "[native code]";
    // }
    
    // if( originalLine === "eval code@" ){
    //   filename = "eval code";
    // }

    if( filename[0] === "(" ){
      filename = this.slice( filename, 1 );
    }

    if( filename.indexOf("#") > -1 ){
      filename = this.splitAtCh( filename, "#", true )[0];
    }

    if( filename.indexOf("?") > -1 ){
      filename = this.splitAtCh( filename, "?", true )[0];
    }

    console.error( originalLine );
    console.warn( filename || "NONE OR EMPTY FILENAME" );

    var ret = {
      content : originalLine,
      line : lineNumber,
      column : columnNumber,
      filename : filename
    };

    return ret;

  };

  esx.normalizeStackTrace = function( stack ){
    
    var lines = this.splitAtCh(stack, "\n", true);

    /**
     * remove the parts of the stack that are in err.js (this file)
     */
    var linesToRemoveCount = Math.max( this.splitAtCh( this.GLOBAL_SCOPE_STACK, "\n", true ).length, 0 );
    lines = this.slice( lines, linesToRemoveCount );

    var _this = this;

    lines = this.map( lines, function(line,n,a){
      return _this.parseStackLine( line );
    });

    return lines;

  };

}()