const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheets')
		.setDescription('Display a list of your characters'),
	async execute(interaction) {
		await interaction.deferReply();

		// Get user_id
		const user_id = interaction.user.id;

		// Get list of all character sheets
        const result = await sheet.fetchAllSheets(user_id);

		// Send list of character sheets embed to chat
        await interaction.editReply({embeds: [result]})
	},
};
