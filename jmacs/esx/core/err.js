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
  null.$ = 0;
}catch(e){
  if( typeof e === "undefined" ){
    esx.GLOBAL_SCOPE_ERROR_STACK = "undefined";
  }else{
    if( typeof e === "object" && e !== null && "stack" in e ){
      esx.GLOBAL_SCOPE_ERROR_STACK = e.stack;
    }else{
      esx.GLOBAL_SCOPE_ERROR_STACK = e;
    }
  }
}

/* coerce to string */
esx.GLOBAL_SCOPE_ERROR_STACK = esx.GLOBAL_SCOPE_ERROR_STACK + "";

esx.generateStackTrace = function(){
  var stack;
  try{
    null.$ = 0;
  }catch(e){
    if( typeof e === "undefined" ){
      stack = "undefined";
    }else{
      if( typeof e === "object" && e !== null && "stack" in e ){
        stack = e.stack;
      }else{
        stack = e;
      }
    }
  }
  /* coerce to string */
  stack = stack + "";
  return stack;
};