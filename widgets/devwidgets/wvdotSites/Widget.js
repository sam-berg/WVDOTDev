define(['dojo/_base/declare', 'jimu/BaseWidget', 'dojo/parser', 'dijit/form/Select', "dojo/store/Memory", 'dojo/data/ObjectStore','dojo/_base/lang', "esri/dijit/InfoWindowLite","esri/InfoTemplate","dojo/dom-construct"],
function (declare, BaseWidget, parser, Select, Memory, ObjectStore,lang, InfoWindowLite, InfoTemplate, domConstruct) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here 

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',

    name: 'wvdotSearch',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      console.log('startup');
      parser.parse();
    },

    onOpen: function(){
      console.log('onOpen');

      //var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, this.map.root));
      //infoWindow.startup();
      //this.map.setInfoWindow(infoWindow);

      var fl= this.map.getLayer(this.map.graphicsLayerIds[1]);
      this.fl=fl;
      //var stateStore = new Memory({
      //  data: [
      //      { name: "Alabama", id: "AL" },
      //      { name: "Alaska", id: "AK" },
      //      { name: "American Samoa", id: "AS" },
      //      { name: "Arizona", id: "AZ" },
      //      { name: "Arkansas", id: "AR" },
      //      { name: "Armed Forces Europe", id: "AE" },
      //      { name: "Armed Forces Pacific", id: "AP" },
      //      { name: "Armed Forces the Americas", id: "AA" },
      //      { name: "California", id: "CA" },
      //      { name: "Colorado", id: "CO" },
      //      { name: "Connecticut", id: "CT" },
      //      { name: "Delaware", id: "DE" }
      //  ]
      //});

      var stateStore = new Memory({
        data: []
      });

      //this.cmbSites.store = stateStore;
   
      var cmb = dijit.byId("cmbSites");

     cmb.on("change", lang.hitch(this, this.doSiteQuery));


     var p = {};
     p.label = "(select a site)";
     p.id = "(select a site)";
     stateStore.data.push(p);

      for(var i=0;i<fl.graphics.length;i++)
      {

        var g = fl.graphics[i];
        var s = g.attributes.SITEID;
        var p = {};
        p.label = s;
        p.id = s;
        stateStore.data.push(p);
      
      }
            
      var os = new ObjectStore({ objectStore: stateStore });
      cmb.attr('store', os);
      cmb.startup();
    },
    doSiteQuery:function(){
      var sSiteID = dijit.byId('cmbSites').get('value');
     // alert(sSiteID);

      //find graphic with this ID and zoom/select
      for (var i = 0;i<this.fl.graphics.length;i++){
        var g=this.fl.graphics[i];
        if(g.attributes.SITEID == sSiteID)
        {

          //alert("found it");
          this.map.centerAndZoom(g.geometry, 14);
          this.map.infoWindow.setFeatures([g]);
          this.map.infoWindow.show(g.geometry);
          //this.map.infoWindow.setTitle(sSiteID);
          //this.map.infoWindow.setContent("Click for more info...");
          //this.map.infoWindow.resize(300, 300);
          //this.map.infoWindow.show(g.geometry);

        }
      }

  },
    onClose: function(){
      console.log('onClose');
    },

    onMinimize: function(){
      console.log('onMinimize');
    },

    onMaximize: function(){
      console.log('onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function(){
      console.log('onSignOut');
    }
  });
});