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
        .setName('streamer')
        .setDescription('Envia o painel de criador de conteúdo para o canal especificado.'),

    async execute(interaction) {
        try {
            // Substitua 'ID_DO_CANAL' pelo ID do canal onde você quer enviar o painel
            const canalId = '1428056622055559190'; // ← COLOQUE O ID DO CANAL AQUI
            const canal = await interaction.client.channels.fetch(canalId);

            // Verifica se o canal existe e é de texto
            if (!canal || !canal.isTextBased()) {
                return await interaction.reply({ 
                    content: '❌ Canal não encontrado ou não é um canal de texto válido.', 
                    ephemeral: true 
                });
            }

            // Cria o container do criador de conteúdo
            const container = new ContainerBuilder()
                .setAccentColor(16711680)
                .addSectionComponents(
                    new SectionBuilder()
                        .setThumbnailAccessory(
                            new ThumbnailBuilder()
                                .setURL("https://cdn.discordapp.com/icons/1425947562384293890/1960aa3d17afd48d8438beedbd10e156.webp?size=1024")
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("# <:dth:1428517556800720969> Vire um Criador de Conteúdo na DEATH"),
                            new TextDisplayBuilder().setContent("> Confira os requisitos completos e faça parte da nossa equipe!"),
                        ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Requisitos")
                                .setDisabled(true)
                                .setCustomId("5bc8ad150e9e4a68f0a409d0213d4d53")
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("### Tiktok:"),
                        ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel("Requisitos")
                                .setDisabled(true)
                                .setCustomId("429e4ef40996446af46c6cf0b79f8c6a")
                        )
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent("### Twitch:"),
                        ),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("### Benefícios:\n\n+30% XP • Cupom exclusivo com seu NOME • Todas as armas • Attachs liberados • + TAG <@&1428056302562709625>"),
                );

            // Envia o painel para o canal especificado
            await canal.send({
                components: [container.toJSON()],
                flags: MessageFlags.IsComponentsV2
            });

            // Responde de forma efêmera (só quem executou vê)
            await interaction.reply({ 
                content: `✅ Painel de criador de conteúdo enviado com sucesso para ${canal}!`, 
                ephemeral: true 
            });

        } catch (err) {
            console.error('Erro ao executar /stremer:', err);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao enviar o painel de criador de conteúdo.', 
                ephemeral: true 
            });
        }
    }
};