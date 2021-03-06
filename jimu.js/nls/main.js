define({
  root: {
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      next: 'Next',
      back: 'Back'
    },

    errorCode: "Code",
    errorMessage: "Message",
    errorDetail: "Detail",
    widgetPlaceholderTooltip: "To set it up, go to Widgets and click corresponding placeholder",

    symbolChooser:{
      preview:'Preview',
      basic:'Basic',
      arrows:'Arrows',
      business:'Business',
      cartographic:'Cartographic',
      nationalParkService:'National Park Service',
      outdoorRecreation:'Outdoor Recreation',
      peoplePlaces:'People Places',
      safetyHealth:'Safety Health',
      shapes:'Shapes',
      transportation:'Transportation',
      symbolSize:'Symbol Size',
      color:'Color',
      alpha:'Alpha',
      outlineColor:'Outline Color',
      outlineWidth:'Outline Width',
      style:'Style',
      width:'Width',
      text:'Text',
      fontColor:'Font Color',
      fontSize:'Font Size',
      transparency: 'Transparency',
      solid: 'Solid',
      dash: 'Dash',
      dot: 'Dot',
      dashDot: 'Dash Dot',
      dashDotDot: 'Dash Dot Dot'
    },

    transparency: {
      opaque: 'Opaque',
      transparent: 'Transparent'
    },

    rendererChooser:{
      domain: 'Domain',
      use:'Use',
      singleSymbol:'A Single Symbol',
      uniqueSymbol:'Unique Symbols',
      color:'Color',
      size:'Size',
      toShow:'To Show',
      colors:'Colors',
      classes:'Classes',
      symbolSize:'Symbol Size',
      addValue:'Add Value',
      setDefaultSymbol:'Set Default Symbol',
      defaultSymbol:'Default Symbol',
      selectedSymbol:'Selected Symbol',
      value:'Value',
      label:'Label',
      range:'Range'
    },

    drawBox:{
      point: "Point",
      line: "Line",
      polyline: "Polyline",
      freehandPolyline: "Freehand Polyline",
      triangle: "Triangle",
      extent: "Extent",
      circle: "Circle",
      ellipse: "Ellipse",
      polygon: "Polygon",
      freehandPolygon: "Freehand Polygon",
      text: "Text",
      clear: "Clear"
    },

    popupConfig: {
      title: "Title",
      add: "Add",
      fields: "Fields",
      noField: "No Field",
      visibility: "Visible",
      name: "Name",
      alias: "Alias",
      actions: "Actions"
    },

    includeButton: {
      include: "Include"
    },

    loadingShelter: {
      loading: "Loading"
    },

    basicServiceBrowser: {
      noServicesFound: 'No service found.',
      unableConnectTo: 'Unable to connect to'
    },

    serviceBrowser: {
      noGpFound: 'No geoprocessing service found.',
      unableConnectTo: 'Unable to connect to'
    },

    layerServiceBrowser: {
      noServicesFound: 'No map service or feature service found',
      unableConnectTo: 'Unable to connect to'
    },

    basicServiceChooser: {
      validate: "Validate",
      example: "Example",
      set: "Set"
    },

    urlInput: {
      invalidUrl: 'Invalid URL.'
    },

    filterBuilder: {
      addAnotherExpression: "Add a filter expression",
      addSet: "Add a expression set",
      matchMsg: "Get features in the layer that match ${any_or_all} of the following expressions",
      matchMsgSet: "${any_or_all} of the following expressions in this set are true",
      all: "All",
      any: "Any",
      value: "Value",
      field: "Field",
      unique: "Unique",
      none: "None",
      and: "and",
      valueTooltip: "Enter value",
      fieldTooltip: "Pick from existing field",
      uniqueValueTooltip: "Pick from unique values in selected field",
      stringOperatorIs: "is", // e.g. <stringFieldName> is 'California'
      stringOperatorIsNot: "is not",
      stringOperatorStartsWith: "starts with",
      stringOperatorEndsWith: "ends with",
      stringOperatorContains: "contains",
      stringOperatorDoesNotContain: "does not contain",
      stringOperatorIsBlank: "is blank",
      stringOperatorIsNotBlank: "is not blank",
      dateOperatorIsOn: "is on", // e.g. <dateFieldName> is on '1/1/2012'
      dateOperatorIsNotOn: "is not on",
      dateOperatorIsBefore: "is before",
      dateOperatorIsAfter: "is after",
      dateOperatorDays: "days",
      dateOperatorWeeks: "weeks", // e.g. <dateFieldName> is the last 4 weeks
      dateOperatorMonths: "months",
      dateOperatorInTheLast: "in the last",
      dateOperatorNotInTheLast: "not in the last",
      dateOperatorIsBetween: "is between",
      dateOperatorIsNotBetween: "is not between",
      dateOperatorIsBlank: "is blank",
      dateOperatorIsNotBlank: "is not blank",
      numberOperatorIs: "is", // e.g. <numberFieldName> is 1000
      numberOperatorIsNot: "is not",
      numberOperatorIsAtLeast: "is at least",
      numberOperatorIsLessThan: "is less than",
      numberOperatorIsAtMost: "is at most",
      numberOperatorIsGreaterThan: "is greater than",
      numberOperatorIsBetween: "is between",
      numberOperatorIsNotBetween: "is not between",
      numberOperatorIsBlank: "is blank",
      numberOperatorIsNotBlank: "is not blank",
      string: "String",
      number: "Number",
      date: "Date",
      askForValues: "Ask for values",
      prompt: "Prompt",
      hint: "Hint",
      error: {
        invalidParams: "Invalid parameters.",
        invalidUrl: "Invalid URL.",
        noFilterFields: "Layer has no fields that can be used for filter.",
        invalidSQL: "Invalid SQL expression.",
        cantParseSQL: "Can't parse the SQL expression."
      }
    },

    featureLayerSource: {
      layer: "Layer",
      browse: "Browse",
      selectFromMap: "Select from Map",
      selectFromPortal: "Add from Portal",
      addServiceUrl: "Add Service URL",
      inputLayerUrl: "Input Layer URL",
      selectLayer: "Select a feature layer from current map.",
      chooseItem: "Choose a feature layer item.",
      setServiceUrl: "Enter the URL of feature service or map service.",
      selectFromOnline: "Add from Online",
      chooseLayer: "Choose a feature layer."
    },

    gpSource: {
      selectFromPortal: "Add from Portal",
      addServiceUrl: "Add Service URL",
      selectFromOnline: "Add from Online",
      setServiceUrl: "Enter the URL of geoprocessing service.",
      chooseItem: "Choose a geoprocessing service item.",
      chooseTask: "Choose a geoprocessing task."
    },

    itemSelector: {
      map: "Map",
      selectWebMap: "Choose Web Map",
      addMapFromOnlineOrPortal: "Find and add a web map to be used in the application from ArcGIS Online public resources or your private content in ArcGIS Online or Portal.",
      searchMapName: "Search by map name...",
      searchNone: "We couldn't find what you were looking for. Please try again.",
      groups: "Groups",
      noneGroups: "No groups",
      signInTip: "Your login session has expired, please refresh your browser to sign in to your portal again.",
      signIn: "Sign in",
      publicMap: "Public",
      myOrganization: "My Organization",
      myGroup: "My Groups",
      myContent: "My Content",
      count: "Count",
      fromPortal: "from Portal",
      fromOnline: "from ArcGIS.com",
      noneThumbnail: "Thumbnail Not Available",
      owner: "owner",
      signInTo: "Sign in to",
      lastModified: "Last Modified",
      moreDetails: "More Details"
    },

    featureLayerChooserFromPortal: {
      notSupportQuery: "The service doesn't support query."
    },

    basicLayerChooserFromMap: {
      noLayersTip: "There is no feature layer available in the map."
    },

    layerInfosMenu: {
      titleBasemap: 'Basemaps',
      titleLayers: 'Operational Layers',
      labelLayer: 'Layer Name',
      itemZoomTo: 'Zoom to',
      itemTransparency: 'Transparency',
      itemTransparent: 'Transparent',
      itemOpaque: 'Opaque',
      itemMoveUp: 'Move up',
      itemMoveDown: 'Move down',
      itemDesc: 'Description',
      itemDownload: 'Download',
      itemToAttributeTable: 'Open Attribute Table'
    },

    imageChooser: {
      unsupportReaderAPI: "TODO: Browser not suport file reader API",
      invalidType: "Invalid file type.",
      exceed: "File size cannot exceed 1024 KB",
      enableFlash: "TODO: please enable flash."
    },

    simpleTable: {
      moveUp: 'Move up',
      moveDown: 'Move down',
      deleteRow: 'Delete',
      edit: 'Edit'
    }
  },
  "ar": false,
  "cs": true,
  "da": true,
  "de": true,
  "es": true,
  "et": true,
  "fi": true,
  "fr": true,
  "he": false,
  "it": true,
  "ja": true,
  "ko": true,
  "lt": true,
  "lv": true,
  "nb": true,
  "nl": true,
  "pl": true,
  "pt-br": true,
  "pt-pt": true,
  "ro": true,
  "ru": true,
  "sv": true,
  "th": true,
  "tr": true,
  "zh-cn": true
});
