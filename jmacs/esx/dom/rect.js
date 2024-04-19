!function(){

  if( typeof esx === "undefined" ){
    esx = {};
  }


  /**
   * tries to get element's bounding client rect.
   * fails, warns, and always returns an object with
   * x, y, width, and heigh properties
   */
  esx.getClientRect = function( elem ){

    var x, y, width, height;
    
    if( typeof elem.getBoundingClientRect === "function" ){

      var rect = elem.getBoundingClientRect();
      
      x = rect.x || rect.left || 0;
      y = rect.y || rect.top || 0;
      
      if( rect.width ){
        width = rect.width;
      }else{
        if( rect.right ){
          width = rect.right - x;
        }else{
          width = 0;
        }
      }

      if( rect.height ){
        height = rect.height;
      }else{
        if( rect.bottom ){
          height = rect.bottom - y;
        }else{
          height = 0;
        }
      }

    }else{

      console.warn( elem + ".getBoundingClientRect was not a method." );

    }

    var obj = {
      x : x,
      y : y,
      width : width,
      height : height
    };

    return obj;

  };

}()