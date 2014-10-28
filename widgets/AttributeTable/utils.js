///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define(['dojo/_base/lang',
  'dojo/_base/array',
  'jimu/LayerInfos/LayerInfos',
  'dojo/Deferred',
  'dojo/promise/all'
], function(lang, array, LayerInfos, Deferred, all) {
  var mo = {};

  mo.readLayerInfosObj = function(map){
    return LayerInfos.getInstance(map, map.itemInfo);
  };

  mo.readLayerInfosFromMap = function(map) {
    var def = new Deferred();
    LayerInfos.getInstance(map, map.itemInfo).then(lang.hitch(this, function(layerInfosObj) {
      var layerInfos = [];
      layerInfosObj.traversal(lang.hitch(this, function(layerInfo) {
        layerInfos.push(layerInfo);
      }));

      def.resolve(layerInfos);
    }), lang.hitch(this, function(err) {
      console.error(err);
      def.reject(err);
    }));

    return def;
  };

  mo.readLayerObjectsFromMap = function(map) {
    var def = new Deferred(),
      defs = [];
    this.readLayerInfosFromMap(map).then(lang.hitch(this, function(layerInfos) {
      array.forEach(layerInfos, lang.hitch(this, function(layerInfo) {
        defs.push(layerInfo.getLayerObject());
      }));

      all(defs).then(lang.hitch(this, function(layerObjects) {
        def.resolve(layerObjects);
      }), lang.hitch(this, function(err) {
        def.reject(err);
        console.error(err);
      }));
    }), lang.hitch(this, function(err) {
      def.reject(err);
    }));

    return def;
  };

  mo.readConfigLayerInfosFromMap = function(map) {
    var def = new Deferred(),
      defs = [];
    this.readLayerInfosFromMap(map).then(lang.hitch(this, function(layerInfos) {
      var ret = [];
      array.forEach(layerInfos, function(layerInfo) {
        defs.push(layerInfo.getLayerType());
      });

      all(defs).then(lang.hitch(this, function(layerTypes) {
        array.forEach(layerTypes, lang.hitch(this, function(layerType, i) {
          if (layerType === "FeatureLayer") {
            layerInfos[i].name = layerInfos[i].title;
            ret.push(layerInfos[i]);
          }
        }));
        fixDuplicateNames(ret);

        def.resolve(ret);
      }), lang.hitch(this, function(err) {
        def.reject(err);
      }));
    }), lang.hitch(this, function(err) {
      def.reject(err);
    }));

    return def;
  };

  mo.getConfigInfosFromLayerInfos = function(layerInfos) {
    return array.map(layerInfos, function(layerInfo) {
      return mo.getConfigInfoFromLayerInfo(layerInfo);
    });
  };

  mo.getConfigInfoFromLayerInfo = function(layerInfo) {
    var json = {};
    json.name = layerInfo.name;
    json.id = layerInfo.id;
    json.show = layerInfo.isShowInMap();
    json.layer = {
      url: layerInfo.getUrl()
    };

    var popupInfo = layerInfo.getPopupInfo();
    if (popupInfo && !popupInfo.description) {
      json.layer.fields = array.map(popupInfo.fieldInfos, function(fieldInfo) {
        return {
          name: fieldInfo.fieldName,
          alias: fieldInfo.label.toLowerCase(),
          show: fieldInfo.visible
        };
      });
    }

    return json;
  };

  // mo.readLayersFromMap = function(map) {
  //   var def = new Deferred(),
  //     defs = [];
  //   LayerInfos.getInstance(map, map.itemInfo).then(lang.hitch(this, function(layerInfosObj) {
  //     var layerInfos = [];

  //     layerInfosObj.traversal(lang.hitch(this, function(layerInfo) {
  //       layerInfos.push(layerInfo);
  //       defs.push(layerInfo.getLayerObject());
  //     }));

  //     all(defs).then(lang.hitch(this, function(layerObjects) {
  //       var ret = [];
  //       array.forEach(layerObjects, function(layerObject, i) {
  //         if (layerObject && layerObject.declaredClass === "esri.layers.FeatureLayer") {
  //           layerObject.id = layerInfos[i].id;
  //           layerObject.name = layerInfos[i].title;
  //           layerObject._showInMap = layerInfos[i].isShowInMap && layerInfos[i].isShowInMap();
  //           ret.push(layerObject);

  //           console.log(layerObject.name, layerObject.id);
  //         }
  //       }, this);
  //       fixDuplicateNames(ret);

  //       def.resolve(ret);
  //     }), lang.hitch(this, function(err) {
  //       console.error(err);
  //     }));
  //   }));

  //   return def;
  // };

  // mo.getLayerConfigsFromLayers = function(layers) {
  //   return array.map(layers, function(layer) {
  //     return mo.getLayerConfigFromLayer(layer);
  //   });
  // };

  // mo.getLayerConfigFromLayer = function(layer) {
  //   var json = {};
  //   json.name = layer.name;
  //   json.show = layer._showInMap;
  //   json.layer = {
  //     url: layer.url,
  //     fields: layer.fields
  //   };

  //   return json;
  // };

  function fixDuplicateNames(layerObjects) {
    var titles = [],
      duplicateLayers = [];
    array.forEach(layerObjects, function(layerObject) {
      if (titles.indexOf(layerObject.name) < 0) {
        titles.push(layerObject.name);
      } else {
        duplicateLayers.push(layerObject);
      }
    });
    array.forEach(duplicateLayers, function(layerObject) {
      layerObject.name = layerObject.name + '-' + layerObject.id;
    });
  }
  return mo;
});