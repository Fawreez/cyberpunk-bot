const { SlashCommandBuilder, CommandInteraction, Message } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('import_sheet')
        .setDescription('Import a character sheet into the bot from a .json file')
        .addAttachmentOption(option =>
            option.setName('sheet_json')
            .setDescription('Character sheet to be imported')
            .setRequired(true)),
    aliases: ['is', 'import_character'],
    async execute(interaction) {
		let user_id;
		let sheet_json;
        let result;
        if (interaction instanceof CommandInteraction) {
            await interaction.deferReply();

            sheet_json = interaction.options.getAttachment('sheet_json');
            
            user_id = interaction.user.id;

            result = await sheet.importSheetFromJSON(user_id, sheet_json);

            await interaction.editReply(result);

        } else if (interaction instanceof Message) {
            sheet_json = interaction.attachments.first();
            
            user_id = interaction.member.id;

            result = await sheet.importSheetFromJSON(user_id, sheet_json);

			return interaction.reply(result);

        }

    },
};
