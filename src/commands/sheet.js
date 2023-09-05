const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Displays your character sheet'),
	async execute(interaction) {
		await interaction.deferReply();

		const user_id = interaction.user.id;

        const characterSheet = await sheet.fetchSheet(user_id)

		console.log(characterSheet);

        await interaction.editReply({embeds: [characterSheet]})
	},
};
