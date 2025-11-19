const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Collections para comandos
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// --- CARREGAR EVENTOS ---
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
});

// --- CARREGAR COMANDOS SLASH ---
const slashPath = path.join(__dirname, 'commands/slash');
fs.readdirSync(slashPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const command = require(path.join(slashPath, file));
  client.slashCommands.set(command.data.name, command);
});

// --- CARREGAR COMANDOS PREFIX ---
const prefixPath = path.join(__dirname, 'commands/prefix');
fs.readdirSync(prefixPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const command = require(path.join(prefixPath, file));
  client.prefixCommands.set(command.name, command);
});

// --- FUNÇÃO PARA REGISTRAR COMANDOS NA GUILD ---
async function registerSlashCommands(guildId) {
  try {
    const commands = [];
    
    // Coletar todos os comandos slash
    client.slashCommands.forEach(command => {
      commands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(config.token);
    
    console.log(`[REGISTRO] Registrando ${commands.length} comandos para a guild ${guildId}...`);
    
    // Registrar comandos apenas para a guild específica
    const data = await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: commands }
    );
    
    console.log(`[REGISTRO] ✅ ${data.length} comandos registrados com sucesso na guild ${guildId}!`);
    return data;
    
  } catch (error) {
    console.error('[ERRO REGISTRO] Erro ao registrar comandos:', error);
  }
}

// --- EVENTO QUANDO O BOT ENTRA EM UMA GUILD ---
client.on('guildCreate', async (guild) => {
  console.log(`[GUILD] Bot adicionado na guild: ${guild.name} (${guild.id})`);
  await registerSlashCommands(guild.id);
});

// --- EVENTO QUANDO O BOT FICA ONLINE ---
client.once('ready', async () => {
  console.log(`[BOT] ✅ ${client.user.tag} está online!`);
  console.log(`[BOT] 📊 Conectado em ${client.guilds.cache.size} servidores`);
  
  // Registrar comandos em todas as guilds que o bot está
  client.guilds.cache.forEach(async (guild) => {
    await registerSlashCommands(guild.id);
  });
});

// --- COMANDO PARA RECARREGAR COMANDOS MANUALMENTE ---
client.prefixCommands.set('reloadcmds', {
  name: 'reloadcmds',
  description: 'Recarrega os comandos slash na guild atual',
  async execute(message, args, client) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ Você precisa ser administrador para usar este comando.');
    }
    
    try {
      await registerSlashCommands(message.guild.id);
      message.reply('✅ Comandos recarregados com sucesso nesta guild!');
    } catch (error) {
      console.error(error);
      message.reply('❌ Erro ao recarregar comandos.');
    }
  }
});

// --- EVENTO DE INTERAÇÃO (SLASH COMMANDS) ---
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
  }
});

// --- EVENTO DE MENSAGEM (PREFIX COMMANDS) ---
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply('Ocorreu um erro ao executar o comando.');
  }
});

// --- LOGIN ---
client.login(config.token);