const Keyv = require('keyv');
require('dotenv').config()

const prefixes = new Keyv('postgresql://postgres:admin123@localhost:5432/postgres', { table: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

const globalPrefix = process.env.GLOBAL_PREFIX


module.exports.updatePrefix = async function (guildId, args){
    
		if (args.length) {
			await prefixes.set(guildId, args[0]);
			return `Successfully set prefix to \`${args[0]}\``;
		}

		return `Prefix is \`${await prefixes.get(guildId) || globalPrefix}\``;
    
}
