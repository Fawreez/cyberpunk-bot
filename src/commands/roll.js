const { SlashCommandBuilder } = require('discord.js');

function diceRoll(dice_query){
    let output = 0;

    dice_query.toLowerCase();
    let split_dice_query = dice_query.toString().split('+');

    for (let i = 0; i<split_dice_query.length; i++){
        let dice = split_dice_query[i];
        if (dice.includes('d')){
            let parsed_dice = parseDice(dice)
            for (let j=0; j<parsed_dice.dice_multiplier; j++){
                let roll_result = Math.floor(Math.random() * parsed_dice.dice_type) + 1;
                output = output + roll_result
                console.log(roll_result)
            }
        }
        else{output = output + Number(dice);}
        
    }

    return output
}

function parseDice(dice){
    let split_dice = dice.toString().split('d');
    dice_multiplier = split_dice[0];
    if (dice_multiplier == 0){
        dice_multiplier = 1;
    }

    dice_type = split_dice[1];

    response = {"dice_multiplier": Number(dice_multiplier), "dice_type": Number(dice_type)};
    console.log(response)
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
