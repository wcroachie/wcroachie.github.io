!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }

  var testingDiv = document.body.appendChild( document.createElement("div") );

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
    +   "opacity:0.5;"
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

      elem.style.left = x + "px";
      elem.style.top = y + "px";

    }

    function pointerDownHandler(e){

      e.preventDefault();

      elem.setAttribute("data-dragging","");

      offsetX = e.clientX - _this.getClientRect(elem).x;
      offsetY = e.clientY - _this.getClientRect(elem).y;

      if( pointerEventsSupported ){

        elem.removeEventListener("pointerdown",pointerDownHandler);
        addEventListener("pointermove",pointerMoveHandler);
        addEventListener("pointerup",pointerUpHandler);

      }else{
        
        if( mouseEventsSuported ){
          elem.removeEventListener("mousedown",pointerDownHandler);
          addEventListener("mousemove",pointerMoveHandler);
          addEventListener("mouseup",pointerUpHandler);
        }

        if( touchEventsSupported ){
          elem.removeEventListener("touchstart",pointerDownHandler);
          addEventListener("touchmove",pointerMoveHandler);
          addEventListener("touchend",pointerUpHandler);
        }

      }

      iv = setInterval( updatePosition, updateIntervalInMs );
    }

    function pointerMoveHandler(e){

      e.preventDefault();

      x = e.clientX - offsetX;
      y = e.clientY - offsetY;

    }

    function pointerUpHandler(e){

      e.preventDefault();

      elem.removeAttribute("data-dragging");
      
      if( pointerEventsSupported ){

        elem.addEventListener("pointerdown",pointerDownHandler);
        removeEventListener("pointermove",pointerMoveHandler);
        removeEventListener("pointerup",pointerUpHandler);

      }else{
        
        if( mouseEventsSuported ){
          elem.addEventListener("mousedown",pointerDownHandler);
          removeEventListener("mousemove",pointerMoveHandler);
          removeEventListener("mouseup",pointerUpHandler);
        }

        if( touchEventsSupported ){
          elem.addEventListener("touchstart",pointerDownHandler);
          removeEventListener("touchmove",pointerMoveHandler);
          removeEventListener("touchend",pointerUpHandler);
        }

      }

      clearInterval( iv );
      
    }

    if( pointerEventsSupported ){
      elem.addEventListener("pointerdown",pointerDownHandler);
    }else{
      mouseEventsSuported && elem.addEventListener("mousedown",pointerDownHandler);
      touchEventsSupported && elem.addEventListener("touchstart",pointerDownHandler);
    }
    
  };

}()