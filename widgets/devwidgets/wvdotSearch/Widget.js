define(['dojo/_base/declare', 'jimu/BaseWidget', 'dijit/layout/TabContainer', 'dijit/layout/ContentPane', 'dojo/parser', 'dijit/form/Select', "dojo/store/Memory", 'dojo/data/ObjectStore',"dojo/_base/lang"],
function (declare, BaseWidget, TabContainer, ContentPane, parser, Select, Memory, ObjectStore, lang) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {
    // DemoWidget code goes here 

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',

    name: 'wvdotSearch2',

    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      this.inherited(arguments);
      //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
     parser.parse();
      console.log('startup');
    },

    onOpen: function(){
      console.log('onOpen');



      var fl = this.map.getLayer(this.map.graphicsLayerIds[0]);
      this.fl = fl;


      var query = new esri.tasks.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "0=0";

      var queryTask = new esri.tasks.QueryTask(fl.url);
      var incidentsStore = new Memory({
        data: []
      });

      var citationsStore = new Memory({
        data: []
      });

      var p = {};
      p.label = "(select an Incident #)";
      p.id = "(select an incident)";
      incidentsStore.data.push(p);

      var p2 = {};
      p2.label = "(select a Citation #)";
      p2.id = "(select a citation)";
      citationsStore.data.push(p2);

      var cmb1 = dijit.byId("cmbIncidents");
      if (cmb1 != null) cmb1.on("change", lang.hitch(this, this.doIncidentsSelect));

      var cmb2 = dijit.byId("cmbCitations");
      if (cmb2 != null) cmb2.on("change", lang.hitch(this, this.doCitationsSelect));

      
      queryTask.on("complete", lang.hitch(this,function (event) {
        var features = event.featureSet.features;

        //QueryTask returns a featureSet.
        //Loop through features in the featureSet and add them to the map.
        var featureCount = features.length;

        for (var i = 0; i < featureCount; i++) {
          //Get the current feature from the featureSet.
          var graphic = features[i]; //Feature is a graphic
          p = {};
          p.label = graphic.attributes.INCIDENT;
          p.id = graphic.attributes.INCIDENT;
          incidentsStore.data.push(p);

          var p2 = {};
          p2.label = graphic.attributes.CITATION;
          p2.id= graphic.attributes.CITATION;
          citationsStore.data.push(p2);

        }


        var cmb1 = dijit.byId("cmbIncidents");
    
        var cmb2 = dijit.byId("cmbCitations");
   
        var os = new ObjectStore({ objectStore: incidentsStore });
        if(cmb1!=null)cmb1.attr('store', os);
        if (cmb1 != null) cmb1.startup();
        

        var os2 = new ObjectStore({ objectStore: citationsStore });
        if (cmb2 != null) cmb2.attr('store', os2);
        if (cmb2 != null) cmb2.startup();

        
      }));
     queryTask.execute(query);
  

    },
    doIncidentsSelect:function(){
      var sIncidentID = dijit.byId('cmbIncidents').get('value');
      //alert(sIncidentID);

      var queryTask = new esri.tasks.QueryTask(this.fl.url);
      var query = new esri.tasks.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "INCIDENT = '" + sIncidentID +"'";

      queryTask.on("complete",lang.hitch(this,function (event) {
        var features = event.featureSet.features;

        //QueryTask returns a featureSet.
        //Loop through features in the featureSet and add them to the map.
        var featureCount = features.length;
        if (featureCount > 0)
        {
          var g = features[0];
          this.map.centerAndZoom(g.geometry, 14);
          this.map.infoWindow.setFeatures([g]);
          //this.map.infoWindow.show(g.geometry);
        }
    

      }));

      queryTask.execute(query);

    },
    doCitationsSelect:function(){
      var sCitations= dijit.byId('cmbCitations').get('value');

      var queryTask = new esri.tasks.QueryTask(this.fl.url);
      var query = new esri.tasks.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "CITATION = '" + sCitations + "'";

      queryTask.on("complete", lang.hitch(this, function (event) {
        var features = event.featureSet.features;

        //QueryTask returns a featureSet.
        //Loop through features in the featureSet and add them to the map.
        var featureCount = features.length;
        if (featureCount > 0) {
          var g = features[0];
          this.map.centerAndZoom(g.geometry, 14);
          this.map.infoWindow.setFeatures([g]);
          //this.map.infoWindow.show(g.geometry);
        }


      }));

      queryTask.execute(query);
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