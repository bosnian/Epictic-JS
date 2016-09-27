var url = "http://localhost:3000";
var key = "06c4aed327920fd83a81e624b37fb9e3";

QUnit.config.testTimeout = 1000;

QUnit.test( "Instance is returned if parameters are passed", function( assert ) {
  assert.ok(Epic.init() == null);
  assert.ok(Epic.init("","") == null);
  assert.ok(Epic.init("") == null);
  assert.ok(Epic.init(324,242) == null);
  assert.ok(Epic.init("aaa.scom",242) == null);
  var instance = Epic.init(url,key);
  assert.ok(instance);
  assert.ok(Epic.shared()==null);
  assert.ok(instance._url == url);
  assert.ok(instance._key == key);
  assert.ok(instance._identifier);
});

QUnit.test( "Shared instance is initialized", function( assert ) {
  assert.ok(Epic.initShared() == null);
  assert.ok(Epic.initShared("","") == null);
  assert.ok(Epic.initShared("") == null);
  assert.ok(Epic.initShared(324,242) == null);
  assert.ok(Epic.initShared("aaa.scom",242) == null);
  assert.ok(Epic.shared() == null);
  
  var instance = Epic.initShared(url,key);
  assert.ok(instance);
  assert.ok(Epic.shared())
  assert.ok(Epic._shared ==instance);
  assert.ok(Epic.shared()._url == url);
  assert.ok(Epic.shared()._key == key);
  assert.ok(Epic.shared()._identifier);
});

QUnit.test( "Identify function is setting identifier", function( assert ) {

  localStorage.removeItem('epictic-user-identifier');
  var instance = Epic.init(url,key);
  assert.ok(instance);
  assert.ok(instance._identifier);
  var email = "test@test.com";
  instance.identify(email);
  assert.ok(instance._identifier == email);
  assert.ok(localStorage.getItem('epictic-user-identifier') == email);
  localStorage.removeItem('epictic-user-identifier');
});

QUnit.test( "GUID is retrieved properly", function( assert ) {
  localStorage.removeItem('epictic-user-identifier');
  var instance = Epic.init(url,key);
  assert.ok(instance);
  assert.ok(instance._generateGUID());
  assert.ok(instance._generateGUID().length == 36);
  assert.ok(instance._generateGUID() != instance._generateGUID());
  assert.ok(instance._random4Characters());
  assert.ok(instance._random4Characters().length == 4);
  assert.ok(instance._random4Characters().length != instance._random4Characters());
  assert.ok(instance._getGUID().length > 5);
  assert.ok(localStorage.getItem('epictic-user-identifier'));
  assert.ok(instance._getGUID() == localStorage.getItem('epictic-user-identifier'));
});

QUnit.test( "Reset function is clearing instance", function( assert ) {

  var instance = Epic.init(url,key);
  instance.reset()
  
  var isEmpty = function (obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }
  assert.ok(isEmpty(instance._base));
  assert.ok(instance._url == null);
  assert.ok(instance._key == null);
  assert.ok(instance._identifier == null);
});

QUnit.test( "Track function is preparing payload and trying to send request", function( assert ) {

  var instance = Epic.init(url,key);
  var done = assert.async();
  var eventName = "Event-Name";
  var prop1 = "value1";
  var prop2 = 5;
  
  var spy = Dexter.spy( instance, '_sendRequest' );
  spy.callback = function( xhr,payload ) {
    assert.ok(xhr);
    assert.ok(payload.key == instance._key);
    assert.ok(payload.content.base == instance._base);
    assert.ok(payload.content.name == eventName);
    assert.ok(payload.content.properties.prop1 == prop1);
    assert.ok(payload.content.properties.prop2 == prop2);
    spy.restore();
    done();
  };
  
  instance.track(eventName,{ prop1: prop1, prop2: prop2})
});

QUnit.test( "HTTP POST Request is sent with correct payload and Content-type,", function( assert ) {

  var instance = Epic.init(url,key);
  var done1 = assert.async();
  var done2 = assert.async();
  var done3 = assert.async();
  var xhr = new XMLHttpRequest();
  var content = {test: 123};
  
  var spy = Dexter.spy( xhr, 'open' );
  spy.callback = function( type, url, asyncBool ) {
    assert.ok(type == "POST");
    assert.ok(url == instance._url);
    assert.ok(asyncBool);
    done1();
  };
  
  spy = Dexter.spy( xhr, 'setRequestHeader' );
  spy.callback = function( prop, value ) {
    assert.ok(prop == "Content-type");
    assert.ok(value == "application/json");
    done2();
  };
  
  spy = Dexter.spy( xhr, 'send' );
  spy.callback = function( payload ) {
    assert.ok(payload == JSON.stringify(content));
    done3();
  };
  
  instance._sendRequest(xhr, content);
});


QUnit.test( "Register function is adding properties to base and mergeing them", function( assert ) {

  var instance = Epic.init(url,key);
  instance.register({a: "a"});
  assert.ok(instance._base.a == "a");
  assert.ok(instance._base.b ==  null);
  instance.register({a: "b", b: "c"});
  assert.ok(instance._base.a ==  "b");
  assert.ok(instance._base.b ==  "c");
});

QUnit.test( "Object are mergeing in favour of newly added", function( assert ) {

  var obj1 = {
    a: "a",
    b: "b",
  }
  
  var obj2 = {
    a: "e",
    c: "c",
    d: "d",
  }
  var obj3 = Epic._lib._mergeObjects(obj1,obj2);
  assert.ok(obj3.a == "e")
  assert.ok(obj3.b == "b")
  assert.ok(obj3.c == "c")
  assert.ok(obj3.d == "d")
  
});

QUnit.test( "Validate that right url format must be passed", function( assert ) {
  assert.ok(Epic._validateUrl('http://www.google-com.123.com'));
  assert.ok(!Epic._validateUrl('http://www.google-com.123')); 
  assert.ok(Epic._validateUrl('https://www.google-com.com:4444'));
  assert.ok(Epic._validateUrl('https://www.google-com.com'));
  assert.ok(Epic._validateUrl('http://google-com.com'));
  assert.ok(Epic._validateUrl('http://google.com'));
  assert.ok(Epic._validateUrl('http://localhost:3000')); 
  assert.ok(!Epic._validateUrl('google.com')); 
  assert.ok(!Epic._validateUrl('fasdfasdf')); 
  assert.ok(!Epic._validateUrl(2323)); 
});
