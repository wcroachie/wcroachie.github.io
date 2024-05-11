if( typeof esx === "undefined" ){
  esx = {};
}

void function(){

  "use strict";
  
  /**
   * 
   * track the usage of blobs
   * 
   * chrome list of hidden urls : chrome://chrome-urls/
   * chrome blob internals: chrome://blob-internals/
   * mozilla list of hidden urls : about:about
   * safari - unknown
   * 
   * note - keep this in a closure
   * 
   * 
   */

  esx.BLOB_URL_REGISTRY = {};
  esx.MAX_SAFE_BLOB_MEMORY = 268435456; /* 256 miB */

  function getTotalBlobMemory(){
    var acc=0, key, size;
    for( key in esx.BLOB_URL_REGISTRY ){
      size = esx.BLOB_URL_REGISTRY[key];
      acc += size;
    }
    return acc;
  }

  esx.createObjectURL = function( blob ){
    var totalBlobMemory = getTotalBlobMemory();
    if( totalBlobMemory + blob.size > this.MAX_SAFE_BLOB_MEMORY ){
      throw "cannot safely create object url due to insufficient memory"
    }
    var url = URL.createObjectURL( blob );
    var size = blob.size;
    this.BLOB_URL_REGISTRY[ url ] = size;
    return url;
  };

  esx.revokeObjectURL = function( url ){
    delete this.BLOB_URL_REGISTRY[ url ];
    return URL.revokeObjectURL( url );
  };

}()