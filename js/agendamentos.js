// Módulo Agendamentos
window.Agendamentos = {
    currentPage: 1,
    itemsPerPage: 10,
    totalResults: 0,

    init: function() {
        this.bindEvents();
        this.initBuscaForm();
        // NÃO carrega automaticamente - apenas exibe formulário de busca
    },

    bindEvents: function() {
        // Botão novo agendamento
        const btnNovo = document.getElementById('novo-agendamento');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormAgendamento());
        }

        // Formulário de busca
        const formBusca = document.getElementById('form-busca-agendamentos');
        if (formBusca) {
            formBusca.addEventListener('submit', (e) => {
                e.preventDefault();
                this.executarBusca();
            });
        }

        // Botão limpar filtros
        const btnLimpar = document.getElementById('limpar-filtros');
        if (btnLimpar) {
            btnLimpar.addEventListener('click', () => this.limparFiltros());
        }
    },

    initBuscaForm: function() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = `
            <div class="agendamentos-container">
                <div class="page-header">
                    <h1><i class="fas fa-calendar-alt"></i> Agendamentos</h1>
                    <button id="novo-agendamento" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Novo Agendamento
                    </button>
                </div>

                <!-- Formulário de Busca -->
                <div class="busca-container">
                    <h2><i class="fas fa-search"></i> Buscar Agendamentos</h2>
                    <form id="form-busca-agendamentos" class="busca-form">
                        <div class="filtros-grid">
                            <div class="filtro-group">
                                <label for="busca-cliente">Cliente:</label>
                                <input type="text" id="busca-cliente" placeholder="Nome do cliente...">
                            </div>
                            
                            <div class="filtro-group">
                                <label for="busca-data-inicio">Data Inicial:</label>
                                <input type="date" id="busca-data-inicio">
                            </div>
                            
                            <div class="filtro-group">
                                <label for="busca-data-fim">Data Final:</label>
                                <input type="date" id="busca-data-fim">
                            </div>
                            
                            <div class="filtro-group">
                                <label for="busca-status">Status:</label>
                                <select id="busca-status">
                                    <option value="">Todos os status</option>
                                    <option value="agendado">Agendado</option>
                                    <option value="em-andamento">Em Andamento</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>
                            
                            <div class="filtro-group">
                                <label for="busca-servico">Serviço:</label>
                                <input type="text" id="busca-servico" placeholder="Tipo de serviço...">
                            </div>
                        </div>
                        
                        <div class="busca-actions">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i> Buscar
                            </button>
                            <button type="button" id="limpar-filtros" class="btn btn-secondary">
                                <i class="fas fa-eraser"></i> Limpar Filtros
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Resultados da Busca -->
                <div id="resultados-container" class="resultados-container" style="display: none;">
                    <div class="resultados-header">
                        <h3 id="total-resultados"></h3>
                        <div class="paginacao-info">
                            <span id="info-paginacao"></span>
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Cliente</th>
                                    <th>Serviço</th>
                                    <th>Status</th>
                                    <th>Valor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="agendamentos-tbody">
                                <!-- Resultados aparecerão aqui -->
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="paginacao-container" class="paginacao-container">
                        <!-- Paginação aparecerá aqui -->
                    </div>
                </div>
            </div>
        `;

        // Re-bind events após criar o HTML
        this.bindEvents();
    },

    executarBusca: function() {
        const filtros = this.obterFiltros();
        const agendamentos = this.filtrarAgendamentos(filtros);
        
        this.totalResults = agendamentos.length;
        this.currentPage = 1;
        
        this.exibirResultados(agendamentos);
        this.atualizarPaginacao(agendamentos);
        
        // Mostrar container de resultados
        const container = document.getElementById('resultados-container');
        if (container) {
            container.style.display = 'block';
        }
    },

    obterFiltros: function() {
        return {
            cliente: document.getElementById('busca-cliente')?.value.trim() || '',
            dataInicio: document.getElementById('busca-data-inicio')?.value || '',
            dataFim: document.getElementById('busca-data-fim')?.value || '',
            status: document.getElementById('busca-status')?.value || '',
            servico: document.getElementById('busca-servico')?.value.trim() || ''
        };
    },

    filtrarAgendamentos: function(filtros) {
        let agendamentos = DataManager.getAll('agendamentos');

        // Filtro por cliente
        if (filtros.cliente) {
            agendamentos = agendamentos.filter(a => 
                a.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
            );
        }

        // Filtro por período
        if (filtros.dataInicio) {
            agendamentos = agendamentos.filter(a => a.data >= filtros.dataInicio);
        }
        if (filtros.dataFim) {
            agendamentos = agendamentos.filter(a => a.data <= filtros.dataFim);
        }

        // Filtro por status
        if (filtros.status) {
            agendamentos = agendamentos.filter(a => a.status === filtros.status);
        }

        // Filtro por serviço
        if (filtros.servico) {
            agendamentos = agendamentos.filter(a => 
                a.servico.toLowerCase().includes(filtros.servico.toLowerCase())
            );
        }

        // Ordenar por data/hora (mais recentes primeiro)
        agendamentos.sort((a, b) => {
            const dateA = new Date(a.data + ' ' + a.hora);
            const dateB = new Date(b.data + ' ' + b.hora);
            return dateB - dateA;
        });

        return agendamentos;
    },

    exibirResultados: function(agendamentos) {
        const tbody = document.getElementById('agendamentos-tbody');
        const totalElement = document.getElementById('total-resultados');
        
        if (!tbody) return;

        // Atualizar total de resultados
        if (totalElement) {
            totalElement.innerHTML = `
                <i class="fas fa-list"></i> 
                ${agendamentos.length} resultado(s) encontrado(s)
            `;
        }

        // Paginação
        const inicio = (this.currentPage - 1) * this.itemsPerPage;
        const fim = inicio + this.itemsPerPage;
        const agendamentosPagina = agendamentos.slice(inicio, fim);

        if (agendamentosPagina.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <i class="fas fa-search"></i> 
                        Nenhum agendamento encontrado com os filtros aplicados
                    </td>
                </tr>
            `;
            return;
        }

        const html = agendamentosPagina.map(agendamento => `
            <tr>
                <td>
                    <div class="datetime-cell">
                        <div>${Utils.formatDate(agendamento.data)}</div>
                        <div class="time">${agendamento.hora}</div>
                    </div>
                </td>
                <td><strong>${agendamento.cliente}</strong></td>
                <td>${agendamento.servico}</td>
                <td>
                    <span class="status-badge ${agendamento.status}">
                        ${this.getStatusText(agendamento.status)}
                    </span>
                </td>
                <td class="text-currency">${Utils.formatCurrency(agendamento.valor || 0)}</td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" onclick="Agendamentos.editarAgendamento('${agendamento.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="Agendamentos.excluirAgendamento('${agendamento.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
        
        // Atualizar info de paginação
        this.atualizarInfoPaginacao(agendamentos.length);
    },

    atualizarPaginacao: function(agendamentos) {
        const container = document.getElementById('paginacao-container');
        if (!container) return;

        const totalPages = Math.ceil(agendamentos.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<div class="pagination">';
        
        // Botão anterior
        if (this.currentPage > 1) {
            html += `<button class="btn-page" onclick="Agendamentos.irParaPagina(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<button class="btn-page active">${i}</button>`;
            } else {
                html += `<button class="btn-page" onclick="Agendamentos.irParaPagina(${i})">${i}</button>`;
            }
        }

        // Botão próximo
        if (this.currentPage < totalPages) {
            html += `<button class="btn-page" onclick="Agendamentos.irParaPagina(${this.currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        html += '</div>';
        container.innerHTML = html;
    },

    atualizarInfoPaginacao: function(total) {
        const infoElement = document.getElementById('info-paginacao');
        if (!infoElement) return;

        const inicio = (this.currentPage - 1) * this.itemsPerPage + 1;
        const fim = Math.min(this.currentPage * this.itemsPerPage, total);

        infoElement.textContent = `Exibindo ${inicio}-${fim} de ${total} registros`;
    },

    irParaPagina: function(pagina) {
        this.currentPage = pagina;
        this.executarBusca();
    },

    limparFiltros: function() {
        document.getElementById('busca-cliente').value = '';
        document.getElementById('busca-data-inicio').value = '';
        document.getElementById('busca-data-fim').value = '';
        document.getElementById('busca-status').value = '';
        document.getElementById('busca-servico').value = '';
        
        // Esconder resultados
        const container = document.getElementById('resultados-container');
        if (container) {
            container.style.display = 'none';
        }
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
                    <input type="text" id="cliente" required value="${isEdit ? agendamento.cliente : ''}" placeholder="Digite o nome do cliente..." class="form-control">
                </div>
                <div class="form-group">
                    <label>Veículo:</label>
                    <input type="text" id="veiculo" required value="${isEdit ? agendamento.veiculo : ''}" placeholder="Digite o modelo do veículo..." class="form-control">
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

        // Configurar autocomplete após criar o modal
        setTimeout(() => {
            this.setupFormAutocomplete();
        }, 100);
    },

    setupFormAutocomplete: function() {
        // Autocomplete para cliente
        Autocomplete.createClienteAutocomplete('cliente', {
            onSelect: (cliente) => {
                // Atualizar autocomplete de veículos baseado no cliente selecionado
                Autocomplete.updateVeiculosByCliente('veiculo', cliente.nome);
            }
        });

        // Autocomplete para veículo
        Autocomplete.createVeiculoAutocomplete('veiculo');

        // Listener para mudanças no campo cliente (manual)
        const clienteInput = document.getElementById('cliente');
        if (clienteInput) {
            let timeoutId;
            clienteInput.addEventListener('input', () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const clienteNome = clienteInput.value.trim();
                    if (clienteNome) {
                        Autocomplete.updateVeiculosByCliente('veiculo', clienteNome);
                    }
                }, 500);
            });
        }
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
            this.executarBusca(); // Re-executa a busca atual
        });
    },

    // Aliases para compatibilidade com os botões
    excluirAgendamento: function(id) {
        this.deleteAgendamento(id);
    },

    editAgendamento: function(id) {
        this.editarAgendamento(id);
    },

    editarAgendamento: function(id) {
        const agendamento = DataManager.getById('agendamentos', id);
        if (agendamento) {
            this.showFormAgendamento(agendamento);
        }
    }
};