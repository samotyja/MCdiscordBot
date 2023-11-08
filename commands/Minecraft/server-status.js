const { SlashCommandBuilder } = require('discord.js');
const util = require('mc-server-utilities');
const { EmbedBuilder } = require('discord.js');
const { serverPort, serverIp } = require('../../server-config.json');
console.log();
const options = {
	timeout: 1000 * 5,
	enableSRV: true,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Udostępnia informację o statusie serwera (NOWAY) i o ilości osób online'),
	async execute(interaction) {
		await util.status(serverIp, Number(serverPort), options)
			.then((result) => {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: ONLINE! ✅')
					.setThumbnail('https://i.imgur.com/AfFp7pu.png')
					.addFields(
						{ name: 'Ilość graczy online:', value: `${result.players.online}/${result.players.max}` },
						{ name: 'Wersja:', value: `${result.version.name}` },
						{ name: 'Opis Serwera: ', value: `${result.motd.clean}` },
					)
					.setTimestamp();
				console.log(result);
				interaction.reply({ embeds: [exampleEmbed] });
			})
			.catch((error) => {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: OFFLINE! 🔴🔴🔴')
					.setThumbnail('https://i.imgur.com/AfFp7pu.png')
					.setDescription('Zażalenia kierować proszę do Admina')
					.setTimestamp();
				console.log(error);
				interaction.reply({ embeds: [exampleEmbed] });
			});
	},
};