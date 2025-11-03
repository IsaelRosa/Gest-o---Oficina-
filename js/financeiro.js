// Módulo Financeiro
window.Financeiro = {
    init: function() {
        this.bindEvents();
        this.loadMovimentacoes();
        this.updateCards();
    },

    bindEvents: function() {
        // Botão nova movimentação
        const btnNova = document.getElementById('nova-movimentacao');
        if (btnNova) {
            btnNova.addEventListener('click', () => this.showFormMovimentacao());
        }
    },

    updateCards: function() {
        // Calcular valores dos cards
        const movimentacoes = DataManager.getAll('movimentacoes') || [];
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        const movimentacoesMes = movimentacoes.filter(m => {
            const dataMovimentacao = new Date(m.data);
            return dataMovimentacao >= inicioMes && dataMovimentacao <= hoje;
        });

        const receitas = movimentacoesMes
            .filter(m => m.tipo === 'receita' && m.status === 'pago')
            .reduce((total, m) => total + m.valor, 0);

        const despesas = movimentacoesMes
            .filter(m => m.tipo === 'despesa' && m.status === 'pago')
            .reduce((total, m) => total + m.valor, 0);

        const lucro = receitas - despesas;

        const contasReceber = movimentacoes
            .filter(m => m.tipo === 'receita' && m.status === 'pendente')
            .reduce((total, m) => total + m.valor, 0);

        // Adicionar receita dos agendamentos concluídos
        const receitaAgendamentos = this.calcularReceitaAgendamentos();
        const receitaTotal = receitas + receitaAgendamentos;
        const lucroTotal = receitaTotal - despesas;

        // Atualizar cards usando seletores mais robustos
        this.updateCardByTitle('Receita Mensal', receitaTotal);
        this.updateCardByTitle('Despesas Mensais', despesas);
        this.updateCardByTitle('Lucro Líquido', lucroTotal);
        this.updateCardByTitle('Contas a Receber', contasReceber);
    },

    calcularReceitaAgendamentos: function() {
        const agendamentos = DataManager.getAll('agendamentos') || [];
        const servicos = DataManager.getAll('servicos') || [];
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        return agendamentos
            .filter(a => {
                const dataAgendamento = new Date(a.data);
                return a.status === 'concluido' && 
                       dataAgendamento >= inicioMes && 
                       dataAgendamento <= hoje;
            })
            .reduce((total, agendamento) => {
                const servico = servicos.find(s => s.nome === agendamento.servico);
                return total + (servico ? servico.preco : 0);
            }, 0);
    },

    updateCardByTitle: function(title, value) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title');
            if (cardTitle && cardTitle.textContent.includes(title)) {
                const cardValue = card.querySelector('.card-value');
                if (cardValue) {
                    cardValue.textContent = Utils.formatCurrency(value);
                    
                    // Adicionar cor baseada no valor
                    if (title.includes('Lucro')) {
                        cardValue.style.color = value >= 0 ? '#27ae60' : '#e74c3c';
                    }
                }
            }
        });
    },

    loadMovimentacoes: function() {
        const tbody = document.getElementById('financeiro-tbody');
        if (!tbody) return;

        let movimentacoes = DataManager.getAll('movimentacoes') || [];

        // Ordenar por data (mais recente primeiro)
        movimentacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

        if (movimentacoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma movimentação encontrada</td></tr>';
            return;
        }

        const html = movimentacoes.map(movimentacao => `
            <tr>
                <td>${Utils.formatDate(movimentacao.data)}</td>
                <td>${movimentacao.descricao}</td>
                <td>
                    <span class="status ${movimentacao.tipo === 'receita' ? 'status-concluido' : 'status-cancelado'}">
                        ${movimentacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                </td>
                <td style="color: ${movimentacao.tipo === 'receita' ? '#27ae60' : '#e74c3c'};">
                    ${movimentacao.tipo === 'receita' ? '+' : '-'} ${Utils.formatCurrency(movimentacao.valor)}
                </td>
                <td>
                    <span class="status ${movimentacao.status === 'pago' ? 'status-concluido' : 'status-agendado'}">
                        ${movimentacao.status === 'pago' ? 'Pago' : 'Pendente'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-warning" onclick="Financeiro.editMovimentacao(${movimentacao.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${movimentacao.status === 'pendente' ? `
                    <button class="btn btn-success" onclick="Financeiro.marcarPago(${movimentacao.id})" title="Marcar como Pago">
                        <i class="fas fa-check"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-danger" onclick="Financeiro.deleteMovimentacao(${movimentacao.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    },

    showFormMovimentacao: function(movimentacao = null) {
        const isEdit = movimentacao !== null;
        const title = isEdit ? 'Editar Movimentação' : 'Nova Movimentação';

        const content = `
            <form id="form-movimentacao">
                <div class="form-group">
                    <label>Data:</label>
                    <input type="date" id="data" required value="${isEdit ? movimentacao.data : new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <input type="text" id="descricao" required value="${isEdit ? movimentacao.descricao : ''}" placeholder="Descrição da movimentação">
                </div>
                <div class="form-group">
                    <label>Tipo:</label>
                    <select id="tipo" required>
                        <option value="receita" ${isEdit && movimentacao.tipo === 'receita' ? 'selected' : ''}>Receita</option>
                        <option value="despesa" ${isEdit && movimentacao.tipo === 'despesa' ? 'selected' : ''}>Despesa</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Valor (R$):</label>
                    <input type="number" id="valor" required step="0.01" min="0" value="${isEdit ? movimentacao.valor : ''}" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Status:</label>
                    <select id="status" required>
                        <option value="pago" ${isEdit && movimentacao.status === 'pago' ? 'selected' : ''}>Pago</option>
                        <option value="pendente" ${isEdit && movimentacao.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="categoria">
                        <option value="">Selecione uma categoria</option>
                        <option value="Serviços" ${isEdit && movimentacao.categoria === 'Serviços' ? 'selected' : ''}>Serviços</option>
                        <option value="Peças" ${isEdit && movimentacao.categoria === 'Peças' ? 'selected' : ''}>Peças</option>
                        <option value="Combustível" ${isEdit && movimentacao.categoria === 'Combustível' ? 'selected' : ''}>Combustível</option>
                        <option value="Energia" ${isEdit && movimentacao.categoria === 'Energia' ? 'selected' : ''}>Energia</option>
                        <option value="Aluguel" ${isEdit && movimentacao.categoria === 'Aluguel' ? 'selected' : ''}>Aluguel</option>
                        <option value="Salários" ${isEdit && movimentacao.categoria === 'Salários' ? 'selected' : ''}>Salários</option>
                        <option value="Marketing" ${isEdit && movimentacao.categoria === 'Marketing' ? 'selected' : ''}>Marketing</option>
                        <option value="Outros" ${isEdit && movimentacao.categoria === 'Outros' ? 'selected' : ''}>Outros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Observações:</label>
                    <textarea id="observacoes" placeholder="Observações adicionais">${isEdit ? movimentacao.observacoes || '' : ''}</textarea>
                </div>
                <div class="flex gap-1">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                    </button>
                    <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `;

        const modal = Modal.show(content, title);

        // Event listener para o formulário
        const form = document.getElementById('form-movimentacao');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMovimentacao(modal, isEdit ? movimentacao.id : null);
        });
    },

    saveMovimentacao: function(modal, id = null) {
        const data = {
            data: document.getElementById('data').value,
            descricao: document.getElementById('descricao').value,
            tipo: document.getElementById('tipo').value,
            valor: parseFloat(document.getElementById('valor').value),
            status: document.getElementById('status').value,
            categoria: document.getElementById('categoria').value,
            observacoes: document.getElementById('observacoes').value
        };

        if (id) {
            DataManager.update('movimentacoes', id, data);
            Utils.showNotification('Movimentação atualizada com sucesso!', 'success');
        } else {
            DataManager.add('movimentacoes', data);
            Utils.showNotification('Movimentação criada com sucesso!', 'success');
        }

        Modal.hide(modal);
        this.loadMovimentacoes();
        this.updateCards();
    },

    editMovimentacao: function(id) {
        const movimentacao = DataManager.getById('movimentacoes', id);
        if (movimentacao) {
            this.showFormMovimentacao(movimentacao);
        }
    },

    marcarPago: function(id) {
        DataManager.update('movimentacoes', id, { status: 'pago' });
        Utils.showNotification('Movimentação marcada como paga!', 'success');
        this.loadMovimentacoes();
        this.updateCards();
    },

    deleteMovimentacao: function(id) {
        Utils.confirm('Tem certeza que deseja excluir esta movimentação?', () => {
            DataManager.delete('movimentacoes', id);
            Utils.showNotification('Movimentação excluída com sucesso!', 'success');
            this.loadMovimentacoes();
            this.updateCards();
        });
    }
};