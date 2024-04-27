!function(){
  "use strict";

  /**
   * this script, when included inline, attempts to
   * re-parse all html after its placement in the DOM
   * so that any scripts with a non-data-or-blob-url
   * 'src' attribute or link tags with an href that is 
   * non-data-or-blob-url have a random parameter added
   * so that they are less likely to be fetched from a
   * caching mechanism the environment is using, assuming
   * it behaves this way. this is mainly to make debugging
   * easier so that the page always refreshes newly.
   * 
   * note that this should only be used if the site is
   * in development, but otherwise may cause a delay and
   * flashes of unstyled content, so remember to remove for 
   * production code.
   **/


  function randomId(){
    return Math.floor( Math.random() * 1e10 ).toString( 36 );
  }

  function addRandomParam( url ){
    url += "";
    if( url.indexOf("?") === -1 ){
      url += "?"
    }else{
      url += "&"
    }
    var a = randomId();
    var b = randomId();
    url += a + "=" + b;
    return url;
  }

  function fixElemAttr( elem, attrName ){
    var val = elem.getAttribute( attrName );
    if( 
      typeof val === "string" &&
      val.length &&
      val.indexOf("data:") !== 0 &&
      val.indexOf("blob:") !== 0
    ){
      elem.setAttribute( attrName, addRandomParam(val) );
    }
  }

  function updateElem( elem ){
    if( elem.hasAttribute("src") ){
      fixElemAttr( elem, "src" );
    }
    if( elem.hasAttribute("href") ){
      fixElemAttr( elem, "href" );
    }
    if( elem.hasAttribute("data") ){
      fixElemAttr( elem, "data" );
    }
  }

  /* IMPORTANT - remove this script so that it doesnt cause an infinite loop */
  try{
    document.currentScript.parentElement.removeChild( document.currentScript );
  }catch(e){
    console.warn(e);
    try{
      document.scripts[ document.scripts.length - 1 ].parentElement.removeChild( document.scripts[ document.scripts.length - 1 ] );
    }catch(e){
      console.warn(e);
      try{
        document.querySelector("script[src*='nocache.js']").remove();
      }catch(e){
        console.warn(e);
      }
    }
  }

  /* interrupt the parser here */
  document.write("<plaintext>");

  !function wait(){

    var plaintext = document.querySelector("plaintext");

    if( !plaintext ){
      console.log("waiting...");
      setTimeout( wait );
      return;
    }

    if( !plaintext.textContent.length ){
      console.log("waiting...");
      setTimeout( wait );
      return;
    }

    var plaintextContent = plaintext.textContent;

    plaintext.parentElement.removeChild( plaintext );
    
    var vHtml = document.createElement("html");

    if( document.body.innerHTML.length ){
      vHtml.innerHTML += "<head></head>";
    }

    vHtml.innerHTML += plaintextContent;

    var descendants = vHtml.querySelectorAll("*");
    for( var i=0; i<descendants.length; i++ ){
      updateElem( descendants[i] );
    }

    if( !document.head ){
      document.documentElement.appendChild( document.createElement("head") );
    }

    if( !document.body ){
      document.documentElement.appendChild( document.createElement("body") );
    }

    var vHead = vHtml.querySelector("head");
    var vBody = vHtml.querySelector("body");

    if( vHead ){

      for( var i=0; i<vHead.attributes.length; i++ ){
        var attrName = vHead.attributes[i].name;
        var attrValue = vHead.getAttribute( attrName );
        document.head.setAttribute( attrName, attrValue );
      }

      /**
       * need to temporarily store references in
       * array due to the children changing state
       * when code in loop executes
       **/
      var vHeadChildren = [];
      for( var i=0; i<vHead.children.length; i++ ){
        vHeadChildren[ vHeadChildren.length ] = vHead.children[i];
      }

      for( var i=0; i<vHeadChildren.length; i++ ){
        document.head.appendChild( vHeadChildren[i] );
      }

    }

    if( vBody ){
      
      for( var i=0; i<vBody.attributes.length; i++ ){
        var attrName = vBody.attributes[i].name;
        var attrValue = vBody.getAttribute( attrName );
        document.body.setAttribute( attrName, attrValue );
      }

      /**
       * need to temporarily store references in
       * array due to the children changing state
       * when code in loop executes
       **/
      var vBodyChildren = [];
      for( var i=0; i<vBody.children.length; i++ ){
        vBodyChildren[ vBodyChildren.length ] = vBody.children[ i ];
      }

      for( var i=0; i<vBodyChildren.length; i++ ){
        document.body.appendChild( vBodyChildren[i] );
      }
    }

    var html = document.documentElement.outerHTML;

    document.write("<!DOCTYPE html>" + html );
   

  }();

}()