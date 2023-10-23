const { SlashCommandBuilder, CommandInteraction, Message } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('switch_sheet')
		.setDescription('Switch your active character'),
	async execute(interaction) {
        let user_id;
        let result;

        if (interaction instanceof CommandInteraction) {
            await interaction.deferReply();

            //Get user_id
            user_id = interaction.user.id;

            // Fetch a list of character sheets the user has
            result = await sheet.fetchAllSheets(user_id);

            // Send the list of character sheet to the chat
            await interaction.editReply({embeds: [result]})

            // Prompt user to send an index
            await interaction.followUp('Which character do you want to switch to?');

            // Listen for further messages
            const filter = i => i.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                index = i.content;
                
                // Check if index is an integer
                if (!(index == parseInt(index, 10))){
                    await interaction.followUp("The message you sent was not a number")
                }
                else{
                    // Call a function to delete sheet based on the index
                    sheet.switchActiveCharacter(index, user_id);
                    await interaction.followUp("Active character deleted successfully");
                }

                // Stop collecting messages
                collector.stop();

            });

        } else if (interaction instanceof Message) {
            //Get user_id
            user_id = interaction.member.id;

            // Fetch a list of character sheets the user has
            result = await sheet.fetchAllSheets(user_id);

            // Send the list of character sheet to the chat
            await interaction.reply({embeds: [result]});

            // Prompt user to send an index
            await interaction.channel.send('Which character do you want to switch to?');

            // Listen for further messages
            const filter = i => i.author.id === interaction.member.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                index = i.content;
                
                // Check if index is an integer
                if (!(index == parseInt(index, 10))){
                    await interaction.channel.send("The message you sent was not a number")
                }
                else{
                    // Call a function to delete sheet based on the index
                    sheet.switchActiveCharacter(index, user_id);
                    await interaction.channel.send("Active character switched successfully");
                }

                // Stop collecting messages
                collector.stop();

            });

        }

	},
};
