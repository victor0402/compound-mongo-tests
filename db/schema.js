/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
 property('email', String, { index: true });
 property('password', String);
 property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
 // model definitions here
 });

 */

var User = describe('User', function () {
	property('name', String);
	set('restPath', pathTo.users);
});

var Address = describe('Address', function () {
	property('street', String);
	set('restPath', pathTo.addresses);
});

var Preference = describe('Preference', function () {
	property('name', String);
	property('value', String);
	set('restPath', pathTo.preferences);
});

var Role = describe('Role', function () {
	property('name', String);
	set('restPath', pathTo.roles);
});

Address.belongsTo(User, {as: 'user', foreignKey: 'userId'});

User.hasAndBelongsToMany('preferences');

Role.hasMany(User, {as: 'users', foreignKey: 'roleId'});
User.belongsTo(Role, {as: 'role', foreignKey: 'roleId'});