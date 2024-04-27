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
  esx.BLOB_MEMORY = 0;
  esx.BLOB_MEMORY_LIMIT = 268435456; /* 256 miB */

  esx.createObjectURL = function( blob ){
    if( this.BLOB_MEMORY + blob.size > this.BLOB_MEMORY_SOFT_LIMIT ){
      throw "cannot safely create object url due to insufficient memory"
    }
    var url = URL.createObjectURL( blob );
    var size = blob.size;
    this.BLOB_URL_REGISTRY[ url ] = size;
    this.BLOB_MEMORY += size;
    return url;
  };

  esx.revokeObjectURL = function( url ){
    var size = this.BLOB_URL_REGISTRY[ url ];
    delete this.BLOB_URL_REGISTRY[ url ];
    this.BLOB_MEMORY -= size;
    return URL.revokeObjectURL( url );
  };

}()