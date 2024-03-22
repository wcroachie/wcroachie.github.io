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
          }
        }
        if( !closed ){
          setTimeout( pump );
        }
      }();
    },
  });
  
  onfetch = e => {
    
    console.warn( e.request.destination );
    
    if( e.request.url.endsWith("ping") ){
      e.respondWith( new Response("pong") );
      return;
    }
    
    let params = Object.fromEntries( new URL( e.request.url ).searchParams );
    
    if( (e.request.destination === "document") && ("download" in params) ){
      
      let filename = params.filename;
      
      // let headers = {
      //   "content-type" : "application/octet-stream",
      //   "content-disposition" : "attachment; filename=" + filename,  
      // };
      
      let headers = new Headers({
        'Content-Type': 'application/octet-stream; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'",
        'X-Content-Security-Policy': "default-src 'none'",
        'X-WebKit-CSP': "default-src 'none'",
        'X-XSS-Protection': '1; mode=block',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      });
      
      // Make filename RFC5987 compatible
      filename = encodeURIComponent(filename).replace(/['()]/g, escape).replace(/\*/g, '%2A');
      headers.set('Content-Disposition', "attachment; filename*=UTF-8''" + filename);
      
      let options = { headers };
      let resp = new Response( stream, options );
      
      e.respondWith( resp );
      
    }
    
    
  };
  
}()
