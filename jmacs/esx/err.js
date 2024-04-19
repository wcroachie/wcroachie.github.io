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

esx.GLOBAL_SCOPE_STACK = "(no stack)";

/**
 * purposefully throw an error by trying to
 * access a property from null. assuming there
 * may not be access to a global Error constructor.
 * in all versions of JS that use try...catch,
 * this should generate an error or error-like
 * object that should have a stack. if there is
 * no stack property, the caught value is coerced
 * to a string.
 **/

try{
  null.a
}catch(e){
  esx.GLOBAL_SCOPE_STACK = e.stack || (e + "");
}

esx.generateStackTrace = function(){
  var linesToRemoveCount = Math.max( this.splitAtCh( this.GLOBAL_SCOPE_STACK, "\n", true ).length - 1, 0 );
  var stack;
  try{
    null.a
  }catch(e){
    stack = e.stack || (e + "");
  }
  var stackLines = this.splitAtCh( stack, "\n", true );
  stackLines = this.slice( stackLines, linesToRemoveCount );
  return this.join( stackLines, "\n" );
};

/**
 * now that that is done, any additional methods can
 * exist within the usual closure, ran below.
 */

!function(){

  esx.normalizeStackTrace = function( stack ){
    var lines = this.splitAtCh(stack, "\n", true);
    var _this = this;
    lines = this.map( lines, function(line,n,a){
      line = _this.trimSpace( line );
      if( line.indexOf("at ") === 0 ){
        line = _this.slice( line, 3 );
      }
      return line;
    });
    return lines.join("\n");
  };

}()