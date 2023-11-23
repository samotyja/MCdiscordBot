const util = require('mc-server-utilities');
const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { serverPort, serverIp } = require('../../server-config.json');

const optionsJava = {
	timeout: 1000 * 5,
	enableSRV: true,
};

const optionsQuery = {
	sessionID: 1,
	enableSRV: true,
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Zwraca status serwera oraz listę graczy online'),

	async execute(interaction) {
		console.log(`command '${interaction.commandName}' awakened by ${interaction.user.globalName}`);
		await interaction.deferReply({ ephemeral: true });
		await util.status(serverIp, serverPort, optionsJava)
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
				return interaction.editReply({ embeds: [exampleEmbed], files: [sfattach], ephemeral: true });
			})
			.catch((error) => {
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('Status Serwera: OFFLINE! 🔴🔴🔴')
					.setThumbnail('https://media3.giphy.com/media/P53TSsopKicrm/200w.gif?cid=6c09b952rnsi8yk1j53wwaqj4n8mntnr2w7rcw15stywln6h&ep=v1_gifs_search&rid=200w.gif&ct=g')
					.setDescription('Zażalenia kierować proszę do Admina')
					.setTimestamp();
				console.log(`error durning JAVA status check ${error}`);
				return interaction.editReply({ embeds: [exampleEmbed], ephemeral: true });
			});

		await util.queryFull(serverIp, Number(serverPort), optionsQuery)
			.then((result) => {
				if (result.players.list.length > 0) {
					let playersList = '';
					for (const player of result.players.list) {
						playersList += player + ' ';
					}

					const exampleEmbed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle('Lista graczy:')
						.addFields(
							{ name: 'Online:', value: `${playersList}` },
						)
						.setTimestamp();
					return interaction.followUp({ embeds: [exampleEmbed], ephemeral: true });
				}
				else {
					return;
				}
			})
			.catch((error) => console.error(`error durning QUERY status check ${error}`));
	},
};