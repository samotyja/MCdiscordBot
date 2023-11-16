const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Powiedź coś na serwerze')
		.addStringOption(option =>
			option
				.setName('wiadomość')
				.setDescription('Treść wiadomości')
				.setRequired(true)),

	async execute(interaction) {
		const msg = interaction.options.getString('wiadomość') ?? 'No reason provided';

		await interaction.reply(`${msg}`);
	},

};