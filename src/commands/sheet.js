const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Displays your character sheet'),
	async execute(interaction) {
		await interaction.deferReply();

		// Get user_id
		const user_id = interaction.user.id;

		// Fetch character sheet
        const characterSheet = await sheet.fetchSheet(user_id)

		// Send character sheet embed to chat
        await interaction.editReply({embeds: [characterSheet]})
	},
};
