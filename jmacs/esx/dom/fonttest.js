void function(){

  var iframe = document.documentElement.appendChild( document.createElement("iframe") );
  iframe.src = "esx/dom/fonttest.html";


  esx.addEventListener(window,"message",function(e){
    if( e.source === iframe.contentWindow ){
      var result = e.data;
      iframe.parentElement.removeChild( iframe );
      console.log( result );
    }
  });

}()