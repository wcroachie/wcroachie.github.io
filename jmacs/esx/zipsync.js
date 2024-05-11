if( typeof esx === "undefined" ){
  esx = {};
}

void function(){
  "use strict";


  esx.zip = {};

  esx.zip._internal = {

    /**
     * used the following resources for guidance.
     * 
     * https://pkwaredownloads.blob.core.windows.net/pem/APPNOTE.txt
     * https://medium.com/@felixstridsberg/the-zip-file-format-6c8a160d1c34
     * https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html
     * https://github.com/pwasystem/zip/blob/main/zip.js
     * https://stackoverflow.com/a/43122214
     * https://graphics.stanford.edu/%7Eseander/bithacks.html
     * 
     */


    msDosDate : function( dateObj ){
  
      /* hhhhhmmm  mmmsssss */
      var hr = dateObj.getHours() << 11;
      var min = dateObj.getMinutes() << 5;
      var sec = Math.round( dateObj.getSeconds()/2 );
      var time = min | hr | sec;

      time = esx.decompose( time, 2 );

      /* yyyyyyym  mmmddddd */
      var year = (dateObj.getFullYear() - 1980) << 9;
      var month = (dateObj.getMonth() + 1) << 5;
      var day = dateObj.getDate();
      var date = year | month | day;

      date = esx.decompose( date, 2 );

      return esx.concat( time, date );

    },

    crc32 : function( byteArr ){
      // var a, o, c, f, n, t;
      // o = [];
      // for( c=0; c<256; c++ ){
      //   a = c;
      //   for( f=0; f<8; f++ ){
      //     a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
      //     o[c] = a;
      //   }
      //   for( n=-1, t=0; t<byteArr.length; t++ ){
      //     n = n >>> 8 ^ o[255 & (n^byteArr[t])];
      //   }
      // }
      for( var a, o=[], c=0; c<256; c++ ){
        a = c;
        for( var f=0; f<8; f++ ){
          a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
          o[c] = a;
        }
        for( var n=-1, t=0; t<byteArr.length; t++ ){
          n = n >>> 8 ^ o[255 & (n^byteArr[t])];
        }
      }
      var res = (-1^n) >>> 0;

      res = esx.decompose( res, 4 );

      return res;
    },

    makeLocalHeader : function( date, fileDataByteArr, path ){
      
      var signature           = [ 0x50, 0x4b, 0x03, 0x04 ];
      var minVersionNeeded    = [ 0x14, 0x00 ];
      var bitFlag             = [ 0x00, 0x00 ];
      var compressionMethod   = [ 0x00, 0x00 ];
      var _date               = this.msDosDate( date );
      var crc                 = this.crc32( fileDataByteArr );
      var compressedLength    = esx.decompose( fileDataByteArr.length, 4 );
      var uncompressedLength  = compressedLength;
      var pathLength          = esx.decompose( path.length, 2 );
      var extraFieldLength    = [ 0x00, 0x00 ];
      var _path               = esx.str2utf8( path );
      var extraField          = [];

      return esx.concat(
        signature,
        minVersionNeeded,
        bitFlag,
        compressionMethod,
        _date,
        crc,
        compressedLength,
        uncompressedLength,
        pathLength,
        extraFieldLength,
        _path,
        extraField
      );

    },

    /* diskIndex is the disk where the local file header is */
    /* localOffset is the distance between start of first disk and the local file header */
    makeCentralDirHeader : function( date, fileDataByteArr, path, diskIndex, localOffset ){

      var signature           = [ 0x50, 0x4b, 0x01, 0x02 ];
      var versionUsed         = [ 0x14, 0x00 ];
      var minVersionNeeded    = [ 0x14, 0x00 ];
      var bitFlag             = [ 0x00, 0x00 ];
      var compressionMethod   = [ 0x00, 0x00 ];
      var _date               = this.msDosDate( date );
      var crc                 = this.crc32( fileDataByteArr );
      var compressedLength    = esx.decompose( fileDataByteArr.length, 4 );
      var uncompressedLength  = compressedLength;
      var pathLength          = esx.decompose( path.length, 2 );
      var extraFieldLength    = [ 0x00, 0x00 ];
      var commentLength       = [ 0x00, 0x00 ];
      var _diskIndex          = esx.decompose( diskIndex, 2 );
      var internalAttrs       = [ 0x01, 0x00 ];
      var externalAttrs       = [ 0x20, 0x00, 0x00, 0x00 ];
      var _localOffset        = esx.decompose( localOffset, 4 );
      var _path               = esx.str2utf8( path );
      var extraField          = [];
      var comment             = [];

      return esx.concat(
        signature,
        versionUsed,
        minVersionNeeded,
        bitFlag,
        compressionMethod,
        _date,
        crc,
        compressedLength,
        uncompressedLength,
        pathLength,
        extraFieldLength,
        commentLength,
        _diskIndex,
        internalAttrs,
        externalAttrs,
        _localOffset,
        _path,
        extraField,
        comment
      );

    },

    /**
     * notes:
     * 
     * centralDirLength is the length of the central directory excluding the eocd
     * centralDirStartOffset is the distance between the start of the central directory from the start of the first disk
     * 
     **/
    makeEOCD : function( thisDiskIndex, centralDirStartDiskIndex, thisDiskEntriesCount, centralDirEntriesCount, centralDirLength, centralDirStartOffset ){

      var signature = [ 0x50, 0x4b, 0x05, 0x06 ];
      var _thisDiskIndex = esx.decompose( thisDiskIndex, 2 );
      var _centralDirStartDiskIndex = esx.decompose( centralDirStartDiskIndex, 2 );
      var _thisDiskEntriesCount = esx.decompose( thisDiskEntriesCount, 2 );
      var _centralDirEntriesCount = esx.decompose( centralDirEntriesCount, 2 );
      var _centralDirLength = esx.decompose( centralDirLength, 4 );
      var _centralDirStartOffset = esx.decompose( centralDirStartOffset, 4 );
      var commentLength = [ 0x00, 0x00 ];
      var comment = [];

      return esx.concat(
        signature,
        _thisDiskIndex,
        _centralDirStartDiskIndex,
        _thisDiskEntriesCount,
        _centralDirEntriesCount,
        _centralDirLength,
        _centralDirStartOffset,
        commentLength,
        comment
      );

    },

  };







  function makeDownloadLink( byteArr, filename ){
    var ui8 = new Uint8Array( byteArr );
    var blob = new Blob([ui8]);
    var a = document.body.appendChild( document.createElement("a") );
    a.textContent = "download " + filename;
    a.download = filename;
    a.href = esx.createObjectURL( blob );
    a.style.display = "block";
  }



  // /* note - the following code yields a perfectly ok zip file of 1 volume */

  // var data = esx.str2utf8("the quick brown fox jumps over the lazy dog");
  // var name = "folder/test.txt";
  // var date = new Date();

  // var localHeader = esx.zip._internal.makeLocalHeader( date, data, name );
  // var cDirHeader = esx.zip._internal.makeCentralDirHeader( date, data, name, 0, 0 );
  // var eocd = esx.zip._internal.makeEOCD( 0, 0, 1, 1, cDirHeader.length, localHeader.length + data.length );
  // var disk = esx.concat(
  //   localHeader, data, cDirHeader, eocd
  // );

  // makeDownloadLink( disk, "test.zip" );







  // /* note - the following code yields a perfectly ok zip file of 1 volume */

  // var files = [
  //   {
  //     data : esx.str2utf8("the quick brown fox jumps over the lazy dog"),
  //     path : "folderA/file0.txt",
  //     date : new Date()
  //   },
  //   {
  //     data : esx.str2utf8("hello world"),
  //     path : "folderA/file1.txt",
  //     date : new Date()
  //   }
  // ];


  // var i, file, localHeader, cDirHeader, localData=[], cDirData=[];

  // for( i=0; i<files.length; i++ ){
  //   file = files[i];
  //   localHeader = esx.zip._internal.makeLocalHeader     ( file.date, file.data, file.path );
  //   cDirHeader  = esx.zip._internal.makeCentralDirHeader( file.date, file.data, file.path, 0, localData.length );
  //   localData   = esx.concat( localData, localHeader, file.data );
  //   cDirData    = esx.concat( cDirData, cDirHeader );
  // }

  // var eocdData = esx.zip._internal.makeEOCD( 0, 0, i, i, cDirData.length, localData.length );
  // var zipFileData = esx.concat( localData, cDirData, eocdData );

  // makeDownloadLink( zipFileData, "test.zip" );
  
  






  /**
   * @todo - why doesn't this work?? figure it out.
   */

  var files = [
    // {
    //   data : [],
    //   path : "folderA/",
    //   date : new Date()
    // },
    {
      data : esx.str2utf8("the quick brown fox jumps over the lazy dogthe qua"),
      path : "folderA/file0.txt",
      date : new Date()
    },
    {
      data : esx.str2utf8("hello worldhello worldhello worldaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
      path : "folderA/file1.txt",
      date : new Date()
    }
  ];


  var maxVolumeSize = 128;
  var byteCount = 0;
  var zipData = [];
  var cDirData = [];
  var entriesCount = 0;

  if( maxVolumeSize > esx.sum( esx.map( files, function(e,n,a){
    return e.data.length
  })) ){
    throw "asdfg"
  }

  var i, file;
  for( i=0; i<files.length; i++ ){
    file = files[i];
    file.offset = byteCount;
    file.localHeader = esx.zip._internal.makeLocalHeader( file.date, file.data, file.path );
    file.entrySize = file.localHeader.length + file.data.length;
    file.startDiskIndex = (byteCount - (byteCount % maxVolumeSize)) / maxVolumeSize;
    file.cDirHeader = esx.zip._internal.makeCentralDirHeader( file.date, file.data, file.path, file.startDiskIndex, file.offset );
    zipData = esx.concat( zipData, file.localHeader, file.data );
    cDirData = esx.concat( cDirData, file.cDirHeader );
    byteCount += file.entrySize;
    entriesCount ++;
  }

  console.log( files );

  var volumes = esx.chunk( zipData, maxVolumeSize );
  
  var eocdData = esx.zip._internal.makeEOCD( volumes.length, volumes.length, entriesCount, entriesCount, cDirData.length, zipData.length );
  var lastFileData = esx.concat( cDirData, eocdData );

  esx.push( volumes, lastFileData );

  var volume;
  for( i=0; i<volumes.length; i++ ){
    volume = volumes[i];
    makeDownloadLink( volume, "test.z" + esx.padStart( i+1, 2, 0 ) );
  }
  



}()