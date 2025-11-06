// Módulo Dashboard
window.Dashboard = {
    init: function() {
        // Verificar role do usuário
        const userRole = localStorage.getItem('carservice_user_role') || 'gerente';
        
        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(() => {
            if (userRole === 'gerente') {
                this.loadGerenteDashboard();
            } else {
                this.loadFuncionarioDashboard();
            }
        }, 100);
    },

    loadGerenteDashboard: function() {
        console.log('📊 Carregando Dashboard do Gerente');
        this.loadProximosAgendamentos();
        this.loadServicosPopulares();
        this.updateGerenteCards();
    },

    loadFuncionarioDashboard: function() {
        console.log('🔧 Carregando Dashboard do Funcionário');
        this.renderFuncionarioDashboard();
    },

    renderFuncionarioDashboard: function() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="dashboard-funcionario">
                <div class="dashboard-header">
                    <h1><i class="fas fa-tools"></i> Dashboard do Funcionário</h1>
                    <p>Acesso rápido às funções do dia a dia</p>
                </div>

                <!-- Atalhos Rápidos -->
                <div class="atalhos-rapidos">
                    <h2><i class="fas fa-rocket"></i> Ações Rápidas</h2>
                    <div class="atalhos-grid">
                        <button class="atalho-card" onclick="navigation.navigateTo('ordem-servico')">
                            <i class="fas fa-plus-circle"></i>
                            <span>Nova OS</span>
                        </button>
                        <button class="atalho-card" onclick="navigation.navigateTo('agendamentos')">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Novo Agendamento</span>
                        </button>
                        <button class="atalho-card" onclick="navigation.navigateTo('clientes')">
                            <i class="fas fa-user-plus"></i>
                            <span>Novo Cliente</span>
                        </button>
                        <button class="atalho-card" onclick="navigation.navigateTo('veiculos')">
                            <i class="fas fa-car"></i>
                            <span>Novo Veículo</span>
                        </button>
                    </div>
                </div>

                <!-- OS em Andamento -->
                <div class="os-andamento">
                    <h2><i class="fas fa-cogs"></i> Ordens de Serviço Hoje</h2>
                    <div id="os-hoje-list" class="os-list">
                        <!-- Será preenchido dinamicamente -->
                    </div>
                </div>

                <!-- Agendamentos Próximos -->
                <div class="agendamentos-proximos">
                    <h2><i class="fas fa-clock"></i> Próximos Agendamentos</h2>
                    <div id="agendamentos-proximos-list" class="agendamentos-list">
                        <!-- Será preenchido dinamicamente -->
                    </div>
                </div>
            </div>
        `;

        // Carregar dados específicos para funcionário
        this.loadOSHoje();
        this.loadAgendamentosProximos();
    },

    updateGerenteCards: function() {
        // Dashboard do gerente - métricas melhoradas
        this.updateMelhoredCards();
    },

    updateMelhoredCards: function() {
        // Verificar se DataManager está disponível
        if (!window.DataManager) {
            console.warn('DataManager não está disponível ainda');
            return;
        }

        const agendamentos = DataManager.getAll('agendamentos');
        const clientes = DataManager.getAll('clientes');
        
        // 1. Clientes Recorrentes (últimos 60 dias)
        const clientesRecorrentes = this.calcularClientesRecorrentes(clientes, agendamentos);
        
        // 2. Faturamento do Mês Atual com detalhes
        const faturamentoDetalhado = this.calcularFaturamentoDetalhado();
        
        // 3. Serviços em Andamento
        const servicosAndamento = agendamentos.filter(a => a.status === 'em-andamento').length;
        
        // 4. Agendamentos dos próximos 7 dias
        const agendamentos7Dias = this.calcularAgendamentos7Dias(agendamentos);

        // Atualizar cards
        this.updateCardByTitle('Clientes Recorrentes', clientesRecorrentes);
        this.updateCardByTitle('Serviços em Andamento', servicosAndamento);
        this.updateFaturamentoCard(faturamentoDetalhado);
        this.updateAgendamentos7DiasCard(agendamentos7Dias);
    },

    calcularClientesRecorrentes: function(clientes, agendamentos) {
        const hoje = new Date();
        const sessentaDiasAtras = new Date(hoje.getTime() - (60 * 24 * 60 * 60 * 1000));
        
        // Agrupar agendamentos por cliente nos últimos 60 dias
        const clientesComAtendimentos = {};
        agendamentos.forEach(ag => {
            const dataAgendamento = new Date(ag.data);
            if (dataAgendamento >= sessentaDiasAtras && dataAgendamento <= hoje) {
                if (!clientesComAtendimentos[ag.cliente]) {
                    clientesComAtendimentos[ag.cliente] = 0;
                }
                clientesComAtendimentos[ag.cliente]++;
            }
        });
        
        // Contar clientes com mais de 1 atendimento
        return Object.values(clientesComAtendimentos).filter(count => count > 1).length;
    },

    calcularFaturamentoDetalhado: function() {
        const hoje = new Date();
        const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        // Simular entradas e saídas do mês atual
        const entradas = 45280; // Receitas
        const saidas = 12750;   // Despesas
        const saldo = entradas - saidas;
        
        return { entradas, saidas, saldo };
    },

    calcularAgendamentos7Dias: function(agendamentos) {
        const hoje = new Date();
        const proximosSete = [];
        
        for (let i = 0; i < 7; i++) {
            const data = new Date(hoje.getTime() + (i * 24 * 60 * 60 * 1000));
            const dataString = data.toISOString().split('T')[0];
            const count = agendamentos.filter(a => a.data === dataString).length;
            
            proximosSete.push({
                dia: data.getDate(),
                diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' }),
                count: count
            });
        }
        
        return proximosSete;
    },

    updateFaturamentoCard: function(faturamento) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title');
            if (cardTitle && cardTitle.textContent.includes('Faturamento')) {
                const cardValue = card.querySelector('.card-value');
                if (cardValue) {
                    cardValue.innerHTML = `
                        <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">
                            ${Utils.formatCurrency(faturamento.saldo)}
                        </div>
                        <div style="font-size: 0.9rem; margin-top: 0.5rem;">
                            <span style="color: #2F7DEB;">↗ ${Utils.formatCurrency(faturamento.entradas)}</span>
                            <span style="color: #e74c3c; margin-left: 1rem;">↘ ${Utils.formatCurrency(faturamento.saidas)}</span>
                        </div>
                    `;
                }
            }
        });
    },

    updateAgendamentos7DiasCard: function(dados7Dias) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title');
            if (cardTitle && (cardTitle.textContent.includes('Agendamentos Hoje') || cardTitle.textContent.includes('Agendamentos'))) {
                cardTitle.textContent = 'Próximos 7 Dias';
                const cardValue = card.querySelector('.card-value');
                if (cardValue) {
                    const tabela = dados7Dias.map(dia => `
                        <div style="display: inline-block; text-align: center; margin: 0 0.3rem;">
                            <div style="font-size: 0.8rem; color: #666;">${dia.diaSemana}</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: ${dia.count > 0 ? '#2F7DEB' : '#ccc'};">
                                ${dia.count}
                            </div>
                            <div style="font-size: 0.7rem; color: #999;">${dia.dia}</div>
                        </div>
                    `).join('');
                    
                    cardValue.innerHTML = `
                        <div style="display: flex; justify-content: center; flex-wrap: wrap;">
                            ${tabela}
                        </div>
                    `;
                }
            }
        });
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

        const hoje = new Date();
        const hojeFmt = hoje.toISOString().split('T')[0];
        const agendamentosTodos = DataManager.getAll('agendamentos')
            .filter(a => a.status === 'agendado')
            .sort((a, b) => new Date(a.data + ' ' + a.hora) - new Date(b.data + ' ' + b.hora));

        // Lógica inteligente: todos do dia atual + garantir mínimo 5
        let agendamentosExibir = [];
        
        // Primeiro: todos os agendamentos de hoje
        const agendamentosHoje = agendamentosTodos.filter(a => a.data === hojeFmt);
        agendamentosExibir = [...agendamentosHoje];
        
        // Se tiver menos de 5, pegar os próximos até completar 5
        if (agendamentosExibir.length < 5) {
            const agendamentosProximos = agendamentosTodos.filter(a => a.data > hojeFmt);
            const quantidadeFaltante = 5 - agendamentosExibir.length;
            agendamentosExibir = [...agendamentosExibir, ...agendamentosProximos.slice(0, quantidadeFaltante)];
        }

        if (agendamentosExibir.length === 0) {
            container.innerHTML = '<p>Nenhum agendamento próximo</p>';
            return;
        }

        const html = agendamentosExibir.map(agendamento => {
            const dataAgendamento = new Date(agendamento.data);
            const isHoje = agendamento.data === hojeFmt;
            const corBorda = isHoje ? '#e74c3c' : '#3498db';
            const labelData = isHoje ? 'Hoje' : Utils.formatDate(agendamento.data);
            
            return `
                <div style="border-left: 3px solid ${corBorda}; padding-left: 1rem; margin-bottom: 1rem;">
                    <div style="font-weight: bold;">${agendamento.cliente}</div>
                    <div style="color: #666; font-size: 0.9rem;">
                        <i class="fas fa-calendar"></i> ${labelData} às ${agendamento.hora}
                    </div>
                    <div style="color: #888; font-size: 0.8rem;">
                        <i class="fas fa-tools"></i> ${agendamento.servico}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    },

    loadServicosPopulares: function() {
        const container = document.getElementById('servicos-populares');
        if (!container || !window.DataManager) return;

        // Filtrar agendamentos dos últimos 30 dias
        const hoje = new Date();
        const trintaDiasAtras = new Date(hoje.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const agendamentos = DataManager.getAll('agendamentos').filter(agendamento => {
            const dataAgendamento = new Date(agendamento.data);
            return dataAgendamento >= trintaDiasAtras && dataAgendamento <= hoje;
        });
        
        const servicosCount = {};

        // Contar frequência dos serviços nos últimos 30 dias
        agendamentos.forEach(agendamento => {
            servicosCount[agendamento.servico] = (servicosCount[agendamento.servico] || 0) + 1;
        });

        // Ordenar por popularidade
        const servicosOrdenados = Object.entries(servicosCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        if (servicosOrdenados.length === 0) {
            container.innerHTML = '<p>Nenhum serviço registrado nos últimos 30 dias</p>';
            return;
        }

        const html = servicosOrdenados.map(([servico, count]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span>${servico}</span>
                <span style="background: #e74c3c; color: white; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem;" title="Últimos 30 dias">
                    ${count}
                </span>
            </div>
        `).join('');

        container.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <small style="color: #666; font-style: italic;">Baseado nos últimos 30 dias</small>
            </div>
            ${html}
        `;
    },

    // Funções específicas para Dashboard do Funcionário
    loadOSHoje: function() {
        const container = document.getElementById('os-hoje-list');
        if (!container) return;

        // Simular OS do dia
        const osHoje = [
            { id: '001', cliente: 'João Silva', veiculo: 'Civic 2020', servico: 'Lavagem Completa', status: 'em-andamento' },
            { id: '002', cliente: 'Maria Santos', veiculo: 'Corolla 2019', servico: 'Enceramento', status: 'aguardando' },
            { id: '003', cliente: 'Pedro Costa', veiculo: 'HB20 2021', servico: 'Lavagem Simples', status: 'finalizada' }
        ];

        const html = osHoje.map(os => `
            <div class="os-item ${os.status}">
                <div class="os-info">
                    <h4>OS #${os.id} - ${os.cliente}</h4>
                    <p><i class="fas fa-car"></i> ${os.veiculo}</p>
                    <p><i class="fas fa-tools"></i> ${os.servico}</p>
                </div>
                <div class="os-status">
                    <span class="status-badge ${os.status}">${this.getStatusText(os.status)}</span>
                    ${os.status === 'em-andamento' ? '<button class="btn btn-sm btn-success" onclick="alert(\'Finalizar OS\')">Finalizar</button>' : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    loadAgendamentosProximos: function() {
        const container = document.getElementById('agendamentos-proximos-list');
        if (!container) return;

        // Simular agendamentos próximos
        const agendamentos = [
            { id: '001', cliente: 'Ana Oliveira', data: 'Hoje 14:00', servico: 'Lavagem Completa' },
            { id: '002', cliente: 'Carlos Lima', data: 'Hoje 15:30', servico: 'Enceramento' },
            { id: '003', cliente: 'Lucia Ferreira', data: 'Amanhã 09:00', servico: 'Lavagem Simples' }
        ];

        const html = agendamentos.map(ag => `
            <div class="agendamento-item">
                <div class="agendamento-info">
                    <h4>${ag.cliente}</h4>
                    <p><i class="fas fa-clock"></i> ${ag.data}</p>
                    <p><i class="fas fa-tools"></i> ${ag.servico}</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="alert('Iniciar Atendimento')">
                    Iniciar
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    },

    getStatusText: function(status) {
        const statusMap = {
            'aguardando': 'Aguardando',
            'em-andamento': 'Em Andamento',
            'finalizada': 'Finalizada'
        };
        return statusMap[status] || status;
    }
};