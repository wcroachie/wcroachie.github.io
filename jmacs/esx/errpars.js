if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";

  /* create a "revealed" clone of an error */
  esx.cloneError = function( error ){
    var obj = {
      cause : error.cause,
      columnNumber : error.columnNumber,
      fileName : error.fileName,
      lineNumber : error.lineNumber,
      message : error.message,
      name : error.name,
      stack : error.stack,
      type : this.toPrimitiveString( error )
    };
    return obj;
  };


  esx.cloneException = function( exception ){
    var obj = {
      code : exception.code,
      message : exception.message,
      name : exception.name,
      stack : exception.stack,
      type : this.toPrimitiveString( exception )
    };
    return obj;
  };

  esx.parseStackLine = function( line ){

    if( line[line.length - 1] === ")" ){
      line = this.slice( line, 0, -1 );
      if( line.indexOf("(") !== -1 ){
        line = this.slice( line, line.indexOf("(") + 1 );
      }
    }

    var betweenColons = this.split( line, ":" );
    var lineno=null, colno=null;
    if(
      this.canBeNum( betweenColons[betweenColons.length - 1 ] ) &&
      this.canBeNum( betweenColons[betweenColons.length - 2 ] )
    ){
      colno = this.pop( betweenColons ) * 1;
      lineno = this.pop( betweenColons ) * 1;
    }

    line = this.join( betweenColons, ":" );

    line = this.trimWhitespace( line );

    if( this.slice( line, -13 ) === "[native code]"){
      line = "[native code]"
    }else{
      line = this.pop( this.split(line," ") );
      line = this.pop( this.split(line,"@") );
      line = this.split( line, "#" )[0];
      line = this.split( line, "?" )[0];
      var scheme = this.getUrlScheme( location.href );
      var domain = this.getUrlDomain( location.href );
      var path = this.getUrlPath( location.href );
      var parentpath = this.getPathParentpath( path );
      var parentUri = scheme + "//" + domain + parentpath;
      var relativeDir = this.pop( this.split( line, parentUri ) );
      line = relativeDir;
    }

    var obj = {
      filename : line,
      lineno : lineno,
      colno : colno
    };

    return obj;

  };

}()