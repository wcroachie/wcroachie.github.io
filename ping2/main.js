function randomId(){
  return Math.random().toString(36).slice(2);
}

/* for get requests, add a random param to prevent cachine */
function randomParam(){
  return randomId() + "=" + randomId();
}

!async function(){
  
  try{
    
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
    
    /* wait for service worker to respond to "ping" with "pong" */
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
    
    let btn0 = document.body.appendChild( document.createElement("button") );
    btn0.textContent = "start pumping bytes";
    
    let btn1 = document.body.appendChild( document.createElement("button") );
    btn1.textContent = "close the stream";
    
    let iv;
    
    btn0.onclick = () => {
      location.search += "&download=true&filename=my-file.bin";
      iv = setInterval(()=>{
        let ui8 = new Uint8Array( new Array(1024).fill(0) );
        swreg.active.postMessage( ui8 );
      },200);
    };
    
    btn1.onclick = () => {
      swreg.active.postMessage( "close" );
      clearInterval( iv );
    };
    
    
    
  }catch(e){
    
    console.error( e );
    
  }
  
}()
