const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const { Routes } = require('discord-api-types/v9');
const { Player } = require('discord-player');

const { DATABASE_URI, TOKEN } = require('./config.json');

const mongoose = require('mongoose');

// Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildVoiceStates
  ]
});

module.exports = client;

// database connection
mongoose.connect(DATABASE_URI, {
	autoIndex: false, // Don't build indexes
	maxPoolSize: 10, // Maintain up to 10 socket connections
	serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
	socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
	family: 4 // Use IPv4, skip trying IPv6
}).then(() => { console.log('Successfully connected to the database !') })
.catch(err => { console.log(err) });

//commands handler
const commands = [];
client.commands = new Collection();
const commandsPathInit = path.join(__dirname, 'commands');

for (const folder1 of fs.readdirSync(commandsPathInit)) {
	const commandsPath1 = path.join(__dirname, `commands/${folder1}`);
	const commandFiles1 = fs.readdirSync(commandsPath1).filter(file => file.endsWith('.js'));

	if (folder1 != 'others') {
		for (const file of commandFiles1) {
			const filePath = path.join(commandsPath1, file);
			const command = require(filePath);
			client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		}
	} else {
		for (const folder2 of fs.readdirSync(commandsPath1)) {
			const commandsPath2 = path.join(__dirname, `commands/${folder1}/${folder2}`);
			const commandFiles2 = fs.readdirSync(commandsPath2).filter(file => file.endsWith('.js'));

			for (const file of commandFiles2) {
				const filePath = path.join(commandsPath2, file);
				const command = require(filePath);
				client.commands.set(command.data.name, command);
				commands.push(command.data.toJSON());
			}
		}
	}
}

//events handler
const eventsPathInit = path.join(__dirname, 'events');

for (const folder1 of fs.readdirSync(eventsPathInit)) {
	const eventsPath1 = path.join(__dirname, `events/${folder1}`);
	const eventFiles1 = fs.readdirSync(eventsPath1).filter(file => file.endsWith('.js'));

	if (folder1 != `guild`) {
		for (const file1 of eventFiles1) {
			const filePath = path.join(eventsPath1, file1);
			const event = require(filePath);

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		}
	} else {
		for (const folder2 of fs.readdirSync(eventsPath1)) {
			const eventsPath2 = path.join(__dirname, `events/${folder1}/${folder2}`);
			const eventFiles2 = fs.readdirSync(eventsPath2).filter(file => file.endsWith('.js'));

			for (const file2 of eventFiles2) {
				const filePath = path.join(eventsPath2, file2);
				const event = require(filePath);

				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args));
				} else {
					client.on(event.name, (...args) => event.execute(...args));
				}
			}
		}
	}
}

client.player = new Player(client, {
	ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
});

client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute({ client, interaction });
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(TOKEN);