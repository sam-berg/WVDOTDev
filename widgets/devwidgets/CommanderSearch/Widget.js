define(['dojo/_base/declare', 'jimu/BaseWidget', "dojo/_base/lang","esri/symbols/SimpleMarkerSymbol","esri/symbols/PictureMarkerSymbol",'dojox/grid/DataGrid', "dojo/parser", "esri/tasks/FindTask", "esri/tasks/FindParameters", "dojo/data/ItemFileReadStore", "dojo/_base/array", "dijit/registry", "dojo/_base/connect", "dojo/on"],
function (declare, BaseWidget,lang, SimpleMarkerSymbol,PictureMarkerSymbol,DataGrid, parser, FindTask, FindParameters, ItemFileReadStore,arrayUtils,registry,connect,on) {  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // Custom widget code goes here 
	  
    myMap: null,

    baseClass: 'jimu-widget-customwidget',

    _mainAction: function () {

      var v = dijit.byId("txtSearch").value;
      this.map.graphics.clear();
      //Create data store and bind to grid.
      var emptyCells = { items: "" };
      store = new ItemFileReadStore({
        data: emptyCells
      });
      var grid = registry.byId("grid");
      grid.setStore(store);


      //do search for value
      var find = new FindTask("http://bosdemo2.esri.com/arcgis/rest/services/RevolutionaryWar/RevolutionaryWarBattlesP1/MapServer");
      var params = new FindParameters();
      params.layerIds = [1];
      params.searchFields = ["Commander"];
      params.searchText = v;
      params.returnGeometry = true;
      params.outSpatialReference = this.map.spatialReference;

      find.execute(params,lang.hitch(this, this.showResults));

    },
 
    showResults:function(results) {
      var r = results;
      this.map.graphics.clear();
   
      var items = arrayUtils.map(results,lang.hitch(this, function (result) {
        var graphic = result.feature;
        var symbol3 = new PictureMarkerSymbol({ "width": 30, "height": 30, "url": "http://static.arcgis.com/images/Symbols/PeoplePlaces/Clue.png" });

        graphic.setSymbol(symbol3);
      
        this.map.graphics.add(graphic);
        return result.feature.attributes;
      }));



      //Create data object to be used in store
      var data = {
        identifier: "OBJECTID", //This field needs to have unique values
        label: "COMMANDER", //Name field for display. Not pertinent to a grid but may be used elsewhere.
        items: items
      };

      //Create data store and bind to grid.
      store = new ItemFileReadStore({
        data: data 
      });
      var grid = registry.byId("grid");
      grid.setStore(store);

      
      grid.on("RowClick",lang.hitch(this, function (evt) {
  
        var clickedOID = evt.grid.getItem(evt.rowIndex).OBJECTID;

        var selectedCommander = arrayUtils.filter(this.map.graphics.graphics, function (graphic) {
          return ((graphic.attributes) && graphic.attributes.OBJECTID === clickedOID);
        });

        var s = selectedCommander[0];

        this.map.centerAndZoom(s.geometry, 12);

      }), true);

    },
 
    //this property is set by the framework when widget is loaded.
     //name: 'CustomWidget',


//methods to communication with app container:

    // postCreate: function() {
    //   this.inherited(arguments);
    //   console.log('postCreate');
    // },

    startup: function() {
      this.inherited(arguments);
      this.myMap = this.map;
      parser.parse();



      console.log('startup');
    }

    // onOpen: function(){
    //   console.log('onOpen');
    // },

    // onClose: function(){
    //   console.log('onClose');
    // },

    // onMinimize: function(){
    //   console.log('onMinimize');
    // },

    // onMaximize: function(){
    //   console.log('onMaximize');
    // },

    // onSignIn: function(credential){
    //   /* jshint unused:false*/
    //   console.log('onSignIn');
    // },

    // onSignOut: function(){
    //   console.log('onSignOut');
    // }
      
    // onPositionChange: function(){
    //   console.log('onPositionChange');
    // },

    // resize: function(){
    //   console.log('resize');
    // }

//methods to communication between widgets:

  });
});