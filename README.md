# Epictic JS - Epic Analytics

# Installation
## Step 1: Include library

Download and include library in your html
```html
<source src="Epictic.min.js"></source>
```

## Step 2: Initialize Epictic environment with *key* and *url*
```javascript
var tracker = Epic.init("YOUR_URL", "API_KEY");
```

## Step 3: Track your events!
```javascript
tracker.track("Edit Profile", null);
```

# Documentation
## Initialization

Use shared instance.
```javascript
Epic.initShared("YOUR_URL", "API_KEY");
Epic.track("Edit Profile", null);
```
Create one instance, or multiple ones with different environments.
```javascript
var tracker = Epic.init("YOUR_URL", "API_KEY");
var tracker2 = Epic.init("YOUR_URL2", "API_KEY2");
tracker.track("Edit Profile", null);
tracker2.track("Troubleshooting", null);
```

## Tracking

Track event without properties.
```javascript
tracker.track("Login",null);
```
Track event with properties.
```javascript
var properties = {
  EmailEntered: true,
  PasswordEntered: false,
  Success: false 
}
tracker.track("Login",properties);
```

### Register properties 
Register properties once and they will be sent with every request. If you register properties multiple times, properties will be merged in favor of newly added.
```javascript
var properties = {
  Platform: navigator.platform,
  Browser: navigator.appName,
  BrowserVersion: navigator.appVersion
}
tracker.register(properties);
```
