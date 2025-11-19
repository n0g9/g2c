const {
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    SectionBuilder,
    ThumbnailBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Envia o painel de boost para o canal especificado.'),

    async execute(interaction) {
        try {
            // Substitua 'ID_DO_CANAL' pelo ID do canal onde você quer enviar o painel
            const canalId = '1428056621182881922'; // ← COLOQUE O ID DO CANAL AQUI
            const canal = await interaction.client.channels.fetch(canalId);

            // Verifica se o canal existe e é de texto
            if (!canal || !canal.isTextBased()) {
                return await interaction.reply({
                    content: '❌ Canal não encontrado ou não é um canal de texto válido.',
                    ephemeral: true
                });
            }

            // Cria o container do boost com thumbnail
            const container = new ContainerBuilder()
                .setAccentColor(16711680)
                .addSectionComponents(
                    new SectionBuilder()
                        .setThumbnailAccessory(
                            new ThumbnailBuilder()
                                .setURL("https://cdn.discordapp.com/icons/1425947562384293890/1960aa3d17afd48d8438beedbd10e156.webp?size=1024")
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("## BOOSTER - DEATH PVP"),
                            new TextDisplayBuilder().setContent("> Seja um **Booster Death** e aproveite grande beneficios! Apos realizar 1 ou mais impulso, você receberar acesso aos comandos **/cor** & **/attachs**"),

                        ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("> <:information:1428575964194934784> Caso remova os boost seus beneficios serão removidos."),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addActionRowComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Resgatar Beneficios")
                                .setEmoji("<:congratulations:1428578173825843253>")
                                .setDisabled(true)
                                .setCustomId("beneficio"),
                        ),
                );

            // Envia o painel para o canal especificado
            await canal.send({
                components: [container.toJSON()],
                flags: MessageFlags.IsComponentsV2
            });

            // Responde de forma efêmera (só quem executou vê)
            await interaction.reply({
                content: `✅ Painel de boost enviado com sucesso para ${canal}!`,
                ephemeral: true
            });

        } catch (err) {
            console.error('Erro ao executar /boost:', err);
            await interaction.reply({
                content: '❌ Ocorreu um erro ao enviar o painel de boost.',
                ephemeral: true
            });
        }
    }
};