const { SlashCommandBuilder, CommandInteraction, Message } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheets')
		.setDescription('Display a list of your characters'),
	async execute(interaction) {
		let user_id;
		let characterList;
        if (interaction instanceof CommandInteraction) {
            await interaction.deferReply();
            user_id = interaction.user.id;

            characterList = await sheet.fetchAllSheets(user_id);

            await interaction.editReply({embeds: [characterList]});

        } else if (interaction instanceof Message) {
            user_id = interaction.member.id;

			characterList = await sheet.fetchAllSheets(user_id);

			return interaction.reply({embeds:[characterList]});

        }

	},
};
