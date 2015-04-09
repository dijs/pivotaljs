pivotaljs
=========

Pivotal Tracker API for V5

### Documentation

<http://dijs.github.io/pivotaljs>

### Installation

```
npm install pivotaljs
```

### Example Usage

```
var Pivotal = require('pivotaljs');
var pivotal = new Pivotal('<API Token>');

pivotal.getStory("<Story ID>", function(err, story){
	// Do great things...
});
```