const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const theSheet = require('./exampleSheet.json');
const sheetSorter = require('../wrappers/sheet_wrapper')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Displays your character sheet'),
	async execute(interaction) {
		await interaction.deferReply();

        const characterSheet = sheetSorter.characterSheet(theSheet)

        await interaction.editReply({embeds: [characterSheet]})
	},
};
