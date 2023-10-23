const { SlashCommandBuilder, CommandInteraction, Message  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	alias: ['p'],
	async execute(interaction) {
		let sent;

        if (interaction instanceof CommandInteraction) {
            const start = Date.now();
            await interaction.reply('Pinging...');
            const end = Date.now();
        	await interaction.editReply(`Pong! Latency is ${end - start}ms.`);

        } else if (interaction instanceof Message) {
            sent = await interaction.reply('Pinging...');
        	sent.edit(`Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms.`);
        }

	},
};
