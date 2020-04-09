const Sequelize = require('sequelize');

const sequelize = new Sequelize('demo1', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	define: {
		freezeTableName: true
	}
});
sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});
const user = sequelize.define('user', {
	username: Sequelize.STRING,
	password: Sequelize.STRING,
	role: Sequelize.STRING
});

sequelize.sync()