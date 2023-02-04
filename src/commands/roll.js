const { SlashCommandBuilder } = require('discord.js');
require('../wrappers/roll_wrapper')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll some dice')
        .addStringOption(option =>
            option.setName('dice_query')
                .setDescription('The dice query')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const dice_query = interaction.options.getString('dice_query');
        const dice_result = diceRoll(dice_query);

        let result = 
        `
        Result: ${dice_result.roll_summary}\nTotal: ${dice_result.roll_result}
        `

        await interaction.editReply(String(result));
    },
};
