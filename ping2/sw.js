!function(){
  
  oninstall = () => skipWaiting();
  onactivate = e => e.waitUntil( clients.claim() );
  
  let queue = [];
  let closed = false;
  
  onmessage = e => {
    if( e.data === "close" ){
      closed = true;
    }else{
      queue.push( e.data );
    }
  };
  
  let stream = new ReadableStream({
    start( ctl ){
      !function pump(){
        if( queue.length ){
          let ui8 = queue.shift();
          ctl.enqueue( ui8 );
        }else{
          if( closed ){
            ctl.close();
            /**
             * main.js will ping until it hears "done",
             * then it will tel top window to close 
             * so that it does not close before the stream
             * is done saving
             */
            onfetch = e => {
              if( e.request.url.endsWith("ping") ){
                e.respondWith( new Response("done") );
              }
            };
            
          }
        }
        if( !closed ){
          setTimeout( pump );
        }
      }();
    },
  });
  
  onfetch = e => {
    
    if( e.request.url.endsWith("ping") ){
      e.respondWith( new Response("pong") );
      return;
    }
    
    let params = Object.fromEntries( new URL( e.request.url ).searchParams );
    
    if( (e.request.destination === "document" || e.request.destination === "iframe") && ("download" in params) ){
      
      let headers = new Headers({
        'Content-Type': 'application/octet-stream; charset=utf-8',
      });
      
      let filename = params.filename;
      
      // Make filename RFC5987 compatible
      filename = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, '%2A');
      headers.set('Content-Disposition', "attachment; filename*=UTF-8''" + filename);
      
      let options = { headers };
      let resp = new Response( stream, options );
      
      e.respondWith( resp );
      
    }
    
    
  };
  
}()
