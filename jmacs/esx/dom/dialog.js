if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";
  
  /* src is url to iframe relative to top window location */
  esx.createDialog = function( src ){

    /* get a unique date */
    var now = Date.now();
    for( ;; ){
      if( Date.now() > now ){
        break;
      }
    }
    var wrapperId = "_-" + Date.now();

    var backdrop = document.createElement("div");    
    var wrapper = document.createElement("div");

  };


}()



// async function requestTransientActivation( optionalMessage=undefined ){
//   return await new Promise( (res,rej) => {
//     try{
//       let dg = document.createElement("dialog");
//       dg.textContent = optionalMessage !== undefined ? optionalMessage : "click anywhere to continue";
//       document.documentElement.appendChild( dg );
//       dg.showModal();
//       dg.onclick = () => {
//         dg.close();
//         res();
//       };
//     }catch(e){
//       rej(e);
//     }
//   });
// }
