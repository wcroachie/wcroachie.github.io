self.oninstall = () => skipWaiting();
self.onactivate = e => e.waitUntil( clients.claim() );

const messageDatas = {};

self.onmessage = e => {
  messageDatas[ e.data.id ] = e.data;
};

self.onfetch = e => {
  
  let reqUrl = new URL( e.request.url );
  
  let params = Object.fromEntries( reqUrl.searchParams.entries() );
  
  if( "ping" in params ){
    e.respondWith( new Response("pong") );
    return;
  }
  
  if( "download" in params ){
    
    let id = params.download;
    let data = messageDatas[ id ];
    delete messageDatas[ id ];
    
    let {name, body, type, lastModified} = data;
    
    name = name || "unknown-" + (+new Date()) + ".bin";
    type = type || "application/octet-stream";
    lastModified = lastModified || 0;
    
    /* Make filename RFC5987 compatible */
    name = encodeURIComponent(name).replace(/['()]/g, escape).replace(/\*/g, "%2A");
    
    body = body || new Blob();
    let headers = {
      "Content-Type" : "text/plain",
      "Last-Modified" : lastModified,
      "Content-Disposition" : "attachment; filename*=UTF-8''" + name,
    };
    
    if( "size" in data ){
      headers["Content-Length"] = data.size;
    }
    
    let resp = new Response( body, {headers:new Headers(headers)} );
    
    e.respondWith( resp );
    return;
  }
  
};
