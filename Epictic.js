/*! @preserve Epictic - v0.0.1 -  * https://github.com/bosnian
 * Copyright (c) 2016 Ammar Hadzic; Licensed MIT */
var Epic = {
    _shared: null,
    _lib: {
      /**
      * Project variables
      **/
      _key: null,
      _url: null,
      _base: {},
      
      /**
      * Track event with given name and properties
      *
      * @param {String} eventName
      * @param {Object} properties
      **/
      track: function(eventName, properties){
        var payload = {
          key: this._key,
          content: {
            base: this._base,
            properties: properties,
            name: eventName
          }
          
        }
        this._sendRequest(new XMLHttpRequest(),payload);
      },
      
      /**
      * Register properties which will be sent with every request
      *
      * @param {Object} properties
      **/
      register: function(properties){
        this._base = this._mergeObjects(this._base, properties)
      },
      
      /**
      * Reset all properties
      **/
      reset: function(){
        this._base = { };
        this._key = null;
        this._url = null;
      },
      
      /**
      * Executes request to API with given payload
      *
      * @param {Object} payload
      **/
      _sendRequest: function(xhr,payload){
        xhr.open("POST", this._url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(payload));
      },
      
      /**
      * Merge two object in favor of second
      *
      * @param {Object} obj1
      * @param {Object} obj2
      * @return {Object} MergedObject
      **/
      _mergeObjects: function (obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
      }
    },
    
    /**
    * Initialize library 
    *
    * @constructor
    * @param {String} url
    * @param {String} key
    * @return {Object} Instance
    **/
    init: function(url, key){
      if(!url || !key || !this._validateUrl(url) || typeof key != 'string'){
        return null;
      }
      this._lib._url = url;
      this._lib._key = key;
      return this._lib;
    },
    
    /**
    * Initialize shared instance 
    *
    * @constructor
    * @param {String} url
    * @param {String} key
    * @return {Object} Instance
    **/
    initShared: function(url, key){
      if(!url || !key || !this._validateUrl(url) || typeof key != 'string'){
        return null;
      }
      this._lib._url = url;
      this._lib._key = key;
      this._shared = this._lib;
      return this._shared
    },
    
    /**
    * Get shared instance
    *
    * @return {Object} Instance
    **/
    shared: function(){
      return this._shared
    },
    
    /**
    * Validate url format
    *
    * @param {String} url
    * @return {Boolean} isValid
    **/
    _validateUrl: function(url){
      var loc = /(localhost)./
      var patt = /^(http?|https?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
      return patt.test(url) || loc.test(url);
    }
}
