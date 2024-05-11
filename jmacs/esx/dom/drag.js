if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  /**
   * use data-dragging selector to override iframe
   * pointer events for iframes, objects, or embeds
   * that are descendants of the dragged elem
   **/
  var style = document.documentElement.appendChild( document.createElement("style") );
  style.textContent = ""
    + "[data-dragging] iframe,"
    + "[data-dragging] object,"
    + "[data-dragging] embed{"
    +   "pointer-events:none;"
    + "}"
  ;

  esx.DRAGGABLE_UPDATE_INTERVAL_MS = 1000/60;
  esx.DRAGGABLE_ELEMS = [];

  esx.makeDraggable = function( elem ){
    if( esx.DRAGGABLE_ELEMS.indexOf(elem) !== -1 ){
      throw "could not make draggable, element was already draggable";
    }
    esx.push( esx.DRAGGABLE_ELEMS, elem );
  };

  var offsetX = 0;
  var offsetY = 0;
  var iv;
  var active = false;
  var elemRect = { x:0,y:0,width:0,height:0 };
  var parentRect = { x:0,y:0,width:0,height:0 };
  var x=0, y=0;

  function updatePosition( elem ){
    
    // if( typeof esx.getClientRect === "function" ){
      elemRect = esx.getClientRect( elem );
      parentRect = esx.getClientRect( elem.parentElement );
    // }
    
    var minLeft = 0 - elemRect.width + 20;
    var maxLeft = parentRect.width - 20;
    
    var minTop = 0 - elemRect.height + 20;
    var maxTop = parentRect.height - 20;

    var _x = Math.max( minLeft, x );
    var _y = Math.max( minTop, y );
    _x = Math.min( maxLeft, _x );
    _y = Math.min( maxTop, _y );

    var snapDistance = 10;

    if( _x < 0 + snapDistance && _x > 0 - snapDistance ){
      _x = 0;
    }

    if( _x > parentRect.width - elemRect.width - snapDistance && _x < parentRect.width - elemRect.width + snapDistance ){
      _x = parentRect.width - elemRect.width;
    }

    if( _x > maxLeft - snapDistance ){
      _x = maxLeft;
    }

    if( _x < minLeft + snapDistance ){
      _x = minLeft;
    }

    if( _y < 0 + snapDistance && _y > 0 - snapDistance ){
      _y = 0;
    }

    if( _y > parentRect.height - elemRect.height - snapDistance && _y < parentRect.height - elemRect.height + snapDistance ){
      _y = parentRect.height - elemRect.height;
    }

    if( _y > maxTop - snapDistance ){
      _y = maxTop;
    }

    if( _y < minTop + snapDistance ){
      _y = minTop;
    }

    if( elem.style.right !== "auto" ){
      elem.style.right = "auto";
    }

    if( elem.style.bottom !== "auto" ){ 
      elem.style.bottom = "auto";
    }

    if( elem.style.left !== _x + "px" ){
      elem.style.left = _x + "px";
    }

    if( elem.style.top !== _y + "px" ){
      elem.style.top = _y + "px";
    }

  }





  /**
   * to minimize unnecessary dom mutations,
   * instead of updating the position every time
   * the pointermove event fires, this instead only
   * updates the position every n ms, while the
   * dragging action is taking place. in the case
   * that for whatever reason the environment fires
   * events more frequently than the desired visual
   * update. an absent, falsy or otherwise invalid
   * second argument is silently coerced to zero.
   */


  function pointerDownHandler(e){
    if( esx.DRAGGABLE_ELEMS.indexOf(e.target) !== -1 ){
      e.preventDefault();
      active = true;
      var rect = esx.getClientRect( e.target );
      offsetX = ( e.clientX || ( e.touches||[{}] )[0].clientX || 0 ) - rect.x;
      offsetY = ( e.clientY || ( e.touches||[{}] )[0].clientY || 0 ) - rect.y;
      x = ( e.clientX || ( e.touches||[{}] )[0].clientX || 0 ) - offsetX;
      y = ( e.clientY || ( e.touches||[{}] )[0].clientY || 0 ) - offsetY;
      e.target.setAttribute("data-dragging","");
      iv = esx.setInterval( function(){ updatePosition( e.target ) }, esx.DRAGGABLE_UPDATE_INTERVAL_MS ); 
    }
    esx.removeEventListener( window, "pointerdown", pointerDownHandler );
    esx.removeEventListener( window, "mousedown", pointerDownHandler );
    esx.removeEventListener( window, "touchstart", pointerDownHandler );
    esx.addEventListener( window, "pointermove", pointerMoveHandler );
    esx.addEventListener( window, "mousemove", pointerMoveHandler );
    esx.addEventListener( window, "touchmove", pointerMoveHandler );
    esx.addEventListener( window, "pointerup", pointerUpHandler );
    esx.addEventListener( window, "mouseup", pointerUpHandler );
    esx.addEventListener( window, "touchend", pointerUpHandler );
  }


  function pointerMoveHandler(e){
    if( active ){
      e.preventDefault();
      x = ( e.clientX || ( e.touches||[{}] )[0].clientX || 0 ) - offsetX;
      y = ( e.clientY || ( e.touches||[{}] )[0].clientY || 0 ) - offsetY;
    }
  }

  function pointerUpHandler(e){
    var elems = document.querySelectorAll("[data-dragging]") || [];
    if( elems.length ){
      var i, elem;
      for( i=0; i<elems.length; i++ ){
        elem = elems[i];
        elem.removeAttribute("data-dragging");
      }
      e.preventDefault();
      active = false;
      esx.clearInterval( iv );
    }
    esx.removeEventListener( window, "pointermove", pointerMoveHandler );
    esx.removeEventListener( window, "mousemove", pointerMoveHandler );
    esx.removeEventListener( window, "touchmove", pointerMoveHandler );
    esx.removeEventListener( window, "pointerup", pointerUpHandler );
    esx.removeEventListener( window, "mouseup", pointerUpHandler );
    esx.removeEventListener( window, "touchend", pointerUpHandler );
    esx.addEventListener( window, "pointerdown", pointerDownHandler );
    esx.addEventListener( window, "mousedown", pointerDownHandler );
    esx.addEventListener( window, "touchstart", pointerDownHandler );
  }

  esx.addEventListener(window,"pointerdown",pointerDownHandler);
  esx.addEventListener( window, "mousedown", pointerDownHandler );
  esx.addEventListener( window, "touchstart", pointerDownHandler );

}()