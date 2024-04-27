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
  style.textContent = 
      "[data-dragging] iframe,"
    + "[data-dragging] object,"
    + "[data-dragging] embed{"
    +   "pointer-events:none;"
    + "}"
  ;

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

  esx.makeDraggable = function( elem, updateIntervalInMs, logDebug ){

    logDebug = !!logDebug;

    var _this = this;

    updateIntervalInMs = updateIntervalInMs * 1;
    if( isNaN(updateIntervalInMs) ){
      updateIntervalInMs = 0;
    }

    var offsetX = 0;
    var offsetY = 0;
    var iv;
    var x=0, y=0;
    var active = false;

    function updatePosition(){
      
      var elemRect = _this.getClientRect( elem );
      var parentRect = _this.getClientRect( elem.parentElement );

      var minLeft = 0 - elemRect.width + 20;
      var maxLeft = parentRect.width - 20;
      
      var minTop = 0 - elemRect.height + 20;
      var maxTop = parentRect.height - 20;

      x = Math.max( minLeft, x );
      y = Math.max( minTop, y );
      x = Math.min( maxLeft, x );
      y = Math.min( maxTop, y );

      if(
        (elem.style.left !== x + "px") ||
        (elem.style.top !== y + "px")
      ){

        if( elem.style.left !== x + "px" ){
          elem.style.left = x + "px";
        }
        if( elem.style.top !== y + "px" ){
          elem.style.top = y + "px";
        }

        logDebug && console.log("position updated to ("+x+","+y+")");

      }

    }

    

    function pointerDownHandler(e){
      
      e.preventDefault();
      elem.setAttribute("data-dragging","");
      active = true;

      offsetX = (e.clientX || (e.touches||[{clientX:0}])[0].clientX) - _this.getClientRect(elem).x;
      offsetY = (e.clientY || (e.touches||[{clientX:0}])[0].clientY) - _this.getClientRect(elem).y;

      _this.removeEventListener( elem, "pointerdown", pointerDownHandler );
      _this.removeEventListener( elem, "mousedown", pointerDownHandler );
      _this.removeEventListener( elem, "touchstart", pointerDownHandler );
      _this.addEventListener( window, "pointerup", pointerUpHandler );
      _this.addEventListener( window, "mouseup", pointerUpHandler );
      _this.addEventListener( window, "touchend", pointerUpHandler );

      iv = setInterval( updatePosition, updateIntervalInMs );

    }
    
    function pointerUpHandler(e){

      e.preventDefault();
      elem.removeAttribute("data-dragging");
      active = false;

      _this.addEventListener( elem, "pointerdown", pointerDownHandler );
      _this.addEventListener( elem, "mousedown", pointerDownHandler );
      _this.addEventListener( elem, "touchstart", pointerDownHandler );
      _this.removeEventListener( window, "pointerup", pointerUpHandler );
      _this.removeEventListener( window, "mouseup", pointerUpHandler );
      _this.removeEventListener( window, "touchend", pointerUpHandler );

      clearInterval( iv );

    }

    _this.addEventListener( elem, "pointerdown", pointerDownHandler );
    _this.addEventListener( elem, "mousedown", pointerDownHandler );
    _this.addEventListener( elem, "touchstart", pointerDownHandler );

    function pointerMoveHandler(e){
      if( active ){
        e.preventDefault();
        x = (e.clientX || (e.touches||[{clientX:0}])[0].clientX) - offsetX;
        y = (e.clientY || (e.touches||[{clientX:0}])[0].clientY) - offsetY;
      }
    }

    _this.addEventListener( window, "pointermove", pointerMoveHandler );
    _this.addEventListener( window, "mousemove", pointerMoveHandler );
    _this.addEventListener( window, "touchmove", pointerMoveHandler );
    
  };

}()