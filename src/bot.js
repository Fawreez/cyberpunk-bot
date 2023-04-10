// Require the necessary wrapper files
const prefix = require('./wrappers/prefix')
const dice = require('./wrappers/roll_wrapper')
const sheet = require('./wrappers/sheet_wrapper')

// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityFlagsBitField } = require('discord.js');
const Keyv = require('keyv');
require('dotenv').config()

// Keyv
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const postgres_url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

const prefixes = new Keyv(postgres_url, { table: 'prefixes' });

const token = process.env.DISCORD_TOKEN
const globalPrefix = process.env.GLOBAL_PREFIX

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent]
});

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
		let bot_prefix;

		if (message.content.startsWith(globalPrefix)) {
			bot_prefix = globalPrefix;
		}
		else {
			// Check for guild prefix
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// If prefix exist in the message, set up args
		if (!bot_prefix) return;
		args = message.content.slice(bot_prefix.length).trim().split(/\s+/);
	}
	else {
		// Handle message in DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice);
	}

	// get the first space-delimited argument after the prefix as the command
	const command = args.shift().toLowerCase();

	// Switch to handle all the different commands
	switch (command) {
		case "prefix":
			let result = await prefix.updatePrefix(message.guild.id, args);
			return message.channel.send(result)

		case "r":
		case "roll":
			args = args.join("")
			let dice_result = dice.diceRoll(args);
			result = `
			Result: ${dice_result.roll_summary}\nTotal: ${dice_result.roll_result}
			`;
			return message.channel.send(result);

		case "import":
		case "import_sheet":
			let user_id = message.member.id;
			let file = message.attachments.first();
			result = await sheet.importSheetFromJSON(user_id, file);

			return message.channel.send(result);

		default:
			return message.channel.send(`Command ${command} not found`)
	}
});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);

