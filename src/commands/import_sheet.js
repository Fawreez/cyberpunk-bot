const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('import_sheet')
        .setDescription('Import a character sheet into the bot from a .json file')
        .addAttachmentOption(option =>
            option.setName('sheet_json')
            .setDescription('Character sheet to be imported')
            .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        
        // Get attached file
        const sheet_json = interaction.options.getAttachment('sheet_json')

        // Get user_id
        const user_id = interaction.user.id;

        // Return result
        const result = await sheet.importSheetFromJSON(user_id, sheet_json);

        await interaction.editReply(result);
    },
};
