var request = require('supertest'),
	sinon = require('sinon'),
	helper = require('../../helper');

describe('User', function () {
	before(function (done) {
		User = app.models.User;
		Address = app.models.Address;
		Preference = app.models.Preference;
		Role = app.models.Role;
		UserPreference = app.models.UserPrefenrece;

		helper.cleanDb(db, done)
	});

	describe("when create a user with all attributes", function () {
		before(function (done) {
			createData(done)
		})

		var userName = 'user';

		it('should be possible get the user preferences', function (done) {
			User.findOne({where: {name: userName}}, function (err, user) {

				user.preferences(function (err, prefs) {
					expect(prefs).to.be.a('array').
						and.to.have.length(2);
					done()
				})
			})
		});

		it('should be possible get an address using the user to find it', function (done) {
			User.findOne({where: {name: userName}}, function (err, user) {
				validateSavedData(err, user);

				Address.findOne({where: {userId: user.id}}, function (err, address) {
					validateSavedData(err, address);
					done()
				})
			})
		});

		it('should be possible get an role using the roleId in the user', function (done) {
			User.findOne({where: {name: userName}}, function (err, user) {
				validateSavedData(err, user);
				user.role(function (err, role) {
					validateSavedData(err, role);
					done()
				})
			})
		});

		function createData(done) {
			Preference.create({name: 'pref 1'}, function (err, pref1) {
				validateSavedData(err, pref1);

				Preference.create({name: 'pref 2'}, function (err, pref2) {
					validateSavedData(err, pref2);

					Role.create({name: 'admin'}, function (err, role) {
						validateSavedData(err, role);

						var newUser = role.users.build({name: userName});
						newUser.save(function (err, user) {
							validateSavedData(err, user);

							user.preferences.add(pref1, function (err, addedPref1) {
								validateSavedData(err, addedPref1);

								user.preferences.add(pref2, function (err, addedPref2) {
									validateSavedData(err, addedPref2);

									Address.create({street: 'street', userId: user.id}, function (err, address) {
										validateSavedData(err, address);
										done()
									})
								})
							})
						})
					})
				})
			});
		}
	})

});