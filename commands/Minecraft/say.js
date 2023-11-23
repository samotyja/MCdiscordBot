const util = require('mc-server-utilities');
const { SlashCommandBuilder } = require('discord.js');
const { rconPort, serverIp, rconPassword } = require('../../server-config.json');

const client = new util.RCON();

const options = {
	timeout: 1000 * 5,
};

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
		console.log(`command '${interaction.commandName}' awakened by ${interaction.user.globalName}`);
		await interaction.deferReply({ ephemeral: true });
		const msg = interaction.options.getString('wiadomość') ?? 'Nie podano wiadomości';
		await client.connect(serverIp, rconPort, options);
		await client.login(rconPassword);
		await client.execute(`/say ${interaction.user.globalName}: ${msg}`);
		await client.close();
		await interaction.editReply({ content: `Wiadomość o treści "${msg}" została wysłana na serwer`, ephemeral: true });
	},

};