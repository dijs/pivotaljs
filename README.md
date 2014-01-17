pivotaljs
=========

Pivotal Tracker API for V5

### Usage

```

var Pivotal = require("pivotaljs");
var pivotal = new Pivotal(apiToken);

pivotal.getStories("1234", {}, function(err, stories){
	// Do something...
});

```