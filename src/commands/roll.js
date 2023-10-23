const { SlashCommandBuilder, CommandInteraction, Message } = require('discord.js');
const dice = require('../wrappers/roll_wrapper')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll some dice')
        .addStringOption(option =>
            option.setName('dice_query')
                .setDescription('The dice query')
                .setRequired(true)),
    aliases: ['r', 'dice'],
    async execute(interaction, args) {
        let dice_query;
        let result;
        if (interaction instanceof CommandInteraction) {
            await interaction.deferReply();
            dice_query = interaction.options.getString('dice_query');

            result = await formResult(dice_query);

            await interaction.editReply(String(result));

        } else if (interaction instanceof Message) {
            dice_query = args.join(" ");

            result = await formResult(dice_query);

            interaction.reply(result);
        }

    },
};

async function formResult(dice_query){
    const dice_result = dice.diceRoll(dice_query);
    let result = `
    Result: ${dice_result.roll_summary}\nTotal: ${dice_result.roll_result}
    `;
    return result

}