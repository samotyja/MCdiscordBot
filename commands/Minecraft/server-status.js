const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { serverPort, serverIp } = require('../../server-config.json');

const fetchInfo = async (ip, port) => {
	try {
		const response = await fetch(`https://api.mcsrvstat.us/3/${ip}:${port}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	}
	catch (error) {
		console.error('Błąd podczas pobierania danych API:', error);
		throw error;
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Zwraca status serwera oraz listę graczy online'),

	async execute(interaction) {
		console.log(`command '${interaction.commandName}' awakened by ${interaction.user.globalName}`);
		await interaction.deferReply({ ephemeral: true });

		try {
			const responseJson = await fetchInfo(serverIp, serverPort);

			if (responseJson.online) {
				const serverInfoEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: ONLINE! ✅')
					.addFields(
						{ name: 'Opis Serwera:', value: responseJson.motd.clean.join('\n') || 'Brak opisu' },
						{ name: 'Ilość graczy online:', value: `${responseJson.players.online}/${responseJson.players.max}` },
						{ name: 'Wersja:', value: responseJson.version || 'Nieznana' },
					)
					.setTimestamp();

				if (responseJson.icon) {
					const sfbuff = Buffer.from(responseJson.icon.split(',')[1], 'base64');
					const sfattach = new AttachmentBuilder(sfbuff, { name: 'server-icon.png' });
					serverInfoEmbed.setThumbnail('attachment://server-icon.png');

					if (responseJson.players.online > 0 && Array.isArray(responseJson.players.list)) {
						const players = responseJson.players.list.map(player => player.name).join(', ');
						serverInfoEmbed.addFields({ name: 'Lista graczy:', value: players || 'Brak danych o graczach' });
					}

					return interaction.editReply({ embeds: [serverInfoEmbed], files: [sfattach], ephemeral: true });
				}

				return interaction.editReply({ embeds: [serverInfoEmbed], ephemeral: true });
			}
			else {
				const offlineEmbed = new EmbedBuilder()
					.setColor(0xFF0000)
					.setTitle('Status Serwera: OFFLINE! 🔴🔴🔴')
					.setThumbnail('https://media3.giphy.com/media/P53TSsopKicrm/200w.gif?cid=6c09b952rnsi8yk1j53wwaqj4n8mntnr2w7rcw15stywln6h&ep=v1_gifs_search&rid=200w.gif&ct=g')
					.setDescription('Zażalenia kierować proszę do Femboya')
					.setTimestamp();

				return interaction.editReply({ embeds: [offlineEmbed], ephemeral: true });
			}
		}
		catch (error) {
			console.error('Błąd podczas pobierania statusu serwera:', error);
			return interaction.editReply({ content: 'Wystąpił błąd podczas pobierania statusu serwera. Spróbuj ponownie później.', ephemeral: true });
		}
	},
};