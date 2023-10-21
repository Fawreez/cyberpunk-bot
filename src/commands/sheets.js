const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheets')
		.setDescription('Display a list of your characters'),
	async execute(interaction) {
		await interaction.deferReply();

		const user_id = interaction.user.id;

        const result = await sheet.fetchAllSheets(user_id);

        await interaction.editReply({embeds: [result]})
	},
};
