var DatabaseCleaner = require('database-cleaner');

exports.cleanDb = function (db, cb) {
	var databaseCleaner = new DatabaseCleaner('mongodb');
	databaseCleaner.clean(db, cb);
};
