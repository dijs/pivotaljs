'use strict';

var pivotal = new(require('../index'))('000'),
	nock = require('nock');

require('should');
nock.disableNetConnect();

nock('https://www.pivotaltracker.com')
	.get('/services/v5/projects/12345/stories?offset=0&limit=128&envelope=true')
	.reply(200, [])
	.post('/services/v5/projects/12345/uploads')
	.reply(200, '{"name":"hello"}')
	.post('/services/v5/projects/12345/stories/123/comments', {'text':'Hello','file_attachments':[{'name':'hello'}]})
	.reply(200);

describe('Pivotal Tracker API', function() {

	it('should get stories', function(done) {
		pivotal.getStories('12345', {}, function(cb){ cb(); }, function(err, stories) {
			done();
		});
	});

	it('should post attachment', function(done) {
		pivotal.postAttachment('12345', '123', './README.md', 'text/plain', 'Hello', function(error, response) {
			done();
		});
	})

});