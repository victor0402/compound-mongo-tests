var connect = require('../node_modules/jugglingdb-mongodb/node_modules/mongodb').connect;

should = require('should');
request = require('supertest');
sinon = require('sinon');
expect = require('chai').expect;

helper = require('./helper');
db = null;
app = null;
compound = null;

before(function (done) {
	app = getApp();
	compound = app.compound;
	cleanupApp();
	compound.on('ready', function () {
		buildDBConnection(done)
	});
});

after(function (done) {
	db.close();
	done();
});

function cleanupApp() {
	app.renderedViews = [];
	app.flashedMessages = {};

	// Monkeypatch app#render so that it exposes the rendered view files
	app._render = app.render;
}

global.cleanupApp = cleanupApp;

function getApp() {
	var app = require('compound').createServer();

	app.render = function (viewName, opts, fn) {
		app.renderedViews.push(viewName);

		// Deep-copy flash messages
		var flashes = opts.request.session.flash;
		for (var type in flashes) {
			app.flashedMessages[type] = [];
			for (var i in flashes[type]) {
				app.flashedMessages[type].push(flashes[type][i]);
			}
		}

		return app._render.apply(this, arguments);
	};

	// Check whether a view has been rendered
	app.didRender = function (viewRegex) {
		var didRender = false;
		app.renderedViews.forEach(function (renderedView) {
			if (renderedView.match(viewRegex)) {
				didRender = true;
			}
		});
		return didRender;
	};

	// Check whether a flash has been called
	app.didFlash = function (type) {
		return !!(app.flashedMessages[type]);
	};

	return app;
};

function buildDBConnection(cb) {
	var stringConexao = 'mongodb://localhost/compound-mongo-dev';

	connect(stringConexao, function (err, con) {
		db = con;
		cb(err)
	});
}

validateSavedData = function(err, data) {
	expect(err).to.not.exist;
	expect(data).to.exist;
};