if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  esx.getMaxSupportedZIndex = function(){
    var div = document.documentElement.appendChild( document.createElement("div") );
    div.style.zIndex = Number.MAX_SAFE_INTEGER;
    var result = getComputedStyle( div ).zIndex;
    div.parentElement.removeChild( div );
    return result;
  };

  esx.getHighestZIndexInDOM = function(){
    var max = 0;
    var all = document.querySelectorAll("*");
    var i, elem, zIndex;
    for( i=0; i<all.length; i++ ){
      elem = all[i];
      zIndex = getComputedStyle(elem).zIndex * 1;
      if( this.isFinite(zIndex) ){
        if( zIndex > max ){
          max = zIndex;
        }
      }
    }
    return max;
  };

}()