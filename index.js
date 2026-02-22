const { Client, GatewayIntentBits, InteractionType } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {
    const query = interaction.options.getString("query");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: "Entra num canal de voz primeiro!", ephemeral: true });
    }

    await interaction.reply(`🔍 A procurar: **${query}**...`);

    const search = await play.search(query, { limit: 1 });
    if (!search.length) return interaction.editReply("❌ Não encontrei essa música.");

    const stream = await play.stream(search[0].url);
    const resource = createAudioResource(stream.stream, { inputType: stream.type });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    player.play(resource);
    connection.subscribe(player);

    interaction.editReply(`🎶 A tocar: **${search[0].title}**`);
  }
});

client.login("MTQ3NDc3NzIwNTA0NDE1NDU2MA.GaZHYy.AQJkUXtIvCeE2BN7WIpEyiMYzeD672FKtX-62Q");
