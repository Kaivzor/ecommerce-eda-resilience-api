const express = require('express');
const ecommerceEvents = require('./config/event');
const dlq = require('./queue/dlq');
require('./listeners/logistica');
require('./src/bancoDados');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/pagamentos', (req, res) => {
    const {id, clienteId, valor} = req.body;
    if (!id || !clienteId || !valor) {
        return res.status(400).json({error: 'Dados do pedido incompletos'});
    }
    const novoPedido = {id, clienteId, valor};
    console.log('[API] Emitindo evento de novo pedido...');
    ecommerceEvents.emit('novoPedido', novoPedido);
    res.status(200).json({message: 'Pedido recebido e processado com sucesso!',
    pedidoId: id
    });
});

app.get('/painel/dlq', (req, res) => {
    const dlqStatus = dlq.listarTodos();
    res.status(200).json(dlqStatus);
});

app.listen(PORT, () => {
    console.log(`[API] Servidor rodando na porta ${PORT}`);
    console.log(`POST   http://localhost:${PORT}/pagamentos (Para criar pedidos)`);
    console.log(`GET    http://localhost:${PORT}/painel/dlq (Para ver o painel da DLQ)`);

});