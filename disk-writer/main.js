function randomId(){
  return Math.random().toString(36).slice(2);
}

/* for get requests, add a random param to prevent caching */
function randomParam(){
  return randomId() + "=" + randomId();
}

async function unregisterAll(){
  /* get any sw regs */
  let swregs = await navigator.serviceWorker.getRegistrations();
  
  /* unregister them */
  for( let swreg of swregs ){
    await swreg.unregister();
    console.warn("unregistered a service worker.");
  }
}

!async function(){
  
  await unregisterAll();
  
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
          setTimeout( wait, 200 );
        }
      })
      .catch( e => {
        console.log("waiting...");
        setTimeout( wait, 200 );
      });
    }();
  });
  
  /* use the window.name to get the filename */
  let lastModified = window.name.split(/;/)[0];
  let filename = window.name.slice(lastModified.length+1);
  
  /* changing the location will trigger the service worker to begin the download */
  location.search += "&download=true&lastmodified=" + lastModified + "&filename=" + filename;
  
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
              /* unregister the service worker and then tell the top window it's okay to close */
              unregisterAll().then( () => {
                /* yay its done, tell top window it's done so it can close this */
                top.postMessage("done","*");
              });
              
            }else{
              setTimeout( waitForDone, 200 );
            }
          })
          .catch( e => {
            setTimeout( waitForDone, 200 );
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
  
  
  /* request and print service worker logs every 200 ms */
  !function requestLogs(){
    fetch( "logs" ).then( resp => resp.json() ).then( json => {
      if( json.length ){
        top.postMessage( ["swlogs",json],"*" );
      }
      setTimeout( requestLogs, 200 );
    }).catch( console.error );
  }();
  
}()
