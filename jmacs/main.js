void function(){


  if( location.hash ){
    location.hash += "_";
  }
  setTimeout(function(){
    esx.addEventListener( window, "hashchange", function(){
      var a = document.createElement("a");
      a.href = location.hash;
      a.click();
      console.log("hash changed");
    });
    if( location.hash ){
      location.hash = location.hash.slice(0,-1);
    }
  });


  // https://pastebin.com/cE0G4TB6

  // setTimeout(()=>{

  //   console.log( esx.generateStackTrace() )
  // });


  // console.log( esx.parseStackLine("abc:12:34") );


  /*

  example urls

  afc://00008020-001354681A84402E:3/

  
  */

  // setTimeout(function(){
  //   esx.generateStacks().then( function(e){
  //     console._log(e);
  //     for( var key in e ){
  //       // console.log(key + ":", e[key]);
  //       var stack = e[key];
  //       console.warn( stack );
  //       if( stack ){
  //         console.log( esx.normalizeStackTrace(stack) );
  //       }
  //     }
  //   })
  // },2000);
  
  // new Promise(function(){
  //   console.log("asdgfhjfd");
  //   eval("console.log( 'asdf' )");
  //   new Function("console.log('asdf')")();
  //   (function(){}).constructor("console.log('asdf')")();
  //   // ({
  //   //   ["asdfg"](){
  //   //     var stack = esx.generateStackTrace();
  //   //     console.warn( stack );
  //   //     var lines = esx.split( stack, "\n" );
  //   //     for( var i=0; i<lines.length; i++ ){
  //   //       console.log( esx.parseStackLine(lines[i]) );
  //   //     }

  //   //     esx.evalFromJSUrl("console.log('asdf')");
  //   //   }
  //   // })["asdfg"]()
  // });


  // setTimeout(function timeoutCallback(){

  
  // },1000);

  // console.warn( eval("eval('esx.normalizeStackTrace(esx.generateStackTrace())')"));
  // console.warn( esx.parseStackLine("test:testsdfkjhsf/sfdsfd/sfd.js:34:  \n\r:") )

}()