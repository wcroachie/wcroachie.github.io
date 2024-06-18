CSS.supports("-webkit-touch-callout:none") && function(){

  "use strict";

  const wrapper = document.documentElement.appendChild( document.createElement("div") );
  wrapper.id = "x-" + +new Date();
  const style = document.documentElement.appendChild( document.createElement("style") );
  style.textContent = `
  
    html{
      border:5px solid blue;
      position:fixed;
      display:block;
      left:0;
      top:0;
      width:100%;
      height:50%;
      box-sizing:border-box;
    }
    #${wrapper.id}{
      border:5px solid blue;
      position:fixed;
      display:block;
      left:0;
      top:50%;
      width:100%;
      height:50%;
      box-sizing:border-box;
      overflow: auto;
    }
    #${wrapper.id} > span{
      display:block;
    }
  `;

  for( let key in console ){
    let method = console[key];
    if( typeof method === "function" ){
      console[key + "_"] = method;
      console[key] = (...args) => {
        for( let arg of args ){
          let span = wrapper.appendChild( document.createElement("span") );
          span.textContent = "> " + key + ": " + arg;
        }
        return method.apply( console, args );
      };
    }
  }

}()