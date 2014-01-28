'use strict';
  
var request = require('request'),
	_ = require('underscore'),
	querystring = require('querystring'),
	fs = require('fs'),
	path = require('path'),
	Pivotal;

/**
 * Pivotal constructor
 * @param {String} [apiToken] API token generated from Pivotal
 */
Pivotal = function Pivotal(apiToken) {
	this.apiToken = apiToken;
	this.baseUrl = 'https://www.pivotaltracker.com/services/v5/';
};

/**
 * Update a Pivotal Story
 * @param  {String}   projectId Pivotal project id
 * @param  {String}   storyId   Pivotal story id
 * @param  {Object}   [params]  Extra parameters
 * @param  {Function} [callback]  function(error, response)
 */
Pivotal.prototype.updateStory = function updateStory(projectId, storyId, params, callback) {
	this.api('put', 'projects/' + projectId + '/stories/' + storyId, {
		json: params
	}, callback);
};

/**
 * Get stories from Pivotal project
 * @param  {String}   projectId Pivotal project id
 * @param  {Object}   [options]   Extra parameters
 * @param  {Function} [callback]  function(error, stories)
 */
Pivotal.prototype.getStories = function getStories(projectId, options, callback) {
	this.api('get', 'projects/' + projectId + '/stories', {
		qs: options
	}, callback);
};

/**
 * Get comments from Pivotal story
 * @param  {String}   projectId Pivotal project id
 * @param  {String}   storyId   Pivotal story id
 * @param  {Function} [callback]  function(error, comments)
 */
Pivotal.prototype.getComments = function getStories(projectId, storyId, callback) {
	this.api('get', 'projects/' + projectId + '/stories/' + storyId + '/comments', {}, callback);
};

/**
 * Export stories from Pivotal
 * @param  {String}    projectId Pivotal project id
 * @param  {String[]}  stories   List of story id's
 * @param  {Function}  [callback]  function(error, response)
 */
Pivotal.prototype.exportStories = function exportStories(projectId, stories, callback) {
	this.api('post', 'projects/' + projectId + '/export', {
		body: querystring.stringify({
			'story_ids[]': stories
		})
	}, callback);
};

/**
 * Post attachment to Pivotal story
 * @param  {String}   projectId Pivotal project id
 * @param  {String}   storyId   Pivotal story id
 * @param  {String}   filepath  Path of attachment
 * @param  {String}   type      Content type of attachment
 * @param  {String}   comment   Comment text
 * @param  {Function} [callback]  function(error, response)
 */
Pivotal.prototype.postAttachment = function postAttachment(projectId, storyId, filepath, type, comment, callback) {
	var that = this;
	fs.readFile(filepath, function(err, contents) {
		that.api('post', 'projects/' + projectId + '/uploads', {
			multipart: [{
				'Content-Disposition': 'form-data; name=\'file\'; filename=\'' + path.basename(filepath) + '}\'',
				'Content-Type': type,
				'body': contents
			}]
		}, function(err, upload) {
			if (err) {
				callback(err, {
					success: false
				});
			} else {
				that.api('post', 'projects/' + projectId + '/stories/' + storyId + '/comments', {
					json: {
						text: comment,
						file_attachments: [upload]
					}
				}, callback);
			}
		});
	});
};

/**
 * Get all labels in Pivotal project
 * @param  {String}   projectId Pivotal project id
 * @param  {Function} [callback]  function(error, labels)
 */
Pivotal.prototype.getLabels = function getLabels(projectId, callback) {
	this.api('get', 'projects/' + projectId + '/labels', {}, callback);
};

/**
 * Create Pivotal label
 * @param  {String}   projectId Pivotal project id
 * @param  {[type]}   name      Name of label
 * @param  {Function} [callback]  function(error, label)
 */
Pivotal.prototype.createLabel = function createStory(projectId, name, callback) {
	this.api('post', 'projects/' + projectId + '/labels', {
		body: {
			name: name
		}
	}, callback);
};

/**
 * Create new Pivotal story
 * @param  {String}   projectId Pivotal project id
 * @param  {Object}   [params]  Story parameters
 * @param  {Function} [callback]  function(error, story)
 */
Pivotal.prototype.createStory = function createStory(projectId, params, callback) {
	this.api('post', 'projects/' + projectId + '/stories', {
		body: params
	}, callback);
};

Pivotal.prototype.api = function api(method, path, options, callback) {
	var opts = _.extend({
		method: method,
		url: this.baseUrl + path,
		json: true,
		headers: {
			'X-TrackerapiToken': this.apiToken
		}
	}, options);
	request(opts, function(err, response, result) {
		if (_.isFunction(callback)) {
			callback(err, result);
		}
	});
};

module.exports = Pivotal;