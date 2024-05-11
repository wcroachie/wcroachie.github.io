if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";

  /* ctxParams is optional */
  /* deafults to 2d canvas */
  esx.makeCanvas = function( w, h, ctxType, ctxParams ){
    ctxType = ctxType || "2d";
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext(ctxType, ctxParams);
    return ctx;
  };

  /* tells you the ctx type that was used when the canvas context was constructed */
  esx.getCtxType = function( ctx ){
    var ctxType;
    if( typeof CanvasRenderingContext2D !== "undefined" && ctx instanceof CanvasRenderingContext2D ){
      ctxType = "2d";
    }else if( typeof WebGLRenderingContext !== "undefined" && ctx instanceof WebGLRenderingContext ){
      ctxType = "webgl";
    }else if( typeof WebGL2RenderingContext !== "undefined" && ctx instanceof WebGL2RenderingContext ){
      ctxType = "webgl2";
    }else if( typeof GPUCanvasContext !== "undefined" && ctx instanceof GPUCanvasContext ){
      ctxType = "webgpu"
    }else if( typeof ImageBitmapRenderingContext !== "undefined" && ctx instanceof ImageBitmapRenderingContext ){
      ctxType = "bitmaprenderer";
    }else{
      throw "unknown ctxType";
    }
    return ctxType;
  };

  


  /* settings is optional */
  /**
   * if w and h are undefined, they default to
   * the canvas width and height minus the x and
   * y respectively. if x and y are undefined,
   * they default to 0.
   **/
  esx.getPixelData = function( ctx, x, y, w, h, settings ){

    var canvas = ctx.canvas;

    if( typeof x === "undefined" ){
      x = 0;
    }
    if( typeof y === "undefined" ){
      y = 0;
    }

    x *= 1;
    y *= 1;

    if( !this.isFinite(x) ){
      throw "x must be such that x * 1 is finite";
    }
    
    if( !this.isFinite(y) ){
      throw "y must be such that y * 1 is finite";
    }

    if( typeof w === "undefined" ){
      w = canvas.width - x;
    }
    
    if( typeof h === "undefined" ){
      h = canvas.height - y;
    }
    
    w *= 1;
    h *= 1;

    if( !this.isFinite(w) ){
      throw "w must be such that w * 1 is finite";
    }

    if( !this.isFinite(h) ){
      throw "h must be such that h * 1 is finite";
    }

    if( x < 0 || x > canvas.width ){
      throw "x value out of bounds";
    }
    if( y < 0 || y > canvas.height ){
      throw "y value out of boounds";
    }
    if( w < 0 ){
      throw "w cannot be negative";
    }
    if( h < 0 ){
      throw "h cannot be negative"
    }
    if( x + w > canvas.width ){
      throw "x + w exceeds width of canvas"
    }
    if( y + h > canvas.height ){
      throw "y + h exceeds height of canvas"
    }
    return ctx.getImageData( x,y,w,h, settings ).data;
  };


  esx.makeImageData = function( data, w, h ){
    var iData;
    try{
      iData = new ImageData( data, w, h );
    }catch(e){
      console.warn(e);
      var ctx = this.makeCanvas( w, h );
      var iData = ctx.createImageData( w, h );
      try{
        iData.data.set( data );
      }catch(e){
        console.warn(e);
        for( var i=0; i<data.length; i++ ){
          iData[i] = data[i];
        }
      }
    }
    return iData;
  }

  esx.putPixelData = function( ctx, data, x, y, w, h ){
    var iData = this.makeImageData( data, w, h );
    ctx.putImageData( iData, x, y );
  };


  esx.applyAlphaThreshold = function( ctx, value ){
    value *= 1;
    if( !this.isFinite(value) ){
      throw "value must be such that value * 1 is finite";
    }
    if( value < 0 || value > 255 ){
      throw "value must be a Number between 0 and 255, inclusive"
    }
    var canvas = ctx.canvas;
    var data = this.getPixelData( ctx );
    for( var i=0; i<data.length; i+=4 ){
      var pixel = this.slice( data, i, i+4 );
      if( pixel[3] >= value ){
        pixel[3] = 255;
      }else{
        pixel[3] = 0;
      }
      data[i] = pixel[0];
      data[i+1] = pixel[1];
      data[i+2] = pixel[2];
      data[i+3] = pixel[3];
    }
    ctx.clearRect( 0,0,canvas.width, canvas.height );
    this.putPixelData( ctx, data, 0, 0, canvas.width, canvas.height );
  };


  
  esx.isEmptyRow = function( ctx, y ){
    var canvas = ctx.canvas;
    y *= 1;
    if( !this.isFinite( y ) ){
      throw "y must be such that y * 1 is finite"
    }
    if( y < 0 || y > canvas.height ){
      throw "y value out of bounds"
    }
    var data = this.getPixelData( ctx, 0, y, canvas.width, 1 );
    for( var i=0; i<data.length; i+= 4 ){
      var alpha = data[i+3];
      if( alpha !== 0 ){
        return false;
      }
    }
    return true;
  };

  esx.isEmptyCol = function( ctx, x ){
    var canvas = ctx.canvas;
    x *= 1;
    if( !this.isFinite( x ) ){
      throw "x must be such that y * 1 is finite"
    }
    if( x < 0 || x > canvas.width ){
      throw "x value out of bounds"
    }
    var data = this.getPixelData( ctx, x, 0, 1, canvas.height );
    for( var i=0; i<data.length; i+= 4 ){
      var alpha = data[i+3];
      if( alpha !== 0 ){
        return false;
      }
    }
    return true;
  };

  

  /**
   * returns an object that contains values from each
   * side for the region of the canvas occupied by
   * pixels with an alpha greater than 0
   **/
  esx.getActiveRegion = function( ctx ){
    
    var left=0, top=0, right=0, bottom=0;
    
    var canvas = ctx.canvas;

    for( var x=0; x<canvas.width; x++ ){
      if( this.isEmptyCol(ctx,x) ){
        left += 1;
        continue;
      }else{
        break;
      }
    }

    for( var x=canvas.width-1; x>=0; x-- ){
      if( this.isEmptyCol(ctx,x) ){
        right += 1;
      }else{
        break;
      }
    }

    for( var y=0; y<canvas.height; y++ ){
      if( this.isEmptyRow(ctx,y) ){
        top += 1;
      }else{
        break;
      }
    }

    for( var y=canvas.height-1; y>=0; y-- ){
      if( this.isEmptyRow(ctx,y) ){
        bottom += 1;
      }else{
        break;
      }
    }

    return {
      x : left,
      y : top,
      w : canvas.width - right - left,
      h : canvas.height - bottom - top
    };

  };



  /* creates a canvas from an active region of the provided canvas, using the same context type */
  esx.makeCanvasFromRegion = function( ctx, x, y, w, h, ctxParams ){
    var ctxType = this.getCtxType( ctx );
    var data = this.getPixelData( ctx, x, y, w, h );
    var ctx2 = this.makeCanvas( w,h,ctxType,ctxParams );
    var canvas2 = ctx2.canvas;
    this.putPixelData( ctx2, data, 0,0,canvas2.width, canvas2.height );
    return ctx2;
  };


  esx.drawLetter = function( ch, fontFamily, fontSize, ctxParams ){
    ch += "";
    if( ch.length !== 1 ){
      throw "string length must be 1"
    }
    fontSize *= 1;
    if( !this.isFinite(fontSize) ){
      throw "fontSize must be such that fontSize * 1 is a finite value"
    }
    var ctx = esx.makeCanvas( fontSize * 2, fontSize * 2, "2d", ctxParams );
    ctx.font = fontSize + "px " + fontFamily ;
    ctx.fillStyle = "black";
    ctx.fillText( ch, fontSize, fontSize );
    var region = esx.getActiveRegion(ctx);
    var subCtx = esx.makeCanvasFromRegion( ctx,region.x,region.y,region.w,region.h );
    var subCanvas = subCtx.canvas;
    return subCanvas;
  };


}()