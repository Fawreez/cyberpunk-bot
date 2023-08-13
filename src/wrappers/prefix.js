const Keyv = require('keyv');
require('dotenv').config()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const postgres_url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

const prefixes = new Keyv(postgres_url, { table: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

const globalPrefix = process.env.GLOBAL_PREFIX


module.exports.updatePrefix = async function (guildId, args) {

	if (args.length) {
		await prefixes.set(guildId, args[0]);
		return `Successfully set prefix to \`${args[0]}\``;
	}

	return `Prefix is \`${await prefixes.get(guildId) || globalPrefix}\``;

}
