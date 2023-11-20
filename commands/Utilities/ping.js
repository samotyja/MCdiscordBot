const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Odpowiada Pongiem!'),
	async execute(interaction) {
		console.log(`command '${interaction.commandName}' awakened by ${interaction.user.globalName}`);
		await interaction.reply('Pong!');
	},
};