const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    SelectMenuOptionBuilder,
    ActionRowBuilder,
    MessageFlags,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Envia o painel de atendimento para abrir tickets.'),

    async execute(interaction) {
        try {
            // Substitua 'ID_DO_CANAL' pelo ID do canal onde você quer enviar o painel
            const canalId = '1428056596075778130'; // ← COLOQUE O ID DO CANAL AQUI
            const canal = await interaction.client.channels.fetch(canalId);

            // Verifica se o canal existe e é de texto
            if (!canal || !canal.isTextBased()) {
                return await interaction.reply({ 
                    content: '❌ Canal não encontrado ou não é um canal de texto válido.', 
                    ephemeral: true 
                });
            }

            // Cria o painel de ticket
            const container = new ContainerBuilder()
                .setAccentColor(16101120)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("# <:duth:1429222636214423593> Atendimento DUTH"),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("Seja bem-vindo(a) ao sistema de atendimento da DUTH. Através do atendimento, você pode falar diretamente com nossa equipe."),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("-# <:Duth12:1429216734224715979> Forneça o motivo e o máximo de informações possível para agilizar seu atendimento.\n-# <:Duth12:1429216734224715979> Não chame membros da equipe no privado.\n-# <:Duth12:1429216734224715979> Iniciar um atendimento sem um motivo coerente poderá resultar em punições."),
                )
                .addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
                )
                .addActionRowComponents(
                    new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('select_ticket')
                            .setPlaceholder('➡️ Escolha aqui a sua categoria.')
                            .addOptions(
                                new SelectMenuOptionBuilder()
                                    .setLabel('Financeiro')
                                    .setDescription('Atendimento Financeiro')
                                    .setEmoji("<:duth12:1429220450793426965>")
                                    .setValue('financeiro'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Suporte')
                                    .setEmoji("<:duth4:1429220437266665522>")
                                    .setDescription('Abrir um atendimento de suporte')
                                    .setValue('suporte'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Denúncia')
                                    .setEmoji("<:Duth1:1429220431499493417>")
                                    .setDescription('Reportar uma denuncia')
                                    .setValue('denuncia'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Bugs')
                                    .setEmoji("<:duth3:1429220435110920283>")
                                    .setDescription('Reportar bugs')
                                    .setValue('bugs'),
                                new SelectMenuOptionBuilder()
                                    .setLabel('Telagem')
                                    .setEmoji("<:righost2line:1429224129151762664>")
                                    .setDescription('Solicitar Telagem')
                                    .setValue('telagem')
                            )
                    )
                );

            // Envia o painel para o canal especificado
            await canal.send({
                components: [container.toJSON()],
                flags: MessageFlags.IsComponentsV2
            });

            // Responde de forma efêmera (só quem executou vê)
            await interaction.reply({ 
                content: `✅ Painel de tickets enviado com sucesso para ${canal}!`, 
                ephemeral: true 
            });

        } catch (err) {
            console.error('Erro ao executar /ticket:', err);
            await interaction.reply({ 
                content: '❌ Ocorreu um erro ao enviar o painel de tickets.', 
                ephemeral: true 
            });
        }
    }
};