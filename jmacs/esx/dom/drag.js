if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  /**
   * @todo
   *  - allow snapping
   *  - create a resize handle + custom resize functionality
   * @todo
   *  - allow snapping
   *  - create a resize handle + custom resize functionality
   * @todo
   *  - allow snapping
   *  - create a resize handle + custom resize functionality
   * @todo
   *  - allow snapping
   *  - create a resize handle + custom resize functionality
   */

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

  esx.makeDraggable = function( elem, updateIntervalInMs ){

    var _this = this;

    updateIntervalInMs = updateIntervalInMs * 1;
    if( !isFinite(updateIntervalInMs) ){
      updateIntervalInMs = 0;
    }

    var offsetX = 0;
    var offsetY = 0;
    var iv;
    var active = false;

    var elemRect = { x:0,y:0,width:0,height:0 };
    var parentRect = { x:0,y:0,width:0,height:0 };

    if( typeof this.getClientRect === "function" ){
      elemRect = this.getClientRect( elem );
      parentRect = this.getClientRect( elem.parentElement );
    }

    var x = elemRect.x || 0;
    var y = elemRect.y || 0;

    updatePosition();

    function updatePosition(){
      
      if( typeof _this.getClientRect === "function" ){
        elemRect = _this.getClientRect( elem );
        parentRect = _this.getClientRect( elem.parentElement );
      }
      
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


    /**
     * monitor the parent client rect for size
     * changes, and update if it has changed
     **/
    setInterval( function(){
      if( typeof _this.getClientRect === "function" && !_this.compareObjs( _this.getClientRect(elem.parentElement), parentRect ) ){
        updatePosition();
      }
    }, updateIntervalInMs );

  };

}()