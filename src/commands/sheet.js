const { SlashCommandBuilder, CommandInteraction, Message } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('sheet')
		.setDescription('Displays your character sheet'),
    aliases: ['character', 's'],
	async execute(interaction) {
		let user_id;
		let characterSheet;
        if (interaction instanceof CommandInteraction) {
            await interaction.deferReply();
            user_id = interaction.user.id;

            characterSheet = await sheet.fetchSheet(user_id);

            await interaction.editReply({embeds: [characterSheet]});

        } else if (interaction instanceof Message) {
            user_id = interaction.member.id;

			characterSheet = await sheet.fetchSheet(user_id);

			return interaction.reply({embeds:[characterSheet]});

        }

	},
};
