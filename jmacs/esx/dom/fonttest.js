if( typeof esx === "undefined" ){
  esx = {};
}

/**
 * unscrupulous way of determining whether user
 * has Times New Roman installed. draws some letters
 * on the canvas and checks against allowed width
 * and height ranges.
 */

void function(){

  "use strict";

  esx.addFont = function( initsrc ){

    var link = document.createElement("link");
    
    link.rel = "stylesheet";
    link.href = initsrc;
    document.head.appendChild( link );

    var iframes = document.querySelectorAll("iframe");
    var i, iframe;
    for( i=0; i<iframes.length; i++ ){
      iframe = iframes[i];
      iframe.contentWindow.postMessage({"add-link":link.href},"*");
    }

  };





  var acceptableRanges = {
    "A" : {
      widthRange : [89,93],
      heightRange : [86,89]
    },
    "g" : {
      widthRange : [58,60],
      heightRange : [85,88]
    },
    "&" : {
      widthRange : [91,93],
      heightRange : [88,90]
    },
    "M" : {
      widthRange : [109,112],
      heightRange : [84,87]
    },
    "l" : {
      widthRange : [29,32],
      heightRange : [88,90]
    },
    "m" : {
      widthRange : [97,101],
      heightRange : [58,61]
    },
  };

  /**
   * 
   * good values
   * 
   * 
   * windows chromium
   * 
   * A  w=92, h=87
   * g  w=59, h=86
   * &  w=92, h=89
   * M  w=111, h=85
   * l  w=31, h=89
   * m  w=100, h=59
   * 
   * windows ff & i.e.
   * 
   * A  w=91, h=88
   * g  w=59, h=87
   * &  w=92, h=89
   * M  w=110, h=86
   * l  w=30, h=89
   * m  w=98, h=60
   * 
   * iOS safari
   * 
   * A  w=90, h=87
   * g  w=59, h=87
   * &  w=92, h=89
   * M  w=110, h=85
   * l  w=30, h=89
   * m  w=98, h=59
   * 
   * 
   * 
   * 
   * 
   * bad values example (fake times new roman font):
   * 
   * A  w=91, h=84
   * g  w=57, h=94
   * &  w=94, h=86
   * M  w=108, h=84
   * l  w=31, h=89
   * m  w=96, h=61
   */

  var needTimesNewRoman = false;
  for( var testChar in acceptableRanges ){
    var cv = esx.drawLetter(testChar,"'Times New Roman'",128);
    var width = cv.width;
    var height = cv.height;
    if(
      width < acceptableRanges[testChar].widthRange[0] ||
      width > acceptableRanges[testChar].widthRange[1] || 
      height < acceptableRanges[testChar].heightRange[0] || 
      height > acceptableRanges[testChar].heightRange[1]
    ){
      needTimesNewRoman = true;
      break;
    }
  }

  if( needTimesNewRoman ){
    
    setTimeout(function(){
      esx.addFont("style/font/timesnr/init.css");
    },1000);

    console.warn("TimesNewRomanError: Times New Roman had to be imported. Please install Times New Roman to prevent this from happening again.");
    
  }



  

  // /* add necap3 */
  // setTimeout(function(){
  //   esx.addFont("style/font/necap3/init.css");
  // },1000);



}()