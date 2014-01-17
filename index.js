
/*jslint node: true, nomen: true */
"use strict";

var request = require("request"),
	_ = require("underscore"),
	querystring = require("querystring"),
	fs = require("fs"),
	path = require("path"),
	Pivotal;

Pivotal = function Pivotal(token) {
	this.token = token;
	this.baseUrl = "https://www.pivotaltracker.com/services/v5/";
};

Pivotal.prototype.updateStory = function updateStory(projectId, storyId, params, callback) {
	this.api("put", "projects/" + projectId + "/stories/" + storyId, {
		json: params
	}, callback);
};

Pivotal.prototype.getStories = function getStories(projectId, options, callback) {
	this.api("get", "projects/" + projectId + "/stories", {
		qs: options
	}, callback);
};

Pivotal.prototype.getComments = function getStories(projectId, storyId, callback) {
	this.api("get", "projects/" + projectId + "/stories/" + storyId + "/comments", {}, callback);
};

Pivotal.prototype.exportStories = function exportStories(projectId, stories, callback) {
	this.api("post", "projects/" + projectId + "/export", {
		body: querystring.stringify({
			"story_ids[]": stories
		})
	}, callback);
};

Pivotal.prototype.postAttachment = function postAttachment(projectId, storyId, filepath, type, comment, callback) {
	var that = this;
	fs.readFile(filepath, function(err, contents) {
		that.api("post", "projects/" + projectId + "/uploads", {
			multipart: [{
				"Content-Disposition": "form-data; name=\"file\"; filename=\"" + path.basename(filepath) + "}\"",
				"Content-Type": type,
				"body": contents
			}]
		}, function(err, upload) {
			if (err) {
				callback(err, {
					success: false
				});
			} else {
				that.api("post", "projects/" + that.config.pivotalProjectId + "/stories/" + storyId + "/comments", {
					json: {
						text: comment,
						file_attachments: [JSON.parse(upload)]
					}
				}, callback);
			}
		});
	});
};

Pivotal.prototype.getLabels = function getLabels(projectId, callback) {
	this.api("get", "projects/" + projectId + "/labels", {}, callback);
};

Pivotal.prototype.createLabel = function createStory(projectId, name, callback) {
	this.api("post", "projects/" + projectId + "/labels", {
		body: {
			name: name
		}
	}, callback);
};

Pivotal.prototype.createStory = function createStory(projectId, params, callback) {
	this.api("post", "projects/" + projectId + "/stories", {
		body: params
	}, callback);
};

Pivotal.prototype.api = function api(method, path, options, callback) {
	var opts = _.extend({
		method: method,
		url: this.baseUrl + path,
		json: true,
		headers: {
			"X-TrackerToken": this.token
		}
	}, options);
	request(opts, function(err, response, result) {
		if (_.isFunction(callback)) {
			callback(err, result);
		}
	});
};

module.exports = Pivotal;