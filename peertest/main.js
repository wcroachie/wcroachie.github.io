"use strict";

let input = document.querySelector("input[type='text']");

let initHostBtn = document.querySelector(".init-host");
let initClientBtn = document.querySelector(".init-client");

let disconnectBtn = document.querySelector(".disconnect");
let reconnectBtn = document.querySelector(".reconnect");
let destroyBtn = document.querySelector(".destroy");

input.disabled = false;

initHostBtn.disabled = false;
initClientBtn.disabled = false;

disconnectBtn.disabled = true;
reconnectBtn.disabled = true;
destroyBtn.disabled = true;

function createHostSession( hostId, onOpen, onConnection, onClose, onDisconnected, onError ){
  console.log("initializing host session...");
  let peer = new Peer( hostId, {
    debug : 3,
    host: "1.peerjs.com",
    port: 443,
    path: "/",
    secure : true,
    pingInterval : 2500,
  } );
  peer.on("open",onOpen);
  peer.on("connection", onConnection);
  peer.on("close",onClose);
  peer.on("disconnected",onDisconnected);
  peer.on("error",onError);
  console.log( peer );
  return peer;
}

/* https://github.com/peers/peerjs/issues/948 */
function createClientSession( onOpen, onConnection, onClose, onDisconnected, onError ){
  console.log("initializing client session...");
  let peer = new Peer( null, {
    debug : 3,
    host: "1.peerjs.com",
    port: 443,
    path: "/",
    secure : true,
    pingInterval : 2500,
  } );
  peer.on("open",onOpen);
  peer.on("connection", onConnection);
  peer.on("close",onClose);
  peer.on("disconnected",onDisconnected);
  peer.on("error",onError);
  console.log( peer );
  return peer;
}

initHostBtn.onclick = () => {
  
  if( !input.value ){
    throw "cannot initialize, input must have a value";
  }

  input.disabled = true;

  initHostBtn.disabled = true;
  initClientBtn.disabled = true;

  let peer = createHostSession(
    
    input.value,

    id => { /* ON OPEN */
      console.warn("onopen triggered");

      disconnectBtn.disabled = false;
      destroyBtn.disabled = false;
      reconnectBtn.disabled = false;

      disconnectBtn.onclick = () => {
        peer.disconnect();
      };

      reconnectBtn.onclick = () => {
        peer.reconnect();
      };

      destroyBtn.onclick = () => {
        peer.destroy();
      };

    },
    dataConn => { /* ON CONNECTION */
      console.warn("onconnection triggered");

      dataConn.on("open",()=>{
        console.warn("dataConn with '" + dataConn.peer + "' onopen triggered");
      });
      dataConn.on("data",data=>{
        console.warn("dataConn ondata triggered");
        console.log( data );
        if( data === "ping" ){
          setTimeout(()=>{
            dataConn.send("ping");
          },1000);
        }
      });
      dataConn.on("close",()=>{
        console.warn("dataConn onclose triggered");
      });
      dataConn.on("error",err=>{
        console.warn("dataConn onerror triggered");
        console.error( err );
      });

    },

    () => { /* ON CLOSE */
      console.warn("onclose triggered");
    },

    () => { /* ON DISCONNECTED */
      console.warn("ondisconnected triggered");
    },

    err => {  /* ON ERROR */
      console.warn("onerror triggered");
      console.error( err );
    },

  );

};

initClientBtn.onclick = () => {

  if( !input.value ){
    throw "cannot initialize, input must have a value";
  }

  input.disabled = true;

  initHostBtn.disabled = true;
  initClientBtn.disabled = true;
  
  let peer = createClientSession(

    id => { /* ON OPEN */

      console.warn("onopen triggered, peer started with id of '" + id + "'.");

      disconnectBtn.disabled = false;
      destroyBtn.disabled = false;
      reconnectBtn.disabled = false;

      disconnectBtn.onclick = () => {
        peer.disconnect();
      };

      reconnectBtn.onclick = () => {
        peer.reconnect();
      };

      destroyBtn.onclick = () => {
        peer.destroy();
      };


      let hostId = input.value;

      let dataConn = peer.connect( hostId, {
        reliable : true
      } );

      dataConn.on("open",()=>{
        console.warn("dataConn with '" + dataConn.peer + "' onopen triggered");
        dataConn.send("ping");
      });
      dataConn.on("data",data=>{
        console.warn("dataConn ondata triggered");
        console.log( data );
        if( data === "ping" ){
          setTimeout(()=>{
            dataConn.send("ping");
          },1000);
        }
      });
      dataConn.on("close",()=>{
        console.warn("dataConn onclose triggered");
      });
      dataConn.on("error",err=>{
        console.warn("dataConn onerror triggered");
        console.error( err );
      });
      
    },

    dataConn => { /* ON CONNECTION */
      console.warn("onconnection triggered");
    },

    () => { /* ON CLOSE */
      console.warn("onclose triggered");
    },

    () => { /* ON DISCONNECTED */
      console.warn("ondisconnected triggered");
    },

    err => {  /* ON ERROR */
      console.warn("onerror triggered");
    },

  );


  

};