document.addEventListener('DOMContentLoaded', () => {
    const diasContainer = document.getElementById('dias-container');
    const totalRestanteEl = document.getElementById('total-restante');
    const porcentagemGastaEl = document.getElementById('porcentagem-gasta'); // Novo elemento
    const orcamentoDiario = 150;

    // Define as datas da viagem
    const datasViagem = [];
    for (let i = 4; i <= 12; i++) {
        const dia = i < 10 ? `0${i}` : `${i}`; // Formata para 04, 05, etc.
        datasViagem.push(`${dia}/09/2025`);
    }

    const totalDias = datasViagem.length;
    let orcamentoBaseTotal = orcamentoDiario * totalDias; // Orçamento total inicial

    // Carrega os dados salvos do navegador
    const gastosSalvos = JSON.parse(localStorage.getItem('gastosViagem')) || {};

    // Gera os campos para cada dia
    datasViagem.forEach(data => {
        const diaItem = document.createElement('div');
        diaItem.classList.add('dia-item');

        const label = document.createElement('label');
        label.setAttribute('for', `gasto-${data.replace(/\//g, '-')}`);
        label.textContent = `Gasto em ${data}:`;

        const input = document.createElement('input');
        input.type = 'number';
        input.id = `gasto-${data.replace(/\//g, '-')}`;
        input.placeholder = '0.00'; // Alterado para refletir valor decimal
        input.step = '0.01'; // Permite inserir centavos
        input.value = gastosSalvos[data] || ''; // Preenche com o valor salvo
        input.addEventListener('input', calcularOrcamento);

        diaItem.appendChild(label);
        diaItem.appendChild(input);
        diasContainer.appendChild(diaItem);
    });

    function calcularOrcamento() {
        let gastosTotais = 0;
        const gastosAtuais = {};

        datasViagem.forEach(data => {
            const inputId = `gasto-${data.replace(/\//g, '-')}`;
            const input = document.getElementById(inputId);
            const valorGasto = parseFloat(input.value) || 0;
            gastosTotais += valorGasto;
            
            // Guarda o valor atual para salvar depois
            if (input.value) { // Salva apenas se houver um valor
                gastosAtuais[data] = input.value;
            } else {
                delete gastosAtuais[data]; // Remove se o campo for limpo
            }
        });

        const restante = orcamentoBaseTotal - gastosTotais;
        totalRestanteEl.textContent = `€ ${restante.toFixed(2).replace('.', ',')}`;

        // Calcula a porcentagem gasta
        const porcentagemGasta = orcamentoBaseTotal > 0 ? (gastosTotais / orcamentoBaseTotal) * 100 : 0;
        porcentagemGastaEl.textContent = `${porcentagemGasta.toFixed(2).replace('.', ',')}%`;

        // Remove classes de status anteriores
        totalRestanteEl.classList.remove('status-ok', 'status-atencao', 'status-critico');
        porcentagemGastaEl.classList.remove('status-ok', 'status-atencao', 'status-critico');


        // Adiciona classes de status com base no orçamento restante
        if (restante < 0) {
            totalRestanteEl.classList.add('status-critico');
            porcentagemGastaEl.classList.add('status-critico');
        } else if (restante < (orcamentoBaseTotal * 0.2)) { // Menos de 20% do orçamento total restante
            totalRestanteEl.classList.add('status-atencao');
            porcentagemGastaEl.classList.add('status-atencao');
        } else {
            totalRestanteEl.classList.add('status-ok');
            porcentagemGastaEl.classList.add('status-ok');
        }
        
        // Salva os dados no localStorage
        localStorage.setItem('gastosViagem', JSON.stringify(gastosAtuais));
    }

    // Calcula o orçamento inicial ao carregar a página
    calcularOrcamento();
});