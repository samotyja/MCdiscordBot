const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { serverPort, serverIp } = require('../../server-config.json');

const FetchInfo = async (ip, port) => {
	try {
		const response = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}:${port}`);
		const responseJson = await response.json();
		return responseJson;
	}
	catch (error) {
		console.log('Error durning fatching API data', error);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Zwraca status serwera oraz listę graczy online'),

	async execute(interaction) {
		console.log(`command '${interaction.commandName}' awakened by ${interaction.user.globalName}`);
		await interaction.deferReply({ ephemeral: true });
		const responseJson = await FetchInfo(serverIp, serverPort);
		if (responseJson.online) {
			const sfbuff = new Buffer.from(responseJson.icon.split(',')[1], 'base64');
			const sfattach = new AttachmentBuilder(sfbuff, { name: 'server-icon.png' });
			const serverInfoEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Status Serwera: ONLINE! ✅')
				.setThumbnail('attachment://server-icon.png')
				.addFields(
					{ name: 'Opis Serwera: ', value: `${responseJson.motd.clean}` },
					{ name: 'Ilość graczy online:', value: `${responseJson.players.online}/${responseJson.players.max}` },
					{ name: 'Wersja:', value: `${responseJson.version.name_clean}` },
				)
				.setTimestamp();

			if (responseJson.players.online > 0) {
				let players = [];
				for (let index = 0; index < responseJson.players.list.length; index++) {
					players += responseJson.players.list[index].name_clean + ', ';
				}
				serverInfoEmbed.addFields(
					{ name: 'Lista graczy:', value: `${players}` },
				);
			}
			return interaction.editReply({ embeds: [serverInfoEmbed], files: [sfattach], ephemeral: true });
		}
		else {
			const serverInfoEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Status Serwera: OFFLINE! 🔴🔴🔴')
				.setThumbnail('https://media3.giphy.com/media/P53TSsopKicrm/200w.gif?cid=6c09b952rnsi8yk1j53wwaqj4n8mntnr2w7rcw15stywln6h&ep=v1_gifs_search&rid=200w.gif&ct=g')
				.setDescription('Zażalenia kierować proszę do Admina')
				.setTimestamp();
			return interaction.editReply({ embeds: [serverInfoEmbed], ephemeral: true });
		}
	},
};