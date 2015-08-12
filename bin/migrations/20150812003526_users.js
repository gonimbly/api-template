
exports.up = function(knex, Promise) {
	return knex.transaction(function (trx) {
		return Promise.resolve()
			.then(function(){
				return trx.schema.createTable('users', function (table) {
					table.increments('id').primary();
					table.text('password').notNullable();
					table.text('email').notNullable();
					table.text('firstName').notNullable();
					table.text('lastName').notNullable();
					table.timestamps();
				});
			});
	});
};

exports.down = function(knex, Promise) {
	return knex.transaction(function (trx) {
		return Promise.resolve()
			.then(function(){
				return trx.schema.dropTable('users');
			});
	});
};
