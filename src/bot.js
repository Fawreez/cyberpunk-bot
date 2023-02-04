// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Keyv = require('keyv');
require('dotenv').config()

const token = process.env.DISCORD_TOKEN
const globalPrefix = "??"

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds,
									  GatewayIntentBits.GuildMessages,
									  GatewayIntentBits.MessageContent] });

const prefixes = new Keyv('postgresql://postgres:admin@localhost:5432/postgres', { table: 'prefixes' });
prefixes.on('error', err => console.error('Keyv connection error:', err));

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Interaction handler
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Command handler
client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;

	let args;
	// Handle messages in guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)){
			prefix = globalPrefix;
		}
		else{
			// Check for guild prefix
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// If prefix exist in the message, set up args
		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	}
	else{
		// Handle message in DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	// get the first space-delimited argument after the prefix as the command
	const command = args.shift().toLowerCase();


	// TODO move prefix commands to another file
	if (command === 'prefix') {
		// if there's at least one argument, set the prefix
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		}

		return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
	}
});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

