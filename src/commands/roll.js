const { SlashCommandBuilder } = require('discord.js');

/**
 * Process dice query (e.g. 2d6+3) and return the roll result
 * @param {String} dice_query Dice query to be processed
 * @returns {Number} Dice roll result
 */
function diceRoll(dice_query) {
    // Set output to 0
    let output = 0;

    // Lower all cases
    dice_query.toLowerCase();

    // Split dice queries into individual dice queries
    let split_dice_query = dice_query.toString().split('+');

    for (let i = 0; i < split_dice_query.length; i++) {
        let dice = split_dice_query[i];

        // If dice query doesn't involve dice, add to output. Else, roll the dice
        if (dice.includes('d')) {
            let parsed_dice = parseDice(dice)
            
            // Roll a dice multiple times based on dice multiplier
            for (let j = 0; j < parsed_dice.dice_multiplier; j++) {
                let roll_result = Math.floor(Math.random() * parsed_dice.dice_type) + 1;
                output = output + roll_result
            }
        }
        else { output = output + Number(dice); }

    }

    return output
}

/**
 * Parse dice query to dice multiplier and dice type
 * @param {String} dice Dice query to be parsed
 * @returns {Object} Object containing dice_multiplier and dice_type
 */
function parseDice(dice) {
    let split_dice = dice.toString().split('d');

    // Get the dice multiplier. if 0, override to 1
    dice_multiplier = split_dice[0];
    if (dice_multiplier == 0) {
        dice_multiplier = 1;
    }

    dice_type = split_dice[1];

    response = { "dice_multiplier": Number(dice_multiplier), "dice_type": Number(dice_type) };
    return response
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll some dice')
        .addStringOption(option =>
            option.setName('dice_query')
                .setDescription('The dice query')
                .setRequired(true)),
    async execute(interaction) {
        const dice_query = interaction.options.getString('dice_query')

        await interaction.reply(String(diceRoll(dice_query)));
    },
};
