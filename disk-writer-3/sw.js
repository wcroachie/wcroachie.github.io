void function(){

  "use strict";

  self.oninstall = () => self.skipWaiting();
  self.onactivate = e => e.waitUntil( clients.claim() );
  
  function sleep( ms ){
    return new Promise( res => setTimeout( res, ms ) );
  }
  
  const downloads = {};
  
  let winClient;
  
  self.onmessage = e => {
    
    winClient = winClient || e.source;
  
    let {id, headers, buffer, closing} = e.data;
  
    if( id in downloads === false ){
      downloads[id] = {
        headers : headers,
        queue : [],
        closing : false
      };
      /**
       * tell window (and thus top window) it's
       * ready to trigger this download
       **/
      winClient.postMessage({ id, startDownload : true });
    }
  
    if( closing ){
      downloads[ id ].closing = true;
    }else{ 
      downloads[ id ].queue.push( buffer );
    }
  
  };
  
  self.onfetch = e => {
    
    let reqUrl = new URL( e.request.url );
    
    let params = Object.fromEntries( reqUrl.searchParams.entries() );
    
    if( "ping" in params ){
      e.respondWith( new Response("pong") );
      return;
    }
    
    /**
     * some browsers (so far, iOS brave it seems) might not
     * handle service worker downloads properly. in case that a
     * file cannot be downloaded using a service worker, "open"
     * can be used in place of "download" to instead open the
     * streamed file in a new tab.
     */
    if( "download" in params || "open" in params ){
      
      let id = params.download || params.open;
      let downloadObj = downloads[ id ];
      let {queue, headers} = downloadObj;

      if( "open" in params ){
        headers["Content-Disposition"] = "inline";
      }
  
      let stream = new ReadableStream({
        start(ctl){
          void async function pump(){
            
            if( queue.length ){
              /* important - only do 1 at a time */
              ctl.enqueue( new Uint8Array(queue.shift()) );
            }else{
              if( downloadObj.closing ){
                ctl.close();
                delete downloads[ id ];
                winClient.postMessage({id, closed : true});
                return;
              }
            }
  
            /* give it time to breathe */
            await sleep(200);
            pump();
  
          }();
        }
      });
  
      headers = new Headers( headers );
      
      e.respondWith( new Response(stream,{headers}) );
  
      return;
    }
  
  };

}()