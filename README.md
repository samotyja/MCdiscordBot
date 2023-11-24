# MCdiscordBot

## About
Simple discord bot node.js project made using [mcstatus API](mcstatus.io) and [minecraft-server-util](https://passthemayo.gitbook.io/minecraft-server-util/).

BOT can display information about the server status (current online players, player list, etc.) and send '/say' command to display text in the server chat. 

## Instalation
It was made for my own small server, so it does not have any more advanced features, and all information like server ip, port ect. has to be hardcoded into a separate JSON file.

You need to create 2 .json files like this:

config.json
{
	"token": "discrod bot token",
	"clientId": "client id",
	"guildId": "guild id"
}

server-config.json
{
	"serverIp": "Minecraft server IP",
	"serverPort": server port,
	"rconPort": RCON port,
	"rconPassword": "RCON password"
}

*Everything except serverPort and rconPort (numbers) must be strings.*

If everything is configured correctly, the bot should start after running the main.js file.