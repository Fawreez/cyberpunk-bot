const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sheet = require('../wrappers/sheet_wrapper');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('delete_sheet')
		.setDescription('Delete a character sheet of your choice'),
	async execute(interaction) {
		await interaction.deferReply();

		const user_id = interaction.user.id;

        const result = await sheet.fetchAllSheets(user_id);

        await interaction.editReply({embeds: [result]})

        await interaction.followUp('Which character do you want delete?');

        // Listen for further messages
        const filter = i => i.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            index = i.content;
            // Call a function to delete sheet based on the index
            sheet.deleteSheet(index, user_id);
            await interaction.followUp("Character deleted successfully");

            // Stop collecting messages
            collector.stop();

        });
	},
};
