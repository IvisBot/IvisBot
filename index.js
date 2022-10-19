const fs = require('node:fs');
const path = require('node:path');

const { Client, Collection, GatewayIntentBits } = require('discord.js');

const { DATABASE_URI, TOKEN } = require('./config.json');

const mongoose = require('mongoose');

// Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

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
client.commands = new Collection();
const commandsPathInit = path.join(__dirname, 'commands');

for (const folder of fs.readdirSync(commandsPathInit)) {
	const commandsPath = path.join(__dirname, `commands/${folder}`);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		client.commands.set(command.data.name, command);
	}
}

//events handler
const eventsPathInit = path.join(__dirname, 'events');

for (const folder1 of fs.readdirSync(eventsPathInit)) {
	const eventsPath1 = path.join(__dirname, `events/${folder1}`);
	const eventFiles1 = fs.readdirSync(eventsPath1).filter(file => file.endsWith('.js'));

	for (const file1 of eventFiles1) {
		if(folder1 != "guild") {
			const filePath = path.join(eventsPath1, file1);
			const event = require(filePath);

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		} else {
			for (const folder2 of fs.readdirSync(eventsPath1)) {
				const eventsPath2 = path.join(__dirname, `events/${folder2}`);
				const eventFiles2 = fs.readdirSync(eventsPath2).filter(file => file.endsWith('.js'));

				for (const file2 of eventFiles2) {
					const filePath = path.join(eventsPath1, file2);
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
}

client.once('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(TOKEN);