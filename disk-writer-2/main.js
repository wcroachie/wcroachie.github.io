void async function(){

  "use strict";

  async function unregisterAll(){
    /* get any sw regs */
    let swregs = await navigator.serviceWorker.getRegistrations();
    /* unregister them */
    for( let swreg of swregs ){
      await swreg.unregister();
      console.warn("unregistered a service worker."); 
    }  
  }
  
  function sleep( ms ){
    return new Promise( res => setTimeout( res, ms ) );
  }
  
  async function waitForResponse( flag, response ){
    try{
      let resp = await fetch( "?" + flag );
      let text = await resp.text();
      if( text === response ){
        return;
      }else{
        console.log("waiting...");
        await sleep();
        await waitForResponse( flag, response );
      }
    }catch(e){
      console.log("waiting...");
      await sleep();
      await waitForResponse( flag, response );
    }
  }
  
  await unregisterAll();
  
  /* register the new one */
  let swreg = await navigator.serviceWorker.register( "sw.js?" + btoa(Math.random()) + "=" + btoa(Math.random()) );
  console.warn("registered a service worker.");

  /* wait for service worker to respond to "ping" with "pong", then we know it is successfully intercepting requests */
  await waitForResponse("ping","pong");
  
  console.warn("sw ready");
  
  window.onmessage = e => {
    /* "register" the download using a unique id */
    /* add an id to it (don't use b64, not url safe) */
    e.data.id = Math.random().toString(36).slice(2);
    /* forward data to sw */
    swreg.active.postMessage( e.data, [e.data.body] );    
    /* trigger download after some time, to make sure sw has recieved the data and stream */
    setTimeout(()=>{
      location.search = "?download=" + e.data.id;
    },200);
  };
  
  /* send a null msg to top to let it know we're ready */
  window.top.postMessage(null,"*");
  
}()