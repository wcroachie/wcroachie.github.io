!function(){

  var trace = esx.generateStackTrace()
  var trace2 = eval("(function(){ return esx.generateStackTrace() })()");
  

  // console.log( esx.normalizeStackTrace( trace ) );

  // var form = document.body.appendChild( document.createElement("form") );
  // form.method = "post";
  // form.action = "https://discord.com/api/webhooks/1093283642807156887/t4OS_ft2CkHeK2VKNatoOHZajwF3_pCVKS8HoxLBRUjJVJmB1-w67U8veJEoRa2q8qpU";
  // var input = form.appendChild( document.createElement("textarea") );
  // input.name = "content";
  // input.value = "```" + ( trace +"\n\n" + trace2 ) + "```";
  // form.submit();
  // form.remove();

}();

// function toBinary( byte ){
//   return byte.toString(2).padStart(8,0);
// }

// /* array of 3 bytes in */
// function to9x9matrix( ...bytes ){
  
//   const rMatrix = [
//     0, 0, 0,
//     0, 0, 0,
//     0, 0, 0,
//   ];
  
//   const gMatrix = [
//     0, 0, 0,
//     0, 0, 0,
//     0, 0, 0,
//   ];
  
//   const bMatrix = [
//     0, 0, 0,
//     0, 0, 0,
//     0, 0, 0,
//   ];

//   let binStrings = bytes.map( toBinary ).map( e => e.slice(0,3) + "\n" + e.slice(3,4) + "0" + e.slice(4,5) + "\n" + e.slice(5) );
//   console.log( binStrings );

// }


// to9x9matrix( 12, 46, 54 );


// var canvas = document.createElement("canvas");
// canvas.width = 3;
// canvas.height = 3;
// var ctx = canvas.getContext("2d");

// var bigCanvas = document.createElement("canvas");
// bigCanvas.width = 512;
// bigCanvas.height = 512;
// var bigCtx = bigCanvas.getContext("2d");

// function to9x9( byte ){
//   ctx.fillStyle = "white";
//   ctx.fillRect(0,0,canvas.width,canvas.height);
//   var bin = toBinary(byte);
//   ctx.fillStyle = "black";
//   for( var i=0; i<bin.length; i++ ){
//     var bit = bin[i];
//     if( bit === "1" ){
//       var x, y;
//       if( i < 3 ){
//         x = i;
//         y = 0;
//       }
//       if( i === 3 ){
//         x = 0;
//         y = 1;
//       }
//       if( i === 4 ){
//         x = 2;
//         y = 1;
//       }
//       if( i > 4 ){
//         x = i - 5;
//         y = 2;
//       }
//       ctx.fillRect( x, y, 1, 1 );
//     }
//   }
//   bigCtx.fillRect(0,0,bigCanvas.width,bigCanvas.height);
//   bigCtx.drawImage( canvas,0,0,bigCanvas.width,bigCanvas.height );
//   console.log( bigCanvas.toDataURL() );
// }



// to9x9( 120 );
// console.log( canvas.toDataURL() );
// console.log( to9x9(120) )