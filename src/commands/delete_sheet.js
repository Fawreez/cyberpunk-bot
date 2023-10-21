const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('delete_sheet')
		.setDescription('Delete a character sheet of your choice'),
	async execute(interaction) {
		await interaction.deferReply();

        //Get user_id
		const user_id = interaction.user.id;

        // Fetch a list of character sheets the user has
        const result = await sheet.fetchAllSheets(user_id);

        // Send the list of character sheet to the chat
        await interaction.editReply({embeds: [result]})

        // Prompt user to send an index
        await interaction.followUp('Which character do you want delete?');

        // Listen for further messages
        const filter = i => i.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            index = i.content;
            
            // Check if index is an integer
            if (!(index === parseInt(index, 10))){
                await interaction.followUp("The message you sent was not a number")
            }
            else{
                // Call a function to delete sheet based on the index
                sheet.deleteSheet(index, user_id);
                await interaction.followUp("Character deleted successfully");
            }

            // Stop collecting messages
            collector.stop();

        });
	},
};
