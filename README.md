pivotaljs
=========

Pivotal Tracker API for V5

### Documentation

<http://rompetoto.github.io/pivotaljs>

### Usage

```

var Pivotal = require("pivotaljs");
var pivotal = new Pivotal(apiToken);

pivotal.getStories("1234", {}, function(err, stories){
	// Do something...
});

```