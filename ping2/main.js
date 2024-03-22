function randomId(){
  return Math.random().toString(36).slice(2);
}

/* for get requests, add a random param to prevent caching */
function randomParam(){
  return randomId() + "=" + randomId();
}

!async function(){
  
  /* get any sw regs */
  let swregs = await navigator.serviceWorker.getRegistrations();
  
  /* unregister them */
  for( let swreg of swregs ){
    await swreg.unregister();
    console.warn("unregistered a service worker.");
  }
  
  /* register the new one */
  let swreg = await navigator.serviceWorker.register( "sw.js?" + randomParam() );
  console.warn("registered a service worker.");
  
  /* wait for service worker to respond to "ping" with "pong", then we know it is successfully intercepting requests */
  await new Promise( res => {
    !function wait(){
      fetch( "ping" )
      .then( resp => resp.text() )
      .then( text => {
        if( text === "pong" ){
          res();
        }else{
          console.log("waiting...");
          setTimeout( wait );
        }
      })
      .catch( e => {
        console.log("waiting...");
        setTimeout( wait );
      });
    }();
  });
  
  /* use the window.name to get the filename */
  let filename = window.name;
  
  /* changing the location will trigger the service worker to begin the download */
  location.search += "&download=true&filename=" + filename;
  
  onmessage = e => {  
    if( e.source === top ){
      if( e.data === "close" ){
        
        /**
         * message from top is telling sw to close,
         * but we have to wait until the sw is done
         * streaming its internal queue first.
         * wait for that, then when sw is done,
         * tell the top window it's okay to close
         * this
         */
        swreg.active.postMessage("close");
        
        /* now keep pinging the sw until it responds with "done" */
        !function waitForDone(){
          fetch( "ping" )
          .then( resp => resp.text() )
          .then( text => {
            if( text === "done" ){
              /* yay its done, tell top window it's done so it can close this */
              top.postMessage("done","*");
            }else{
              console.log("waiting...");
              setTimeout( waitForDone );
            }
          })
          .catch( e => {
            console.log("waiting...");
            setTimeout( waitForDone );
          });
        }();
        
        return;
      }else{
        /* all other messages besides "close" are ui8's so they should be posted to sw */
        swreg.active.postMessage( e.data );
      }
    }
  };
  
  /* notify the top that we are ready to begin accepting messages */
  top.postMessage("ready","*");
  
}()
