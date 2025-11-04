// Módulo Agendamentos
window.Agendamentos = {
    init: function() {
        this.bindEvents();
        this.loadAgendamentos();
    },

    bindEvents: function() {
        // Botão novo agendamento
        const btnNovo = document.getElementById('novo-agendamento');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormAgendamento());
        }

        // Filtro de status
        const filtroStatus = document.getElementById('filtro-status');
        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => this.loadAgendamentos());
        }
    },

    loadAgendamentos: function() {
        const tbody = document.getElementById('agendamentos-tbody');
        if (!tbody) return;

        const filtroStatus = document.getElementById('filtro-status');
        const statusFiltro = filtroStatus ? filtroStatus.value : '';

        let agendamentos = DataManager.getAll('agendamentos');

        // Aplicar filtro
        if (statusFiltro) {
            agendamentos = agendamentos.filter(a => a.status === statusFiltro);
        }

        // Ordenar por data/hora
        agendamentos.sort((a, b) => {
            const dateA = new Date(a.data + ' ' + a.hora);
            const dateB = new Date(b.data + ' ' + b.hora);
            return dateB - dateA;
        });

        if (agendamentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum agendamento encontrado</td></tr>';
            return;
        }

        const html = agendamentos.map(agendamento => `
            <tr>
                <td>${Utils.formatDate(agendamento.data)} ${agendamento.hora}</td>
                <td>${agendamento.cliente}</td>
                <td>${agendamento.veiculo}</td>
                <td>${agendamento.servico}</td>
                <td><span class="status status-${agendamento.status}">${this.getStatusText(agendamento.status)}</span></td>
                <td>
                    <button class="btn btn-warning" onclick="Agendamentos.editAgendamento(${agendamento.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success" onclick="Agendamentos.updateStatus(${agendamento.id}, 'em-andamento')" title="Iniciar">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-success" onclick="Agendamentos.updateStatus(${agendamento.id}, 'concluido')" title="Concluir">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-danger" onclick="Agendamentos.deleteAgendamento(${agendamento.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    },

    getStatusText: function(status) {
        const statusMap = {
            'agendado': 'Agendado',
            'em-andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    },

    showFormAgendamento: function(agendamento = null) {
        const isEdit = agendamento !== null;
        const title = isEdit ? 'Editar Agendamento' : 'Novo Agendamento';
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            console.log('DataManager não disponível, aguardando...');
            setTimeout(() => this.showFormAgendamento(agendamento), 100);
            return;
        }
        
        const clientes = DataManager.getAll('clientes') || [];
        const servicos = DataManager.getAll('servicos') || [];
        const funcionarios = DataManager.getAll('funcionarios') || [];

        console.log('=== DEBUG AGENDAMENTO ===');
        console.log('Clientes encontrados:', clientes.length, clientes);
        console.log('Serviços encontrados:', servicos.length, servicos);
        console.log('Funcionários encontrados:', funcionarios.length, funcionarios);
        console.log('========================');

        const clientesOptions = clientes.map(c => 
            `<option value="${c.nome}" ${isEdit && agendamento.cliente === c.nome ? 'selected' : ''}>${c.nome}</option>`
        ).join('');

        const servicosOptions = servicos.map(s => {
            const preco = Utils.formatCurrency ? Utils.formatCurrency(s.preco) : `R$ ${s.preco.toFixed(2)}`;
            const tempo = s.tempo ? `(${s.tempo} min)` : '';
            return `<option value="${s.nome}" data-id="${s.id}" ${isEdit && agendamento.servico === s.nome ? 'selected' : ''}>${s.nome} - ${preco} ${tempo}</option>`;
        }).join('');

        const funcionariosOptions = funcionarios.filter(f => f.status === 'ativo').map(f => 
            `<option value="${f.id}" ${isEdit && agendamento.funcionarioId == f.id ? 'selected' : ''}>${f.nome} - ${f.cargo}</option>`
        ).join('');

        console.log('Opções de serviços geradas:', servicosOptions);

        const content = `
            <form id="form-agendamento">
                <div class="form-group">
                    <label>Data:</label>
                    <input type="date" id="data" required value="${isEdit ? agendamento.data : ''}" class="form-control">
                </div>
                <div class="form-group">
                    <label>Hora:</label>
                    <input type="time" id="hora" required value="${isEdit ? agendamento.hora : ''}" class="form-control">
                </div>
                <div class="form-group">
                    <label>Cliente:</label>
                    <select id="cliente" required class="form-control">
                        <option value="">Selecione um cliente</option>
                        ${clientesOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Veículo:</label>
                    <input type="text" id="veiculo" required value="${isEdit ? agendamento.veiculo : ''}" placeholder="Ex: Honda Civic 2020" class="form-control">
                </div>
                <div class="form-group">
                    <label>Serviço:</label>
                    <select id="servico" required class="form-control">
                        <option value="">Selecione um serviço</option>
                        ${servicosOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Funcionário Responsável:</label>
                    <select id="funcionario" class="form-control">
                        <option value="">Selecione um funcionário (opcional)</option>
                        ${funcionariosOptions}
                    </select>
                </div>
                ${isEdit ? `
                <div class="form-group">
                    <label>Status:</label>
                    <select id="status" class="form-control">
                        <option value="agendado" ${agendamento.status === 'agendado' ? 'selected' : ''}>Agendado</option>
                        <option value="em-andamento" ${agendamento.status === 'em-andamento' ? 'selected' : ''}>Em Andamento</option>
                        <option value="concluido" ${agendamento.status === 'concluido' ? 'selected' : ''}>Concluído</option>
                        <option value="cancelado" ${agendamento.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
                ` : ''}
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
        const form = document.getElementById('form-agendamento');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAgendamento(modal, isEdit ? agendamento.id : null);
        });
    },

    saveAgendamento: function(modal, id = null) {
        const servicoSelect = document.getElementById('servico');
        const servicoOption = servicoSelect.options[servicoSelect.selectedIndex];
        const servicoId = servicoOption ? servicoOption.getAttribute('data-id') : null;
        
        const data = {
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value,
            cliente: document.getElementById('cliente').value,
            veiculo: document.getElementById('veiculo').value,
            servico: document.getElementById('servico').value,
            servicoId: servicoId,
            funcionarioId: document.getElementById('funcionario').value || null,
            status: document.getElementById('status') ? document.getElementById('status').value : 'agendado'
        };

        // Validações básicas
        if (!data.data || !data.hora || !data.cliente || !data.veiculo || !data.servico) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Verificar conflito de horário (apenas para novos agendamentos)
        if (!id && this.verificarConflitoHorario(data.data, data.hora)) {
            Utils.showNotification('Já existe um agendamento para este horário!', 'error');
            return;
        }

        if (id) {
            DataManager.update('agendamentos', id, data);
            Utils.showNotification('Agendamento atualizado com sucesso!', 'success');
        } else {
            DataManager.add('agendamentos', data);
            Utils.showNotification('Agendamento criado com sucesso!', 'success');
            
            // Atualizar última visita do cliente
            this.atualizarUltimaVisitaCliente(data.cliente, data.data);
        }

        Modal.hide(modal);
        this.loadAgendamentos();
    },

    verificarConflitoHorario: function(data, hora) {
        const agendamentos = DataManager.getAll('agendamentos');
        return agendamentos.some(a => 
            a.data === data && 
            a.hora === hora && 
            a.status !== 'cancelado'
        );
    },

    atualizarUltimaVisitaCliente: function(nomeCliente, dataVisita) {
        const clientes = DataManager.getAll('clientes');
        const cliente = clientes.find(c => c.nome === nomeCliente);
        if (cliente) {
            DataManager.update('clientes', cliente.id, { ultimaVisita: dataVisita });
        }
    },

    editAgendamento: function(id) {
        const agendamento = DataManager.getById('agendamentos', id);
        if (agendamento) {
            this.showFormAgendamento(agendamento);
        }
    },

    updateStatus: function(id, status) {
        DataManager.update('agendamentos', id, { status });
        Utils.showNotification(`Status atualizado para ${this.getStatusText(status)}!`, 'success');
        this.loadAgendamentos();
    },

    deleteAgendamento: function(id) {
        Utils.confirm('Tem certeza que deseja excluir este agendamento?', () => {
            DataManager.delete('agendamentos', id);
            Utils.showNotification('Agendamento excluído com sucesso!', 'success');
            this.loadAgendamentos();
        });
    }
};