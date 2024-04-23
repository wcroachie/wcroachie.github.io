(function closure(){


  // console.log( esx.normalizeStackTrace( esx.generateStackTrace() )); 

  esx.generateStacks().then( function(e){
    // console._log(e);
    for( var key in e ){
      // console.log(key + ":", e[key]);
      var stack = e[key];
      console.log( esx.normalizeStackTrace(stack) );
    }
  })
  // ({
  //   ["@testhttp://www.:1:2@? h at @ @testhttp://www.:1:2@?"](){
  //     /**
  //      * @todo - fix this so that the filenames show up correctly in all browsers (edit err.js)
  //      * @todo - fix this so that the filenames show up correctly in all browsers (edit err.js)
  //      */
  //   }
  // })["@testhttp://www.:1:2@? h at @ @testhttp://www.:1:2@?"]()

  // setTimeout(function timeoutCallback(){

  
  // },1000);

  // console.warn( eval("eval('esx.normalizeStackTrace(esx.generateStackTrace())')"));
  // console.warn( esx.parseStackLine("test:testsdfkjhsf/sfdsfd/sfd.js:34:  \n\r:") )

})()