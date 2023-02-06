const Keyv = require('keyv');
require('dotenv').config()

const prefixes = new Keyv('postgresql://postgres:admin123@localhost:5432/postgres', { table: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

const globalPrefix = process.env.GLOBAL_PREFIX


module.exports.updatePrefix = async function (message, args){
    
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		}

		return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
    
}
