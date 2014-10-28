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

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'jimu/dijit/SimpleTable',
    'dojo/_base/lang',
    'dojo/_base/html',
    'dojo/_base/array',
    'dojo/on',
    'dojo/Deferred',
    "dojo/dom-style",
    "jimu/dijit/SymbolChooser",
    "dojo/query",
    "dojo/aspect",
    "esri/symbols/jsonUtils",
    'jimu/dijit/Message',
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "jimu/dijit/CheckBox",
    "jimu/dijit/LoadingShelter",
    "../utils",
    "dijit/TooltipDialog",
    "dijit/popup"
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    Table,
    lang,
    html,
    array,
    on,
    Deferred,
    domStyle,
    SymbolChooser,
    query,
    aspect,
    jsonUtils,
    Message,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleFillSymbol,
    CheckBox,
    LoadingShelter,
    utils,
    TooltipDialog,
    dijitPopup
  ) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-attributetable-setting',
      currentFieldTable: null,
      tooltipDialogs: {},
      fieldTables: {},
      _allLayerFields: null,
      _layerInfos: null,
      _delayedLayerInfos: null,

      startup: function() {
        this.inherited(arguments);
        if (!this.config.layerInfos) {
          this.config.layerInfos = [];
        }
        this._allLayerFields = [];
        this._layerInfos = [];
        this._delayedLayerInfos = [];

        var fields = [{
          name: 'label',
          title: this.nls.label,
          type: 'text'
        }, {
          name: 'url',
          title: 'url',
          type: 'text',
          hidden: true
        }, {
          name: 'index',
          title: 'index',
          type: 'text',
          hidden: true
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          actions: ['edit'],
          'class': 'symbol'
        }, {
          name: 'show',
          title: this.nls.show,
          type: 'checkbox',
          'class': 'show'
        }];

        var args = {
          fields: fields,
          selectable: false,
          autoHeight: false
        };
        this.displayFieldsTable = new Table(args);
        this.displayFieldsTable.placeAt(this.tableLayerInfos);
        html.setStyle(this.displayFieldsTable.domNode, {
          'height': '100%'
        });
        this.displayFieldsTable.startup();

        this.shelter = new LoadingShelter({
          hidden: true
        });
        this.shelter.placeAt(this.domNode.parentNode.parentNode || this.domNode);
        this.shelter.startup();
        this.shelter.show();

        utils.readLayerInfosObj(this.map).then(lang.hitch(this, function(layerInfosObj) {
          this.own(layerInfosObj.on(
            'layerInfosChanged',
            lang.hitch(this, this.onLayerInfosChanged)
          ));

          this.own(on(
            this.displayFieldsTable,
            'actions-edit',
            lang.hitch(this, this.editFieldsClick)
          ));
          this.own(on(this.getParent().getParent().domNode, 'click', lang.hitch(this, function() {
            dijitPopup.close();
          })));
          html.addClass(this.exportcsv.domNode, 'export-csv');

          this.setConfig(this.config);
        }));
      },


      editFieldsClick: function(tr) {
        var tds = query(".action-item-parent", tr);
        var data;
        if (tds && tds.length) {
          data = this.displayFieldsTable.getRowData(tr);
          if (!data.show) {
            var popup = new Message({
              message: this.nls.warning,
              buttons: [{
                label: this.nls.ok,
                onClick: lang.hitch(this, function() {
                  popup.close();
                })
              }]
            });
          } else {
            var rowIndex = parseInt(data.index, 10);
            this.shelter.show();
            this._getLayerFields(rowIndex).then(lang.hitch(this, function(fields) {
              this.openFieldsDialog(tr, fields, rowIndex);
            }), lang.hitch(this, function(err) {
              console.error(err);
            })).always(lang.hitch(this, function() {
              this.shelter.hide();
            }));
          }
        }
      },

      _getLayerFields: function(rowIndex) {
        var def = new Deferred();
        var fields = this._allLayerFields[rowIndex];
        if (fields) {
          def.resolve(fields);
        } else {
          this._layerInfos[rowIndex].getLayerObject().then(lang.hitch(this, function(layer) {
            if (layer.fields) {
              def.resolve(layer.fields);
            } else {
              def.reject();
            }
          }), lang.hitch(this, function(err) {
            def.reject(err);
          }));
        }

        return def;
      },

      openFieldsDialog: function(tr, fields, idx) {
        if (!this.tooltipDialogs[idx]) {
          var table = this._createFieldsTable(fields, idx);
          this.currentFieldTable = table;
          this.fieldTables[idx] = table;

          var tDialog = new TooltipDialog({
            style: 'width: 400px;height:400px;',
            content: table.domNode,
            onClose: lang.hitch(this, function() {
              this._allLayerFields[idx] = table.getData();
            }),
            onCancel: lang.hitch(this, function() {
              dijitPopup.close();
            })
          });
          this.tooltipDialogs[idx] = tDialog;
        }

        var editDiv = query('.row-edit-div', tr)[0];

        dijitPopup.open({
          parent: this,
          popup: this.tooltipDialogs[idx],
          around: editDiv,
          orient: ['before-centered', "below", "below-alt", "above", "above-alt"]
        });
      },

      _createFieldsTable: function(lFields) {
        var fields = [{
          name: 'show',
          title: this.nls.fieldVisibility,
          type: 'checkbox',
          'class': 'show'
        }, {
          name: 'name',
          title: this.nls.fieldName,
          type: 'text'
        }, {
          name: 'alias',
          title: this.nls.fieldAlias,
          editable: true,
          type: 'text'
        }, {
          name: 'actions',
          title: this.nls.fieldActions,
          type: 'actions',
          actions: ['up', 'down'],
          'class': 'symbol'
        }];

        var args = {
          fields: fields,
          selectable: false,
          autoHeight: false,
          style: {
            'height': '400px',
            'maxHeight': '400px'
          }
        };
        var fieldsTable = new Table(args);

        for (var i = 0; i < lFields.length; i++) {
          if (lFields[i].show === undefined) {
            lFields[i].show = true;
          } else {
            lFields[i].show = !!lFields[i].show;
          }

          fieldsTable.addRow(lFields[i]);
        }

        return fieldsTable;
      },

      setConfig: function(config) {
        this.config = config;
        this.displayFieldsTable.clear();
        this._allLayerFields = [];
        this.tooltipDialogs = {};

        this._processTableData().then(lang.hitch(this, function(layerInfos) {
          this._init(layerInfos);
          this.shelter.hide();
        }), lang.hitch(this, function(err) {
          new Message({
            message: err.message || err
          });
        }));
      },

      onLayerInfosChanged: function(layerInfo, changeType, layerInfoSelf) {
        if ('added' !== changeType || !layerInfoSelf) {
          return;
        }
        layerInfoSelf.getLayerType().then(lang.hitch(this, function(layerType) {
          if (layerType === "FeatureLayer") {
            if (this._layerInfos && this._layerInfos.length === 0) {
              this._delayedLayerInfos.push(layerInfoSelf);
            } else if (this._layerInfos && this._layerInfos.length > 0 &&
              !this._getLayerInfoById(layerInfoSelf.id)) {
              this._layerInfos.push(layerInfoSelf);
              this.initConfigLayerInfos();
            }
          }
        }));
      },

      _processDelayedLayerInfos: function() {
        if (this._delayedLayerInfos.length > 0) {
          array.forEach(this._delayedLayerInfos, lang.hitch(this, function(delayedLayerInfo) {
            if (!this._getLayerInfoById(delayedLayerInfo.id)) {
              this._layerInfos.push(delayedLayerInfo);
            }
          }));

          this._delayedLayerInfos = [];
        }
      },

      _processTableData: function() {
        var def = new Deferred();

        utils.readConfigLayerInfosFromMap(this.map).then(lang.hitch(this, function(layerInfos) {
          this._layerInfos = layerInfos;
          this._processDelayedLayerInfos();

          if (this.config && this.config.layerInfos && this.config.layerInfos.length > 0) {
            var _cLayerInfos = array.filter(
              this.config.layerInfos,
              lang.hitch(this, function(layerInfo) {
                return this._getLayerInfoById(layerInfo.id);
              }));
            def.resolve(_cLayerInfos);
          } else {
            def.resolve(utils.getConfigInfosFromLayerInfos(layerInfos));
          }
        }), lang.hitch(this, function(err) {
          console.error(err);
          def.reject(err);
        }));
        return def;
      },

      _init: function(layerInfos) {
        for (var i = 0; i < layerInfos.length; i++) {
          var show = layerInfos[i].show;
          this.displayFieldsTable.addRow({
            label: layerInfos[i].name,
            url: layerInfos[i].layer.url,
            index: "" + i,
            show: show
          });

          this._allLayerFields.push(layerInfos[i].layer.fields);
        }
        // console.log("_init this._allLayerFields: ", this._allLayerFields);

        if (layerInfos.length === 0) {
          domStyle.set(this.tableEditInfosError, "display", "");
          this.tableEditInfosError.innerHTML = this.nls.noLayers;
        } else {
          domStyle.set(this.tableEditInfosError, "display", "none");
        }
        if (this.config.hideExportButton) {
          this.exportcsv.uncheck();
        } else {
          this.exportcsv.check();
        }
      },

      _destroyPopupDialog: function() {
        dijitPopup.close();

        for (var p in this.tooltipDialogs) {
          if (this.tooltipDialogs[p] && this.tooltipDialogs[p].destroy) {
            this.tooltipDialogs[p].destroy();
            this.tooltipDialogs[p] = null;
          }
        }
      },

      _getLayerInfoById: function(layerId) {
        for (var i = 0, len = this._layerInfos.length; i < len; i++) {
          if (this._layerInfos[i].id === layerId) {
            return this._layerInfos[i];
          }
        }
      },

      getConfig: function() {
        dijitPopup.close();

        var data = this.displayFieldsTable.getData();
        var table = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          var json = {};
          json.name = this._layerInfos[i].name; // prevent mess code
          json.id = this._layerInfos[i].id;
          json.layer = {};
          json.layer.url = data[i].url;
          json.layer.fields = this._allLayerFields[i];
          json.show = data[i].show;
          table.push(json);
        }

        this.config.layerInfos = table;
        if (this.exportcsv.getValue()) {
          this.config.hideExportButton = false;
        } else {
          this.config.hideExportButton = true;
        }

        // console.log("getConfig this.config.layers", this.config.layers);
        return this.config;
      },

      destroy: function() {
        this._destroyPopupDialog();

        this.inherited(arguments);
      }
    });
  });