if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  var testingDiv = document.createElement("div");

  var mouseEventsSuported = "onmousedown" in testingDiv;
  var touchEventsSupported = "ontouchdown" in testingDiv;
  var pointerEventsSupported = "onpointerdown" in testingDiv;

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

  esx.makeDraggable = function( elem, updateIntervalInMs ){

    var _this = this;

    updateIntervalInMs = updateIntervalInMs * 1;
    if( isNaN(updateIntervalInMs) ){
      updateIntervalInMs = 0;
    }

    var offsetX = 0;
    var offsetY = 0;
    var iv;
    var x=0, y=0;

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

        console.log("position updated to ("+x+","+y+")");

      }

    }

    function pointerDownHandler(e){
      console.warn("pointer down handler running")
      e.preventDefault();
      elem.setAttribute("data-dragging","");
      offsetX = e.clientX - _this.getClientRect(elem).x;
      offsetY = e.clientY - _this.getClientRect(elem).y;
      _this.removeEventListener( elem, "pointerdown", pointerDownHandler );
      _this.removeEventListener( elem, "mousedown", pointerDownHandler );
      _this.removeEventListener( elem, "touchstart", pointerDownHandler );
      _this.addEventListener( window, "pointerup", pointerUpHandler );
      _this.addEventListener( window, "mouseup", pointerUpHandler );
      _this.addEventListener( window, "touchend", pointerUpHandler );
      iv = setInterval( updatePosition, updateIntervalInMs );
    }
    
    function pointerUpHandler(e){
      console.warn("pointer up handler running");
      e.preventDefault();
      elem.removeAttribute("data-dragging");
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
      e.preventDefault();
      if( elem.hasAttribute("data-dragging") ){
        console.log("pointer move handler running");
        x = e.clientX - offsetX;
        y = e.clientY - offsetY;
      }
    }

    _this.addEventListener( window, "pointermove", pointerMoveHandler );
    _this.addEventListener( window, "mousemove", pointerMoveHandler );
    _this.addEventListener( window, "touchmove", pointerMoveHandler );

    // function pointerDownHandler(e){

    //   console.warn("pointer down handler running")

    //   e.preventDefault();

    //   elem.setAttribute("data-dragging","");

    //   offsetX = e.clientX - _this.getClientRect(elem).x;
    //   offsetY = e.clientY - _this.getClientRect(elem).y;

    //   if( pointerEventsSupported ){

    //     _this.removeEventListener(elem,"pointerdown",pointerDownHandler);
    //     // _this.addEventListener(window,"pointermove",pointerMoveHandler);
    //     _this.addEventListener(window,"pointerup",pointerUpHandler);

    //   }else{
        
    //     if( mouseEventsSuported ){
    //       _this.removeEventListener(elem,"mousedown",pointerDownHandler);
    //       // _this.addEventListener(window,"mousemove",pointerMoveHandler);
    //       _this.addEventListener(window,"mouseup",pointerUpHandler);
    //     }

    //     if( touchEventsSupported ){
    //       _this.removeEventListener(elem,"touchstart",pointerDownHandler);
    //       // _this.addEventListener(window,"touchmove",pointerMoveHandler);
    //       _this.addEventListener(window,"touchend",pointerUpHandler);
    //     }

    //   }

    //   iv = setInterval( updatePosition, updateIntervalInMs );
    // }



    // function pointerMoveHandler(e){

    //   console.log("pointer move handler running");

    //   e.preventDefault();

    //   x = e.clientX - offsetX;
    //   y = e.clientY - offsetY;

    // }



    // function pointerUpHandler(e){

    //   console.log("pointer up handler running");

    //   e.preventDefault();

    //   elem.removeAttribute("data-dragging");
      
    //   if( pointerEventsSupported ){

    //     _this.addEventListener(elem,"pointerdown",pointerDownHandler);
    //     _this.removeEventListener(window,"pointermove",pointerMoveHandler);
    //     _this.removeEventListener(window,"pointerup",pointerUpHandler);

    //   }else{
        
    //     if( mouseEventsSuported ){
    //       _this.addEventListener(elem,"mousedown",pointerDownHandler);
    //       _this.removeEventListener(window,"mousemove",pointerMoveHandler);
    //       _this.removeEventListener(window,"mouseup",pointerUpHandler);
    //     }

    //     if( touchEventsSupported ){
    //       _this.addEventListener(elem,"touchstart",pointerDownHandler);
    //       _this.removeEventListener(window,"touchmove",pointerMoveHandler);
    //       _this.removeEventListener(window,"touchend",pointerUpHandler);
    //     }

    //   }

    //   clearInterval( iv );
      
    // }



    // if( pointerEventsSupported ){
    //   _this.addEventListener(elem,"pointerdown",pointerDownHandler);
    //   console.warn("pointer down listener added");
    // }else{
    //   mouseEventsSuported && _this.addEventListener(elem,"mousedown",pointerDownHandler);
    //   touchEventsSupported && _this.addEventListener(elem,"touchstart",pointerDownHandler);
    //   console.warn("mouse down listener added");
    //   console.warn("touch start listener added");
    // }
    
  };

}()