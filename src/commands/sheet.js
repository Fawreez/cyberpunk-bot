const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dummySheet = require('./exampleSheet.json');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Displays your character sheet'),
	async execute(interaction) {
		await interaction.deferReply();

        const characterSheet = new EmbedBuilder()
            .setColor(0xad0303)
            .setTitle(dummySheet.name)
            .setDescription(
                `**Role:** ${dummySheet.role}
                **HP:** ${dummySheet.hp}
                **INT:** ${dummySheet.stats.int} **REF:** ${dummySheet.stats.ref}
                **DEX:** ${dummySheet.stats.dex} **TECH:** ${dummySheet.stats.tech}
                **COOL:** ${dummySheet.stats.cool} **WILL:** ${dummySheet.stats.will}
                **LUCK:** ${dummySheet.stats.base_luck} **MOVE:** ${dummySheet.stats.move}
                **BODY:** ${dummySheet.stats.body} **EMP:** ${dummySheet.stats.base_emp}
                `
            )
	},
};
