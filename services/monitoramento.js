//modularização: monitoramento.js
const ferramentasMonitoramento = {
    sentryCapture: (erro, contexto) => {
        console.log('\n [SENTRY ALERT] Erro registrado na linha de produção!')
        console.log(`Motivo: ${erro.message}`);
        console.log('Contexto extra:', contexto)
    },
    datadogIncrement: (metrica, tags) => {
        console.log(`[DATADOG METRIC] Incrementado ${metrica} com as tags: [${tags.join(',')}]`)
},
}

module.exports = ferramentasMonitoramento;