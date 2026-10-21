const ecommerceEvents = require('../config/event');
const monitoramento = require('../services/monitoramento');
const dlq = require('../queue/dlq');

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

ecommerceEvents.on('novoPedido', async (pedido) => {
    const MAX_TENTATIVAS = 3;
    let tentativaAtual = 1;
    let sucesso = false;
    let ultimoErro = null;

    while (tentativaAtual <= MAX_TENTATIVAS && !sucesso) {
    try {
        console.log('[API EXTERNA] Notificando sistema de logística...');
        throw new Error("Conexão recusada pelo servidor(Timeout)");
    } catch (erro) {
        ultimoErro = erro;
        console.warn('[Aviso logistica] Falha ao notificar sistema de logística. Tentativa:', tentativaAtual, 'falhou');
        await esperar(2000);
        tentativaAtual++;
    }
        if (!sucesso) {
        console.error('[Erro logistica] Todas as tentativas de notificação falharam. Isolando pedido na DLQ...');
        monitoramento.sentryCapture(ultimoErro, { pedidoId: pedido.id, clienteId: pedido.clienteId });
        monitoramento.datadogIncrement('pagamentos.falha_gateway', ['env:producao', `erro:${ultimoErro ? ultimoErro.name : 'desconhecido'}`]);
        dlq.adicionar(pedido, ultimoErro);
    }
}
});