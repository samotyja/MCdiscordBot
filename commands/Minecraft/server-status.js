const util = require('mc-server-utilities');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { serverPort, serverIp } = require('../../server-config.json');
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
				const sfbuff = new Buffer.from(result.favicon.split(',')[1], 'base64');
				const sfattach = new AttachmentBuilder(sfbuff, { name: 'server-icon.png' });
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: ONLINE! ✅')
					.setThumbnail('attachment://server-icon.png')
					.addFields(
						{ name: 'Opis Serwera: ', value: `${result.motd.clean}` },
						{ name: 'Ilość graczy online:', value: `${result.players.online}/${result.players.max}` },
						{ name: 'Wersja:', value: `${result.version.name}` },
					)
					.setTimestamp();
				interaction.reply({ embeds: [exampleEmbed], files: [sfattach] });
			})
			.catch((error) => {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: OFFLINE! 🔴🔴🔴')
					.setThumbnail('https://media3.giphy.com/media/P53TSsopKicrm/200w.gif?cid=6c09b952rnsi8yk1j53wwaqj4n8mntnr2w7rcw15stywln6h&ep=v1_gifs_search&rid=200w.gif&ct=g')
					.setDescription('Zażalenia kierować proszę do Admina')
					.setTimestamp();
				console.log(error);
				interaction.reply({ embeds: [exampleEmbed] });
			});
	},
};