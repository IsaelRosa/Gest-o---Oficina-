// Módulo Dashboard
window.Dashboard = {
    init: function() {
        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            this.loadProximosAgendamentos();
            this.loadServicosPopulares();
            this.updateCards();
        }, 100);
    },

    updateCards: function() {
        // Verificar se DataManager está disponível
        if (!window.DataManager) {
            console.warn('DataManager não está disponível ainda');
            return;
        }

        // Atualizar cards com dados reais
        const agendamentos = DataManager.getAll('agendamentos');
        const hoje = new Date().toISOString().split('T')[0];
        
        const agendamentosHoje = agendamentos.filter(a => a.data === hoje).length;
        const servicosAndamento = agendamentos.filter(a => a.status === 'em-andamento').length;
        
        // Calcular outros dados
        const faturamento = this.calcularFaturamentoMensal();
        const clientesAtivos = DataManager.getAll('clientes').length;

        // Atualizar cards usando seletores mais robustos
        this.updateCardByTitle('Agendamentos Hoje', agendamentosHoje);
        this.updateCardByTitle('Serviços em Andamento', servicosAndamento);
        this.updateCardByTitle('Faturamento Mensal', Utils.formatCurrency(faturamento));
        this.updateCardByTitle('Clientes Ativos', clientesAtivos);
    },

    updateCardByTitle: function(title, value) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title');
            if (cardTitle && cardTitle.textContent.includes(title)) {
                const cardValue = card.querySelector('.card-value');
                if (cardValue) {
                    cardValue.textContent = value;
                }
            }
        });
    },

    calcularFaturamentoMensal: function() {
        // Verificar se DataManager está disponível
        if (!window.DataManager) {
            return 45280; // Valor simulado se não houver dados
        }

        // Simular cálculo de faturamento
        const agendamentos = DataManager.getAll('agendamentos');
        const servicos = DataManager.getAll('servicos');
        
        let total = 0;
        agendamentos.forEach(agendamento => {
            if (agendamento.status === 'concluido') {
                const servico = servicos.find(s => s.nome === agendamento.servico);
                if (servico) {
                    total += servico.preco;
                }
            }
        });
        
        // Adicionar valor simulado para demonstração
        return total + 45280;
    },

    loadProximosAgendamentos: function() {
        const container = document.getElementById('proximos-agendamentos');
        if (!container || !window.DataManager) return;

        const agendamentos = DataManager.getAll('agendamentos')
            .filter(a => a.status === 'agendado')
            .sort((a, b) => new Date(a.data + ' ' + a.hora) - new Date(b.data + ' ' + b.hora))
            .slice(0, 5);

        if (agendamentos.length === 0) {
            container.innerHTML = '<p>Nenhum agendamento próximo</p>';
            return;
        }

        const html = agendamentos.map(agendamento => `
            <div style="border-left: 3px solid #3498db; padding-left: 1rem; margin-bottom: 1rem;">
                <div style="font-weight: bold;">${agendamento.cliente}</div>
                <div style="color: #666; font-size: 0.9rem;">
                    ${Utils.formatDate(agendamento.data)} às ${agendamento.hora}
                </div>
                <div style="color: #888; font-size: 0.8rem;">${agendamento.servico}</div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    loadServicosPopulares: function() {
        const container = document.getElementById('servicos-populares');
        if (!container || !window.DataManager) return;

        const agendamentos = DataManager.getAll('agendamentos');
        const servicosCount = {};

        // Contar frequência dos serviços
        agendamentos.forEach(agendamento => {
            servicosCount[agendamento.servico] = (servicosCount[agendamento.servico] || 0) + 1;
        });

        // Ordenar por popularidade
        const servicosOrdenados = Object.entries(servicosCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (servicosOrdenados.length === 0) {
            container.innerHTML = '<p>Nenhum serviço registrado</p>';
            return;
        }

        const html = servicosOrdenados.map(([servico, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>${servico}</span>
                <span style="background: #e74c3c; color: white; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem;">
                    ${count}
                </span>
            </div>
        `).join('');

        container.innerHTML = html;
    }
};