// Módulo Despesas - Sistema de Gestão de Despesas Operacionais
window.Despesas = {
    init: function() {
        console.log('Inicializando módulo de despesas...');
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.loadDespesas();
        this.initializeDemoData();
        this.updateCards();
    },

    initializeDemoData: function() {
        // Criar tipos de pagamento padrão se não existirem
        const tiposPagamento = DataManager.getAll('tipos-pagamento');
        if (tiposPagamento.length === 0) {
            const demoTipos = [
                { id: Utils.generateId(), nome: 'Dinheiro', descricao: 'Pagamento em espécie', ativo: true },
                { id: Utils.generateId(), nome: 'PIX', descricao: 'Transferência instantânea', ativo: true },
                { id: Utils.generateId(), nome: 'Cartão de Débito', descricao: 'Débito em conta corrente', ativo: true },
                { id: Utils.generateId(), nome: 'Cartão de Crédito', descricao: 'Crédito parcelado ou à vista', ativo: true },
                { id: Utils.generateId(), nome: 'Transferência Bancária', descricao: 'TED/DOC', ativo: true },
                { id: Utils.generateId(), nome: 'Boleto Bancário', descricao: 'Cobrança registrada', ativo: true },
                { id: Utils.generateId(), nome: 'Débito Automático', descricao: 'Cobrança automática mensal', ativo: true }
            ];

            demoTipos.forEach(tipo => {
                DataManager.save('tipos-pagamento', tipo);
            });
        }

        // Criar despesas de demonstração se não existirem
        const despesas = DataManager.getAll('despesas');
        if (despesas.length === 0) {
            const hoje = new Date();
            const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
            
            const demoDespesas = [
                {
                    id: Utils.generateId(),
                    tipo: 'fixa',
                    categoria: 'Infraestrutura',
                    descricao: 'Aluguel da oficina',
                    valor: 3500.00,
                    dataVencimento: '2024-12-05',
                    dataPagamento: null,
                    funcionarioId: null,
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Contrato renovado até dezembro 2025',
                    status: 'pendente',
                    fornecedor: 'Imobiliária Central Ltda'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'fixa',
                    categoria: 'Utilities',
                    descricao: 'Conta de energia elétrica',
                    valor: 850.00,
                    dataVencimento: '2024-12-10',
                    dataPagamento: null,
                    funcionarioId: null,
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Consumo elevado devido aos equipamentos',
                    status: 'pendente',
                    fornecedor: 'Enel São Paulo'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'fixa',
                    categoria: 'Utilities',
                    descricao: 'Conta de água',
                    valor: 420.00,
                    dataVencimento: '2024-12-15',
                    dataPagamento: '2024-11-03',
                    funcionarioId: null,
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Alto consumo devido aos serviços de lavagem',
                    status: 'pago',
                    fornecedor: 'Sabesp'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'fixa',
                    categoria: 'Impostos',
                    descricao: 'IPTU',
                    valor: 280.00,
                    dataVencimento: '2024-12-20',
                    dataPagamento: null,
                    funcionarioId: null,
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Parcelamento em 12x',
                    status: 'pendente',
                    fornecedor: 'Prefeitura Municipal'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'variavel',
                    categoria: 'Funcionários',
                    descricao: 'Salário - João Silva',
                    valor: 2500.00,
                    dataVencimento: '2024-12-05',
                    dataPagamento: null,
                    funcionarioId: this.getFuncionarioByName('João Silva'),
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Pagamento do 5º dia útil',
                    status: 'pendente',
                    fornecedor: null
                },
                {
                    id: Utils.generateId(),
                    tipo: 'variavel',
                    categoria: 'Funcionários',
                    descricao: 'Vale Alimentação - Maria Santos',
                    valor: 600.00,
                    dataVencimento: '2024-12-01',
                    dataPagamento: '2024-11-01',
                    funcionarioId: this.getFuncionarioByName('Maria Santos'),
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Crédito em cartão alimentação',
                    status: 'pago',
                    fornecedor: 'VR Benefícios'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'variavel',
                    categoria: 'Equipamentos',
                    descricao: 'Manutenção aspirador industrial',
                    valor: 350.00,
                    dataVencimento: '2024-11-25',
                    dataPagamento: '2024-11-20',
                    funcionarioId: null,
                    recorrente: false,
                    frequenciaRecorrencia: null,
                    observacoes: 'Troca de motor e filtros',
                    status: 'pago',
                    fornecedor: 'TechClean Equipamentos'
                },
                {
                    id: Utils.generateId(),
                    tipo: 'variavel',
                    categoria: 'Marketing',
                    descricao: 'Anúncios Google Ads',
                    valor: 800.00,
                    dataVencimento: '2024-12-01',
                    dataPagamento: null,
                    funcionarioId: null,
                    recorrente: true,
                    frequenciaRecorrencia: 'mensal',
                    observacoes: 'Campanha para captação de novos clientes',
                    status: 'pendente',
                    fornecedor: 'Google Brasil'
                }
            ];

            demoDespesas.forEach(despesa => {
                DataManager.save('despesas', despesa);
            });

            Utils.showNotification('Despesas de demonstração criadas com sucesso!', 'success');
        }
    },

    getFuncionarioByName: function(nome) {
        const funcionarios = DataManager.getAll('funcionarios') || [];
        const funcionario = funcionarios.find(f => f.nome === nome);
        return funcionario ? funcionario.id : null;
    },

    bindEvents: function() {
        // Botão nova despesa
        const btnNova = document.getElementById('nova-despesa');
        if (btnNova) {
            btnNova.addEventListener('click', () => this.showFormDespesa());
        }

        // Botão gerenciar tipos de pagamento
        const btnTipos = document.getElementById('gerenciar-tipos-pagamento');
        if (btnTipos) {
            btnTipos.addEventListener('click', () => this.showTiposPagamento());
        }

        // Filtros
        const filtroStatus = document.getElementById('filtro-status-despesa');
        const filtroCategoria = document.getElementById('filtro-categoria-despesa');
        const buscarDespesa = document.getElementById('buscar-despesa');

        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => this.loadDespesas());
        }

        if (filtroCategoria) {
            filtroCategoria.addEventListener('change', () => this.loadDespesas());
        }

        if (buscarDespesa) {
            buscarDespesa.addEventListener('input', Utils.debounce(() => this.loadDespesas(), 300));
        }
    },

    updateCards: function() {
        const despesas = DataManager.getAll('despesas') || [];
        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        
        // Despesas do mês atual
        const despesasMes = despesas.filter(d => {
            const dataVencimento = new Date(d.dataVencimento);
            return dataVencimento >= inicioMes && dataVencimento <= fimMes;
        });

        const totalMes = despesasMes.reduce((total, d) => total + d.valor, 0);
        const pagas = despesasMes.filter(d => d.status === 'pago');
        const totalPago = pagas.reduce((total, d) => total + d.valor, 0);
        const pendentes = despesasMes.filter(d => d.status === 'pendente');
        const totalPendente = pendentes.reduce((total, d) => total + d.valor, 0);

        // Despesas vencidas (pendentes com data passada)
        const vencidas = pendentes.filter(d => new Date(d.dataVencimento) < hoje);
        const totalVencido = vencidas.reduce((total, d) => total + d.valor, 0);

        // Atualizar cards
        this.updateCardByTitle('Total do Mês', Utils.formatCurrency(totalMes));
        this.updateCardByTitle('Já Pagas', Utils.formatCurrency(totalPago));
        this.updateCardByTitle('Pendentes', Utils.formatCurrency(totalPendente));
        this.updateCardByTitle('Vencidas', Utils.formatCurrency(totalVencido));
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

    loadDespesas: function() {
        const tbody = document.getElementById('despesas-tbody');
        if (!tbody) {
            console.warn('Elemento despesas-tbody não encontrado');
            return;
        }

        const filtroStatus = document.getElementById('filtro-status-despesa');
        const filtroCategoria = document.getElementById('filtro-categoria-despesa');
        const buscarDespesa = document.getElementById('buscar-despesa');
        
        const statusFiltro = filtroStatus ? filtroStatus.value : '';
        const categoriaFiltro = filtroCategoria ? filtroCategoria.value : '';
        const termoBusca = buscarDespesa ? buscarDespesa.value.toLowerCase() : '';

        let despesas = DataManager.getAll('despesas') || [];

        // Aplicar filtros
        if (statusFiltro) {
            despesas = despesas.filter(d => d.status === statusFiltro);
        }

        if (categoriaFiltro) {
            despesas = despesas.filter(d => d.categoria === categoriaFiltro);
        }

        if (termoBusca) {
            despesas = despesas.filter(d => 
                d.descricao.toLowerCase().includes(termoBusca) ||
                d.fornecedor?.toLowerCase().includes(termoBusca) ||
                d.categoria.toLowerCase().includes(termoBusca)
            );
        }

        // Ordenar por data de vencimento
        despesas.sort((a, b) => new Date(a.dataVencimento) - new Date(b.dataVencimento));

        tbody.innerHTML = '';

        despesas.forEach(despesa => {
            const row = this.createDespesaRow(despesa);
            tbody.appendChild(row);
        });

        // Atualizar contadores
        const total = document.getElementById('total-despesas');
        if (total) {
            total.textContent = despesas.length;
        }

        // Atualizar cards
        this.updateCards();
    },

    createDespesaRow: function(despesa) {
        const row = document.createElement('tr');
        
        // Determinar classe do status
        let statusClass = '';
        let statusText = '';
        const hoje = new Date();
        const dataVencimento = new Date(despesa.dataVencimento);
        
        if (despesa.status === 'pago') {
            statusClass = 'status-pago';
            statusText = 'Pago';
        } else if (dataVencimento < hoje) {
            statusClass = 'status-vencido';
            statusText = 'Vencido';
        } else {
            statusClass = 'status-pendente';
            statusText = 'Pendente';
        }

        // Obter nome do funcionário se existir
        let funcionarioNome = '-';
        if (despesa.funcionarioId) {
            const funcionario = DataManager.getById('funcionarios', despesa.funcionarioId);
            funcionarioNome = funcionario ? funcionario.nome : 'Funcionário não encontrado';
        }

        row.innerHTML = `
            <td>
                <div class="despesa-info">
                    <div class="despesa-categoria ${despesa.categoria.toLowerCase()}">${despesa.categoria}</div>
                    <div class="despesa-descricao">${despesa.descricao}</div>
                    <div class="despesa-fornecedor">${despesa.fornecedor || 'Não informado'}</div>
                </div>
            </td>
            <td>
                <span class="despesa-tipo ${despesa.tipo}">${despesa.tipo.charAt(0).toUpperCase() + despesa.tipo.slice(1)}</span>
            </td>
            <td>${Utils.formatCurrency(despesa.valor)}</td>
            <td>${Utils.formatDate(despesa.dataVencimento)}</td>
            <td>${despesa.dataPagamento ? Utils.formatDate(despesa.dataPagamento) : '-'}</td>
            <td>${funcionarioNome}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="actions">
                    ${despesa.status === 'pendente' ? `
                        <button class="btn-icon btn-success" onclick="Despesas.marcarComoPago('${despesa.id}')" title="Marcar como pago">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon" onclick="Despesas.showDespesaDetails('${despesa.id}')" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="Despesas.editDespesa('${despesa.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="Despesas.deleteDespesa('${despesa.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    },

    showFormDespesa: function(despesaId = null) {
        const isEdit = despesaId !== null;
        const despesa = isEdit ? DataManager.getById('despesas', despesaId) : null;
        const funcionarios = DataManager.getAll('funcionarios') || [];
        const tiposPagamento = DataManager.getAll('tipos-pagamento') || [];

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>${isEdit ? 'Editar Despesa' : 'Nova Despesa'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="despesa-form" class="form-grid">
                    <div class="form-section">
                        <h4>Informações Básicas</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="despesa-tipo">Tipo *</label>
                                <select id="despesa-tipo" required>
                                    <option value="">Selecione o tipo</option>
                                    <option value="fixa" ${despesa && despesa.tipo === 'fixa' ? 'selected' : ''}>Fixa</option>
                                    <option value="variavel" ${despesa && despesa.tipo === 'variavel' ? 'selected' : ''}>Variável</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="despesa-categoria">Categoria *</label>
                                <select id="despesa-categoria" required>
                                    <option value="">Selecione a categoria</option>
                                    <option value="Infraestrutura" ${despesa && despesa.categoria === 'Infraestrutura' ? 'selected' : ''}>Infraestrutura</option>
                                    <option value="Utilities" ${despesa && despesa.categoria === 'Utilities' ? 'selected' : ''}>Utilities (Água, Luz, Internet)</option>
                                    <option value="Funcionários" ${despesa && despesa.categoria === 'Funcionários' ? 'selected' : ''}>Funcionários</option>
                                    <option value="Impostos" ${despesa && despesa.categoria === 'Impostos' ? 'selected' : ''}>Impostos e Taxas</option>
                                    <option value="Equipamentos" ${despesa && despesa.categoria === 'Equipamentos' ? 'selected' : ''}>Equipamentos</option>
                                    <option value="Marketing" ${despesa && despesa.categoria === 'Marketing' ? 'selected' : ''}>Marketing</option>
                                    <option value="Materiais" ${despesa && despesa.categoria === 'Materiais' ? 'selected' : ''}>Materiais e Insumos</option>
                                    <option value="Seguros" ${despesa && despesa.categoria === 'Seguros' ? 'selected' : ''}>Seguros</option>
                                    <option value="Outros" ${despesa && despesa.categoria === 'Outros' ? 'selected' : ''}>Outros</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="despesa-descricao">Descrição *</label>
                            <input type="text" id="despesa-descricao" required 
                                value="${despesa ? despesa.descricao : ''}" 
                                placeholder="Descrição da despesa">
                        </div>
                        <div class="form-group">
                            <label for="despesa-fornecedor">Fornecedor/Beneficiário</label>
                            <input type="text" id="despesa-fornecedor" 
                                value="${despesa ? despesa.fornecedor || '' : ''}" 
                                placeholder="Nome do fornecedor ou beneficiário">
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Valores e Datas</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="despesa-valor">Valor *</label>
                                <input type="number" id="despesa-valor" required min="0" step="0.01"
                                    value="${despesa ? despesa.valor : ''}" 
                                    placeholder="0,00">
                            </div>
                            <div class="form-group">
                                <label for="despesa-vencimento">Data de Vencimento *</label>
                                <input type="date" id="despesa-vencimento" required 
                                    value="${despesa ? despesa.dataVencimento : ''}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="despesa-pagamento">Data de Pagamento</label>
                                <input type="date" id="despesa-pagamento" 
                                    value="${despesa ? despesa.dataPagamento || '' : ''}">
                            </div>
                            <div class="form-group">
                                <label for="despesa-status">Status *</label>
                                <select id="despesa-status" required>
                                    <option value="pendente" ${despesa && despesa.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                                    <option value="pago" ${despesa && despesa.status === 'pago' ? 'selected' : ''}>Pago</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Recorrência e Vinculação</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="despesa-recorrente" 
                                        ${despesa && despesa.recorrente ? 'checked' : ''}>
                                    Despesa Recorrente
                                </label>
                            </div>
                            <div class="form-group">
                                <label for="despesa-frequencia">Frequência</label>
                                <select id="despesa-frequencia">
                                    <option value="">Não recorrente</option>
                                    <option value="mensal" ${despesa && despesa.frequenciaRecorrencia === 'mensal' ? 'selected' : ''}>Mensal</option>
                                    <option value="bimestral" ${despesa && despesa.frequenciaRecorrencia === 'bimestral' ? 'selected' : ''}>Bimestral</option>
                                    <option value="trimestral" ${despesa && despesa.frequenciaRecorrencia === 'trimestral' ? 'selected' : ''}>Trimestral</option>
                                    <option value="semestral" ${despesa && despesa.frequenciaRecorrencia === 'semestral' ? 'selected' : ''}>Semestral</option>
                                    <option value="anual" ${despesa && despesa.frequenciaRecorrencia === 'anual' ? 'selected' : ''}>Anual</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="despesa-funcionario">Funcionário Vinculado</label>
                            <select id="despesa-funcionario">
                                <option value="">Não vinculado a funcionário</option>
                                ${funcionarios.map(func => `
                                    <option value="${func.id}" ${despesa && despesa.funcionarioId === func.id ? 'selected' : ''}>
                                        ${func.nome} - ${func.cargo}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-group">
                            <label for="despesa-observacoes">Observações</label>
                            <textarea id="despesa-observacoes" rows="3" 
                                placeholder="Observações sobre a despesa">${despesa ? despesa.observacoes || '' : ''}</textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
                <button type="submit" form="despesa-form" class="btn btn-primary">
                    ${isEdit ? 'Atualizar' : 'Cadastrar'} Despesa
                </button>
            </div>
        `);

        // Event listeners
        document.getElementById('despesa-recorrente').addEventListener('change', function() {
            const frequencia = document.getElementById('despesa-frequencia');
            frequencia.disabled = !this.checked;
            if (!this.checked) frequencia.value = '';
        });

        document.getElementById('despesa-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDespesa(despesaId);
        });
    },

    saveDespesa: function(despesaId = null) {
        const despesaData = {
            id: despesaId || Utils.generateId(),
            tipo: document.getElementById('despesa-tipo').value,
            categoria: document.getElementById('despesa-categoria').value,
            descricao: document.getElementById('despesa-descricao').value,
            fornecedor: document.getElementById('despesa-fornecedor').value,
            valor: parseFloat(document.getElementById('despesa-valor').value) || 0,
            dataVencimento: document.getElementById('despesa-vencimento').value,
            dataPagamento: document.getElementById('despesa-pagamento').value || null,
            funcionarioId: document.getElementById('despesa-funcionario').value || null,
            recorrente: document.getElementById('despesa-recorrente').checked,
            frequenciaRecorrencia: document.getElementById('despesa-frequencia').value || null,
            status: document.getElementById('despesa-status').value,
            observacoes: document.getElementById('despesa-observacoes').value,
            dataCadastro: despesaId ? undefined : new Date().toISOString(),
            dataUltimaAtualizacao: new Date().toISOString()
        };

        try {
            DataManager.save('despesas', despesaData);
            Utils.closeModal();
            this.loadDespesas();
            Utils.showNotification(
                despesaId ? 'Despesa atualizada com sucesso!' : 'Despesa cadastrada com sucesso!', 
                'success'
            );
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
            Utils.showNotification('Erro ao salvar despesa. Tente novamente.', 'error');
        }
    },

    marcarComoPago: function(despesaId) {
        const despesa = DataManager.getById('despesas', despesaId);
        if (!despesa) return;

        const hoje = new Date().toISOString().split('T')[0];
        despesa.status = 'pago';
        despesa.dataPagamento = hoje;
        despesa.dataUltimaAtualizacao = new Date().toISOString();

        try {
            DataManager.save('despesas', despesa);
            this.loadDespesas();
            Utils.showNotification('Despesa marcada como paga!', 'success');
        } catch (error) {
            console.error('Erro ao marcar despesa como paga:', error);
            Utils.showNotification('Erro ao atualizar status da despesa.', 'error');
        }
    },

    editDespesa: function(despesaId) {
        this.showFormDespesa(despesaId);
    },

    deleteDespesa: function(despesaId) {
        const despesa = DataManager.getById('despesas', despesaId);
        if (!despesa) return;

        if (confirm(`Tem certeza que deseja excluir a despesa "${despesa.descricao}"?\n\nEsta ação não pode ser desfeita.`)) {
            try {
                DataManager.delete('despesas', despesaId);
                this.loadDespesas();
                Utils.showNotification('Despesa excluída com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir despesa:', error);
                Utils.showNotification('Erro ao excluir despesa. Tente novamente.', 'error');
            }
        }
    },

    showDespesaDetails: function(despesaId) {
        const despesa = DataManager.getById('despesas', despesaId);
        if (!despesa) return;

        let funcionarioInfo = 'Não vinculado';
        if (despesa.funcionarioId) {
            const funcionario = DataManager.getById('funcionarios', despesa.funcionarioId);
            funcionarioInfo = funcionario ? `${funcionario.nome} (${funcionario.cargo})` : 'Funcionário não encontrado';
        }

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>Detalhes da Despesa</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="despesa-details">
                    <div class="details-grid">
                        <div class="detail-section">
                            <h5>Informações Básicas</h5>
                            <div class="detail-item">
                                <span class="label">Tipo:</span>
                                <span class="value despesa-tipo ${despesa.tipo}">${despesa.tipo.charAt(0).toUpperCase() + despesa.tipo.slice(1)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Categoria:</span>
                                <span class="value">${despesa.categoria}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Descrição:</span>
                                <span class="value">${despesa.descricao}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Fornecedor:</span>
                                <span class="value">${despesa.fornecedor || 'Não informado'}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h5>Valores e Datas</h5>
                            <div class="detail-item">
                                <span class="label">Valor:</span>
                                <span class="value valor-destaque">${Utils.formatCurrency(despesa.valor)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Vencimento:</span>
                                <span class="value">${Utils.formatDate(despesa.dataVencimento)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Pagamento:</span>
                                <span class="value">${despesa.dataPagamento ? Utils.formatDate(despesa.dataPagamento) : 'Não pago'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Status:</span>
                                <span class="value status ${despesa.status === 'pago' ? 'status-pago' : 'status-pendente'}">
                                    ${despesa.status.charAt(0).toUpperCase() + despesa.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h5>Recorrência e Vinculação</h5>
                            <div class="detail-item">
                                <span class="label">Recorrente:</span>
                                <span class="value">${despesa.recorrente ? 'Sim' : 'Não'}</span>
                            </div>
                            ${despesa.recorrente ? `
                            <div class="detail-item">
                                <span class="label">Frequência:</span>
                                <span class="value">${despesa.frequenciaRecorrencia || 'Não definida'}</span>
                            </div>
                            ` : ''}
                            <div class="detail-item">
                                <span class="label">Funcionário:</span>
                                <span class="value">${funcionarioInfo}</span>
                            </div>
                        </div>

                        ${despesa.observacoes ? `
                        <div class="detail-section full-width">
                            <h5>Observações</h5>
                            <p class="observacoes">${despesa.observacoes}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="Despesas.editDespesa('${despesa.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        `);
    },

    showTiposPagamento: function() {
        const tipos = DataManager.getAll('tipos-pagamento') || [];

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>Gerenciar Tipos de Pagamento</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tipos-pagamento-container">
                    <button class="btn btn-primary mb-2" onclick="Despesas.showFormTipoPagamento()">
                        <i class="fas fa-plus"></i> Novo Tipo
                    </button>
                    
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tipos.map(tipo => `
                                    <tr>
                                        <td>${tipo.nome}</td>
                                        <td>${tipo.descricao || '-'}</td>
                                        <td>
                                            <span class="status ${tipo.ativo ? 'status-ativo' : 'status-inativo'}">
                                                ${tipo.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="actions">
                                                <button class="btn-icon" onclick="Despesas.editTipoPagamento('${tipo.id}')" title="Editar">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="btn-icon btn-danger" onclick="Despesas.deleteTipoPagamento('${tipo.id}')" title="Excluir">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
            </div>
        `);
    },

    showFormTipoPagamento: function(tipoId = null) {
        const isEdit = tipoId !== null;
        const tipo = isEdit ? DataManager.getById('tipos-pagamento', tipoId) : null;

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>${isEdit ? 'Editar' : 'Novo'} Tipo de Pagamento</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="tipo-pagamento-form">
                    <div class="form-group">
                        <label for="tipo-nome">Nome *</label>
                        <input type="text" id="tipo-nome" required 
                            value="${tipo ? tipo.nome : ''}" 
                            placeholder="Nome do tipo de pagamento">
                    </div>
                    <div class="form-group">
                        <label for="tipo-descricao">Descrição</label>
                        <input type="text" id="tipo-descricao" 
                            value="${tipo ? tipo.descricao || '' : ''}" 
                            placeholder="Descrição do tipo de pagamento">
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="tipo-ativo" 
                                ${tipo && tipo.ativo !== false ? 'checked' : ''}>
                            Ativo
                        </label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
                <button type="submit" form="tipo-pagamento-form" class="btn btn-primary">
                    ${isEdit ? 'Atualizar' : 'Cadastrar'}
                </button>
            </div>
        `);

        document.getElementById('tipo-pagamento-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTipoPagamento(tipoId);
        });
    },

    saveTipoPagamento: function(tipoId = null) {
        const tipoData = {
            id: tipoId || Utils.generateId(),
            nome: document.getElementById('tipo-nome').value,
            descricao: document.getElementById('tipo-descricao').value,
            ativo: document.getElementById('tipo-ativo').checked
        };

        try {
            DataManager.save('tipos-pagamento', tipoData);
            Utils.closeModal();
            this.showTiposPagamento();
            Utils.showNotification(
                tipoId ? 'Tipo atualizado com sucesso!' : 'Tipo cadastrado com sucesso!', 
                'success'
            );
        } catch (error) {
            console.error('Erro ao salvar tipo de pagamento:', error);
            Utils.showNotification('Erro ao salvar tipo de pagamento.', 'error');
        }
    },

    editTipoPagamento: function(tipoId) {
        this.showFormTipoPagamento(tipoId);
    },

    deleteTipoPagamento: function(tipoId) {
        const tipo = DataManager.getById('tipos-pagamento', tipoId);
        if (!tipo) return;

        if (confirm(`Tem certeza que deseja excluir o tipo "${tipo.nome}"?`)) {
            try {
                DataManager.delete('tipos-pagamento', tipoId);
                this.showTiposPagamento();
                Utils.showNotification('Tipo excluído com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir tipo de pagamento:', error);
                Utils.showNotification('Erro ao excluir tipo de pagamento.', 'error');
            }
        }
    }
};

// Auto-inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#despesas') {
        setTimeout(() => Despesas.init(), 100);
    }
});