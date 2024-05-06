if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";

  esx.NaN = "a" * 1;
  esx.undefined = function(){}();
  esx.Infinity = 1/0;

  esx.isNaN = function( val ){
    return (val * 1) !== (val * 1);
  };

  esx.isFinite = function( val ){
    return !this.isNaN(val) && val !== -this.Infinity && val !== this.Infinity;
  };

}()