define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/text!./wkid.json'
], function(
  declare,
  lang,
  array,
  wkids
) {
  try {
    var spatialRefs = JSON.parse(wkids);
  } catch (err) {
    throw err;
  }

  var mo = declare(null, function() {
    // nothing
  });


  // coordinate
  mo.isSameSR = function(tWkid, sWkid) {
    var idx = this.indexOfWkid(tWkid),
      idx2 = this.indexOfWkid(sWkid);
    return spatialRefs.labels[idx] === spatialRefs.labels[idx2];
  };

  mo.isValidWkid = function(wkid) {
    return this.indexOfWkid(wkid) > -1;
  };

  mo.getSRLabel = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var i = this.indexOfWkid(wkid);
      return spatialRefs.labels[i];
    }
  };

  mo.indexOfWkid = function(wkid) {
    return array.indexOf(spatialRefs.wkids, wkid);
  };

  return mo;
});