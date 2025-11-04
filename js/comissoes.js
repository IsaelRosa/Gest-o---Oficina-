// Sistema de Comissões - Módulo para cálculo e gestão de comissões
window.Comissoes = {
    init: function() {
        console.log('Inicializando módulo de comissões...');
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.loadComissoes();
        this.loadDashboardComissoes();
    },

    bindEvents: function() {
        // Filtros
        const filtroMes = document.getElementById('filtro-mes-comissao');
        const filtroFuncionario = document.getElementById('filtro-funcionario-comissao');
        
        if (filtroMes) {
            filtroMes.addEventListener('change', () => this.loadComissoes());
        }
        
        if (filtroFuncionario) {
            filtroFuncionario.addEventListener('change', () => this.loadComissoes());
        }

        // Botão gerar relatório
        const btnRelatorio = document.getElementById('gerar-relatorio-comissoes');
        if (btnRelatorio) {
            btnRelatorio.addEventListener('click', () => this.gerarRelatorioComissoes());
        }

        // Botão pagar comissão
        const btnPagar = document.getElementById('pagar-comissoes');
        if (btnPagar) {
            btnPagar.addEventListener('click', () => this.pagarComissoesPendentes());
        }
    },

    loadDashboardComissoes: function() {
        const funcionarios = DataManager.getAll('funcionarios');
        const agendamentos = this.getAgendamentosConcluidos();
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        // Filtrar agendamentos do mês atual
        const agendamentosMes = agendamentos.filter(ag => {
            const dataAgendamento = new Date(ag.data);
            return dataAgendamento.getMonth() === mesAtual && 
                   dataAgendamento.getFullYear() === anoAtual;
        });

        // Calcular totais
        let totalComissoesMes = 0;
        let totalComissoesPendentes = 0;
        let funcionariosComComissao = 0;

        funcionarios.forEach(funcionario => {
            if (funcionario.status === 'ativo' && funcionario.percentualComissao > 0) {
                const comissaoFuncionario = this.calcularComissaoFuncionario(funcionario.id, agendamentosMes);
                if (comissaoFuncionario.total > 0) {
                    funcionariosComComissao++;
                    totalComissoesMes += comissaoFuncionario.total;
                    
                    // Verificar se há comissões pendentes de pagamento
                    const comissoesPagas = this.getComissoesPagas(funcionario.id, mesAtual, anoAtual);
                    if (comissoesPagas.length === 0) {
                        totalComissoesPendentes += comissaoFuncionario.total;
                    }
                }
            }
        });

        // Atualizar dashboard
        this.updateDashboardCard('total-comissoes-mes', totalComissoesMes);
        this.updateDashboardCard('comissoes-pendentes', totalComissoesPendentes);
        this.updateDashboardCard('funcionarios-com-comissao', funcionariosComComissao);
    },

    updateDashboardCard: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (elementId.includes('comissoes')) {
                element.textContent = Utils.formatCurrency(value);
            } else {
                element.textContent = value;
            }
        }
    },

    getAgendamentosConcluidos: function() {
        const agendamentos = DataManager.getAll('agendamentos');
        return agendamentos.filter(ag => ag.status === 'concluido' && ag.funcionarioId);
    },

    calcularComissaoFuncionario: function(funcionarioId, agendamentos = null) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario || funcionario.percentualComissao <= 0) {
            return { total: 0, servicos: [] };
        }

        // Se não foram passados agendamentos específicos, buscar todos os concluídos
        if (!agendamentos) {
            agendamentos = this.getAgendamentosConcluidos();
        }

        // Filtrar agendamentos do funcionário
        const agendamentosFuncionario = agendamentos.filter(ag => 
            ag.funcionarioId && ag.funcionarioId.toString() === funcionarioId.toString()
        );

        let totalComissao = 0;
        const servicosComissao = [];

        agendamentosFuncionario.forEach(agendamento => {
            // Buscar dados do serviço
            const servico = DataManager.getById('servicos', agendamento.servicoId);
            const valorServico = servico ? servico.preco : agendamento.valor || 0;
            
            const valorComissao = (valorServico * funcionario.percentualComissao) / 100;
            totalComissao += valorComissao;

            servicosComissao.push({
                agendamentoId: agendamento.id,
                data: agendamento.data,
                cliente: agendamento.cliente,
                servico: agendamento.servico,
                valorServico: valorServico,
                percentualComissao: funcionario.percentualComissao,
                valorComissao: valorComissao
            });
        });

        return {
            total: totalComissao,
            servicos: servicosComissao
        };
    },

    loadComissoes: function() {
        const tbody = document.getElementById('comissoes-tbody');
        if (!tbody) return;

        const filtroMes = document.getElementById('filtro-mes-comissao');
        const filtroFuncionario = document.getElementById('filtro-funcionario-comissao');
        
        const mesAno = filtroMes ? filtroMes.value : '';
        const funcionarioId = filtroFuncionario ? filtroFuncionario.value : '';

        let funcionarios = DataManager.getAll('funcionarios').filter(f => f.status === 'ativo');
        
        // Filtrar por funcionário se selecionado
        if (funcionarioId) {
            funcionarios = funcionarios.filter(f => f.id.toString() === funcionarioId);
        }

        // Filtrar agendamentos por período se selecionado
        let agendamentos = this.getAgendamentosConcluidos();
        if (mesAno) {
            const [ano, mes] = mesAno.split('-');
            agendamentos = agendamentos.filter(ag => {
                const dataAgendamento = new Date(ag.data);
                return dataAgendamento.getFullYear() == ano && 
                       dataAgendamento.getMonth() == (parseInt(mes) - 1);
            });
        }

        if (funcionarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum funcionário encontrado</td></tr>';
            return;
        }

        const html = funcionarios.map(funcionario => {
            const comissaoData = this.calcularComissaoFuncionario(funcionario.id, agendamentos);
            const statusPagamento = this.getStatusPagamento(funcionario.id, mesAno);
            
            return `
                <tr>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cargo}</td>
                    <td>${funcionario.percentualComissao}%</td>
                    <td>${comissaoData.servicos.length}</td>
                    <td>${Utils.formatCurrency(comissaoData.total)}</td>
                    <td>
                        <span class="status status-${statusPagamento.classe}">${statusPagamento.texto}</span>
                    </td>
                    <td>
                        <button class="btn btn-info btn-sm" onclick="Comissoes.verDetalhesComissao(${funcionario.id})" title="Ver Detalhes">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${comissaoData.total > 0 && statusPagamento.classe === 'pendente' ? `
                            <button class="btn btn-success btn-sm" onclick="Comissoes.marcarComoPago(${funcionario.id})" title="Marcar como Pago">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;
        this.populateFilters();
    },

    getStatusPagamento: function(funcionarioId, mesAno = '') {
        if (!mesAno) {
            const hoje = new Date();
            mesAno = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        }

        const comissoesPagas = this.getComissoesPagas(funcionarioId, mesAno);
        
        if (comissoesPagas.length > 0) {
            return { classe: 'pago', texto: 'Pago' };
        }

        const comissaoData = this.calcularComissaoFuncionario(funcionarioId);
        if (comissaoData.total > 0) {
            return { classe: 'pendente', texto: 'Pendente' };
        }

        return { classe: 'sem-comissao', texto: 'Sem Comissão' };
    },

    getComissoesPagas: function(funcionarioId, mesAno) {
        const pagamentos = DataManager.getAll('pagamentos_comissao') || [];
        return pagamentos.filter(p => 
            p.funcionarioId.toString() === funcionarioId.toString() && 
            p.mesAno === mesAno
        );
    },

    populateFilters: function() {
        // Popular filtro de funcionários
        const filtroFuncionario = document.getElementById('filtro-funcionario-comissao');
        if (filtroFuncionario) {
            const funcionarios = DataManager.getAll('funcionarios').filter(f => f.status === 'ativo');
            const optionsHtml = '<option value="">Todos os funcionários</option>' + 
                funcionarios.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
            filtroFuncionario.innerHTML = optionsHtml;
        }

        // Popular filtro de mês/ano
        const filtroMes = document.getElementById('filtro-mes-comissao');
        if (filtroMes) {
            const hoje = new Date();
            const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
            
            let optionsHtml = '<option value="">Todos os períodos</option>';
            
            // Gerar últimos 12 meses
            for (let i = 0; i < 12; i++) {
                const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
                const mesNome = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                optionsHtml += `<option value="${mesAno}" ${mesAno === mesAtual ? 'selected' : ''}>${Utils.capitalizeFirst(mesNome)}</option>`;
            }
            
            filtroMes.innerHTML = optionsHtml;
        }
    },

    verDetalhesComissao: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario) return;

        const filtroMes = document.getElementById('filtro-mes-comissao');
        const mesAno = filtroMes ? filtroMes.value : '';
        
        let agendamentos = this.getAgendamentosConcluidos();
        if (mesAno) {
            const [ano, mes] = mesAno.split('-');
            agendamentos = agendamentos.filter(ag => {
                const dataAgendamento = new Date(ag.data);
                return dataAgendamento.getFullYear() == ano && 
                       dataAgendamento.getMonth() == (parseInt(mes) - 1);
            });
        }

        const comissaoData = this.calcularComissaoFuncionario(funcionarioId, agendamentos);
        
        if (comissaoData.servicos.length === 0) {
            Utils.showAlert('Nenhum serviço com comissão encontrado para este funcionário no período selecionado.', 'info');
            return;
        }

        const servicosHtml = comissaoData.servicos.map(servico => `
            <tr>
                <td>${Utils.formatDate(servico.data)}</td>
                <td>${servico.cliente}</td>
                <td>${servico.servico}</td>
                <td>${Utils.formatCurrency(servico.valorServico)}</td>
                <td>${servico.percentualComissao}%</td>
                <td>${Utils.formatCurrency(servico.valorComissao)}</td>
            </tr>
        `).join('');

        const modalHtml = `
            <div class="modal-overlay" onclick="Utils.closeModal(this)">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>Detalhes de Comissão - ${funcionario.nome}</h2>
                        <button class="modal-close" onclick="Utils.closeModal(this)">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Funcionário:</strong> ${funcionario.nome}
                            </div>
                            <div class="info-item">
                                <strong>Cargo:</strong> ${funcionario.cargo}
                            </div>
                            <div class="info-item">
                                <strong>Percentual de Comissão:</strong> ${funcionario.percentualComissao}%
                            </div>
                            <div class="info-item">
                                <strong>Total de Serviços:</strong> ${comissaoData.servicos.length}
                            </div>
                            <div class="info-item">
                                <strong>Total de Comissão:</strong> ${Utils.formatCurrency(comissaoData.total)}
                            </div>
                        </div>
                        
                        <h3>Serviços Realizados</h3>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Cliente</th>
                                        <th>Serviço</th>
                                        <th>Valor Serviço</th>
                                        <th>% Comissão</th>
                                        <th>Valor Comissão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${servicosHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="5">Total de Comissão</th>
                                        <th>${Utils.formatCurrency(comissaoData.total)}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="Utils.closeModal(this)">Fechar</button>
                        ${comissaoData.total > 0 ? `
                            <button class="btn btn-success" onclick="Comissoes.marcarComoPago(${funcionarioId}); Utils.closeModal(this)">
                                Marcar como Pago
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    marcarComoPago: function(funcionarioId) {
        const filtroMes = document.getElementById('filtro-mes-comissao');
        let mesAno = filtroMes ? filtroMes.value : '';
        
        if (!mesAno) {
            const hoje = new Date();
            mesAno = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        }

        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        const comissaoData = this.calcularComissaoFuncionario(funcionarioId);

        if (comissaoData.total <= 0) {
            Utils.showAlert('Não há comissão a ser paga para este funcionário.', 'warning');
            return;
        }

        if (confirm(`Confirma o pagamento de ${Utils.formatCurrency(comissaoData.total)} em comissão para ${funcionario.nome}?`)) {
            const pagamento = {
                id: Utils.generateId(),
                funcionarioId: funcionarioId,
                funcionarioNome: funcionario.nome,
                mesAno: mesAno,
                valorComissao: comissaoData.total,
                dataPagamento: new Date().toISOString().split('T')[0],
                servicos: comissaoData.servicos,
                observacoes: `Comissão referente ao período ${this.formatMesAno(mesAno)}`
            };

            DataManager.save('pagamentos_comissao', pagamento);
            
            Utils.showAlert('Comissão marcada como paga com sucesso!', 'success');
            this.loadComissoes();
            this.loadDashboardComissoes();
        }
    },

    formatMesAno: function(mesAno) {
        if (!mesAno) return '';
        const [ano, mes] = mesAno.split('-');
        const data = new Date(ano, parseInt(mes) - 1, 1);
        return data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    },

    pagarComissoesPendentes: function() {
        const funcionarios = DataManager.getAll('funcionarios').filter(f => f.status === 'ativo');
        const hoje = new Date();
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
        
        let totalPagar = 0;
        let funcionariosComComissao = [];

        funcionarios.forEach(funcionario => {
            const statusPagamento = this.getStatusPagamento(funcionario.id, mesAtual);
            if (statusPagamento.classe === 'pendente') {
                const comissaoData = this.calcularComissaoFuncionario(funcionario.id);
                if (comissaoData.total > 0) {
                    totalPagar += comissaoData.total;
                    funcionariosComComissao.push({
                        funcionario: funcionario,
                        valor: comissaoData.total
                    });
                }
            }
        });

        if (funcionariosComComissao.length === 0) {
            Utils.showAlert('Não há comissões pendentes para pagamento.', 'info');
            return;
        }

        const listaFuncionarios = funcionariosComComissao.map(item => 
            `• ${item.funcionario.nome}: ${Utils.formatCurrency(item.valor)}`
        ).join('\n');

        if (confirm(`Confirma o pagamento de comissões pendentes?\n\n${listaFuncionarios}\n\nTotal: ${Utils.formatCurrency(totalPagar)}`)) {
            funcionariosComComissao.forEach(item => {
                this.marcarComoPago(item.funcionario.id);
            });
        }
    },

    gerarRelatorioComissoes: function() {
        const filtroMes = document.getElementById('filtro-mes-comissao');
        const mesAno = filtroMes ? filtroMes.value : '';
        const periodo = mesAno ? this.formatMesAno(mesAno) : 'Todos os períodos';

        const funcionarios = DataManager.getAll('funcionarios').filter(f => f.status === 'ativo');
        let totalGeralComissao = 0;
        let totalServicosPagos = 0;

        const dadosRelatorio = funcionarios.map(funcionario => {
            let agendamentos = this.getAgendamentosConcluidos();
            
            if (mesAno) {
                const [ano, mes] = mesAno.split('-');
                agendamentos = agendamentos.filter(ag => {
                    const dataAgendamento = new Date(ag.data);
                    return dataAgendamento.getFullYear() == ano && 
                           dataAgendamento.getMonth() == (parseInt(mes) - 1);
                });
            }

            const comissaoData = this.calcularComissaoFuncionario(funcionario.id, agendamentos);
            const statusPagamento = this.getStatusPagamento(funcionario.id, mesAno);
            
            totalGeralComissao += comissaoData.total;
            
            if (statusPagamento.classe === 'pago') {
                totalServicosPagos += comissaoData.total;
            }

            return {
                nome: funcionario.nome,
                cargo: funcionario.cargo,
                percentual: funcionario.percentualComissao,
                servicos: comissaoData.servicos.length,
                total: comissaoData.total,
                status: statusPagamento.texto
            };
        }).filter(item => item.total > 0 || item.servicos > 0);

        // Abrir relatório em nova janela
        const relatorioHtml = this.gerarHtmlRelatorio(dadosRelatorio, periodo, totalGeralComissao, totalServicosPagos);
        const novaJanela = window.open('', '_blank');
        novaJanela.document.write(relatorioHtml);
        novaJanela.document.close();
        novaJanela.print();
    },

    gerarHtmlRelatorio: function(dados, periodo, totalGeral, totalPago) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Relatório de Comissões - ${periodo}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .info { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .total { font-weight: bold; background-color: #f9f9f9; }
                    .footer { margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>CarService Pro</h1>
                    <h2>Relatório de Comissões</h2>
                    <p><strong>Período:</strong> ${periodo}</p>
                    <p><strong>Data do Relatório:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div class="info">
                    <p><strong>Total de Funcionários:</strong> ${dados.length}</p>
                    <p><strong>Total de Comissões:</strong> ${Utils.formatCurrency(totalGeral)}</p>
                    <p><strong>Total Pago:</strong> ${Utils.formatCurrency(totalPago)}</p>
                    <p><strong>Total Pendente:</strong> ${Utils.formatCurrency(totalGeral - totalPago)}</p>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Funcionário</th>
                            <th>Cargo</th>
                            <th>% Comissão</th>
                            <th>Serviços</th>
                            <th>Total Comissão</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dados.map(item => `
                            <tr>
                                <td>${item.nome}</td>
                                <td>${item.cargo}</td>
                                <td>${item.percentual}%</td>
                                <td>${item.servicos}</td>
                                <td>${Utils.formatCurrency(item.total)}</td>
                                <td>${item.status}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="total">
                            <td colspan="4"><strong>TOTAL GERAL</strong></td>
                            <td><strong>${Utils.formatCurrency(totalGeral)}</strong></td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="footer">
                    <p>Relatório gerado automaticamente pelo CarService Pro em ${new Date().toLocaleString('pt-BR')}</p>
                </div>
            </body>
            </html>
        `;
    }
};

// Aguardar DOM estar pronto para inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Comissoes.init());
} else {
    Comissoes.init();
}